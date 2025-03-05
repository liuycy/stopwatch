<template>
  <view />
</template>

<script setup lang="ts">
const router = useRouter();
onReady(() => router.modto(router.lastmod!));
</script>
