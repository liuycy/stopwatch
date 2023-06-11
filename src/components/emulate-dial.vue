<template>
	<view class="emulate-dial">
		<canvas class="canvas" id="dial" type="2d"></canvas>
	</view>
</template>

<script lang="ts" setup>
import { getCurrentInstance } from "vue"
import { onReady, onUnload } from '@dcloudio/uni-app'

import { useSettingsStore } from "@/stores/settings"
import { useRecordsStore } from '@/stores/records'
import { useDialStore } from '@/stores/dial'
import { Drawer } from '@/utils/drawer'
import { RecordType } from "@/types/enums"

const dial = useDialStore()
const records = useRecordsStore()
const settings = useSettingsStore()

let drawer: Drawer
let timer = 0

onReady(async () => {
	drawer = await Drawer.create({
		instance: getCurrentInstance(),
		canvasId: 'dial',
		bgColor: '#000',
		color: '#fff',
		secondaryColor: '#444',
		pointerColor: '#f1a43d',
		durationPointerColor: '#3788f2'
	})

	const loop = () => {
		timer = drawer.requestAnimationFrame(loop)
		drawer.draw(dial, settings.defaultRecordType === RecordType.Duration ? records.duration : undefined)
	}

	loop()
})

onUnload(() => {
	drawer.cancelAnimationFrame(timer)
})
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
