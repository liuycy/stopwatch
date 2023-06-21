<template>
    <view class="actions-group">
        <action-button @click="timer.stop()" type="gray" :disabled="timer.state === 'stopped'">取消</action-button>

        <template v-if="timer.state === 'stopped'">
            <action-button @click="timer.start()" type="green" :disabled="timer.isAllZero">开始计时</action-button>
        </template>
        <template v-else>
            <action-button @click="timer.pause()" type="orange" v-if="timer.state === 'running'">暂停</action-button>
            <action-button @click="timer.start()" type="green" v-else>继续</action-button>
        </template>
    </view>
</template>

<script lang="ts" setup>
import { useTimerStore } from '@/stores/timer';

import ActionButton from '@/components/action-button.vue'

const timer = useTimerStore()
</script>

<style lang="scss" scoped>
.actions-group {
    width: calc(100% - 60rpx);
    padding: 0 30rpx;
    position: absolute;
    top: 745rpx;
    display: flex;
    justify-content: space-between;
}
</style>
