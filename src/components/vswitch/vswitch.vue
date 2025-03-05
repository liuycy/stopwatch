<template>
  <switch :class="mergeClass" :checked="model" @change="onSwitchChange" />
</template>

<script lang="ts" setup>
defineOptions({ options: { virtualHost: true, styleIsolation: "shared" } });
defineProps<{ mergeClass?: unknown }>();
const model = defineModel<boolean>();
const setting = useSetting();

function onSwitchChange(e: unknown) {
  const { detail } = e as CustomEvent<{ value: boolean }>;
  model.value = detail.value;
  setting.vibrate();
}
</script>
