<template>
    <view class="page-timer" v-if="settings.defaultPageType === PageType.Timer">
        <timer-picker :class="['panel', { hidden: timer.state !== 'stopped' }]"></timer-picker>
        <timer-runner v-if="timer.state !== 'stopped'"></timer-runner>
        <timer-actions></timer-actions>
        <timer-setting></timer-setting>
    </view>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '@/stores/settings';
import { useTimerStore } from '@/stores/timer';
import { PageType } from '@/types/enums'

import TimerPicker from '@/components/timer-picker.vue'
import TimerRunner from '@/components/timer-runner.vue'
import TimerActions from '@/components/timer-actions.vue'
import TimerSetting from '@/components/timer-setting.vue'

const settings = useSettingsStore()
const timer = useTimerStore()
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