import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', () => {
    const { theme } = uni.getAppBaseInfo();
    const { platform } = uni.getDeviceInfo();
    const { safeArea, statusBarHeight, pixelRatio, screenWidth } = uni.getWindowInfo();

    const topGap = safeArea.top || statusBarHeight;

    return {
        theme,
        platform,

        pixelRatio,
        screenWidth,
        topGap,
    };
});
