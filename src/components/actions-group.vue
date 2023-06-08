<template>
	<view class="actions-group">
		<template v-if="dial.status === DialStatus.Running">
			<template v-if="settings.isActionsReverse">
				<action-button @click="onPause" type="pause">停止</action-button>
				<action-button @click="records.addTime()" type="count">计次</action-button>
			</template>

			<template v-else>
				<action-button @click="records.addTime()" type="count">计次</action-button>
				<action-button @click="onPause" type="pause">停止</action-button>
			</template>
		</template>

		<template v-else>
			<template v-if="settings.isActionsReverse">
				<action-button @click="onStart" type="start">启动</action-button>
				<action-button @click="onReset" type="reset" :disabled="isInited">{{ isInited ? '计次' : '复位'
				}}</action-button>
			</template>

			<template v-else>
				<action-button @click="onReset" type="reset" :disabled="isInited">{{ isInited ? '计次' : '复位'
				}}</action-button>
				<action-button @click="onStart" type="start">启动</action-button>
			</template>
		</template>
	</view>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import ActionButton from '@/components/action-button.vue'

import { useSettings } from '@/stores/settings'
import { useRecordsStore } from '@/stores/records'
import { useDialStore } from '@/stores/dial'
import { DialStatus } from '@/types/enums'

const settings = useSettings()
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
	width: calc(100% - 60rpx);
	padding: 0 30rpx;
	position: absolute;
	top: 745rpx;
	display: flex;
	justify-content: space-between;
}
</style>
