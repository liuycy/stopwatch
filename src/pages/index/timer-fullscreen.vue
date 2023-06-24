<template>
    <view class="timer-fullscreen">
        <timer-picker class="picker" :class="{ hidden: !pickerVisible }" fullscreen
            v-if="!settings.isLockedClock && settings.isReverseTimer"></timer-picker>

        <view class="back-button" :class="{ hidden }" @click="goBack()" hover-class="hover" :hover-start-time="0"
            :hover-stay-time="50">
            <svg-icon class="icon" src="/static/icon-normal-screen.svg" size="16px" color="#fff"></svg-icon>
            <text>竖屏</text>
        </view>

        <timer-clock class="clock" @click="onClockClick()" v-if="!pickerVisible"></timer-clock>

        <view class="tips" :class="{ hidden }" v-if="settings.isReverseTimer && timer.state === 'running'">
            <text>息屏或切到后台 自动暂停计时</text>
        </view>

        <view class="actions" @click="hideIfNoClick()" :class="{ float: settings.isLockedClock, hidden }">
            <view class="action">
                <text>锁定为时钟</text>
                <switch class="switch" @change="toggleLockedClock()" :checked="settings.isLockedClock">
                </switch>
            </view>
            <view class="action" v-if="settings.isLockedClock || !settings.isReverseTimer">
                <text>隐藏秒钟</text>
                <switch class="switch" @change="toggleHiddenSeconds()" :checked="settings.hiddenSeconds">
                </switch>
            </view>
            <view class="action" v-if="!settings.isLockedClock">
                <text>倒计时</text>
                <switch class="switch" @change="toggleReverseTimer()" :checked="settings.isReverseTimer">
                </switch>
            </view>

            <timer-actions size="70px" fullscreen v-if="!settings.isLockedClock"></timer-actions>
        </view>

        <timer-modal fullscreen></timer-modal>
    </view>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { onHide } from '@dcloudio/uni-app';

import { useSettingsStore } from '@/stores/settings';
import { useTimerStore } from '@/stores/timer';

import SvgIcon from '@/components/svg-icon.vue';
import TimerActions from '@/components/timer-actions.vue';
import TimerClock from '@/components/timer-clock.vue';
import TimerModal from '@/components/timer-modal.vue';
import TimerPicker from '@/components/timer-picker.vue';

let timeout = -1
const settings = useSettingsStore()
const timer = useTimerStore()

const hidden = ref(false)
const pickerVisible = computed(() => timer.state === 'stopped' && !settings.isLockedClock && settings.isReverseTimer)

function goBack() {
    uni.redirectTo({ url: 'index' })
}

function toggleReverseTimer() {
    settings.vibrate()
    settings.isReverseTimer = !settings.isReverseTimer
    timer.reset()
}

function toggleHiddenSeconds() {
    console.log('change');

    settings.vibrate()
    settings.hiddenSeconds = !settings.hiddenSeconds
}

function toggleLockedClock() {
    settings.vibrate()
    settings.isLockedClock = !settings.isLockedClock
    hideIfNoClick()
    timer.reset()
}

function hideIfNoClick() {
    clearTimeout(timeout)
    hidden.value = false
    timeout = setTimeout(() => {
        if (pickerVisible.value) return
        hidden.value = true
    }, 5000)
}

function onClockClick() {
    if (hidden.value) return hideIfNoClick()
    hidden.value = true
}

watchEffect(() => {
    if (pickerVisible.value) hidden.value = false
    if (timer.state === 'running') {
        setTimeout(() => hidden.value = true, 100)
    }
})

onMounted(() => {
    uni.setKeepScreenOn({ keepScreenOn: true })
    hideIfNoClick()
})

onUnmounted(() => {
    uni.setKeepScreenOn({ keepScreenOn: settings.keepScreenOn })
    timer.reset()
})

onHide(() => {
    if (!settings.isReverseTimer) return
    if (timer.state === 'running') {
        timer.pause()
    }
})
</script>

<style lang="scss" scoped>
.timer-fullscreen {
    width: 750rpx;
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
            top: -100%;
        }
    }

    .picker {
        width: 500px;
        height: 100vh;
        position: absolute;
        transition: all 0.3s;

        &.hidden {
            left: -500px;
        }
    }

    .clock {
        flex: 1 1 auto;
    }

    .tips {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 12px;
        color: var(--color-tips);

        &.hidden {
            transition: all 0.3s 2s;
            top: -100%;
        }
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
            transition: all 0.3s;

            .switch {
                transform: scale(0.8);
            }
        }
    }
}
</style>