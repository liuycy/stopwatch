<template>
    <view class="page-timer">
        <template v-if="settings.isReverseTimer">
            <timer-picker :class="['panel', { hidden: timer.state !== 'stopped' }]"></timer-picker>
            <timer-runner v-if="timer.state !== 'stopped'"></timer-runner>
        </template>
        <template v-else>
            <timer-runner></timer-runner>
        </template>
        <timer-actions></timer-actions>
        <timer-setting></timer-setting>
    </view>
</template>

<script lang="ts" setup>
import { onHide } from '@dcloudio/uni-app';
import { onUnmounted } from 'vue';

import { useSettingsStore } from '@/stores/settings';
import { useTimerStore } from '@/stores/timer';

import TimerActions from '@/components/timer-actions.vue';
import TimerPicker from '@/components/timer-picker.vue';
import TimerRunner from '@/components/timer-runner.vue';
import TimerSetting from '@/components/timer-setting.vue';

const settings = useSettingsStore()
const timer = useTimerStore()

onUnmounted(() => {
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
.page-timer {
    width: 100%;
    height: 100%;

    .panel {
        position: absolute;
        top: 0;

        &.hidden {
            z-index: -1;
        }
    }
}
</style>