<template>
    <view class="svg-icon" :style="size && { '--size': size }">
        <image class="icon" :src="base64"></image>
    </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { decode, encode } from 'js-base64'
import { watchEffect } from 'vue';

const props = defineProps<{
    src: string,
    color: string,
    size?: string
}>()

const base64 = ref<string>()

function initSrc() {
    const fs = uni.getFileSystemManager()
    let svg = decode(fs.readFileSync(props.src, 'base64') as string)
    if (/fill=".*?"/.test(svg)) {
        svg = svg.replace(/fill=".*?"/, `fill="${props.color}" `);
    } else {
        svg = svg.replace(/<svg /, `<svg fill="${props.color}" `);
    }
    base64.value = `data:image/svg+xml;base64,${encode(svg)}`;
}


watchEffect(initSrc)
</script>

<style lang="scss" scoped>
.svg-icon {
    width: var(--size, 32rpx);
    height: var(--size, 32rpx);
    position: relative;

    .icon {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
}
</style>