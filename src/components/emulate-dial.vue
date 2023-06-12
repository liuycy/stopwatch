<template>
	<view class="emulate-dial">
		<canvas class="canvas" id="dial" type="2d"></canvas>
	</view>
</template>

<script lang="ts" setup>
import { getCurrentInstance, computed, watchEffect, onMounted, onUnmounted } from "vue"

import { useSettingsStore } from "@/stores/settings"
import { useRecordsStore } from '@/stores/records'
import { useDialStore } from '@/stores/dial'
import { Drawer } from '@/utils/drawer'
import { DialStatus, RecordType } from "@/types/enums"

const dial = useDialStore()
const records = useRecordsStore()
const settings = useSettingsStore()

const duration = computed(() => settings.defaultRecordType === RecordType.Duration ? records.duration : undefined)

let drawer: Drawer | undefined
let timer: number | undefined

watchEffect(async () => {
	if (dial.status === DialStatus.Init) {
		drawer?.draw(dial, duration.value)
	}
})

onMounted(async () => {
	drawer = await Drawer.create({
		instance: getCurrentInstance(),
		canvasId: 'dial',
		bgColor: '#000',
		color: '#fff',
		secondaryColor: '#444',
		pointerColor: '#f1a43d',
		durationPointerColor: '#3788f2'
	})

	drawer.draw(dial, duration.value)

	~(function start() {
		timer = drawer.requestAnimationFrame(start)
		if (dial.status === DialStatus.Running) {
			drawer.draw(dial, duration.value)
		}
	})()
})

onUnmounted(() => timer && drawer?.cancelAnimationFrame(timer))
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
