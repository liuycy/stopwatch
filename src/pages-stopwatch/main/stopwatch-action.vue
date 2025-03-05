<template>
  <view class="box-border px-4 h-50rpx w-750rpx -translate-y-135rpx" un-flex="~ justify-between">
    <template v-if="dial.status === DialStatus.Running">
      <action-btn color="gray" label="停止" v-if="setting.reversed" @click="onPause" />
      <action-btn color="gray" :label="recordLabel" @click="records.addTime()" />
      <action-btn color="red" label="停止" v-if="!setting.reversed" @click="onPause" />
    </template>
    <template v-else>
      <action-btn color="green" label="启动" v-if="setting.reversed" @click="onStart" />
      <action-btn color="gray" :label="isInited ? recordLabel : '复位'" :disabled="isInited" @click="onReset" />
      <action-btn color="green" label="启动" v-if="!setting.reversed" @click="onStart" />
    </template>
  </view>
</template>

<script lang="ts" setup>
const dial = useDial();
const records = useRecords();
const setting = useSetting();
const history = useHistory();
const tags = useTags();

const isInited = computed(() => dial.status === DialStatus.Init);
const recordLabel = computed(() => (setting.record === RecordType.Duration ? "计次" : "计时"));

onUnload(() => {
  records.pause();
  records.reset();
  dial.pause();
  dial.reset();
});

function onStart() {
  records.start();
  dial.start();
}

function onReset() {
  history.generate(records.timeRecords, records.timePeak);
  tags.binding.clear();
  records.reset();
  dial.reset();
}

function onPause() {
  records.pause();
  dial.pause();
}
</script>

<style scoped></style>
