export const enum PageType {
    Stopwatch = 0,
    Timer = 1,
}

export const enum DialType {
    Number = 0,
    Emulate = 1,
}

export const enum DialStatus {
    Init = 0,
    Running = 1,
    Paused = 2,
}

export const enum RecordType {
    Time = 0,
    Duration = 1,
}

export const enum VibrateType {
    Short = 0,
    Long = 1,
    Disabled = 2,
}

export const enum PageURLs {
    RecycleBin = '/pages/index/recycle-bin',
    Stopwatch = '/pages/index/stopwatch',
    Timer = '/pages/index/timer',
    TimerFullscreen = '/pages/index/timer-fullscreen',
}
