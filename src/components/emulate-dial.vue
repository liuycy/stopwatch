<template>
	<view class="emulate-dial">
		<canvas class="canvas" id="dial" type="2d"></canvas>
	</view>
</template>

<script lang="ts" setup>
import {
	getCurrentInstance,
	ref
} from "vue";

import {
	onReady,
	onUnload,
} from '@dcloudio/uni-app'

import {
	Drawer
} from '../utils/drawer'

import {
	useDialStore
} from '../stores/dial'

import {
	useRecordsStore
} from '../stores/records'

const dial = useDialStore()
const records = useRecordsStore()
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
		byTimePointerColor: '#3788f2'
	})

	const loop = () => {
		timer = drawer.requestAnimationFrame(loop)
		drawer.draw(dial, records.durationByTime)
	}

	loop()
})

onUnload(() => {
	console.log('unload')
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
