<template>
	<view class="gap line"></view>

	<template v-if="curRecord">
		<scroll-view class="records-list" :show-scrollbar="false" enhanced scroll-y enable-passive enable-back-to-top>
			<view class="record" v-if="!isTimeRecord">
				<text class="label">{{ recordLabel }}{{ records.timeRecords.length + 1 }}</text>
				<text class="duration">{{ curRecord }}</text>
				<view class="gap"></view>
			</view>

			<view class="record" v-for="record in records.timeRecords" :key="hashKey(record.id)">
				<text class="label">{{ recordLabel }}{{ record.index }}</text>
				<text :class="['duration', peakClass(record.index)]">{{ formatValue(record) }}</text>
				<view class="gap"></view>
			</view>

			<view class="footer" :style="{ height: `${footerHeight ?? 0}px` }"></view>
		</scroll-view>
	</template>

	<template v-else-if="settings.historyVisible">
		<records-history></records-history>
	</template>
</template>

<script lang="ts" setup>
import { computed, inject, type Ref } from 'vue'

import { useRecordsStore } from '@/stores/records'
import { useSettingsStore } from '@/stores/settings'
import { RecordType } from '@/types/enums'
import type { TimeRecord } from '@/types/time'
import { formatDuration } from '@/utils/format'

import RecordsHistory from '@/components/records-history.vue'

const settings = useSettingsStore()
const records = useRecordsStore()

const isTimeRecord = computed(() => settings.defaultRecordType === RecordType.Time)
const curRecord = computed(() => isTimeRecord.value ? records.timeText : records.durationText)
const recordLabel = computed(() => isTimeRecord.value ? '计时' : '计次')

const footerHeight = inject<Ref<number>>('footerHeight')

function formatValue(record: TimeRecord) {
	if (isTimeRecord.value) return formatDuration(record.time)
	return formatDuration(record.duration)
}

function hashKey(id: string) {
	if (isTimeRecord.value) {
		return `${id}-${records.timeRecords.length}`
	}

	const { minIndex, maxIndex } = records.timePeak ?? {}
	return `${id}-${minIndex}-${maxIndex}`
}

function peakClass(index: number) {
	if (isTimeRecord.value) {
		const len = records.timeRecords.length
		return {
			min: index === 1,
			max: len > 1 && index === len
		}
	}

	const { minIndex, maxIndex } = records.timePeak ?? {}

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

	.footer {
		width: 100%;
	}
}
</style>