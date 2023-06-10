export interface HistoryRecord {
    id: string;
    min: string;
    max?: string;
    total: number;
    ctime: number;
    status: HistoryRecordStatus;
}

export type HistoryRecordStatus = 'saving' | 'saved' | 'dead';

export type DeletedRecord = HistoryRecord & {
    dtime: number;
};

export type RecordToBeConfirmed = HistoryRecord & {
    confirm(): void;
    cancel(): void;
};

export class RecordConfirmRejectError extends Error {}
