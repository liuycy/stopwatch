<template>
    <view class="actions-group" :class="{ fullscreen }">
        <action-button class="action" @click="timer.stop()" :size="size" type="gray"
            :disabled="timer.state === 'stopped'">取消</action-button>

        <template v-if="timer.state === 'stopped'">
            <action-button class="action" @click="timer.start()" :size="size" type="green"
                :disabled="timer.startDisabled">开始</action-button>
        </template>
        <template v-else>
            <action-button class="action" @click="timer.pause()" :size="size" type="orange"
                v-if="timer.state === 'running'">暂停</action-button>
            <action-button class="action" @click="timer.start()" :size="size" type="green" v-else>继续</action-button>
        </template>
    </view>
</template>

<script lang="ts" setup>
import { useTimerStore } from '@/stores/timer';

import ActionButton from '@/components/action-button.vue'

const timer = useTimerStore()

defineProps<{
    size?: string;
    fullscreen?: boolean;
}>()
</script>

<style lang="scss" scoped>
.actions-group {
    width: calc(100% - 60rpx);
    padding: 0 30rpx;
    position: absolute;
    top: 650rpx;
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
