<template>
  <view>
    <view
      class="mx-4 mb-2 pl-4 h-10 rounded-6px bg-[--color-bg2]"
      un-flex="~ justify-between items-center"
      v-if="timer.status === 'stopped'"
    >
      <text class="flex-auto text-(4 [--color-tips])">计时器类型</text>

      <text class="flex-none text-3.5">倒计时</text>
      <vswitch merge-class="flex-none scale-60" v-model="timer.settings.reversed" />
    </view>

    <view class="mx-4 mb-2 pl-4 h-10 rounded-6px bg-[--color-bg2]" un-flex="~ justify-between items-center">
      <text class="flex-auto text-(4 [--color-tips])">计时结束时提醒</text>

      <text class="flex-none text-3.5">铃声</text>
      <vswitch merge-class="flex-none scale-60" v-model="timer.settings.ring" />

      <text class="flex-none text-3.5">震动</text>
      <vswitch merge-class="flex-none scale-60" v-model="timer.settings.vibrate" />
    </view>

    <view class="mx-4 mb-2 pl-4 h-10 rounded-6px bg-[--color-bg2]" un-flex="~ justify-between items-center">
      <text class="flex-auto text-(4 [--color-tips])">滴嗒声</text>
      <finite-state
        reversed
        merge-class="flex-none pr-4"
        :options="['禁用', '慢', '快']"
        v-model="timer.settings.tick"
      />
    </view>

    <view
      class="flex flex-col text-(3.5 center [--color-tips])"
      v-if="timer.settings.reversed && timer.status === 'running'"
    >
      <text>息屏或切到后台 自动暂停计时</text>
    </view>
  </view>
</template>

<script lang="tsx" setup>
const timer = useTimer();

onHide(() => {
  if (!timer.settings.reversed) return;
  if (timer.status === "running") timer.pause();
});
</script>
