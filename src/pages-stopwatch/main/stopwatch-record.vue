<template>
  <scroll-view
    v-if="records.curRecord"
    class="h-[calc(100vh-800rpx)] w-750rpx font-mono"
    :padding="[0, 0, system.bottom, 0]"
    :show-scrollbar="false"
    enable-back-to-top
    enable-passive
    scroll-y
  >
    <view
      class="px-4 h-10 text-4"
      un-flex="~ justify-between items-center"
      un-border="0 t-1px solid [--color-border]"
      v-if="!records.isTimeRecord"
    >
      <text>{{ recordLabel }}{{ records.timeRecords.length + 1 }}</text>
      <text>{{ records.curRecord }}</text>
    </view>

    <view
      :key="hashKey(record.id)"
      class="px-4 h-10 text-4"
      un-flex="~ justify-between items-center"
      un-border="0 t-1px solid [--color-border]"
      @click="onRecordClick(record)"
      v-for="record in records.timeRecords"
    >
      <text class="flex-auto leading-10" v-if="!record.tag">{{ recordLabel }}{{ record.index }}</text>
      <text
        v-else
        class="flex-auto mr-2 leading-10 truncate"
        :style="{ backgroundColor: hex2rgba(record.tag.color, 0.5).rgba }"
      >
        {{ record.tag.text }}
      </text>
      <text class="flex-none peak" :class="peakClass(record.index)">
        {{ records.isTimeRecord ? formatDuration(record.time) : formatDuration(record.duration) }}
      </text>
    </view>
  </scroll-view>

  <stopwatch-recordtags ref="reftags" />
</template>

<script lang="ts" setup>
import stopwatchRecordtags from "./stopwatch-recordtags.vue";

const system = useSystem();
const setting = useSetting();
const records = useRecords();
const tags = useTags();

const recordLabel = computed(() => (records.isTimeRecord ? "计时" : "计次"));

const hashKey = (id: string) => {
  if (records.isTimeRecord) return `${id}-${records.timeRecords.length}`;
  const { minIndex, maxIndex } = records.timePeak ?? {};
  return `${id}-${minIndex}-${maxIndex}`;
};

const peakClass = (index: number) => {
  if (records.isTimeRecord) {
    const len = records.timeRecords.length;
    return { min: index === 1, max: len > 1 && index === len };
  }
  const { minIndex, maxIndex } = records.timePeak ?? {};
  return { min: minIndex === index, max: maxIndex === index };
};

const reftags = ref();

function onRecordClick(record: TimeRecord) {
  setting.vibrate();
  if (!setting.history) return;
  reftags.value?.show(record);
}
</script>

<style scoped>
.peak.min {
  color: var(--color-green);
}
.peak.max {
  color: var(--color-red);
}
</style>
