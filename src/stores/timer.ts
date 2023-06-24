import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { useSettingsStore } from '@/stores/settings';

export const useTimerStore = defineStore('timer', () => {
    const settings = useSettingsStore();

    const state = ref<'running' | 'paused' | 'stopped'>('stopped');
    const picked = ref([0, 0, 0]);
    const finished = ref(0);
    const startAt = ref(0);
    const firstStartAt = ref(0);
    const duration = ref(0);
    const endAt = ref(0);

    const startDisabled = computed(() => {
        if (!settings.isReverseTimer) return false;
        const [h, m, s] = picked.value;
        return h === 0 && m === 0 && s === 0;
    });

    let interval = -1;
    let pauseAt = 0;

    function tick() {
        const now = Date.now();

        if (settings.isReverseTimer) {
            if (now >= endAt.value) {
                finished.value += 1;
                return stop();
            }
            duration.value = endAt.value - now;
        } else {
            duration.value = now - startAt.value;
        }
    }

    function start() {
        startAt.value += Date.now() - pauseAt;
        if (!firstStartAt.value) firstStartAt.value = startAt.value;

        if (settings.isReverseTimer) {
            const [h, m, s] = picked.value;
            endAt.value = startAt.value + 1000 * s + 60000 * m + 3600000 * h;
        }

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
        firstStartAt.value = 0;
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
        finished,
        startAt,
        firstStartAt,
        duration,
        endAt,
        startDisabled,

        start,
        pause,
        stop,
        reset,
    };
});
