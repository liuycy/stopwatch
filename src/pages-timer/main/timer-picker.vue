<template>
  <view
    :class="mergeClass"
    class="relative box-border pt-[--top] h-750rpx w-750rpx"
    :style="{ '--top': `${system.top}px` }"
  >
    <picker-view
      class="absolute bottom-50rpx h-580rpx w-full"
      indicator-class="picker-view-remove-indicator-border"
      mask-class="picker-view-remove-mask-bg"
      indicator-style="height: 64rpx"
      @change="onPickerChange"
    >
      <picker-view-column>
        <text class="box-border block pr-6 leading-8 text-(5 center)" v-for="(hour, index) in 24" :key="hour">
          {{ index }}
        </text>
      </picker-view-column>
      <picker-view-column>
        <text class="box-border block pr-6 leading-8 text-(5 center)" v-for="(minute, index) in 60" :key="minute">
          {{ index }}
        </text>
      </picker-view-column>
      <picker-view-column>
        <text class="box-border block pr-6 leading-8 text-(5 center)" v-for="(second, index) in 60" :key="second">
          {{ index }}
        </text>
      </picker-view-column>
    </picker-view>
    <view class="absolute bottom-305rpx h-8 w-full bg-[--color-mask]">
      <text class="absolute left-135rpx leading-8 text-3">时</text>
      <text class="absolute left-385rpx leading-8 text-3">分</text>
      <text class="absolute left-640rpx leading-8 text-3">秒</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
defineProps<{ mergeClass?: unknown }>();

const system = useSystem();
const timer = useTimer();

function onPickerChange(e: unknown) {
  const { detail } = e as CustomEvent;
  timer.picked = detail.value;
}
</script>
