<template>
  <view class="h-screen w-screen bg-[--color-bg] text-[--color-text]" :style="{ '--safetop': `${system.top}px` }">
    <clock-runner v-if="timer.settings.clock || timer.status !== 'stopped'" @click="AutoHide.toggle" />
    <clock-picker
      merge-class="ml-[--safetop]"
      :hidden-class="[{ '-translate-x-150%': !timer.settings.reversed }, 'transition-(all duration-0.3s)']"
    />

    <float-btn
      size="18px"
      label="竖屏"
      icon="/static/icon-normal-screen.svg"
      merge-class="top-8px! left-[--safetop]! p-(x-8px! y-4px!) [&>text]:(ml-4px text-16px)"
      :hidden-class="['transition-(all duration-0.3s)', { '-translate-y-100px': hidden }]"
      @click="router.modto('timer')"
    />
    <clock-setting :hidden-class="['transition-(all duration-0.3s)', { 'translate-x-100%': hidden }]" />
    <clock-tips :hidden-class="['transition-(all duration-0.3s)', { '-translate-y-100px': hidden }]" />
  </view>
</template>

<script setup lang="ts">
import clockTips from "./clock-tips.vue";
import clockSetting from "./clock-setting.vue";
import clockRunner from "./clock-runner.vue";
import clockPicker from "./clock-picker.vue";

const system = useSystem();
const router = useRouter();
const timer = useTimer();

const hidden = ref(false);

class AutoHide {
  private static id = -1;
  static toggle() {
    if (!hidden.value) return (hidden.value = true);
    AutoHide.show();
  }
  static show() {
    hidden.value = false;
    clearTimeout(AutoHide.id);
    AutoHide.id = setTimeout(() => {
      hidden.value = timer.settings.clock || timer.status === "running";
    }, 3000);
  }
}

watch(() => timer.status, AutoHide.show, { immediate: true });
watch(timer.settings, AutoHide.show, { deep: true });

uni.showShareMenu();
</script>
