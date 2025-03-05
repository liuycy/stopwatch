<template>
  <view class="h-full inline-flex items-center" :class="mergeClass ?? 'text-#999999'" @click="onBoxClick">
    <template v-for="(o, i) in renderopts" :key="o.value">
      <view
        class="flex items-center text-3.5 after:(content-['/'] px-0.5 text-[0.7em])"
        :class="[{ 'after-hidden': i === renderopts.length - 1 }]"
      >
        <text :class="[o.value === model && (activeClass ?? 'text-#27bd2d')]">{{ o.label }}</text>
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
defineOptions({ options: { virtualHost: true, styleIsolation: "shared" } });

const emit = defineEmits(["change"]);
const model = defineModel();
const props = defineProps<{
  options: string[] | Array<{ label: string; value: number | boolean }>;
  activeClass?: unknown;
  mergeClass?: unknown;
  reversed?: boolean;
}>();

const setting = useSetting();
const options = computed(() => props.options.map((o, i) => (typeof o !== "string" ? o : { label: o, value: i })));
const renderopts = computed(() => (props.reversed ? options.value.slice().reverse() : options.value));

const onBoxClick = () => {
  const cur = options.value.findIndex((o) => o.value === model.value);
  model.value = options.value[(cur + 1) % options.value.length].value;
  setting.vibrate();
  emit("change");
};
</script>

<style scoped>
.after-hidden::after {
  content: "";
  display: none;
}
</style>
