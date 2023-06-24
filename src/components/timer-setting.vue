<template>
    <view class="fullscreen-button" @click="fullscreen()" hover-class="hover" :hover-start-time="0" :hover-stay-time="50"
        :style="{ top }">
        <svg-icon class="icon" src="/static/icon-fullscreen.svg" size="16px" color="#fff"></svg-icon>
        <text>横屏</text>
    </view>

    <view class="timer-setting">
        <view class="function-list">
            <view class="item">
                <view>计时结束时提醒</view>
                <view>
                    <view class="span">
                        <view>铃声</view>
                        <switch class="switch" @change="changeSetting('ring')" :checked="settings.enableTimerRing"></switch>
                    </view>
                    <view class="span">
                        <view>震动</view>
                        <switch class="switch" @change="changeSetting('vibrate')" :checked="settings.enableTimerVibrate">
                        </switch>
                    </view>
                </view>
            </view>
        </view>

        <view class="tips" v-if="timer.state === 'running'">
            <text>息屏或切到后台 自动暂停计时</text>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global';
import { useSettingsStore } from '@/stores/settings';
import { useTimerStore } from '@/stores/timer';

import SvgIcon from '@/components/svg-icon.vue'

const global = useGlobalStore()
const settings = useSettingsStore()
const timer = useTimerStore()

const top = `${4 + global.safeArea.top}px`


function fullscreen() {
    uni.redirectTo({ url: 'timer-fullscreen' })
}

function changeSetting(type: 'ring' | 'vibrate') {
    settings.vibrate()
    if (type === 'ring') settings.enableTimerRing = !settings.enableTimerRing
    if (type === 'vibrate') settings.enableTimerVibrate = !settings.enableTimerVibrate
}
</script>

<style lang="scss" scoped>
.fullscreen-button {
    width: 66px;
    height: 30px;
    position: absolute;
    left: 16px;
    font-size: 16px;
    border-radius: 18px;
    border: 1px solid var(--color-border);
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
        margin-right: 2px;
    }

    &.hover {
        opacity: 0.5;
    }
}

.timer-setting {
    width: 100vw;
    position: absolute;
    top: 920rpx;

    .function-list {
        margin: 16px;
        border-radius: 10px;
        background-color: var(--color-modal-bg);

        .item {
            border: unset;
            box-sizing: content-box;
            height: 30px;
            padding: 10rpx;
            padding-left: 16px;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--color-tips);

            .span {
                display: inline-flex;
                align-items: center;
            }

            .switch {
                transform: scale(0.6);
            }
        }
    }

    .tips {
        width: 100%;
        color: var(--color-tips);
        text-align: center;
        font-size: 12px;
    }
}
</style>