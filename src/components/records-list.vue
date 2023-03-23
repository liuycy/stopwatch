<template>
	<view class="gap line"></view>
	<scroll-view class="records-list" scroll-y>
		<view class="record" v-if="records.nowByTime">
			<text class="label">计次{{ records.byTime.length + 1 }}</text>
			<text class="duration">{{ records.nowByTime }}</text>
			<view class="gap"></view>
		</view>

		<view class="record" v-for="record in records.byTime" :key="hashKey(record.index)">
			<text class="label">计次{{ record.index }}</text>
			<text :class="['duration', peakClass(record.index)]">{{ record.duration }}</text>
			<view class="gap"></view>
		</view>
	</scroll-view>
</template>

<script lang="ts" setup>
import {
	useRecordsStore
} from '../stores/records'

const records = useRecordsStore()

function hashKey(index: number) {
	const {
		minIndex,
		maxIndex
	} = records.peakByTime ?? {}

	return `${index}-${minIndex}-${maxIndex}`
}

function peakClass(index: number) {
	const {
		minIndex,
		maxIndex
	} = records.peakByTime ?? {}

	return {
		min: minIndex === index,
		max: maxIndex === index,
	}
}
</script>

<style lang="scss" scoped>
.gap {
	position: absolute;
	left: 30rpx;
	right: 30rpx;
	width: calc(100% - 60rpx);
	border-top: 1px solid var(--color-border);

	&.line {
		border-top-color: var(--color-line);
	}
}

.records-list {
	width: 750rpx;
	height: 100%;
	box-sizing: border-box;

	.record {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 80rpx;
		font-size: 32rpx;
		padding: 0 30rpx;

		.duration {
			&.min {
				color: var(--color-green);
			}

			&.max {
				color: var(--color-red);
			}
		}

		.gap {
			bottom: 0;
		}
	}
}
</style>