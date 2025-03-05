<template>
  <image :class="mergeClass" :src="base64" />
</template>

<script lang="ts" setup>
defineOptions({ options: { virtualHost: true, styleIsolation: "shared" } });

const props = defineProps<{
  mergeClass?: unknown;
  color: string;
  src: string;
}>();

const base64 = ref<string>();

watchEffect(() => {
  const fs = uni.getFileSystemManager();

  let svg = fs.readFileSync(props.src, "utf8") as string;
  if (/fill=".*?"/.test(svg)) {
    svg = svg.replace(/fill=".*?"/, `fill="${props.color}" `);
  } else {
    svg = svg.replace(/<svg /, `<svg fill="${props.color}" `);
  }

  const u8 = Uint8Array.from(svg, (s) => s.charCodeAt(0));
  svg = uni.arrayBufferToBase64(u8.buffer);
  base64.value = `data:image/svg+xml;base64,${svg}`;
});
</script>
