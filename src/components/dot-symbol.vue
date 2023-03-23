<template>
	<view class="dot-symbol" :style="style">
		<view class="dot" :style="dotStyle"></view>
	</view>
</template>

<script lang="ts" setup>
import {
	computed,
	inject
} from 'vue'

const fontSize = inject<number>('fontSize') ?? 0

const style = computed(() => ({
	height: `${fontSize * 0.7}rpx`
}))

const dotStyle = computed(() => ({
	width: `${fontSize * 0.1}rpx`,
	height: `${fontSize * 0.1}rpx`,
}))
</script>

<style lang="scss" scoped>
.dot-symbol {
	display: flex;
	align-items: flex-end;

	.dot {
		background-color: var(--color-text);
		border-radius: 50%;
	}
}
</style>
