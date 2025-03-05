<template>
  <view
    :style="{
      '--size': size ?? '155rpx',
      '--txt': `var(--color-${color})`,
      '--bg': `var(--color-${color}-bg)`,
    }"
    :class="mergeClass"
    class="color-provider rounded-full size-[--size] bg-[--bg] opacity-70"
    un-ring="offset-2 offset-[--color-bg] 2 [--bg]"
    un-flex="~ justify-center items-center"
    v-if="disabled"
  >
    <text class="text-(4 [--txt])">{{ label }}</text>
  </view>

  <view
    v-else
    :style="{
      '--size': size ?? '155rpx',
      '--txt': `var(--color-${color})`,
      '--bg': `var(--color-${color}-bg)`,
      '--bg-hover': `var(--color-${color}-hover)`,
    }"
    :class="mergeClass"
    :hover-start-time="0"
    :hover-stay-time="50"
    hover-class="bg-[--bg-hover]"
    class="color-provider rounded-full size-[--size] bg-[--bg]"
    un-ring="offset-2 offset-[--color-bg] 2 [--bg]"
    un-flex="~ justify-center items-center"
    @click="onActionClick"
  >
    <text class="text-(4 [--txt])">{{ label }}</text>
  </view>
</template>

<script lang="ts" setup>
defineOptions({ options: { virtualHost: true, styleIsolation: "shared" } });
defineProps<{
  label: string;
  color: string;
  mergeClass?: unknown;
  disabled?: boolean;
  size?: string;
}>();

const emit = defineEmits(["click"]);
const setting = useSetting();

function onActionClick() {
  setting.vibrate();
  emit("click");
}
</script>

<style scoped>
.color-provider {
  --color-green: #65ce67;
  --color-green-bg: #112813;
  --color-green-hover: #081609;

  --color-red: #ee534f;
  --color-red-bg: #2d100c;
  --color-red-hover: #180808;

  --color-orange: #efa448;
  --color-orange-bg: #30200a;
  --color-orange-hover: #191103;

  --color-gray-bg: #333;
  --color-gray-hover: #1b1b1b;
}
</style>
