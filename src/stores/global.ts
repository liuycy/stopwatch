import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', () => {
    const { theme } = uni.getAppBaseInfo();
    const { platform } = uni.getDeviceInfo();
    const { safeArea, pixelRatio, screenWidth } = uni.getWindowInfo();

    return {
        theme,
        platform,

        safeArea,
        pixelRatio,
        screenWidth,
    };
});
