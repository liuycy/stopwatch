<template>
	<view class="dial-panel">
		<swiper class="swiper" :indicator-dots="true" indicator-color="#727272" indicator-active-color="#fff">
			<swiper-item>
				<number-dial></number-dial>
			</swiper-item>
			<swiper-item>
				<emulate-dial></emulate-dial>
			</swiper-item>
		</swiper>
	</view>
</template>

<script lang="ts" setup>
import NumberDial from './number-dial.vue'
import EmulateDial from './emulate-dial.vue'
</script>

<style lang="scss" scoped>
.dial-panel {
	height: 940rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;

	.swiper {
		height: 780rpx;
	}
}
</style>
