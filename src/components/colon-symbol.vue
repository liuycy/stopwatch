<template>
	<view class="colon-symbol" :style="style">
		<view class="dot" :style="dotStyle"></view>
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
	height: `${fontSize * 0.5}rpx`
}))

const dotStyle = computed(() => ({
	width: `${fontSize * 0.1}rpx`,
	height: `${fontSize * 0.1}rpx`,
}))
</script>

<style lang="scss" scoped>
.colon-symbol {
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	.dot {
		background-color: var(--color-text);
		border-radius: 50%;
	}
}
</style>
