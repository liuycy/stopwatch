<template>
  <view
    :class="[hiddenClass]"
    :style="{ '--top': `${system.top}px`, '--bottom': `${system.bottom}px` }"
    class="absolute top-0 right-0 box-border pr-[--top] pt-40px h-full w-300px bg-[--color-overlay]"
  >
    <view
      class="pl-16px m-8px h-32px flex justify-between items-center rounded-6px bg-[--color-mask]"
      v-if="timer.status === 'stopped'"
    >
      <text class="flex-auto text-16px">显示类型</text>
      <finite-state
        merge-class="pr-16px [&>view]:(text-14px after:px-2px)"
        v-model="timer.settings.clock"
        :options="[
          { label: '计时器', value: false },
          { label: '时钟', value: true },
        ]"
      />
    </view>

    <view class="pl-16px m-8px h-32px flex justify-between items-center rounded-6px bg-[--color-mask]">
      <text class="flex-auto text-16px">滴嗒声</text>
      <finite-state
        reversed
        merge-class="pr-16px [&>view]:(text-14px after:px-2px)"
        :options="['禁用', '慢', '快']"
        v-model="timer.settings.tick"
      />
    </view>

    <view
      class="pl-16px m-8px h-32px flex justify-between items-center rounded-6px bg-[--color-mask]"
      v-if="timer.settings.clock"
    >
      <text class="flex-auto text-16px">隐藏秒钟</text>
      <vswitch merge-class="scale-50" v-model="timer.settings.nosecond" />
    </view>

    <view
      class="pl-16px m-8px h-32px flex justify-between items-center rounded-6px bg-[--color-mask]"
      v-if="!timer.settings.clock"
    >
      <text class="flex-auto text-16px">提醒</text>

      <text class="flex-none text-14px">铃声</text>
      <vswitch merge-class="flex-none scale-50" v-model="timer.settings.ring" />

      <text class="flex-none text-14px">震动</text>
      <vswitch merge-class="flex-none scale-50" v-model="timer.settings.vibrate" />
    </view>

    <view
      class="pl-16px m-8px h-32px flex justify-between items-center rounded-6px bg-[--color-mask]"
      v-if="!timer.settings.clock && timer.status === 'stopped'"
    >
      <text class="flex-auto text-16px">倒计时</text>
      <vswitch merge-class="scale-50" v-model="timer.settings.reversed" />
    </view>

    <view
      class="absolute bottom-0 box-border pl-8px pr-[calc(8px+var(--top))] pb-[calc(8px+var(--bottom))] w-full"
      un-flex="~ justify-between items-center"
      v-if="!timer.settings.clock"
    >
      <action-btn
        size="64px"
        label="取消"
        color="gray"
        merge-class="[&>text]:text-12px"
        :disabled="timer.status === 'stopped'"
        @click="timer.stop"
      />
      <action-btn
        size="64px"
        label="开始"
        color="green"
        merge-class="[&>text]:text-12px"
        :disabled="timer.startDisabled"
        @click="timer.start"
        v-if="timer.status === 'stopped'"
      />
      <template v-else>
        <action-btn
          size="64px"
          label="暂停"
          color="orange"
          merge-class="[&>text]:text-12px"
          @click="timer.pause"
          v-if="timer.status === 'running'"
        />
        <action-btn
          size="64px"
          label="继续"
          color="green"
          merge-class="[&>text]:text-12px"
          @click="timer.start"
          v-else
        />
      </template>
    </view>
  </view>
</template>

<script lang="ts" setup>
const system = useSystem();
const timer = useTimer();

defineProps<{ hiddenClass?: unknown }>();
onUnload(() => timer.reset());
</script>
