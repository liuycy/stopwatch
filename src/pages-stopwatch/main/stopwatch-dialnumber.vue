<template>
  <view
    un-flex="~ justify-center items-center"
    class="h-full w-full font-mono text-[--color-text]"
    :class="[dial.hours ? 'text-110rpx' : 'text-160rpx']"
  >
    <template v-if="dial.hours">
      <text>{{ padFixedInt(dial.hours) }}</text>
      <text class="h-110rpx leading-96rpx text-60rpx font-serif">:</text>
    </template>
    <text>{{ padFixedInt(dial.minutes) }}</text>
    <text class="h-110rpx leading-96rpx text-60rpx font-serif">:</text>
    <text>{{ padFixedInt(dial.seconds) }}</text>
    <text class="h-110rpx leading-150rpx text-60rpx font-serif">.</text>
    <text>{{ padFixedInt(dial.ms) }}</text>
  </view>
</template>

<script lang="ts" setup>
const dial = useDial();
</script>
