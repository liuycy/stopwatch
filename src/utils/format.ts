import type { Duration } from '@/types/time';

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

export function formatTime(ms: number, format = 'yyyy-mm-dd hh:MM:ss') {
    const time = new Date(ms);

    const year = time.getFullYear();
    const month = padFixedInt(time.getMonth() + 1)!;
    const date = padFixedInt(time.getDate())!;
    const hours = padFixedInt(time.getHours())!;
    const minutes = padFixedInt(time.getMinutes())!;
    const seconds = padFixedInt(time.getSeconds())!;

    return format
        .replace(/y+/, `${year}`)
        .replace(/m+/, month)
        .replace(/d+/, date)
        .replace(/h+/, hours)
        .replace(/M+/, minutes)
        .replace(/s+/, seconds);
}
