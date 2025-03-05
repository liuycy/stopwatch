<template>
  <view class="h-screen w-screen bg-[--color-bg] text-[--color-text]">
    <timer-runner v-if="!pickershow" />
    <timer-picker :merge-class="[!pickershow && 'absolute! -top-100%']" />
    <timer-action />
    <timer-setting />
    <timer-tips />

    <template v-if="timer.status === 'stopped'">
      <float-btn icon="/static/icon-fullscreen.svg" label="横屏" @click="router.modto('clock')" size="28rpx" />
      <tab-bar />
    </template>
  </view>
</template>

<script setup lang="ts">
import timerPicker from "./timer-picker.vue";
import timerRunner from "./timer-runner.vue";
import timerAction from "./timer-action.vue";
import timerSetting from "./timer-setting.vue";
import timerTips from "./timer-tips.vue";

const timer = useTimer();
const router = useRouter();
const pickershow = computed(() => timer.settings.reversed && timer.status === "stopped");

uni.showShareMenu();
</script>
