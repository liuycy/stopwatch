<template>
    <view class="view-box" :class="{ fullscreen }" :style="{ '--top': top }">
        <view class="time-label" v-if="settings.isTimerPageFullscreen">
            <text class="number">{{ padFixedInt(duration.hours) }}</text>
            <colon-symbol></colon-symbol>
            <text class="number">{{ padFixedInt(duration.minutes) }}</text>
            <colon-symbol></colon-symbol>
            <text class="number">{{ padFixedInt(duration.seconds) }}</text>
        </view>
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
import { computed } from 'vue'

import { useGlobalStore } from '@/stores/global'
import { useTimerStore } from '@/stores/timer'
import { useSettingsStore } from '@/stores/settings'
import { parseDuration, padFixedInt } from '@/utils/format'

import ColonSymbol from '@/components/colon-symbol.vue'

const global = useGlobalStore()
const timer = useTimerStore()
const settings = useSettingsStore()

const duration = computed(() => parseDuration(timer.duration))
const top = `${global.safeArea.top}px`

defineProps<{
    fullscreen?: boolean
}>()

function onChange(e: any) {
    if (timer.state === 'running' || timer.state === 'paused') return

    timer.state = 'stopped'
    timer.picked = e.detail.value
}
</script>

<style lang="scss" scoped>
.view-box {
    width: calc(100vw - 48px);
    height: 600rpx;
    padding: 24px;
    position: relative;
    display: flex;
    align-items: flex-end;

    .picker-view {
        width: 100%;
        height: 240px;

        .item {
            text-align: center;
            font-size: 24px;
            display: flex;
            align-items: center;

            .text {
                flex: 0 0 40%;
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
        padding: 24px;
        padding-top: 0;
        position: absolute;
        bottom: 0;
        left: 0;
        height: 240px;
        width: calc(100% - 48px);
        display: flex;
        align-items: center;
        justify-content: space-between;
        overflow: hidden;

        .item {
            flex: 1 1 auto;
            height: 34px;
            font-size: 24px;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .label {
                flex: 0 0 55%;
                display: inline-flex;
                font-weight: bold;
                font-size: 16px;
                color: var(--color-text);
            }
        }

        .bar {
            position: absolute;
            width: calc(100vw - 96rpx);
            height: 34px;
            border-radius: 5px;
            background-color: var(--color-mask-bar);

            &::before {
                content: ' ';
                position: absolute;
                top: -100vh;
                display: inline-block;
                width: calc(100vw - 96rpx);
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.7);
            }

            &::after {
                content: ' ';
                position: absolute;
                top: 34px;
                display: inline-block;
                width: calc(100vw - 96rpx);
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.7);
            }
        }
    }

    &.fullscreen {
        margin-left: var(--top, 20px);
        width: 200px;
        height: calc(100vh - 48px);

        .picker-view {
            height: 100%;
        }

        .mask {
            width: 200px;
            height: calc(100vh - 48px);

            .bar {
                width: 200px;
            }
        }
    }
}
</style>