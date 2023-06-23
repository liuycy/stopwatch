<template>
    <view class="timer-fullscreen">
        <view class="panel" @click="hideIfNoClick()">
            <timer-picker fullscreen v-if="!settings.isLockedClock && settings.isReverseTimer"></timer-picker>
            <timer-clock v-if="settings.isLockedClock || !settings.isReverseTimer"></timer-clock>
        </view>

        <view class="actions" @click="hideIfNoClick()" :class="{ float: settings.isLockedClock, hidden }">
            <view class="action" v-if="!settings.isLockedClock">
                <text>倒计时</text>
                <switch class="switch" @change="changeSettings('timer')" :checked="settings.isReverseTimer"></switch>
            </view>
            <view class="action">
                <text>锁定为时钟</text>
                <switch class="switch" @change="changeSettings('locked')" :checked="settings.isLockedClock"></switch>
            </view>
            <view class="action">
                <text>隐藏秒钟</text>
                <switch class="switch" @change="changeSettings('hidden')" :checked="settings.hiddenSeconds"></switch>
            </view>

            <timer-actions size="70px" fullscreen v-if="!settings.isLockedClock"></timer-actions>
        </view>

        <view class="back-button" :class="{ hidden }" @click="goBack()" hover-class="hover" :hover-start-time="0"
            :hover-stay-time="50">
            <svg-icon class="icon" src="/static/icon-normal-screen.svg" size="16px" color="#fff"></svg-icon>
            <text>竖屏</text>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { useSettingsStore } from '@/stores/settings'

import SvgIcon from '@/components/svg-icon.vue'
import TimerActions from '@/components/timer-actions.vue'
import TimerClock from '@/components/timer-clock.vue'
import TimerPicker from '@/components/timer-picker.vue'

const settings = useSettingsStore()

const hidden = ref(false)
let timeout = -1

function hideIfNoClick() {
    clearTimeout(timeout)
    hidden.value = false
    timeout = setTimeout(() => {
        hidden.value = true
    }, 5000)
}

function goBack() {
    uni.redirectTo({ url: 'index' })
}

function changeSettings(type: 'timer' | 'locked' | 'hidden') {
    settings.vibrate()
    if (type === 'timer') settings.isReverseTimer = !settings.isReverseTimer
    if (type === 'hidden') settings.hiddenSeconds = !settings.hiddenSeconds
    if (type === 'locked') {
        settings.isLockedClock = !settings.isLockedClock
        hideIfNoClick()
    }
}

onMounted(() => {
    hideIfNoClick()
})
</script>

<style lang="scss" scoped>
.timer-fullscreen {
    width: 100vw;
    height: 100vh;
    background-color: var(--color-bg);
    color: var(--color-text);
    display: flex;
    justify-content: space-between;

    .back-button {
        width: 66px;
        height: 30px;
        position: absolute;
        top: 8px;
        left: 20px;
        font-size: 16px;
        border-radius: 30rpx;
        border: 1px solid var(--color-border);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.3s;

        .icon {
            margin-right: 2px;
        }

        &.hover {
            opacity: 0.5;
        }

        &.hidden {
            top: -30px;
        }
    }

    .panel {
        flex: 1 1 auto;
    }

    .actions {
        width: 180px;
        height: calc(100vh - 60px);
        padding-top: 60px;
        padding-left: 20px;
        position: absolute;
        z-index: 1;
        right: 0;
        background-color: var(--color-overlay);
        transition: all 0.3s;

        &.hidden {
            right: -180px;
        }

        .action {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-right: 20px;
            margin-top: 10px;
            font-size: 16px;
            background-color: var(--color-mask-bar);
            border-radius: 10px;
            padding: 3px;
            padding-left: 10px;

            .switch {
                transform: scale(0.8);
            }
        }
    }
}
</style>