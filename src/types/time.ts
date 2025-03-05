export interface TimeRecord {
  id: string;
  time: Duration;
  duration: Duration;
  index: number;
  tag?: Tag;
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
  milliseconds: number;
  ms3: number;
  ms: number;
  seconds: number;
  minutes: number;
  hours?: number;
}

export interface Tag {
  id: number;
  text: string;
  color: string;
}
