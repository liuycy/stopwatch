<template>
    <view class="view-box">
        <picker-view class="picker-view" @change="onChange" indicator-class="picker-indicator" mask-class="picker-mask"
            immediate-change>
            <picker-view-column class="action">
                <view class="item" v-for="(hour, index) in 24" :key="hour">
                    <text class="text">{{ index }}</text>
                    <text class="label">小时</text>
                </view>
            </picker-view-column>
            <picker-view-column class="action">
                <view class="item" v-for="(minute, index) in 60" :key="minute">
                    <text class="text">{{ index }}</text>
                    <text class="label">分钟</text>
                </view>
            </picker-view-column>
            <picker-view-column class="action">
                <view class="item" v-for="(second, index) in 60" :key="second">
                    <text class="text">{{ index }}</text>
                    <text class="label">秒</text>
                </view>
            </picker-view-column>
        </picker-view>
        <view class="mask">
            <view class="item">
                <text class="text">0</text>
                <text class="label">小时</text>
            </view>
            <view class="item">
                <text class="text">0</text>
                <text class="label">分钟</text>
            </view>
            <view class="item">
                <text class="text">0</text>
                <text class="label">秒</text>
            </view>
            <view class="bar"></view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { onUnmounted } from 'vue'

import { useTimerStore } from '@/stores/timer'

const timer = useTimerStore()

function onChange(e: any) {
    if (timer.state === 'running' || timer.state === 'paused') return

    timer.state = 'stopped'
    timer.picked = e.detail.value
}

onUnmounted(() => {
    timer.reset()
})
</script>

<style lang="scss" scoped>
.view-box {
    width: calc(100vw - 2 * 48rpx);
    height: 600rpx;
    padding: 48rpx;
    position: relative;
    display: flex;
    align-items: flex-end;

    .picker-view {
        width: 100%;
        height: 420rpx;

        .item {
            height: 80rpx;
            text-align: center;
            font-size: 48rpx;
            transform-origin: 0 0 -100px;

            .text {
                width: 60rpx;
                height: 80rpx;
                display: inline-block;
                text-align: right;
                color: var(--color-tips);
            }

            .label {
                margin-left: 8rpx;
                height: 80rpx;
                width: 80rpx;
                display: inline-block;
                text-align: left;
                line-height: 80rpx;
                font-weight: bold;
                font-size: 32rpx;
                opacity: 0;
            }
        }
    }

    .mask {
        pointer-events: none;
        padding: 48rpx;
        padding-top: 0;
        position: absolute;
        bottom: 0;
        left: 0;
        height: 420rpx;
        width: calc(100% - 96rpx);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .item {
            flex: 1 1 auto;
            height: 80rpx;
            text-align: center;
            font-size: 48rpx;

            .text {
                width: 60rpx;
                height: 80rpx;
                display: inline-block;
                text-align: right;
                opacity: 0;
            }

            .label {
                margin-left: 8rpx;
                height: 80rpx;
                width: 80rpx;
                display: inline-block;
                text-align: left;
                line-height: 80rpx;
                font-weight: bold;
                font-size: 32rpx;
                color: var(--color-text);
            }
        }

        .bar {
            position: absolute;
            width: calc(100vw - 96rpx);
            height: 60rpx;
            border-radius: 10rpx;
            background-color: var(--color-mask-bar);
        }
    }
}
</style>