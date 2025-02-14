import { onLaunch } from '@dcloudio/uni-app';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { DialType, PageType, RecordType, TickType, VibrateType } from '@/types/enums';

export const useSettingsStore = defineStore('settings', () => {
    const historyVisible = ref(true);
    const recycleBinEnabled = ref(false);
    const keepScreenOn = ref(true);
    const isActionsReverse = ref(false);
    const tickType = ref(TickType.Disabled);
    const vibrateType = ref(VibrateType.Short);
    const defaultRecordType = ref(RecordType.Duration);
    const defaultDialType = ref(DialType.Number);
    const defaultPageType = ref(PageType.Stopwatch);

    const enableTimerVibrate = ref(true);
    const enableTimerRing = ref(false);
    const isReverseTimer = ref(true);
    const isLockedClock = ref(false);
    const hiddenSeconds = ref(false);

    function vibrate() {
        if (vibrateType.value === VibrateType.Short) {
            uni.vibrateShort();
        }
        if (vibrateType.value === VibrateType.Long) {
            uni.vibrateLong();
        }
    }

    function changePageType(type: PageType, vibratable = true) {
        if (vibratable) vibrate();
        defaultPageType.value = type;
    }

    function changeHistoryVisible() {
        vibrate();
        historyVisible.value = !historyVisible.value;
    }

    function toggleRecyleBin() {
        vibrate();
        recycleBinEnabled.value = !recycleBinEnabled.value;
    }

    function changeScreenOn() {
        vibrate();
        keepScreenOn.value = !keepScreenOn.value;
        uni.setKeepScreenOn({ keepScreenOn: keepScreenOn.value });
    }

    function reverseActions() {
        vibrate();
        isActionsReverse.value = !isActionsReverse.value;
    }

    function nextVibrateType() {
        vibrateType.value = (vibrateType.value + 1) % 3;
        vibrate();
    }

    function nextDefaultRecordType() {
        vibrate();
        defaultRecordType.value = (defaultRecordType.value + 1) % 2;
    }

    function nextDefaultDialType() {
        vibrate();
        defaultDialType.value = (defaultDialType.value + 1) % 2;
    }

    function nextTickType() {
        tickType.value = (tickType.value + 1) % 3;
        vibrate();
    }

    return {
        historyVisible,
        recycleBinEnabled,
        keepScreenOn,
        isActionsReverse,
        vibrateType,
        defaultRecordType,
        defaultDialType,
        defaultPageType,
        enableTimerVibrate,
        enableTimerRing,
        isReverseTimer,
        isLockedClock,
        hiddenSeconds,
        tickType,

        vibrate,
        changePageType,
        changeHistoryVisible,
        toggleRecyleBin,
        changeScreenOn,
        reverseActions,
        nextVibrateType,
        nextDefaultRecordType,
        nextDefaultDialType,
        nextTickType,
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
        settings.changePageType(settings.defaultPageType, false);
        uni.setKeepScreenOn({ keepScreenOn: settings.keepScreenOn });
    });
};
