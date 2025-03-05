<template>
  <overlay :show="show">
    <view class="w-[calc(100vw-150rpx)] rounded-10px bg-[--color-bg2]" v-if="hrecord">
      <text class="pt-4 block font-bold text-(4 center [--color-tips])">确定要删除这段记录吗?</text>
      <view class="p-4 flex flex-col font-mono">
        <view class="mb-1 flex justify-between text-(3 [--color-tips])">
          <text>记录时间 {{ formatTime(hrecord.ctime) }}</text>
          <text>{{ hrecord.total }} 条记录</text>
        </view>
        <view class="flex justify-between items-end">
          <view class="text-4">
            <view un-flex="~ items-center">
              <text>最小记录 </text>
              <text class="ml-1 text-[--color-green]">{{ hrecord.min }}</text>
            </view>
            <view un-flex="~ items-center">
              <text>最大记录 </text>
              <text class="ml-1 text-[--color-red]">{{ hrecord.max ?? "-" }}</text>
            </view>
          </view>
        </view>
      </view>
      <view un-flex="~ justify-between" un-border="0 t-1 solid [--color-border2]">
        <view
          @click="show = false"
          class="flex-[0_0_50%] h-10"
          un-text="4 [--color-tips]"
          un-flex="~ justify-center items-center "
          un-border="0 r-1px solid [--color-border2]"
          hover-class="opacity-50"
        >
          取消
        </view>
        <view
          @click="onConfirmClick(hrecord.id)"
          class="flex-[0_0_50%] h-10"
          un-flex="~ justify-center items-center"
          un-text="4 [--color-text2]"
          hover-class="opacity-50"
        >
          确定
        </view>
      </view>
    </view>
  </overlay>
</template>

<script lang="ts" setup>
const history = useHistory();
const hrecord = ref<HistoryRecord>();
const show = ref(false);

function onConfirmClick(id: string) {
  history.remove(id);
  show.value = false;
}

defineExpose({
  show: (record: HistoryRecord) => {
    hrecord.value = record;
    show.value = true;
  },
});
</script>
