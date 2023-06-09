import { onLaunch } from '@dcloudio/uni-app';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { DialType, VibrateType } from '@/types/enums';

export const useSettingsStore = defineStore('settings', () => {
    const historyVisible = ref(true);
    const recycleBinEnabled = ref(false);
    const keepScreenOn = ref(true);
    const isActionsReverse = ref(false);
    const vibrateType = ref<VibrateType>(VibrateType.Short);
    const defaultDialType = ref<DialType>(DialType.Number);

    function changeHistoryVisible() {
        historyVisible.value = !historyVisible.value;
    }

    function toggleRecyleBin() {
        recycleBinEnabled.value = !recycleBinEnabled.value;
    }

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
        historyVisible,
        recycleBinEnabled,
        keepScreenOn,
        isActionsReverse,
        vibrateType,
        defaultDialType,

        changeHistoryVisible,
        toggleRecyleBin,
        changeScreenOn,
        reverseActions,
        nextVibrateType,
        nextDefaultDialType,
    };
});

export const useSettingsLanuch = () => {
    const settings = useSettingsStore();

    settings.$subscribe((_, state) => {
        const data = JSON.stringify(state);
        uni.setStorage({ key: 'settings', data });
    });

    onLaunch(() => {
        uni.setKeepScreenOn({ keepScreenOn: true });

        const data = uni.getStorageSync('settings');
        if (!data) return;

        settings.$patch(JSON.parse(data));
        uni.setKeepScreenOn({ keepScreenOn: settings.keepScreenOn });
    });
};
