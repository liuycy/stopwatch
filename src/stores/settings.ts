import { defineStore } from 'pinia';
import { ref } from 'vue';

import { DialType, VibrateType } from '@/types/enums';

export const useSettings = defineStore('settings', () => {
    const keepScreenOn = ref(true);
    const historyVisible = ref(true);
    const isActionsReverse = ref(false);
    const vibrateType = ref<VibrateType>(VibrateType.Short);
    const defaultDialType = ref<DialType>(DialType.Number);

    function changeScreenOn() {
        keepScreenOn.value = !keepScreenOn.value;
        uni.setKeepScreenOn({ keepScreenOn: keepScreenOn.value });
    }

    function reverseActions() {
        isActionsReverse.value = !isActionsReverse.value;
    }

    function nextVibrateType() {
        vibrateType.value = (vibrateType.value + 1) % 3;
        if (vibrateType.value === VibrateType.Short) {
            uni.vibrateShort();
        }
        if (vibrateType.value === VibrateType.Long) {
            uni.vibrateLong();
        }
    }

    function nextDefaultDialType() {
        defaultDialType.value = (defaultDialType.value + 1) % 2;
    }

    return {
        keepScreenOn,
        historyVisible,
        isActionsReverse,
        vibrateType,
        defaultDialType,

        changeScreenOn,
        reverseActions,
        nextVibrateType,
        nextDefaultDialType,
    };
});
