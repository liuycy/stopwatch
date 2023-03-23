import type { Duration } from '../types/time';

export function padFixedInt(num: number | undefined, maxLength = 2) {
    if (num === undefined) return undefined;

    const int = ~~num;
    return `${int}`.padStart(maxLength, '0');
}

export function parseDuration(duration: number) {
    const milliseconds = duration % 60000;
    const ms = (duration % 1000) / 10;
    const seconds = (duration / 1000) % 60;
    const minutes = (duration / 60000) % 60;

    const hoursValue = duration / 3600000;
    const hours = hoursValue < 1 ? undefined : hoursValue;

    return { milliseconds, ms, seconds, minutes, hours };
}

export function formatDuration(duration: Duration) {
    const h = padFixedInt(duration.hours);
    const m = padFixedInt(duration.minutes);
    const s = padFixedInt(duration.seconds);
    const ss = padFixedInt(duration.ms);

    if (!h) return `${m}:${s}.${ss}`;
    return `${h}:${m}:${s}.${ss}`;
}
