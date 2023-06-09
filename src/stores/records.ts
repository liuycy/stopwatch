import { defineStore } from 'pinia';
import { ref } from 'vue';

import { formatDuration, parseDuration } from '@/utils/format';
import type { TimeRecord, Duration, TimePeak } from '@/types/time';

export const useRecordsStore = defineStore('records', () => {
    const byTime = ref<TimeRecord[]>([]);
    const durationByTime = ref<Duration>();
    const nowByTime = ref<string>();
    const peakByTime = ref<TimePeak>();

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
            peakByTime.value = { min: ms, minIndex: index };
            return peakByTime.value;
        }

        const { min, max, minIndex } = peakByTime.value;

        if (ms < min) {
            peakByTime.value.min = ms;
            peakByTime.value.minIndex = index;

            if (index > 1 && !max) {
                peakByTime.value.max = min;
                peakByTime.value.maxIndex = minIndex;
            }

            return peakByTime.value;
        }

        if (ms === min) {
            return peakByTime.value;
        }

        if (!max || ms > max) {
            peakByTime.value.max = ms;
            peakByTime.value.maxIndex = index;
            return peakByTime.value;
        }

        return peakByTime.value;
    }

    function addTime() {
        const now = Date.now();
        const duration = parseDuration(now - startAt);
        const index = byTime.value.length + 1;

        const { minIndex, maxIndex } = peak(now - startAt, index);

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
