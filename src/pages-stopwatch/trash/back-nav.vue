<template>
  <view
    :class="mergeClass"
    :style="{ '--top': `${system.top}px` }"
    class="relative pt-[--top] h-8 w-750rpx backdrop-blur-lg"
  >
    <text class="leading-8 text-(4 center)" v-show="title">{{ title }}</text>
    <view class="absolute left-3 h-8 flex items-center" @click="$emit('backclick')">
      <svg-icon merge-class="size-6" color="#3183f4" src="/static/icon-left-arrow.svg" />
      <text class="text-(4 #3183f4)">返回</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
defineProps<{ title?: string; mergeClass?: unknown }>();
const system = useSystem();
</script>
