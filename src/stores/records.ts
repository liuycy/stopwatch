import { defineStore } from 'pinia';
import { ref } from 'vue';

import { formatDuration, parseDuration } from '@/utils/format';
import type { Duration } from '@/types/time';

export const useRecordsStore = defineStore('records', () => {
    const byTime = ref<{ duration: string; index: number }[]>([]);
    const durationByTime = ref<Duration>();
    const nowByTime = ref<string>();
    const peakByTime = ref<{ min: number; minIndex: number; max?: number; maxIndex?: number }>();

    let startAt = 0;
    let pausedAt = 0;
    let timer = 0;

    function reset() {
        byTime.value = [];
        durationByTime.value = undefined;
        nowByTime.value = undefined;
        peakByTime.value = undefined;
        startAt = 0;
        pausedAt = 0;
    }

    function tick() {
        const now = Date.now();
        const duration = parseDuration(now - startAt);
        nowByTime.value = formatDuration(duration);
        durationByTime.value = duration;
    }

    function start() {
        const now = Date.now();
        const duration = now - pausedAt;
        startAt += duration;
        timer = setInterval(tick, 20);
    }

    function pause() {
        clearInterval(timer);
        pausedAt = Date.now();
    }

    function peak(ms: number, index: number) {
        if (!peakByTime.value) {
            return (peakByTime.value = {
                min: ms,
                minIndex: index,
            });
        }

        const { min, max } = peakByTime.value;

        if (min && min > ms) {
            peakByTime.value.min = ms;
            peakByTime.value.minIndex = index;
        }

        if ((!max && min < ms) || (max && max < ms)) {
            peakByTime.value.max = ms;
            peakByTime.value.maxIndex = index;
        }
    }

    function addTime() {
        const now = Date.now();
        const duration = parseDuration(now - startAt);
        const index = byTime.value.length + 1;

        peak(now - startAt, index);

        startAt = now;
        byTime.value.unshift({
            duration: formatDuration(duration),
            index,
        });
    }

    return {
        byTime,
        durationByTime,
        nowByTime,
        peakByTime,

        reset,
        start,
        pause,
        addTime,
    };
});
