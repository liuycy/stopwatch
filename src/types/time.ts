export interface TimeRecord {
    duration: string;
    index: number;
}

export interface TimePeak {
    min: number;
    minIndex: number;
    max?: number;
    maxIndex?: number;
}

export interface Duration {
    milliseconds: number;
    ms: number;
    seconds: number;
    minutes: number;
    hours?: number;
}
