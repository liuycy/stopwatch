<template>
    <view class="timer-runner">
        <canvas class="canvas" id="runner" type="2d"></canvas>
    </view>
</template>

<script lang="ts" setup>
import { onMounted, watchEffect } from "vue";

import { useTimerStore } from "@/stores/timer";
import { useSettingsStore } from "@/stores/settings";
import { TimerPainter } from "@/utils/timer-painter";
import { TimerBell } from "@/utils/timer-bell";
import { TickType } from "@/types/enums";

const timer = useTimerStore();
const settings = useSettingsStore();

onMounted(async () => {
    const painter = await TimerPainter.create({
        canvasId: "runner",
        timeColor: "#fff",
        tipsColor: "#999",
        circleColor: "#eca449",
        circleBgColor: "#262628",
    });

    await painter.createImage("ring", "/static/icon-phone-ring.png");
    await painter.createImage("shake", "/static/icon-phone-shake.png");

    watchEffect(async (onCleanup) => {
        painter.setCurrentImage();
        if (settings.enableTimerVibrate) painter.setCurrentImage("shake");
        if (settings.enableTimerRing) painter.setCurrentImage("ring");

        let rafId = -1;
        ~(function loop() {
            painter.draw(timer, settings.isReverseTimer);
            rafId = painter.requestAnimationFrame(loop);
        })();

        onCleanup(() => {
            painter.cancelAnimationFrame(rafId);
        });
    });
});

watchEffect((onCleanup) => {
    const bell = (() => {
        switch (settings.tickType) {
            case TickType.Quick:
                return new TimerBell("tick-quick");
            case TickType.Slow:
                return new TimerBell("tick-slow");
        }
    })();

    const tid = setInterval(() => {
        if (timer.state !== "running") return;
        bell?.context.stop();
        bell?.context.play();
    }, 1000);

    onCleanup(() => {
        clearInterval(tid);
        bell?.context.destroy();
    });
});
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
