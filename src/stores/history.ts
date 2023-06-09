import { onLaunch } from '@dcloudio/uni-app';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { formatDuration } from '@/utils/format';
import { formatTime, parseDuration } from '@/utils/format';
import { RecordConfirmRejectError, type HistoryRecord, type RecordToBeConfirmed } from '@/types/history';
import type { TimePeak, TimeRecord } from '@/types/time';

export const useHistoryStore = defineStore('history', () => {
    const records = ref<HistoryRecord[]>([]);
    const recordToBeConfirmed = ref<RecordToBeConfirmed>();

    function generate(times: TimeRecord[], peak?: TimePeak) {
        if (!times.length) return;

        const total = times.length;
        const ctime = formatTime(new Date(), 'yyyy-mm-dd hh:MM:ss');

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
        records.value.splice(index, 1);
    }

    function exportExcel(id: string) {
        console.log(id);
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
        recordToBeConfirmed,

        generate,
        remove,
        exportExcel,
        confirmRemove,
    };
});

export const useHistoryLaunch = () => {
    const history = useHistoryStore();

    history.$subscribe((_, state) => {
        uni.setStorage({ key: 'history', data: JSON.stringify({ records: state.records }) });
    });

    onLaunch(() => {
        const data = uni.getStorageSync('history');
        if (!data) return;
        history.$patch(JSON.parse(data));
    });
};
