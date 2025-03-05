<template>
  <view
    :class="mergeClass"
    class="p-1 h-5"
    un-flex="~ justify-between items-center"
    un-border="1px solid [--color-border] rounded-5px"
    @click.stop="$emit('click')"
  >
    <template v-if="loading">
      <svg-icon src="/static/icon-loading.svg" merge-class="size-4 animate-spin" color="#ffffff" />
      <text class="ml-1 text-3 opacity-30">{{ label }}</text>
    </template>
    <template v-else>
      <svg-icon :src="icon" merge-class="size-4" color="#ffffff" />
      <text class="ml-1 text-3">{{ label }}</text>
    </template>
  </view>
</template>

<script lang="ts" setup>
defineOptions({ options: { virtualHost: true, styleIsolation: "shared" } });
defineProps<{
  icon: string;
  label: string;
  loading?: boolean;
  mergeClass?: unknown;
}>();
</script>
