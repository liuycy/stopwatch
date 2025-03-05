<template>
  <sticky-header v-if="isSupported">
    <slot></slot>
  </sticky-header>
  <view class="h-fit w-fit" v-else>
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
defineOptions({ options: { virtualHost: true, styleIsolation: "shared" } });
const { isSupported } = uni.getSkylineInfoSync();
</script>
