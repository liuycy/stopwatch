export const padFixedInt = (num: number | undefined, maxLength = 2) => {
  if (num === undefined) return undefined;

  const int = ~~num;
  return `${int}`.padStart(maxLength, "0");
};

export const parseDuration = (duration: number) => {
  const milliseconds = duration % 60000;
  const ms3 = duration % 1000;
  const ms = ms3 / 10;
  const seconds = (duration / 1000) % 60;
  const minutes = (duration / 60000) % 60;

  const hoursValue = duration / 3600000;
  const hours = hoursValue < 1 ? undefined : hoursValue;

  return { milliseconds, ms3, ms, seconds, minutes, hours };
};

export const formatDuration = (duration: Duration, options?: { ms3?: boolean; noMs?: boolean; noColon?: boolean }) => {
  const h = padFixedInt(duration.hours);
  const m = padFixedInt(duration.minutes);
  const s = padFixedInt(duration.seconds);

  const ss = options?.ms3 ? padFixedInt(duration.ms3, 3) : padFixedInt(duration.ms);

  if (options?.noColon) return !h ? `${m} ${s}` : `${h} ${m} ${s}`;
  if (options?.noMs) return !h ? `${m}:${s}` : `${h}:${m}:${s}`;
  return !h ? `${m}:${s}.${ss}` : `${h}:${m}:${s}.${ss}`;
};

export const formatTime = (ms: number, format = "yyyy-mm-dd hh:MM:ss") => {
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
};
