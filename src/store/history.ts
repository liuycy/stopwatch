export const KeepDay4Deleted = 7;

export const useHistory = defineStore("history", () => {
  const state = reactive({
    records: [] as HistoryRecord[],
    deletedRecords: [] as DeletedRecord[],
    recordToBeConfirmed: ref<RecordToBeConfirmed>(),
    tempSheet: ref<string[][]>(),
    tempFilename: "",
  });

  const exportExcel = (id: string) => exportExcelFile(id);
  const sortRecords = () => state.records.sort((a, b) => b.ctime - a.ctime);

  const register = () => {
    const key = "history";
    watch(state, () => uni.setStorage({ key, data: { records: state.records, deletedRecords: state.deletedRecords } }));
    uni.getStorage({
      key,
      success: async (res) => {
        Object.assign(state, res.data);
        await nextTick();
        checkRecordStatus();
        checkRecordDeleted();
      },
    });
  };

  const generate = async (times: TimeRecord[], peak?: TimePeak) => {
    if (!times.length) return;

    const total = times.length;
    const ctime = Date.now();
    const id = `history-${state.records.length}-${total}-${ctime}`;

    state.records.unshift({
      firstTime: formatDuration(times[times.length - 1].time),
      lastTime: times.length > 1 ? formatDuration(times[0].time) : undefined,
      min: peak?.min ? formatDuration(parseDuration(peak.min)) : formatDuration(times[0].duration),
      max: peak?.max ? formatDuration(parseDuration(peak.max)) : undefined,
      status: "saving",
      total,
      ctime,
      id,
    });

    const record = state.records[0];

    try {
      const sheet = [["序号" as string | number, "每次间隔(ms)", "总用时(ms)", "每次间隔(s)", "总用时(s)", "峰值"]];
      times.reduceRight(
        (_, t) =>
          sheet.push([
            t.tag ? t.tag.text : t.index,
            formatDuration(t.duration, { ms3: true }),
            formatDuration(t.time, { ms3: true }),
            formatDuration(t.duration, { noMs: true }),
            formatDuration(t.time, { noMs: true }),
            t.index === peak?.minIndex ? "最小间隔" : t.index === peak?.maxIndex ? "最大间隔" : "",
          ]),
        0,
      );
      await saveAsUserData(id, sheet);
      record.status = "saved";
    } catch (error) {
      record.status = "dead";
      throw error;
    }
  };

  const remove = (id: string, isErased = false) => {
    const index = state.records.findIndex((r) => r.id === id);
    if (index < 0) return;
    const deletedRecord = state.records.splice(index, 1);
    if (isErased) return;
    state.deletedRecords.unshift({
      ...deletedRecord[0],
      dtime: Date.now(),
    });
  };

  const recovery = (idset: Set<string>) => {
    const leavedRecords: DeletedRecord[] = [];
    for (const record of state.deletedRecords) {
      if (idset.has(record.id)) {
        state.records.unshift(record);
      } else {
        leavedRecords.push(record);
      }
    }
    state.deletedRecords = leavedRecords;
  };

  const readExcelToTemp = async (id: string) => {
    const sheet = await readExcelFile(id);
    state.tempFilename = id;
    state.tempSheet = sheet;
  };

  const confirmDelete = (idset: Set<string>) => {
    state.deletedRecords = state.deletedRecords.filter((r) => {
      if (!idset.has(r.id)) return true;
      deleteExcelFile(r.id).catch(() => {});
      return false;
    });
  };

  const confirmRemove = (record: HistoryRecord) => {
    return new Promise<string>((resolve, reject) => {
      state.recordToBeConfirmed = {
        ...record,
        confirm: () => {
          const { id } = state.recordToBeConfirmed!;
          state.recordToBeConfirmed = undefined;
          resolve(id);
        },
        cancel: () => {
          state.recordToBeConfirmed = undefined;
          reject(new RecordConfirmRejectError());
        },
      };
    });
  };

  const checkRecordStatus = () => {
    for (const record of state.records) {
      setTimeout(() => {
        record.status = checkIfExist(record.id) ? "saved" : "dead";
      });
    }
  };

  const checkRecordDeleted = () => {
    const ktime = KeepDay4Deleted * 24 * 60 * 60 * 1000;
    const ntime = Date.now();
    const leavedRecords = [];
    for (const record of state.deletedRecords) {
      if (record.dtime + ktime < ntime) {
        deleteExcelFile(record.id).catch(() => {});
      } else {
        leavedRecords.push(record);
      }
    }
    state.deletedRecords = leavedRecords;
  };

  return {
    ...toRefs(state),

    register,
    sortRecords,
    generate,
    remove,
    recovery,
    exportExcel,
    readExcelToTemp,
    confirmDelete,
    confirmRemove,
    checkRecordStatus,
    checkRecordDeleted,
  };
});
