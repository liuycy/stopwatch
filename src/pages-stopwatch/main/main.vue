<template>
  <view class="h-screen w-screen bg-[color-bg]">
    <stopwatch />
    <float-btn icon="/static/icon-setting.svg" label="设置" @click="refsett?.show" />
    <tab-bar v-if="!records.curRecord" />
    <stopwatch-hisdelconfirm ref="refcofm" />
    <setting ref="refsett" />
  </view>
</template>

<script setup lang="ts">
import stopwatch from "./stopwatch.vue";
import stopwatchHisdelconfirm from "./stopwatch-hisdelconfirm.vue";
import setting from "./setting.vue";

const records = useRecords();
const refcofm = ref();
const refsett = ref();

provide("refcofm", refcofm);

uni.showShareMenu();
</script>
