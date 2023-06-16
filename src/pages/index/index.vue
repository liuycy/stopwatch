<template>
	<view class="index">
		<dial-panel class="fixed"></dial-panel>
		<actions-group></actions-group>
		<records-list class="flexable"></records-list>
		<setting-panel></setting-panel>
		<history-modal></history-modal>
	</view>
</template>

<script lang="ts" setup>
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'

import SettingPanel from '@/components/setting-panel.vue'
import DialPanel from '@/components/dial-panel.vue'
import ActionsGroup from '@/components/actions-group.vue'
import RecordsList from '@/components/records-list.vue'
import HistoryModal from '@/components/history-modal.vue'

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
	display: flex;
	flex-direction: column;
	background-color: var(--color-bg);
	color: var(--color-text);

	.fixed {
		flex: 0 0 auto;
	}

	.flexable {
		flex: 1 1 0;
		overflow: hidden;
		padding-bottom: env(safe-area-inset-bottom, 20px);
	}
}
</style>
