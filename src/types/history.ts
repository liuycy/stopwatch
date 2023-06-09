export interface HistoryRecord {
    id: string;
    min: string;
    max?: string;
    total: number;
    ctime: string;
}

export type RecordToBeConfirmed = HistoryRecord & {
    confirm(): void;
    cancel(): void;
};

export class RecordConfirmRejectError extends Error {}
