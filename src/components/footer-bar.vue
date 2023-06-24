<template>
    <view class="footer-bar">
        <view class="action" @click="settings.changePageType(PageType.Stopwatch)">
            <svg-icon src="/static/icon-stopwatch.svg" size="56rpx" :color="getActiceColor(PageType.Stopwatch)"></svg-icon>
            <view class="label" :style="{ color: getActiceColor(PageType.Stopwatch) }">秒表</view>
        </view>
        <view class="action" @click="settings.changePageType(PageType.Timer)">
            <svg-icon src="/static/icon-timer.svg" size="56rpx" :color="getActiceColor(PageType.Timer)"></svg-icon>
            <view class="label" :style="{ color: getActiceColor(PageType.Timer) }">计时器</view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '@/stores/settings'
import { PageType } from '@/types/enums'

import SvgIcon from '@/components/svg-icon.vue'

const settings = useSettingsStore()

function getActiceColor(type: PageType) {
    return settings.defaultPageType === type ? '#eba54c' : '#7d7d7d'
}
</script>

<style lang="scss" scoped>
.footer-bar {
    position: absolute;
    bottom: 0;
    width: 100vw;
    height: 50px;
    padding-top: 5px;
    padding-bottom: env(safe-area-inset-bottom, 20px);
    display: flex;
    justify-content: space-around;
    background-color: var(--color-blur);
    backdrop-filter: blur(16px);

    .action {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 10px;

        .label {
            margin-top: 2px;
        }
    }
}
</style>