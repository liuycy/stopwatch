import { ref } from 'vue';
import { defineStore } from 'pinia';

import { DialStatus } from '@/types/enums';
import { formatDuration, parseDuration } from '@/utils/format';

export const useDialStore = defineStore('dial', () => {
    const milliseconds = ref(0);
    const ms3 = ref(0);
    const ms = ref(0);
    const seconds = ref(0);
    const minutes = ref(0);
    const hours = ref<number>();
    const status = ref(DialStatus.Init);

    let startAt = 0;
    let pausedAt = 0;
    let timer = 0;

    function tick() {
        const now = Date.now();
        const duration = parseDuration(now - startAt);

        milliseconds.value = duration.milliseconds;
        ms3.value = duration.ms3;
        ms.value = duration.ms;
        seconds.value = duration.seconds;
        minutes.value = duration.minutes;
        hours.value = duration.hours;
    }

    function start() {
        const now = Date.now();
        const durationMs = now - pausedAt;
        startAt += durationMs;
        status.value = DialStatus.Running;
        timer = setInterval(tick, 20);
    }

    function pause() {
        clearInterval(timer);
        pausedAt = Date.now();
        status.value = DialStatus.Paused;
    }

    function reset() {
        milliseconds.value = 0;
        ms3.value = 0;
        ms.value = 0;
        seconds.value = 0;
        minutes.value = 0;
        hours.value = undefined;
        status.value = DialStatus.Init;
        startAt = 0;
        pausedAt = 0;
    }

    function now() {
        return formatDuration({
            milliseconds: milliseconds.value,
            ms3: ms3.value,
            ms: ms.value,
            seconds: seconds.value,
            minutes: minutes.value,
            hours: hours.value,
        });
    }

    return {
        milliseconds,
        ms3,
        ms,
        seconds,
        minutes,
        hours,
        status,

        start,
        pause,
        reset,
        now,
    };
});
