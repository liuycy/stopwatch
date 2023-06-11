import { defineStore } from 'pinia';
import { ref } from 'vue';

import { formatDuration, parseDuration } from '@/utils/format';
import type { TimeRecord, Duration, TimePeak } from '@/types/time';

export const useRecordsStore = defineStore('records', () => {
    const timeRecords = ref<TimeRecord[]>([]);
    const duration = ref<Duration>();
    const durationText = ref<string>();
    const timeText = ref<string>();
    const timePeak = ref<TimePeak>();

    let ldtime = 0;
    let startAt = 0;
    let pausedAt = 0;
    let timer = 0;

    function reset() {
        timeRecords.value = [];
        duration.value = undefined;
        durationText.value = undefined;
        timeText.value = undefined;
        timePeak.value = undefined;
        ldtime = 0;
        startAt = 0;
        pausedAt = 0;
    }

    function tick() {
        const now = Date.now();
        const dtime = now - startAt;
        duration.value = parseDuration(dtime);
        durationText.value = formatDuration(duration.value);
        timeText.value = formatDuration(parseDuration(ldtime + dtime));
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

    function peakTime(ms: number, time: number, index: number) {
        if (!timePeak.value) {
            timePeak.value = { min: ms, minIndex: index, firstTime: time };
            return timePeak.value;
        }

        if (index > 1) timePeak.value.lastTime = time;

        const { min, max, minIndex } = timePeak.value;

        if (ms < min) {
            timePeak.value.min = ms;
            timePeak.value.minIndex = index;

            if (index > 1 && !max) {
                timePeak.value.max = min;
                timePeak.value.maxIndex = minIndex;
            }

            return timePeak.value;
        }

        if (ms === min) {
            return timePeak.value;
        }

        if (!max || ms > max) {
            timePeak.value.max = ms;
            timePeak.value.maxIndex = index;
            return timePeak.value;
        }

        return timePeak.value;
    }

    function addTime() {
        const now = Date.now();
        const dtime = now - startAt;
        const time = ldtime + dtime;
        const index = timeRecords.value.length + 1;

        startAt = now;
        ldtime = dtime;
        peakTime(dtime, time, index);
        timeRecords.value.unshift({
            id: `${index}-${time}-${dtime}`,
            time: formatDuration(parseDuration(time)),
            duration: formatDuration(parseDuration(dtime)),
            index,
        });
    }

    return {
        timeRecords,
        duration,
        durationText,
        timeText,
        timePeak,

        reset,
        start,
        pause,
        addTime,
    };
});
