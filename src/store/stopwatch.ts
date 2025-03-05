export const useSetting = defineStore("stopwatch-setting", () => {
  const state = reactive({
    screenOn: false,
    reversed: false,
    history: true,
    trash: false,
    vibrateType: 0,
    record: 0,
    timer: 0,
  });

  const register = () => {
    const key = "stopwatch-settings";
    watch(state, () => uni.setStorage({ key, data: state }));
    watchEffect(() => uni.setKeepScreenOn({ keepScreenOn: state.screenOn }));
    uni.getStorage({ key, success: (res) => Object.assign(state, res.data) });
  };

  const vibrate = async () => {
    await nextTick();
    if (state.vibrateType === VibrateType.Disabled) return;
    if (state.vibrateType === VibrateType.Short) uni.vibrateShort();
    if (state.vibrateType === VibrateType.Long) uni.vibrateLong();
  };

  return { ...toRefs(state), register, vibrate };
});

export const useDial = defineStore("stopwatch-dial", () => {
  const state = reactive({
    milliseconds: 0,
    ms3: 0,
    ms: 0,
    seconds: 0,
    minutes: 0,
    hours: ref<number>(),
    status: DialStatus.Init,
  });

  let pauseAt = 0;
  let startAt = 0;
  let timer = 0;

  const tick = () => {
    const now = Date.now();
    const duration = parseDuration(now - startAt);
    Object.assign(state, duration);
  };

  const now = () => formatDuration(toRaw(state));

  const start = () => {
    startAt += Date.now() - pauseAt;
    state.status = DialStatus.Running;
    timer = setInterval(tick, 20);
  };

  const pause = () => {
    clearInterval(timer);
    pauseAt = Date.now();
    state.status = DialStatus.Paused;
  };

  const reset = () => {
    state.milliseconds = 0;
    state.ms3 = 0;
    state.ms = 0;
    state.seconds = 0;
    state.minutes = 0;
    state.hours = undefined;
    state.status = DialStatus.Init;
    startAt = 0;
    pauseAt = 0;
  };

  return { ...toRefs(state), now, start, pause, reset };
});

export const useRecords = defineStore("records", () => {
  const state = reactive({
    timeRecords: [] as TimeRecord[],
    duration: ref<Duration>(),
    durationText: ref<string>(),
    timeText: ref<string>(),
    timePeak: ref<TimePeak>(),
  });

  const isTimeRecord = computed(() => useSetting().record === RecordType.Time);
  const curRecord = computed(() => (isTimeRecord.value ? state.timeText : state.durationText));

  let time = 0;
  let startAt = 0;
  let pausedAt = 0;
  let timer = 0;

  const reset = () => {
    state.timeRecords = [];
    state.duration = undefined;
    state.durationText = undefined;
    state.timeText = undefined;
    state.timePeak = undefined;
    time = 0;
    startAt = 0;
    pausedAt = 0;
  };

  const tick = () => {
    const now = Date.now();
    const dtime = now - startAt;
    state.duration = parseDuration(dtime);
    state.durationText = formatDuration(state.duration);
    state.timeText = formatDuration(parseDuration(time));
  };

  const start = () => {
    const now = Date.now();
    const duration = now - pausedAt;
    startAt += duration;
    timer = setInterval(tick, 20);
  };

  const pause = () => {
    clearInterval(timer);
    pausedAt = Date.now();
  };

  const peakTime = (ms: number, index: number) => {
    if (!state.timePeak) {
      state.timePeak = { min: ms, minIndex: index, firstTime: time };
      return state.timePeak;
    }

    if (index > 1) state.timePeak.lastTime = time;

    const { min, max, minIndex } = state.timePeak;

    if (ms < min) {
      state.timePeak.min = ms;
      state.timePeak.minIndex = index;

      if (index > 1 && !max) {
        state.timePeak.max = min;
        state.timePeak.maxIndex = minIndex;
      }

      return state.timePeak;
    }

    if (ms === min) {
      return state.timePeak;
    }

    if (!max || ms > max) {
      state.timePeak.max = ms;
      state.timePeak.maxIndex = index;
      return state.timePeak;
    }

    return state.timePeak;
  };

  const addTime = () => {
    const now = Date.now();
    const dtime = now - startAt;
    const index = state.timeRecords.length + 1;

    startAt = now;
    time += dtime;
    peakTime(dtime, index);
    state.timeRecords.unshift({
      id: `${index}-${time}-${dtime}`,
      duration: parseDuration(dtime),
      time: parseDuration(time),
      index,
    });
  };

  const unbindTag = (record: TimeRecord) => {
    const oldtag = record.tag;
    delete record.tag;
    return oldtag;
  };
  const bindTag = (record: TimeRecord, tag: Tag) => {
    const oldtag = record.tag;
    record.tag = tag;
    return oldtag;
  };

  return {
    ...toRefs(state),
    isTimeRecord,
    curRecord,

    reset,
    start,
    pause,
    addTime,
    bindTag,
    unbindTag,
  };
});
