<template>
    <view class="timer-runner">
        <canvas class="canvas" id="runner" type="2d"></canvas>
    </view>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'

import { useTimerStore } from '@/stores/timer';
import { useSettingsStore } from '@/stores/settings';
import { TimerPainter } from '@/utils/timer-painter';
import { watch } from 'vue';

const timer = useTimerStore()
const settings = useSettingsStore()
let painter: TimerPainter | undefined
let rafId: number | undefined

function setCanvasImage() {
    painter?.setCurrentImage()
    if (settings.enableTimerVibrate) painter?.setCurrentImage('shake')
    if (settings.enableTimerRing) painter?.setCurrentImage('ring')
}

onMounted(async () => {
    painter = await TimerPainter.create({
        canvasId: 'runner',
        timeColor: '#fff',
        tipsColor: '#999',
        circleColor: '#eca449',
        circleBgColor: '#262628',
    })

    await painter.createImage('ring', '/static/icon-phone-ring.png')
    await painter.createImage('shake', '/static/icon-phone-shake.png')

    setCanvasImage()

    ~(function loop() {
        painter.draw(timer, settings.isReverseTimer)
        rafId = painter.requestAnimationFrame(loop)
    })()
})

onUnmounted(() => rafId && painter?.cancelAnimationFrame(rafId))

watch(() => [settings.enableTimerRing, settings.enableTimerVibrate], setCanvasImage, { immediate: false })
</script>

<style lang="scss" scoped>
.timer-runner {
    width: 750rpx;
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