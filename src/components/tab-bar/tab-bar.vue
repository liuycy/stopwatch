<template>
  <view class="absolute bottom-0 w-screen backdrop-blur-lg">
    <view class="h-15 w-full flex justify-around items-center">
      <action label="秒表" pageto="stopwatch" icon="/static/icon-stopwatch.svg" />
      <action label="计时器" pageto="timer" icon="/static/icon-timer.svg" />
    </view>
    <view class="h-[env(safe-area-inset-bottom)] w-full" />
  </view>
</template>

<script lang="ts" setup>
import action from "./action.vue";
defineOptions({ options: { virtualHost: true, styleIsolation: "shared" } });
</script>
