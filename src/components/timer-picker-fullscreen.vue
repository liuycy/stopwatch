<template>
    <view class="view-box" :style="{ '--top': top }">
        <picker-view class="picker-view" @change="onChange" indicator-class="picker-indicator" mask-class="picker-mask"
            immediate-change>
            <picker-view-column class="action">
                <view class="item" v-for="(hour, index) in 24" :key="hour">
                    <text class="text">{{ index }}</text>
                </view>
            </picker-view-column>
            <picker-view-column class="action">
                <view class="item" v-for="(minute, index) in 60" :key="minute">
                    <text class="text">{{ index }}</text>
                </view>
            </picker-view-column>
            <picker-view-column class="action">
                <view class="item" v-for="(second, index) in 60" :key="second">
                    <text class="text">{{ index }}</text>
                </view>
            </picker-view-column>
        </picker-view>
        <view class="mask">
            <view class="item">
                <text class="label">时</text>
            </view>
            <view class="item">
                <text class="label">分</text>
            </view>
            <view class="item">
                <text class="label">秒</text>
            </view>
            <view class="bar"></view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global'
import { useTimerStore } from '@/stores/timer'

const global = useGlobalStore()
const timer = useTimerStore()

const top = `${global.topGap}px`

function onChange(e: any) {
    if (timer.state === 'running' || timer.state === 'paused') return

    timer.state = 'stopped'
    timer.picked = e.detail.value
}

defineProps<{
    fullscreen?: boolean
}>()
</script>

<style lang="scss" scoped>
.view-box {
    --padding: 16px;
    --width: 200px;
    --height: calc(100vh - 32px);

    width: var(--width);
    height: var(--height);
    padding: var(--padding);
    position: relative;
    left: var(--top);
    display: flex;
    align-items: flex-end;

    .picker-view {
        width: 100%;
        height: 100%;

        .item {
            text-align: center;
            font-size: 20px;
            display: flex;
            align-items: center;

            .text {
                flex: 0 0 50%;
                height: 100%;
                display: inline-flex;
                justify-content: flex-end;
                align-items: center;
                color: var(--color-tips);
            }
        }
    }

    .mask {
        pointer-events: none;
        width: calc(100% - 32px);
        height: calc(100% - 32px);
        padding: 16px;
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;

        .item {
            flex: 1 1 auto;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .label {
                flex: 0 0 45%;
                display: inline-flex;
                font-weight: bold;
                font-size: 14px;
                color: var(--color-text);
            }
        }

        .bar {
            height: 34px;
            width: var(--width);
            position: absolute;
            border-radius: 5px;
            background-color: var(--color-mask-bar);

            &::before {
                content: ' ';
                height: 100vh;
                width: var(--width);
                position: absolute;
                top: -100vh;
                display: inline-block;
                background-color: var(--color-mask-bg);
            }

            &::after {
                content: ' ';
                height: 100vh;
                width: var(--width);
                position: absolute;
                top: 34px;
                display: inline-block;
                background-color: var(--color-mask-bg);
            }
        }
    }
}
</style>