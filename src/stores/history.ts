import { onLaunch } from '@dcloudio/uni-app';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { formatDuration } from '@/utils/format';
import { parseDuration } from '@/utils/format';
import type { TimePeak, TimeRecord } from '@/types/time';
import {
    RecordConfirmRejectError,
    type HistoryRecord,
    type RecordToBeConfirmed,
    type DeletedRecord,
} from '@/types/history';

export const useHistoryStore = defineStore('history', () => {
    const records = ref<HistoryRecord[]>([]);
    const deletedRecords = ref<DeletedRecord[]>([]);
    const recordToBeConfirmed = ref<RecordToBeConfirmed>();

    function generate(times: TimeRecord[], peak?: TimePeak) {
        if (!times.length) return;

        const total = times.length;
        const ctime = Date.now();

        records.value.unshift({
            id: `history-${records.value.length}-${total}-${ctime}`,
            min: peak?.min ? formatDuration(parseDuration(peak.min)) : times[0].duration,
            max: peak?.max ? formatDuration(parseDuration(peak.max)) : undefined,
            total,
            ctime,
        });
    }

    function remove(id: string) {
        const index = records.value.findIndex(r => r.id === id);
        if (index < 0) return;
        const deletedRecord = records.value.splice(index, 1);
        deletedRecords.value.unshift({
            ...deletedRecord[0],
            dtime: Date.now(),
        });
    }

    function recovery(idset: Set<string>) {
        const leavedRecords: DeletedRecord[] = [];
        for (const record of deletedRecords.value) {
            if (idset.has(record.id)) {
                records.value.unshift(record);
            } else {
                leavedRecords.push(record);
            }
        }
        deletedRecords.value = leavedRecords;
    }

    function exportExcel(id: string) {
        console.log(id);
    }

    function confirmDelete(idset: Set<string>) {
        deletedRecords.value = deletedRecords.value.filter(r => !idset.has(r.id));
    }

    function confirmRemove(record: HistoryRecord) {
        return new Promise<string>((resolve, reject) => {
            recordToBeConfirmed.value = {
                ...record,
                confirm: () => {
                    const { id } = recordToBeConfirmed.value!;
                    recordToBeConfirmed.value = undefined;
                    resolve(id);
                },
                cancel: () => {
                    recordToBeConfirmed.value = undefined;
                    reject(new RecordConfirmRejectError());
                },
            };
        });
    }

    return {
        records,
        deletedRecords,
        recordToBeConfirmed,

        generate,
        remove,
        recovery,
        exportExcel,
        confirmDelete,
        confirmRemove,
    };
});

export const useHistoryLaunch = () => {
    const history = useHistoryStore();

    history.$subscribe((_, state) => {
        const { records, deletedRecords } = state;
        const data = JSON.stringify({ records, deletedRecords });
        uni.setStorage({ key: 'history', data });
    });

    onLaunch(() => {
        const data = uni.getStorageSync('history');
        if (!data) return;
        history.$patch(JSON.parse(data));
    });
};
