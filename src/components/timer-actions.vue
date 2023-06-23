<template>
    <view class="actions-group" :class="{ fullscreen }">
        <action-button class="action" @click="timer.stop()" :size="size" type="gray"
            :disabled="timer.state === 'stopped'">取消</action-button>

        <template v-if="timer.state === 'stopped'">
            <action-button class="action" @click="timer.start()" :size="size" type="green"
                :disabled="timer.isAllZero">开始</action-button>
        </template>
        <template v-else>
            <action-button class="action" @click="timer.pause()" :size="size" type="orange"
                v-if="timer.state === 'running'">暂停</action-button>
            <action-button class="action" @click="timer.start()" :size="size" type="green" v-else>继续</action-button>
        </template>
    </view>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { onHide } from '@dcloudio/uni-app';

import { useTimerStore } from '@/stores/timer';
import { useSettingsStore } from '@/stores/settings';

import ActionButton from '@/components/action-button.vue'

const timer = useTimerStore()
const settings = useSettingsStore()

defineProps<{
    size?: string;
    fullscreen?: boolean;
}>()

onMounted(() => {
    uni.setKeepScreenOn({ keepScreenOn: true })
})

onUnmounted(() => {
    uni.setKeepScreenOn({ keepScreenOn: settings.keepScreenOn })
    timer.reset()
})

onHide(() => {
    if (timer.state === 'running') {
        timer.pause()
    }
})
</script>

<style lang="scss" scoped>
.actions-group {
    width: calc(100% - 60rpx);
    padding: 0 30rpx;
    position: absolute;
    top: 745rpx;
    display: flex;
    justify-content: space-between;

    &.fullscreen {
        top: unset;
        right: 0;
        bottom: 0;
        align-items: flex-end;
        width: calc(100% - 40px);
        padding: 20px;
    }
}
</style>
