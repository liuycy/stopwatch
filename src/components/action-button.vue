<template>
	<view class="action" @click="onClick" :class="[type, { disabled }]" :style="size && { '--size': size }"
		hover-class="hover" :hover-start-time="0" :hover-stay-time="50">
		<slot></slot>
	</view>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '@/stores/settings'
import { VibrateType } from '@/types/enums'

const props = defineProps<{
	type: 'green' | 'red' | 'orange' | 'gray',
	disabled?: boolean,
	size?: string;
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
	width: var(--size, 165rpx);
	height: var(--size, 165rpx);
	border-radius: 50%;

	&::before {
		position: absolute;
		content: '';
		width: calc(var(--size, 165rpx) - 20rpx);
		height: calc(var(--size, 165rpx) - 20rpx);
		border-radius: 50%;
		border: 6rpx solid var(--color-bg);
	}


	&.green {
		background-color: var(--color-green-bg);
		color: var(--color-green);

		&.hover {
			background-color: var(--color-green-hover);
		}
	}

	&.red {
		background-color: var(--color-red-bg);
		color: var(--color-red);

		&.hover {
			background-color: var(--color-red-hover);
		}
	}

	&.orange {
		background-color: var(--color-orange-bg);
		color: var(--color-orange);

		&.hover {
			background-color: var(--color-orange-hover);
		}
	}

	&.gray {
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
