<template>
	<view class="index">
		<svg-icon class="icon" src="/static/icon-stopwatch.svg" size="120rpx" color="#eba54c"></svg-icon>
	</view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';

import { useSettingsStore } from '@/stores/settings'
import { PageType } from '@/types/enums'

import SvgIcon from '@/components/svg-icon.vue'
import { pageTo } from '@/utils/pages';

const settings = useSettingsStore()

onLoad(() => {
	if (settings.defaultPageType === PageType.Stopwatch) {
		return pageTo("Stopwatch")
	}
	if (settings.defaultPageType === PageType.Timer) {
		return pageTo("Timer")
	}
	if (settings.defaultPageType === PageType.TimerFullscreen) {
		return pageTo("TimerFullscreen")
	}
});
</script>

<style lang="scss" scoped>
.index {
	width: 100vw;
	height: 100vh;
	background-color: var(--color-bg);
	display: flex;
	justify-content: center;
	align-items: center;

	.icon {
		animation-name: heartBeat;
		animation-duration: 1.3s;
		animation-iteration-count: infinite;
		animation-timing-function: ease-in-out;
	}
}

@keyframes heartBeat {
	0% {
		-webkit-transform: scale(1);
		transform: scale(1);
	}

	14% {
		-webkit-transform: scale(1.3);
		transform: scale(1.3);
	}

	28% {
		-webkit-transform: scale(1);
		transform: scale(1);
	}

	42% {
		-webkit-transform: scale(1.3);
		transform: scale(1.3);
	}

	70% {
		-webkit-transform: scale(1);
		transform: scale(1);
	}
}
</style>
