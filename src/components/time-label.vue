<template>
	<view class="time-label">
		<template v-if="duration.hours">
			<text class="number" :style="style">{{ padFixedInt(duration.hours) }}</text>
			<colon-symbol></colon-symbol>
		</template>

		<text class="number" :style="style">{{ padFixedInt(duration.minutes) }}</text>
		<colon-symbol></colon-symbol>

		<text class="number" :style="style">{{ padFixedInt(duration.seconds) }}</text>
		<dot-symbol></dot-symbol>

		<text class="number" :style="style">{{ padFixedInt(duration.ms) }}</text>
	</view>
</template>

<script lang="ts" setup>
import { computed, provide } from "vue"

import ColonSymbol from '@/components/colon-symbol.vue'
import DotSymbol from '@/components/dot-symbol.vue'

import { padFixedInt } from '@/utils/format'
import type { Duration } from "@/types/time"

const props = defineProps<{
	duration: Duration,
	fontSize: number,
}>()

const style = computed(() => ({
	fontSize: `${props.fontSize}rpx`
}))

provide('fontSize', props.fontSize)
</script>

<style lang="scss" scoped>
.time-label {
	width: 100%;
	display: flex;
	align-items: center;

	.number {
		flex: 1 1 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
</style>
