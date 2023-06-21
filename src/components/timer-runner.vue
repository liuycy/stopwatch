<template>
    <view class="timer-runner">
        <canvas class="canvas" id="runner" type="2d"></canvas>
    </view>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'

import { useTimerStore } from '@/stores/timer';
import { TimerPainter } from '@/utils/timer-painter';

const timer = useTimerStore()
let painter: TimerPainter | undefined
let rafId: number | undefined

onMounted(async () => {
    painter = await TimerPainter.create({
        imageSrc: '/static/icon-phone-shake.png',
        canvasId: 'runner',
        timeColor: '#fff',
        tipsColor: '#999',
        circleColor: '#eca449',
        circleBgColor: '#262628',
    })

    ~(function loop() {
        rafId = painter.requestAnimationFrame(loop)
        if (timer.state !== 'stopped') {
            painter.draw(timer.startAt, timer.endAt, timer.duration)
        }
    })()
})

onUnmounted(() => rafId && painter?.cancelAnimationFrame(rafId))
</script>

<style lang="scss" scoped>
.timer-runner {
    width: 100vw;
    height: 600rpx + 2 * 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .canvas {
        width: 100%;
        height: 100%;
    }
}
</style>