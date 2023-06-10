import { onLaunch } from '@dcloudio/uni-app';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { checkIfExist, deleteExcelFile, exportExcelFile, saveAsUserData } from '@/utils/excel';
import { formatDuration, parseDuration } from '@/utils/format';
import type { TimePeak, TimeRecord } from '@/types/time';
import {
    RecordConfirmRejectError,
    type HistoryRecord,
    type RecordToBeConfirmed,
    type DeletedRecord,
} from '@/types/history';

export const KeepDay4Deleted = 7;

export const useHistoryStore = defineStore('history', () => {
    const records = ref<HistoryRecord[]>([]);
    const deletedRecords = ref<DeletedRecord[]>([]);
    const recordToBeConfirmed = ref<RecordToBeConfirmed>();

    async function generate(times: TimeRecord[], peak?: TimePeak) {
        if (!times.length) return;

        const total = times.length;
        const ctime = Date.now();
        const id = `history-${records.value.length}-${total}-${ctime}`;

        records.value.unshift({
            min: peak?.min ? formatDuration(parseDuration(peak.min)) : times[0].duration,
            max: peak?.max ? formatDuration(parseDuration(peak.max)) : undefined,
            status: 'saving',
            total,
            ctime,
            id,
        });

        const record = records.value[0];

        try {
            const sheet: [number | string, string][] = [['序号', '计次时间']];
            times.reduceRight((_, t) => sheet.push([t.index, t.duration]), 0);
            await saveAsUserData(id, sheet);
            record.status = 'saved';
        } catch (error) {
            record.status = 'dead';
            throw error;
        }
    }

    function remove(id: string) {
        const index = records.value.findIndex(r => r.id === id);
        if (index < 0) return;
        const deletedRecord = records.value.splice(index, 1);
        deletedRecords.value.unshift({
            ...deletedRecord[0],
            dtime: Date.now(),
        });
    }

    function recovery(idset: Set<string>) {
        const leavedRecords: DeletedRecord[] = [];
        for (const record of deletedRecords.value) {
            if (idset.has(record.id)) {
                records.value.unshift(record);
            } else {
                leavedRecords.push(record);
            }
        }
        deletedRecords.value = leavedRecords;
    }

    function exportExcel(id: string) {
        return exportExcelFile(id);
    }

    function confirmDelete(idset: Set<string>) {
        deletedRecords.value = deletedRecords.value.filter(r => {
            if (!idset.has(r.id)) return true;
            deleteExcelFile(r.id).catch(() => {});
            return false;
        });
    }

    function confirmRemove(record: HistoryRecord) {
        return new Promise<string>((resolve, reject) => {
            recordToBeConfirmed.value = {
                ...record,
                confirm: () => {
                    const { id } = recordToBeConfirmed.value!;
                    recordToBeConfirmed.value = undefined;
                    resolve(id);
                },
                cancel: () => {
                    recordToBeConfirmed.value = undefined;
                    reject(new RecordConfirmRejectError());
                },
            };
        });
    }

    function checkRecordStatus() {
        for (const record of records.value) {
            setTimeout(() => {
                record.status = checkIfExist(record.id) ? 'saved' : 'dead';
            });
        }
    }

    function checkRecordDeleted() {
        const ktime = KeepDay4Deleted * 24 * 60 * 60 * 1000;
        const ntime = Date.now();
        const leavedRecords = [];
        for (const record of deletedRecords.value) {
            if (record.dtime + ktime < ntime) {
                deleteExcelFile(record.id).catch(() => {});
            } else {
                leavedRecords.push(record);
            }
        }
        deletedRecords.value = leavedRecords;
    }

    return {
        records,
        deletedRecords,
        recordToBeConfirmed,

        generate,
        remove,
        recovery,
        exportExcel,
        confirmDelete,
        confirmRemove,
        checkRecordStatus,
        checkRecordDeleted,
    };
});

export const useHistoryLaunch = () => {
    const history = useHistoryStore();

    history.$subscribe((_, state) => {
        const { records, deletedRecords } = state;
        const data = JSON.stringify({ records, deletedRecords });
        uni.setStorage({ key: 'history', data });
    });

    onLaunch(() => {
        const data = uni.getStorageSync('history');
        if (!data) return;
        history.$patch(JSON.parse(data));
        setTimeout(() => {
            history.checkRecordStatus();
            history.checkRecordDeleted();
        });
    });
};
