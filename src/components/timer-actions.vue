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
import { watch } from 'vue'

import { useTimerStore } from '@/stores/timer';

import ActionButton from '@/components/action-button.vue'

const timer = useTimerStore()
let interval = -1

async function showTips() {
    uni.vibrateLong()
    interval = setInterval(() => uni.vibrateLong(), 1000)

    const { confirm } = await uni.showModal({
        title: '时间到了',
        confirmText: '停止',
        cancelText: '重复',
    })

    if (confirm) return clearInterval(interval)

    clearInterval(interval)
    timer.start()
}

watch(() => timer.state, (curr, prev) => {
    if (curr === 'stopped' && prev !== 'stopped') {
        showTips()
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
}
</style>
