<template>
  <view
    :style="{ '--top': `${system.top}px` }"
    class="box-border px-[--top] h-full w-full flex justify-center items-center"
    @click="$emit('click')"
  >
    <template v-if="!timer.settings.clock || !timer.settings.nosecond">
      <view class="mx-20rpx aspect-ratio-1 rounded-12px bg-[--color-bg2]">
        <text class="text-150rpx font-mono">{{ padFixedInt(clock.hours ?? 0) }}</text>
      </view>
      <view class="mx-20rpx aspect-ratio-1 rounded-12px bg-[--color-bg2]">
        <text class="text-150rpx font-mono">{{ padFixedInt(clock.minutes) }}</text>
      </view>
      <view class="mx-20rpx aspect-ratio-1 rounded-12px bg-[--color-bg2]">
        <text class="text-150rpx font-mono">{{ padFixedInt(clock.seconds) }}</text>
      </view>
    </template>
    <template v-else>
      <view class="mx-20rpx aspect-ratio-1 rounded-12px overflow-hidden">
        <view class="h-50% overflow-hidden bg-[--color-bg2]" :class="{ 'animate-fold': svhour }">
          <text class="block h-full text-180rpx font-mono">{{ padFixedInt(clock.hours ?? 0) }}</text>
        </view>
        <view class="h-50% overflow-hidden bg-[--color-bg2]">
          <text class="block h-full text-180rpx font-mono -translate-y-100%">{{ padFixedInt(clock.hours) }}</text>
        </view>
      </view>
      <view class="mx-20rpx aspect-ratio-1 rounded-12px overflow-hidden">
        <view class="h-50% overflow-hidden bg-[--color-bg2]" :class="{ 'animate-fold': svminu }">
          <text class="block h-full text-180rpx font-mono">{{ padFixedInt(clock.minutes) }}</text>
        </view>
        <view class="h-50% overflow-hidden bg-[--color-bg2]">
          <text class="block h-full text-180rpx font-mono -translate-y-100%">{{ padFixedInt(clock.minutes) }}</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
const system = useSystem();
const timer = useTimer();

const duration = ref(0);
const clock = computed(() => parseDuration(duration.value));

const shared = (state: () => number) => {
  const chgval = ref(false);
  watch(state, (cur, prev) => {
    if (~~cur === ~~prev) return;
    setTimeout(() => (chgval.value = false), 500);
    chgval.value = true;
  });
  return chgval;
};

const svhour = shared(() => clock.value.hours ?? 0);
const svminu = shared(() => clock.value.minutes);

function setclock() {
  const date = new Date();
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  duration.value = 1000 * (s + 60 * m + 3600 * h);
}

watchEffect(() => {
  uni.setKeepScreenOn({ keepScreenOn: timer.settings.clock });
});

watchEffect((onCleanup) => {
  const tid = setInterval(() => {
    if (timer.settings.clock) return setclock();
    duration.value = timer.duration;
  }, 60);

  onCleanup(() => clearInterval(tid));
});
</script>
