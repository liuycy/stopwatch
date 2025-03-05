<template>
  <view
    class="bg-#333"
    :style="{
      '--size': `${size}rpx`,
      '--hstub': `${32 + system.top}px`,
      '--height': `calc(${rows * size}rpx + ${(rows + 1) * gap}px + var(--hstub))`,
    }"
  >
    <view class="pt-[--hstub] h-100rpx w-750rpx flex justify-center items-center" v-if="taglist.length === 0">
      <text class="text-4">请在 [设置] > [查看自定义序号] 中添加文本</text>
    </view>

    <scroll-view
      type="custom"
      class="w-750rpx max-h-750rpx h-[--height]"
      :show-scrollbar="false"
      enable-passive
      scroll-y
      v-else
    >
      <view class="h-[--hstub] w-full" />
      <grid-view :cross-axis-count="5" :main-axis-gap="gap" :padding="[gap, gap, gap, gap]">
        <view
          v-for="tag in taglist"
          :key="tag.id"
          :style="{ backgroundColor: hex2rgba(tag.color, 0.5).rgba }"
          un-border="1px solid #ddd rounded-full"
          un-flex="~ justify-center items-center"
          class="text-#fff size-[--size]"
          @click="onTagClick(tag)"
        >
          <text class="truncate text-(4 center)">{{ tag.text }}</text>
        </view>
      </grid-view>
    </scroll-view>
  </view>
</template>

<script lang="ts" setup>
const emit = defineEmits(["tagclick"]);
const setting = useSetting();
const system = useSystem();
const tags = useTags();

const taglist = computed(() => tags.list.filter((t) => !tags.binding.has(t.id)));
const rows = computed(() => Math.ceil(taglist.value.length / 5));
const size = 120;
const gap = 16;

function onTagClick(tag: Tag) {
  setting.vibrate();
  emit("tagclick", tag);
}
</script>
