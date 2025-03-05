<template>
  <scroll-view
    v-if="setting.history && !records.curRecord"
    class="h-[calc(100vh-800rpx)] w-750rpx font-mono"
    :show-scrollbar="false"
    enable-back-to-top
    enable-passive
    scroll-y
    type="custom"
  >
    <list-view>
      <view
        v-for="record in history.records"
        :key="record.id"
        class="box-border mt-1 mx-4 p-2 flex flex-col"
        un-border="1px solid [--color-border] rounded-5px"
        @click="onTagsviewLongpress(record)"
      >
        <view class="mb-1 flex justify-between text-(3 [--color-tips])">
          <text>记录时间 {{ formatTime(record.ctime) }}</text>
          <text>{{ record.total }} 条记录</text>
        </view>

        <view un-flex="~ justify-between items-end">
          <view>
            <view class="flex mb-1 text-(4 [--color-green])">
              <text class="mr-1 text-[--color-text]">最小记录 </text>
              <text v-if="records.isTimeRecord">{{ record.firstTime }}</text>
              <text v-else>{{ record.min }}</text>
            </view>
            <view class="flex text-(4 [--color-red])">
              <text class="mr-1 text-[--color-text]">最大记录 </text>
              <text v-if="records.isTimeRecord">{{ record.lastTime ?? "-" }}</text>
              <text v-else>{{ record.max ?? "-" }}</text>
            </view>
          </view>

          <view un-flex>
            <icon-btn merge-class="mr-2" label="删除" icon="/static/icon-delete.svg" @click="onDeleteClick(record)" />
            <icon-btn
              label="导出"
              icon="/static/icon-export.svg"
              :loading="record.status === 'saving'"
              @click="onExportClick(record)"
            />
          </view>
        </view>
      </view>
    </list-view>

    <view class="h-[calc(120rpx+env(safe-area-inset-bottom))] w-full" />
  </scroll-view>
</template>

<script lang="ts" setup>
const router = useRouter();
const history = useHistory();
const setting = useSetting();
const records = useRecords();

const refcofm = inject("refcofm", ref());

const showCleanModal = async (title: string, record: HistoryRecord) => {
  const { confirm } = await uni.showModal({
    content: "由于文件缓存被清理, 找不到 Excel 文件, 请删除该记录",
    confirmText: "删除",
    title,
  });
  if (confirm) history.remove(record.id, true);
};

function onDeleteClick(record: HistoryRecord) {
  setting.vibrate();
  if (setting.trash) return history.remove(record.id);
  refcofm.value?.show(record);
}

async function onExportClick(record: HistoryRecord) {
  setting.vibrate();
  try {
    await history.exportExcel(record.id);
  } catch {
    record.status = "dead";
    showCleanModal("无法导出", record);
  }
}

async function onTagsviewLongpress(record: HistoryRecord) {
  setting.vibrate();
  try {
    await history.readExcelToTemp(record.id);
    router.to("tagsview");
  } catch {
    showCleanModal("无法打开", record);
  }
}
</script>
