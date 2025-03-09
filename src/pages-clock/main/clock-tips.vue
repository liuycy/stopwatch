<template>
  <template v-if="timer.settings.reversed && timer.status === 'running'">
    <view class="absolute top-12px w-full flex justify-center items-center" :class="[hiddenClass]">
      <text class="text-(12px [--color-tips])">
        当前时间 {{ formatTime(timer.endAt - timer.duration, "hh:MM") }}, 在
        {{ formatTime(timer.endAt, "hh:MM") }} 结束计时
      </text>
      <svg-icon merge-class="size-14px" src="/static/icon-phone-ring.svg" color="#fff" v-if="timer.settings.ring" />
      <svg-icon
        color="#fff"
        merge-class="size-14px"
        src="/static/icon-phone-shake.svg"
        v-else-if="timer.settings.vibrate"
      />
    </view>
    <view class="absolute top-36px w-full flex justify-center" :class="[hiddenClass]">
      <text class="text-(12px [--color-tips])">息屏或切到后台 自动暂停计时</text>
    </view>
  </template>

  <template v-if="!timer.settings.reversed && timer.status === 'running'">
    <view class="absolute top-12px w-full flex justify-center items-center" :class="[hiddenClass]">
      <text class="text-(12px [--color-tips])">
        从 {{ formatTime(timer.firstStartAt, "hh:MM") }} 开始计时, 当前时间
        {{ formatTime(timer.startAt + timer.duration, "hh:MM") }}
      </text>
    </view>
  </template>

  <overlay merge-class="z-1" :show="show" @clickoverlay="onStopClick">
    <view class="w-250px rounded-10px bg-[--color-bg2]">
      <text class="pt-16px block font-bold text-(16px center [--color-tips])">计时结束</text>
      <text class="pt-8px block text-(12px center [--color-tips])">息屏或切到后台, 自动停止计时</text>
      <view class="py-16px flex justify-center animate-shaking">
        <svg-icon
          color="#c6c6c6"
          merge-class="size-100px"
          src="/static/icon-phone-ring.svg"
          v-if="timer.settings.ring"
        />
        <svg-icon
          color="#c6c6c6"
          merge-class="size-100px"
          src="/static/icon-phone-shake.svg"
          v-else-if="timer.settings.vibrate"
        />
      </view>
      <view un-flex="~ justify-between" un-border="0 t-1px solid [--color-border2]">
        <view
          @click="onRepeatClick"
          class="flex-[0_0_50%] h-40px"
          un-text="16px [--color-tips]"
          un-flex="~ justify-center items-center "
          un-border="0 r-1px solid [--color-border2]"
          hover-class="opacity-50"
        >
          重复
        </view>
        <view
          @click="onStopClick"
          class="flex-[0_0_50%] h-40px"
          un-flex="~ justify-center items-center"
          un-text="16px [--color-text2]"
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
defineProps<{ hiddenClass?: unknown }>();

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

onHide(() => {
  if (!timer.settings.reversed) return;
  if (timer.status === "running") timer.pause();
});

watchEffect((onCleanup) => {
  if (!timer.settings.clock && timer.status !== "running") return;

  const bell = (() => {
    switch (timer.settings.tick) {
      case TickType.Quick:
        return new WebAudio("/static/tick-quick.mp3");
      case TickType.Slow:
        return new WebAudio("/static/tick-slow.mp3");
    }
  })();

  const tid = +(() => {
    return setInterval(() => {
      bell?.context.stop();
      bell?.context.play();
    }, 1000);
  })();

  onCleanup(() => {
    bell?.context.destroy();
    clearInterval(tid);
  });
});

onUnload(() => uni.$off("timer-finished", onTimerFinished));
uni.$on("timer-finished", onTimerFinished);

function onTimerFinished() {
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

function onRepeatClick() {
  audioring.context.stop();
  audioring.context.seek(0);
  clearTimeout(Heart.id);
  show.value = false;
  timer.start();
}
</script>
