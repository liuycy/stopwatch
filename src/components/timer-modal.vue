<template>
    <view class="confirm-modal" v-if="visible">
        <view class="modal-content">
            <view class="title">计时结束</view>
            <view class="tips">息屏或切到后台 自动停止计时</view>
            <view class="icon">
                <svg-icon v-if="settings.enableTimerRing" src="/static/icon-phone-ring.svg" size="200rpx"
                    color="#c6c6c6"></svg-icon>
                <svg-icon v-else-if="settings.enableTimerVibrate" src="/static/icon-phone-shake.svg" size="200rpx"
                    color="#c6c6c6"></svg-icon>
            </view>
            <view class="actions">
                <view @click="cancel()" class="action cancel" hover-class="hover">重复</view>
                <view @click="confirm()" class="action confirm" hover-class="hover">停止</view>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { getCurrentInstance, ref, watch } from 'vue';
import { onHide } from '@dcloudio/uni-app';

import { useTimerStore } from '@/stores/timer';
import { useSettingsStore } from '@/stores/settings';
import { TimerBell } from '@/utils/timer-bell';

import SvgIcon from '@/components/svg-icon.vue'

const timer = useTimerStore()
const settings = useSettingsStore()
const timerbell = new TimerBell()

const instance: any = getCurrentInstance()
const _this = instance.ctx.$scope;

const visible = ref(false)
let timeout = -1;

function cancel() {
    //#ifdef MP-WEIXIN
    _this.animate('.modal-content', [
        { opacity: 1.0, scale: [1, 1], ease: 'ease-out' },
        { opacity: 0.1, scale: [0.1, 0.1], ease: 'ease-out' },
    ], 200, () => {
        visible.value = false
        timer.start()
    })
    //#endif
    // #ifndef MP-WEIXIN
    visible.value = false
    timer.start()
    // #endif
}

function confirm() {
    //#ifdef MP-WEIXIN
    _this.animate('.modal-content', [
        { opacity: 1.0, scale: [1, 1], ease: 'ease-out' },
        { opacity: 0.1, scale: [0.1, 0.1], ease: 'ease-out' },
    ], 200, () => {
        visible.value = false
    })
    //#endif
    // #ifndef MP-WEIXIN
    visible.value = false
    // #endif
}

function heartBeat() {
    if (settings.enableTimerRing) timerbell.ring()
    if (settings.enableTimerVibrate) uni.vibrateLong()
    timeout = setTimeout(heartBeat, 1000)
}

watch(() => visible.value, () => {
    if (!visible.value) clearTimeout(timeout)
})

watch(() => timer.finished, (curr, prev) => {
    if (!settings.enableTimerRing && !settings.enableTimerVibrate) return
    if (curr > prev) {
        visible.value = true
        heartBeat()
    }
})

onHide(() => {
    if (visible.value) {
        visible.value = false
    }
})
</script>

<style lang="scss" scoped>
@keyframes slidein {
    from {
        opacity: 0.1;
        transform: scale(0.1);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes shaking {
    0% {
        transform: rotate(0);
    }

    25% {
        transform: rotate(-10deg);
    }

    30% {
        transform: rotate(-15deg);
    }

    70% {
        transform: rotate(5deg);
    }

    100% {
        transform: rotate(0);
    }
}

.confirm-modal {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-overlay);
    color: var(--color-modal-text);

    .modal-content {
        width: 75vw;
        background-color: var(--color-modal-bg);
        border-radius: 20rpx;
        animation: 0.2s ease-in slidein;

        .title {
            padding-top: 32rpx;
            text-align: center;
            font-weight: bold;
            color: var(--color-tips);
        }

        .tips {
            margin-top: 16rpx;
            font-size: 24rpx;
            text-align: center;
        }

        .icon {
            padding: 32rpx 0;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: 0.5s shaking infinite;
        }

        .actions {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid var(--color-modal-border);

            .action {
                height: 80rpx;
                flex: 0 0 50%;
                display: flex;
                justify-content: center;
                align-items: center;

                &.hover {
                    opacity: 0.5;
                }

                &+.action {
                    border-left: 1px solid var(--color-modal-border);
                }
            }

            .cancel {
                color: var(--color-tips);
            }

            .confirm {
                color: var(--color-modal-confirm-text)
            }
        }
    }
}
</style>