<template>
	<view class="index">
		<page-stopwatch></page-stopwatch>
		<page-timer></page-timer>
		<footer-bar class="footer"></footer-bar>
		<history-modal></history-modal>
		<timer-modal></timer-modal>
	</view>
</template>

<script lang="ts" setup>
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { provide, ref } from 'vue'

import { bindHeightFor } from '@/utils/node'

import PageStopwatch from '@/components/page-stopwatch.vue'
import PageTimer from '@/components/page-timer.vue'
import FooterBar from '@/components/footer-bar.vue'
import HistoryModal from '@/components/history-modal.vue'
import TimerModal from '@/components/timer-modal.vue'

const footerHeight = ref(0)

provide('footerHeight', footerHeight)

onLoad(() => {
	bindHeightFor('.footer >>> .footer-bar').to(footerHeight)
})

onShareAppMessage(() => {
	return {
		title: '秒表|支持导出Excel',
		imageUrl: '/static/share.jpeg'
	}
})

onShareTimeline(() => {
	return {
		title: '秒表|支持导出Excel',
	}
})
</script>

<style lang="scss" scoped>
.index {
	width: 100vw;
	height: 100vh;
	background-color: var(--color-bg);
	color: var(--color-text);
}
</style>
