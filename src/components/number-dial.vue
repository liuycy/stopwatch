<template>
	<view class="number-dial">
		<time-label class="label" :fontSize="dial.hours ? 120 : 150" :duration="dial">
		</time-label>
	</view>
</template>

<script lang="ts" setup>
import TimeLabel from '@/components/time-label.vue'

import { useDialStore } from '@/stores/dial'

const dial = useDialStore()
</script>

<style lang="scss" scoped>
.number-dial {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;

	.label {
		width: 100%;
	}
}
</style>
