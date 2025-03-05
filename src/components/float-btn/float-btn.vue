<template>
  <view
    :style="{ '--top': `${system.top}px`, '--size': size ?? '32rpx' }"
    :hover-start-time="0"
    :hover-stay-time="50"
    :class="[mergeClass, hiddenClass]"
    hover-class="opacity-50"
    class="absolute left-4 top-[--top]"
    un-border="~ solid [--color-border] rounded-full"
    un-flex="~ items-center"
    un-p="x-2 y-1"
    @click="onViewClick"
  >
    <svg-icon merge-class="size-[--size]" color="#ffffff" :src="icon" />
    <text class="ml-1 text-(4 [--color-text])">{{ label }}</text>
  </view>
</template>

<script lang="ts" setup>
import type { VueElement } from 'vue';

defineOptions({ options: { virtualHost: true, styleIsolation: "shared" } });
defineProps<{
  icon: string;
  label: string;
  size?: number;
  mergeClass?: unknown;
  hiddenClass?: unknown;
}>();

const system = useSystem();
const setting = useSetting();
const emit = defineEmits(["click"]);

function onViewClick() {
  setting.vibrate();
  emit("click");
}
</script>
