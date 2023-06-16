<template>
	<view class="dial-panel">
		<template v-if="settings.defaultDialType === DialType.Number">
			<swiper class="swiper" :indicator-dots="true" indicator-color="#727272" indicator-active-color="#fff">
				<swiper-item>
					<number-dial></number-dial>
				</swiper-item>
				<swiper-item>
					<emulate-dial></emulate-dial>
				</swiper-item>
			</swiper>
		</template>
		<template v-if="settings.defaultDialType === DialType.Emulate">
			<swiper class="swiper" :indicator-dots="true" indicator-color="#727272" indicator-active-color="#fff">
				<swiper-item>
					<emulate-dial></emulate-dial>
				</swiper-item>
				<swiper-item>
					<number-dial></number-dial>
				</swiper-item>
			</swiper>
		</template>
	</view>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '@/stores/settings'
import { DialType } from '@/types/enums'

import NumberDial from '@/components/number-dial.vue'
import EmulateDial from '@/components/emulate-dial.vue'

const settings = useSettingsStore()
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
