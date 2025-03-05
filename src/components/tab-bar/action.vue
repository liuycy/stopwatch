<template>
  <view class="inline-flex flex-col items-center" @click="onViewClick">
    <svg-icon merge-class="size-6" :src="icon" :color="color" />
    <text class="mt-1 text-(3 [--color])" :style="{ '--color': color }">{{ label }}</text>
  </view>
</template>

<script lang="ts" setup>
defineOptions({ options: { virtualHost: true, styleIsolation: "shared" } });

const props = defineProps<{
  icon: string;
  label: string;
  pageto: pkey;
}>();

const color = computed(() => (router.lastmod === props.pageto ? "#eba54c" : "#7d7d7d"));

const router = useRouter();
const setting = useSetting();

function onViewClick() {
  router.modto(props.pageto);
  setting.vibrate();
}
</script>
