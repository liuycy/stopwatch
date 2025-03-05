<template>
  <swiper
    circular
    indicator-dots
    indicator-color="#727272"
    indicator-active-color="#fff"
    class="h-750rpx w-750rpx"
    @change="onSwiperChange"
  >
    <swiper-item v-if="setting.timer === DialType.Number">
      <stopwatch-dialnumber />
    </swiper-item>
    <swiper-item item-id="emulate">
      <stopwatch-dial :item-id="curitem" />
    </swiper-item>
    <swiper-item v-if="setting.timer === DialType.Emulate">
      <stopwatch-dialnumber />
    </swiper-item>
  </swiper>

  <stopwatch-action />
  <stopwatch-record />
  <stopwatch-history />
</template>

<script lang="ts" setup>
import stopwatchDial from "./stopwatch-dial.vue";
import stopwatchDialnumber from "./stopwatch-dialnumber.vue";
import stopwatchAction from "./stopwatch-action.vue";
import stopwatchRecord from "./stopwatch-record.vue";
import stopwatchHistory from "./stopwatch-history.vue";

const setting = useSetting();
const curitem = ref("");

function onSwiperChange(e: unknown) {
  const { detail } = e as CustomEvent;
  curitem.value = detail.currentItemId;
}
</script>
