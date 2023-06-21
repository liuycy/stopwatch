import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useTimerStore = defineStore('timer', () => {
    const state = ref<'running' | 'paused' | 'stopped'>('stopped');
    const picked = ref([0, 0, 0]);
    const startAt = ref(0);
    const duration = ref(0);
    const endAt = ref(0);

    const isAllZero = computed(() => picked.value[0] === 0 && picked.value[1] === 0 && picked.value[2] === 0);

    let interval = -1;
    let pauseAt = 0;

    function tick() {
        const now = Date.now();
        if (now >= endAt.value) return stop();
        duration.value = endAt.value - now;
    }

    function start() {
        const [hours, minutes, seconds] = picked.value;
        startAt.value += Date.now() - pauseAt;

        endAt.value = startAt.value + 1000 * seconds + 60000 * minutes + 3600000 * hours;
        state.value = 'running';
        interval = setInterval(tick, 20);
    }

    function pause() {
        pauseAt = Date.now();
        state.value = 'paused';
        clearInterval(interval);
    }

    function stop() {
        state.value = 'stopped';
        clearInterval(interval);
        pauseAt = 0;
        startAt.value = 0;
        duration.value = 0;
        endAt.value = 0;
    }

    function reset() {
        stop();
        interval = -1;
        picked.value = [0, 0, 0];
    }

    return {
        state,
        picked,
        isAllZero,

        startAt,
        duration,
        endAt,

        start,
        pause,
        stop,
        reset,
    };
});
