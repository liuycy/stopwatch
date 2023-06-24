<template>
	<view class="index">
		<page-stopwatch v-if="settings.defaultPageType === PageType.Stopwatch"></page-stopwatch>
		<page-timer v-if="settings.defaultPageType === PageType.Timer"></page-timer>
		<footer-bar class="footer"></footer-bar>
		<history-modal></history-modal>
		<timer-modal></timer-modal>
	</view>
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

import { useSettingsStore } from '@/stores/settings'
import { bindHeightFor } from '@/utils/node'
import { PageType } from '@/types/enums'

import PageStopwatch from '@/components/page-stopwatch.vue'
import PageTimer from '@/components/page-timer.vue'
import FooterBar from '@/components/footer-bar.vue'
import HistoryModal from '@/components/history-modal.vue'
import TimerModal from '@/components/timer-modal.vue'

const settings = useSettingsStore()
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
