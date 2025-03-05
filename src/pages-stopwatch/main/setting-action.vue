<template>
  <view class="pl-3 h-10" v-if="feedback">
    <button
      plain
      open-type="feedback"
      class="p-0 h-full w-full flex justify-between items-center"
      :style="{ border: 'unset' }"
    >
      <text class="text-(4 [--color-text])">{{ label }}</text>
      <svg-icon merge-class="pr-2 size-4" src="/static/icon-right-arrow.svg" :color="icolor" />
    </button>
  </view>

  <view class="pl-3 h-10 flex justify-between items-center" v-show="model" @click="onEggClick" v-else-if="egg">
    <text class="text-(4 [--color-text])">{{ label }}</text>
    <svg-icon merge-class="pr-2 size-4" src="/static/icon-right-arrow.svg" :color="icolor" />
  </view>

  <view
    class="pl-3 h-10 flex justify-between items-center"
    @click="router.to(pageto!, { routype: 'upwards' })"
    v-else-if="pageto"
  >
    <text class="text-(4 [--color-text])">{{ label }}</text>
    <svg-icon merge-class="pr-2 size-4" src="/static/icon-right-arrow.svg" :color="icolor" />
  </view>

  <view class="pl-3 h-10 flex justify-between items-center" v-else>
    <text class="text-(4 [--color-text])" @click="eggTrigger">{{ label }}</text>
    <vswitch merge-class="scale-75" v-model="model" v-if="switch" />
    <finite-state
      reversed
      merge-class="pr-3 text-[--color-label]"
      active-class="text-[--color-label-highlight]"
      :options="select"
      v-model="model"
      v-if="select"
    />
  </view>
</template>

<script lang="ts" setup>
defineOptions({ options: { virtualHost: true, styleIsolation: "shared" } });
defineProps<{
  eggTrigger?: () => void;
  egg?: boolean;
  label: string;
  pageto?: pkey;
  switch?: boolean;
  select?: string[];
  feedback?: boolean;
}>();

const model = defineModel();
const icolor = computed(() => (system.theme === "dark" ? "#fff" : "#000"));

const system = useSystem();
const router = useRouter();
const setting = useSetting();

async function onEggClick() {
  const { confirm } = await uni.showModal({ title: "清除所有缓存数据?" });
  if (!confirm) return;
  uni.clearStorage();
  removeExcelDir();
}
</script>
