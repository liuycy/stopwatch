<template>
  <view class="h-screen w-screen flex flex-col">
    <back-nav merge-class="flex-none" @backclick="router.back" />

    <view class="flex-none m-4 flex flex-col">
      <text class="text-6 font-bold">自定义序号</text>
      <text class="text-(4 [--color-tips2])">点击运行中的记录可选择替换其序号为下列文本</text>
      <text class="text-(4 [--color-tips2])">点击历史记录也可选择替换其序号为下列文本</text>
    </view>

    <view class="flex-none m-4 mt-0 flex justify-between items-center">
      <input
        type="text"
        placeholder="请输入文本"
        placeholder-style="color: var(--color-tips);"
        class="flex-auto p-2 text-(5 [--color-text])"
        un-border="1px solid [--color-border] rounded-4px"
        :auto-focus="tags.searching.focus"
        :focus="tags.searching.focus"
        v-model="tags.searching.key"
        @focus="tags.searching.focus = true"
        @blur="tags.searchreset"
        @confirm="tags.searchadd(true)"
      />
      <text class="flex-none ml-4 leading-8 text-(4 [--color-action])" @click="tags.searchadd()">添加</text>
    </view>

    <scroll-view class="flex-auto" :bounces="false" :show-scrollbar="false" enable-back-to-top enable-passive scroll-y>
      <view
        :key="tag.id"
        class="mx-4 flex items-center"
        un-border="0 t-1px solid [--color-border2]"
        v-for="tag in taglist"
      >
        <text
          class="flex-auto px-2 leading-8 truncate text-(4 [--color-text])"
          :style="{ backgroundColor: hex2rgba(tag.color, 0.5).rgba }"
        >
          {{ tag.text }}
        </text>
        <text class="flex-none ml-16px leading-8 text-(4 [--color-action])" @click="tags.remove(tag)">删除</text>
        <text class="flex-none ml-16px leading-8 text-(4 [--color-action])" @click="tags.change(tag)">修改</text>
      </view>

      <view class="h-[env(safe-area-inset-bottom)]" />
    </scroll-view>

    <overlay :show="!!tags.changing" @clickoverlay="tags.changing = undefined">
      <view class="w-[calc(100vw-150rpx)] rounded-10px bg-[--color-bg2]">
        <text class="pt-4 block font-bold text-(4 center [--color-tips])">请修改</text>

        <input
          type="text"
          placeholder="请输入文本"
          placeholder-style="color: var(--color-tips);"
          un-border="1px solid [--color-border2] rounded-4px"
          class="m-4 p-2 text-(5 [--color-text])"
          @confirm="tags.confirm()"
          v-model="tags.changing.tobecofm"
          :auto-focus="tags.changing.focus"
          :focus="tags.changing.focus"
          v-if="tags.changing"
        />

        <view un-flex="~ justify-between" un-border="0 t-1 solid [--color-border2]">
          <view
            hover-class="opacity-50"
            un-border="0 r-1px solid [--color-border2]"
            class="flex-[0_0_50%] h-10 flex justify-center items-center text-(4 [--color-tips])"
            @click="tags.changing = undefined"
          >
            取消
          </view>
          <view
            hover-class="opacity-50"
            class="flex-[0_0_50%] h-10 flex justify-center items-center text-(4 [--color-text2])"
            @click="tags.confirm()"
          >
            确定
          </view>
        </view>
      </view>
    </overlay>
  </view>
</template>

<script lang="ts" setup>
import backNav from "../trash/back-nav.vue";

const tags = useTags();
const router = useRouter();
const taglist = computed(() => tags.list.filter((t) => t.text.includes(tags.searching.key)));
</script>
