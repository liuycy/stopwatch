<template>
    <view class="timer-clock" @click="$emit('click')" :style="{ fontSize }">
        <view class="card">
            <text class="label">{{ padFixedInt(time.hours ?? 0) }}</text>
        </view>
        <view class="card">
            <text class="label">{{ padFixedInt(time.minutes) }}</text>
        </view>
        <view class="card" v-if="!settings.hiddenSeconds">
            <text class="label">{{ padFixedInt(time.seconds) }}</text>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue';

import { useTimerStore } from '@/stores/timer';
import { useSettingsStore } from '@/stores/settings';
import { parseDuration, padFixedInt } from '@/utils/format';

const timer = useTimerStore()
const settings = useSettingsStore()
const instance = getCurrentInstance()

const duration = ref(0)
const fontSize = ref<string>()
const time = computed(() => parseDuration(duration.value))

let interval = -1

function setForOnlyClock() {
    const date = new Date()
    const h = date.getHours()
    const m = date.getMinutes()
    const s = date.getSeconds()
    duration.value = 1000 * (s + 60 * m + 3600 * h)
}

function setDuration() {
    if (settings.isLockedClock) return setForOnlyClock()
    duration.value = timer.duration
}

function setFonstSize() {
    fontSize.value = '0px'
    setTimeout(() => {
        const nodeRef = uni.createSelectorQuery().in(instance).select('.card')
        nodeRef.boundingClientRect(info => {
            const { width, height } = info as UniApp.NodeInfo
            const minSize = width! > height! ? height! : width!
            fontSize.value = `${minSize ? `${0.7 * minSize}px` : '16px'}`
        }).exec()
    });
}

watch(() => settings.hiddenSeconds, () => setFonstSize(), { immediate: false })

onMounted(() => {
    setFonstSize()
    interval = setInterval(setDuration, 60)
})

onUnmounted(() => {
    clearInterval(interval)
})
</script>

<style lang="scss" scoped>
.timer-clock {
    width: calc(100% - 120px);
    height: calc(100% - 60px);
    padding: 30px 60px;
    display: flex;
    align-items: center;
    justify-content: center;

    .card {
        flex: 1 1 auto;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .label {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: var(--color-modal-bg);
            border-radius: 0.1em;
            width: 1.2em;
            height: 1.2em;
        }

        &+.card {
            margin-left: 10px;
        }
    }
}
</style>