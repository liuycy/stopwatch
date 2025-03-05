<template>
  <overlay position="bottom" :show="show" @clickoverlay="show = false">
    <view class="color-provider pt-6 w-750rpx rounded-t-3xl bg-[--color-bg]">
      <view class="m-4 mt-0 rounded-xl bg-[--color-action-bg] *:b-0" un-divide="y-1px solid [--color-cancel-border]">
        <setting-action label="显示可导出的历史记录" switch v-model="setting.history" />
        <setting-action label="删除历史记录到回收站" switch v-model="setting.trash" />
        <setting-action label="查看历史记录的回收站" pageto="trash" v-if="setting.trash" />
        <setting-action label="查看自定义序号" pageto="tags" v-if="setting.history" />
      </view>

      <view class="m-4 mb-0 rounded-xl bg-[--color-action-bg] *:b-0" un-divide="y-1px solid [--color-cancel-border]">
        <setting-action label="保持屏幕常亮" switch v-model="setting.screenOn" />
        <setting-action label="调换操作按钮的位置" switch v-model="setting.reversed" :egg-trigger="egg.hit" />
        <setting-action label="操作按钮的振动强度" :select="['弱', '强', '禁用']" v-model="setting.vibrateType" />
        <setting-action label="默认显示的时间类型" :select="['每次间隔', '总用时']" v-model="setting.record" />
        <setting-action label="默认显示的秒表类型" :select="['模拟秒表', '数字秒表']" v-model="setting.timer" />
        <setting-action label="小程序有问题或想要更多功能" feedback />
        <setting-action label="清除小程序所有缓存数据" egg v-model="egg.crack" />
      </view>

      <view
        class="pb-[env(safe-area-inset-bottom)] h-14 w-full"
        un-flex="~ justify-center items-center"
        hover-class="bg-[--color-cancel-border]"
        @click="show = false"
      >
        <text un-text="4 [--color-cancel-text]">取消</text>
      </view>
    </view>
  </overlay>
</template>

<script lang="ts" setup>
import settingAction from "./setting-action.vue";

const egg = useEgg();
const setting = useSetting();
const show = ref(false);

defineOptions({ options: { virtualHost: true, styleIsolation: "shared" } });
defineExpose({ show: () => (show.value = true) });
</script>

<style scoped>
.color-provider {
  --color-bg: #f7f7f7;
  --color-action-bg: #fff;
  --color-cancel-border: #e6e6e6;
  --color-cancel-text: #5e6696;
  --color-text: #000;
  --color-label: #999;
  --color-label-highlight: #27bd2d;
}

@media (prefers-color-scheme: dark) {
  .color-provider {
    --color-bg: #1e1e1e;
    --color-action-bg: #2c2c2c;
    --color-cancel-border: #202020;
    --color-cancel-text: #7e88a1;
    --color-text: #808080;
    --color-label: #999;
    --color-label-highlight: #26c067;
  }
}
</style>
