<template>
	<view class="actions-group">
		<template v-if="dial.status === DialStatus.Running">
			<action-button @click="records.addTime()" type="count">计次</action-button>
			<action-button @click="onPause" type="pause">停止</action-button>
		</template>

		<template v-else>
			<action-button @click="onReset" type="reset" :disabled="isInited">{{ isInited ? '计次' : '复位' }}</action-button>
			<action-button @click="onStart" type="start">启动</action-button>
		</template>
	</view>
</template>

<script lang="ts" setup>
import ActionButton from './action-button.vue'

import {
	useDialStore
} from '../stores/dial'

import {
	useRecordsStore
} from '../stores/records'

import {
	DialStatus
} from '../types/enums';
import {
	computed
} from "vue";

const dial = useDialStore()
const records = useRecordsStore()

const isInited = computed(() => dial.status === DialStatus.Init)

function onStart() {
	dial.start()
	records.start()
}

function onReset() {
	dial.reset()
	records.reset()
}

function onPause() {
	dial.pause()
	records.pause()
}
</script>

<style lang="scss" scoped>
.actions-group {
	position: absolute;
	top: 745rpx;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-between;
	padding: 0 30rpx;
}
</style>
