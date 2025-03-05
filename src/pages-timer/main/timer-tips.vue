<template>
  <overlay :show="show" @clickoverlay="onStopClick">
    <view class="w-[calc(100vw-150rpx)] rounded-10px bg-[--color-bg2]">
      <text class="block pt-4 font-bold text-(4 center [--color-tips])">计时结束</text>
      <text class="block pt-2 text-(3 center [--color-tips])">息屏或切到后台, 自动停止计时</text>
      <view class="py-4 flex justify-center animate-shaking">
        <svg-icon
          color="#c6c6c6"
          merge-class="size-200rpx"
          src="/static/icon-phone-ring.svg"
          v-if="timer.settings.ring"
        />
        <svg-icon
          color="#c6c6c6"
          merge-class="size-200rpx"
          src="/static/icon-phone-shake.svg"
          v-else-if="timer.settings.vibrate"
        />
      </view>
      <view un-flex="~ justify-between" un-border="0 t-1 solid [--color-border2]">
        <view
          @click="onRepeatClick"
          class="flex-[0_0_50%] h-10"
          un-text="4 [--color-tips]"
          un-flex="~ justify-center items-center "
          un-border="0 r-1px solid [--color-border2]"
          hover-class="opacity-50"
        >
          重复
        </view>
        <view
          @click="onStopClick"
          class="flex-[0_0_50%] h-10"
          un-flex="~ justify-center items-center"
          un-text="4 [--color-text2]"
          hover-class="opacity-50"
        >
          停止
        </view>
      </view>
    </view>
  </overlay>
</template>

<script lang="ts" setup>
defineOptions({ options: { virtualHost: true, styleIsolation: "shared" } });

const audioring = new WebAudio("/static/ring.mp3");
const timer = useTimer();
const show = ref(false);

class Heart {
  static id = -1;
  static beat() {
    if (timer.settings.vibrate) uni.vibrateLong();
    Heart.id = setTimeout(Heart.beat, 1000);
  }
}

watchEffect((onCleanup) => {
  if (timer.status !== "running") return;

  const bell = (() => {
    switch (timer.settings.tick) {
      case TickType.Quick:
        return new WebAudio("/static/tick-quick.mp3");
      case TickType.Slow:
        return new WebAudio("/static/tick-slow.mp3");
    }
  })();

  const tid = setInterval(() => {
    if (timer.status !== "running") return;
    bell?.context.stop();
    bell?.context.play();
  }, 1000);

  onCleanup(() => {
    clearInterval(tid);
    bell?.context.destroy();
  });
});

onUnload(() => uni.$off("timer-finished", onTimerFinish));
uni.$on("timer-finished", onTimerFinish);

function onTimerFinish() {
  if (!timer.settings.ring && !timer.settings.vibrate) return;
  if (timer.settings.ring) audioring.context.play();
  show.value = true;
  Heart.beat();
}

onHide(onStopClick);

function onStopClick() {
  audioring.context.stop();
  clearTimeout(Heart.id);
  show.value = false;
}

async function onRepeatClick() {
  audioring.context.stop();
  audioring.context.seek(0);
  clearTimeout(Heart.id);
  show.value = false;
  timer.start();
}
</script>
