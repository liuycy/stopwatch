<template>
  <view class="h-screen w-screen" :style="{ '--top': `${system.top}px`, '--bottom': `${system.bottom}px` }">
    <scroll-view
      scroll-y
      enable-passive
      enable-back-to-top
      :show-scrollbar="false"
      :bounces="false"
      class="h-full"
      type="custom"
      @scroll="onScroll"
    >
      <sticky-header>
        <back-nav :title="titleVisible ? '最近删除' : undefined" @backclick="router.back" />
      </sticky-header>

      <view class="p-4 flex flex-col">
        <text class=" text-6 font-bold">最近删除</text>
        <text class=" text-(4 [--color-tips2])">记录最多保留 {{ KeepDay4Deleted }} 天, 之后会被永久删除</text>
      </view>

      <list-view>
        <view
          :key="record.id"
          :class="{ 'bg-[--color-border2]': checked.has(record.id) }"
          class="py-1 flex items-center"
          @click="onRecordClick(record.id)"
          v-for="record in history.deletedRecords"
        >
          <view class="p-4">
            <svg-icon merge-class="size-6" color="#3183f4" src="/static/icon-check.svg" v-if="checked.has(record.id)" />
            <svg-icon merge-class="size-6" color="#767676" src="/static/icon-uncheck.svg" v-else />
          </view>

          <view class="flex-auto pr-4">
            <view class="mb-1 flex justify-between text-(3 [--color-tips])">
              <text>删除时间 {{ formatTime(record.dtime) }}</text>
              <text>{{ record.total }} 条记录</text>
            </view>

            <view class="font-mono">
              <view class="flex items-center text-4">
                <text class="mr-2">最小记录 </text>
                <text class="text-[--color-green]" v-if="records.isTimeRecord">{{ record.firstTime }}</text>
                <text class="text-[--color-green]" v-else>{{ record.min }}</text>
              </view>
              <view class="flex items-center text-4">
                <text class="mr-2">最大记录 </text>
                <text class="text-[--color-red]" v-if="records.isTimeRecord">{{ record.lastTime ?? "-" }}</text>
                <text class="text-[--color-red]" v-else>{{ record.max ?? "-" }}</text>
              </view>
            </view>
          </view>
        </view>
      </list-view>

      <view class="h-[calc(96rpx+var(--bottom))] w-full" />
    </scroll-view>

    <view
      v-if="history.deletedRecords.length"
      class="absolute bottom-0 pb-[--bottom] h-12 w-full backdrop-blur-lg"
      un-flex="~ justify-between"
      un-text="[--color-action]"
    >
      <view class="px-4 h-full" un-flex="~ items-center" @click="onDeleteClick">
        <text class="text-4">{{ checked.size ? "删除" : "全部删除" }}</text>
      </view>
      <view class="px-4 h-full" un-flex="~ items-center" @click="onRecoveryClick">
        <text class="text-4">{{ checked.size ? "恢复" : "全部恢复" }}</text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import backNav from "./back-nav.vue";

const system = useSystem();
const router = useRouter();
const history = useHistory();
const records = useRecords();

const checked = ref(new Set<string>());
const titleVisible = ref(false);

function onScroll(e: unknown) {
  const { detail } = e as CustomEvent;
  titleVisible.value = detail.scrollTop >= 32 + system.top;
}

function onRecordClick(id: string) {
  if (checked.value.has(id)) {
    checked.value.delete(id);
  } else {
    checked.value.add(id);
  }
}

function onRecoveryClick() {
  if (!checked.value.size) {
    history.records.unshift(...history.deletedRecords.reverse());
    history.deletedRecords = [];
  } else {
    history.recovery(checked.value);
    checked.value = new Set();
  }
  history.sortRecords();
}

async function onDeleteClick() {
  if (!checked.value.size) {
    const { confirm } = await uni.showModal({ title: `删除全部 ${history.deletedRecords.length} 段记录?` });
    if (confirm) history.confirmDelete(new Set(history.deletedRecords.map((r) => r.id)));
  } else {
    const { confirm } = await uni.showModal({ title: `删除所选 ${checked.value.size} 段记录?` });
    if (!confirm) return;
    history.confirmDelete(checked.value);
    checked.value = new Set();
  }
}
</script>
