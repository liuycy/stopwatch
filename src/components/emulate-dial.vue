<template>
	<view class="emulate-dial">
		<canvas class="canvas" id="dial" type="2d"></canvas>
	</view>
</template>

<script lang="ts" setup>
import { computed, watchEffect, onMounted, onUnmounted } from "vue"

import { useSettingsStore } from "@/stores/settings"
import { useRecordsStore } from '@/stores/records'
import { useDialStore } from '@/stores/dial'
import { WatchPainter } from '@/utils/watch-painter'
import { DialStatus, RecordType } from "@/types/enums"

const dial = useDialStore()
const records = useRecordsStore()
const settings = useSettingsStore()

const duration = computed(() => settings.defaultRecordType === RecordType.Duration ? records.duration : undefined)

let painter: WatchPainter | undefined
let timer: number | undefined

watchEffect(async () => {
	if (dial.status === DialStatus.Init) {
		painter?.draw(dial, duration.value)
	}
})

onMounted(async () => {
	painter = await WatchPainter.create({
		canvasId: 'dial',
		bgColor: '#000',
		color: '#fff',
		secondaryColor: '#444',
		pointerColor: '#f1a43d',
		durationPointerColor: '#3788f2'
	})

	painter.draw(dial, duration.value)

	~(function start() {
		timer = painter.requestAnimationFrame(start)
		if (dial.status === DialStatus.Running) {
			painter.draw(dial, duration.value)
		}
	})()
})

onUnmounted(() => timer && painter?.cancelAnimationFrame(timer))
</script>

<style lang="scss" scoped>
.emulate-dial {
	height: 100%;

	.canvas {
		width: 750rpx;
		height: 750rpx;
	}
}
</style>
