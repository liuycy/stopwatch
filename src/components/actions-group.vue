<template>
	<view class="actions-group">
		<template v-if="dial.status === DialStatus.Running">
			<template v-if="settings.isActionsReverse">
				<action-button @click="onPause" type="gray">停止</action-button>
				<action-button @click="records.addTime()" type="gray">{{ recordLabel }}</action-button>
			</template>

			<template v-else>
				<action-button @click="records.addTime()" type="gray">{{ recordLabel }}</action-button>
				<action-button @click="onPause" type="red">停止</action-button>
			</template>
		</template>

		<template v-else>
			<template v-if="settings.isActionsReverse">
				<action-button @click="onStart" type="green">启动</action-button>
				<action-button @click="onReset" type="gray" :disabled="isInited">{{ isInited ? recordLabel : '复位'
				}}</action-button>
			</template>

			<template v-else>
				<action-button @click="onReset" type="gray" :disabled="isInited">{{ isInited ? recordLabel : '复位'
				}}</action-button>
				<action-button @click="onStart" type="green">启动</action-button>
			</template>
		</template>
	</view>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import ActionButton from '@/components/action-button.vue'

import { useDialStore } from '@/stores/dial'
import { useHistoryStore } from "@/stores/history"
import { useRecordsStore } from '@/stores/records'
import { useSettingsStore } from '@/stores/settings'
import { useTagsStore } from "@/stores/tags"

import { DialStatus, RecordType } from '@/types/enums'

const settings = useSettingsStore()
const history = useHistoryStore()
const dial = useDialStore()
const records = useRecordsStore()
const tags = useTagsStore()

const isInited = computed(() => dial.status === DialStatus.Init)
const recordLabel = computed(() => settings.defaultRecordType === RecordType.Duration ? '计次' : '计时')

function onStart() {
	dial.start()
	records.start()
}

function onReset() {
	tags.binding.clear()
	history.generate(records.timeRecords, records.timePeak)
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
	width: calc(100% - 32px);
	padding: 0 16px;
	position: absolute;
	top: 745rpx;
	display: flex;
	justify-content: space-between;
	font-size: 16px;
}
</style>
