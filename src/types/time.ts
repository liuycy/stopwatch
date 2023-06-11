export interface TimeRecord {
    id: string;
    time: string;
    duration: string;
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
    ms: number;
    seconds: number;
    minutes: number;
    hours?: number;
}
