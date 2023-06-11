export interface TimeRecord {
    id: string;
    time: Duration;
    duration: Duration;
    index: number;
}

export interface TimePeak {
    min: number;
    minIndex: number;
    firstTime: number;
    max?: number;
    maxIndex?: number;
    lastTime?: number;
}

export interface Duration {
    milliseconds: number; // 指针角度占比
    ms3: number;
    ms: number;
    seconds: number;
    minutes: number;
    hours?: number;
}
