<template>
	<view @click="onClick" :class="['action', type, { disabled }]" hover-class="hover" :hover-start-time="0"
		:hover-stay-time="50">
		<slot></slot>
	</view>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '@/stores/settings'
import { VibrateType } from '@/types/enums'

const props = defineProps<{
	type: 'start' | 'pause' | 'reset' | 'count',
	disabled?: boolean,
}>()

const emit = defineEmits(['click'])

const settings = useSettingsStore()

function onClick() {
	if (props.disabled) return
	emit('click')

	if (settings.vibrateType === VibrateType.Short) {
		uni.vibrateShort()
	}
	if (settings.vibrateType === VibrateType.Long) {
		uni.vibrateLong()
	}
}
</script>

<style lang="scss" scoped>
.action {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 165rpx;
	height: 165rpx;
	border-radius: 50%;

	&::before {
		position: absolute;
		content: '';
		width: 145rpx;
		height: 145rpx;
		border-radius: 50%;
		border: 6rpx solid var(--color-bg);
	}


	&.start {
		background-color: var(--color-green-bg);
		color: var(--color-green);

		&.hover {
			background-color: var(--color-green-hover);
		}
	}

	&.pause {
		background-color: var(--color-red-bg);
		color: var(--color-red);

		&.hover {
			background-color: var(--color-red-hover);
		}
	}

	&.count,
	&.reset {
		background-color: var(--color-gray-bg);

		&.hover {
			background-color: var(--color-gray-hover);
		}
	}

	&.disabled {
		opacity: 0.7;
	}
}
</style>
