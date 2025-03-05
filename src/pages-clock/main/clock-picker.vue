<template>
  <view class="absolute h-full w-50% flex flex-col justify-center" :class="[mergeClass, hiddenClass]">
    <picker-view
      class="h-60% w-full"
      mask-class="picker-view-remove-mask-bg"
      indicator-class="picker-view-remove-indicator-border"
      indicator-style="height: 32px;"
      @change="onPickerChange"
    >
      <picker-view-column>
        <text class="box-border block pr-24px leading-32px text-(20px center)" v-for="(hour, index) in 24" :key="hour">
          {{ index }}
        </text>
      </picker-view-column>
      <picker-view-column>
        <text
          class="box-border block pr-24px leading-32px text-(20px center)"
          v-for="(minute, index) in 60"
          :key="minute"
        >
          {{ index }}
        </text>
      </picker-view-column>
      <picker-view-column>
        <text
          class="box-border block pr-24px leading-32px text-(20px center)"
          v-for="(second, index) in 60"
          :key="second"
        >
          {{ index }}
        </text>
      </picker-view-column>
    </picker-view>
    <view class="absolute h-32px w-full flex pointer-events-none bg-[--color-mask]">
      <text class="flex-auto box-border pr-32px leading-32px text-(12px end)">时</text>
      <text class="flex-auto box-border pr-32px leading-32px text-(12px end)">分</text>
      <text class="flex-auto box-border pr-32px leading-32px text-(12px end)">秒</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
defineProps<{ mergeClass?: unknown; hiddenClass?: unknown }>();

const timer = useTimer();

function onPickerChange(e: unknown) {
  const { detail } = e as CustomEvent;
  timer.picked = detail.value;
}
</script>
