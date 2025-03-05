<template>
  <view class="h-screen w-screen flex flex-col">
    <back-nav merge-class="flex-none" @backclick="onBackClick" />

    <view class="flex-none m-4 flex flex-col">
      <text class="text-6 font-bold">替换序号</text>
      <text class="text-(4 [--color-tips2])">点击列表行选择弹出的自定义文本进行替换</text>
      <text class="text-(4 [--color-tips2])">返回时确认保存修改,直接返回不自动保存</text>
    </view>

    <scroll-view
      scroll-x
      enable-flex
      enable-passive
      :show-scrollbar="false"
      :bounces="false"
      type="custom"
      class="flex-auto box-border flex overflow-hidden text-4"
      v-if="history.tempSheet"
    >
      <vsticky-header>
        <view class="w-[--whead]" :style="{ '--top': `${scrolltop}px`, '--whead': `${hcols[0]}rpx` }">
          <view class="w-full bg-[--color-border] z-1">
            <text class="block box-border px-2 w-full leading-8 truncate">
              {{ history.tempSheet[0][0] }}
            </text>
          </view>
          <view class="w-full bg-[--color-border] -translate-y-[--top]">
            <template v-for="(row, i) in history.tempSheet" :key="i">
              <text
                class="block box-border px-2 h-8 w-full leading-8 truncate"
                un-border="0 b-1 r-1 solid [--color-border2]"
                :style="{ backgroundColor: bindcolor(i) }"
                v-if="i !== 0"
              >
                {{ rowbind.has(i) ? rowbind.get(i)?.text : row[0] }}
              </text>
            </template>
          </view>
        </view>
      </vsticky-header>
      <scroll-view
        scroll-y
        enable-passive
        :bounces="false"
        :show-scrollbar="false"
        :padding="[0, 0, system.bottom, 0]"
        :style="{ '--wtab': `${hcols.slice(1).reduce((p, w) => p + w)}rpx` }"
        class="h-full w-[--wtab]"
        type="custom"
        @scroll="scbind"
        @scrollend="scbind"
        @scrollstart="scbind"
      >
        <template v-for="(row, i) in history.tempSheet" :key="`${row[1]}-${row[2]}`">
          <sticky-header v-if="i === 0">
            <view un-flex>
              <text
                :key="`${i}-${col}`"
                :style="{ '--wcol': `${hcols[i + 1]}rpx` }"
                class="box-border pl-2 w-[--wcol] leading-8 bg-[--color-border]"
                v-for="(col, i) in row.slice(1)"
              >
                {{ col }}
              </text>
            </view>
          </sticky-header>
          <view
            un-flex
            :class="{ 'bg-[--color-border]': rowselect === i }"
            :style="{ backgroundColor: bindcolor(i) }"
            @click="onRowClick(i)"
            v-else
          >
            <text
              :key="`${i}-${col}`"
              :style="{ '--wcol': `${hcols[i + 1]}px` }"
              un-border="0 b-1 r-1 solid [--color-border2]"
              class="box-border pl-2 h-8 w-[--wcol] leading-8"
              v-for="(col, i) in row.slice(1)"
            >
              {{ col }}
            </text>
          </view>
        </template>
      </scroll-view>
    </scroll-view>
  </view>

  <overlay position="top" :show="show" @clickoverlay="show = false">
    <tags-binding @tagclick="onTagClick" />
  </overlay>
</template>

<script lang="ts" setup>
import backNav from "../trash/back-nav.vue";
import tagsBinding from "../tags/tags-binding.vue";

const system = useSystem();
const router = useRouter();
const setting = useSetting();
const history = useHistory();

const hcols = [160, 230, 200, 200, 170, 170];
const rowbind = new Map<number, Tag>();
const rowselect = ref(-1);
const scrolltop = ref(0);
const show = ref(false);

const scbind = (e: unknown) => {
  const { detail } = e as CustomEvent;
  scrolltop.value = detail.scrollTop;
};

const bindcolor = (i: number) => {
  const color = rowbind.get(i)?.color;
  if (!color) return;
  return hex2rgba(color, 0.5).rgba;
};

async function onBackClick() {
  if (!rowbind.size) return router.back();

  const { confirm } = await uni.showModal({
    content: "即将覆盖之前记录,确定保存当前这份数据",
    cancelText: "直接返回",
    title: "确认修改",
  });

  if (confirm && history.tempSheet) {
    for (const [idx, tag] of rowbind) history.tempSheet[idx][0] = tag.text;
    await saveAsUserData(history.tempFilename, history.tempSheet);
  }

  return router.back();
}

function onRowClick(i: number) {
  rowselect.value = i;
  rowbind.delete(rowselect.value);
  setting.vibrate();
  show.value = true;
}

function onTagClick(tag: Tag) {
  rowbind.set(rowselect.value, tag);
  show.value = false;
}
</script>
