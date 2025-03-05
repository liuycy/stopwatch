export const useTimer = defineStore("timer", () => {
  const state = reactive({
    settings: {
      ring: false,
      vibrate: true,
      reversed: true,
      nosecond: false,
      clock: true,
      tick: 0,
    },
    status: ref<"running" | "paused" | "stopped">("stopped"),
    picked: [0, 0, 0],
    startAt: 0,
    firstStartAt: 0,
    duration: 0,
    endAt: 0,
  });

  const startDisabled = computed(() => {
    if (!state.settings.reversed) return false;
    const [h, m, s] = state.picked;
    return h === 0 && m === 0 && s === 0;
  });

  let interval = -1;
  let pauseAt = 0;

  const register = () => {
    const key = "timer";
    watch(state, () => uni.setStorage({ key, data: { settings: state.settings } }));
    uni.getStorage({ key, success: (res) => Object.assign(state, res.data) });
  };

  const tick = () => {
    const now = Date.now();

    if (state.settings.reversed) {
      if (now >= state.endAt) {
        uni.$emit("timer-finished");
        return stop();
      }
      state.duration = state.endAt - now;
    } else {
      state.duration = now - state.startAt;
    }
  };

  const start = () => {
    state.startAt += Date.now() - pauseAt;
    if (!state.firstStartAt) state.firstStartAt = state.startAt;

    if (state.settings.reversed) {
      const [h, m, s] = state.picked;
      state.endAt = state.startAt + 1000 * s + 60000 * m + 3600000 * h;
    }

    state.status = "running";
    uni.setKeepScreenOn({ keepScreenOn: true });
    interval = setInterval(tick, 20);
  };

  const pause = () => {
    pauseAt = Date.now();
    state.status = "paused";
    clearInterval(interval);
    uni.setKeepScreenOn({ keepScreenOn: false });
  };

  const stop = () => {
    pauseAt = 0;
    state.endAt = 0;
    state.startAt = 0;
    state.duration = 0;
    state.firstStartAt = 0;
    state.status = "stopped";
    clearInterval(interval);
    uni.setKeepScreenOn({ keepScreenOn: false });
  };

  const reset = () => {
    stop();
    interval = -1;
    state.picked = [0, 0, 0];
  };

  return {
    ...toRefs(state),
    startDisabled,

    register,
    start,
    pause,
    stop,
    reset,
  };
});
