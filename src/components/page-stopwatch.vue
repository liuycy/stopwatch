<template>
    <view class="page-stopwatch">
        <dial-panel class="fixed"></dial-panel>
        <actions-group></actions-group>
        <records-list class="flexable"></records-list>
        <setting-panel></setting-panel>
    </view>
</template>

<script lang="ts" setup>
import { onUnmounted } from "vue"

import { useDialStore } from '@/stores/dial'
import { useRecordsStore } from '@/stores/records'

import ActionsGroup from '@/components/actions-group.vue'
import DialPanel from '@/components/dial-panel.vue'
import RecordsList from '@/components/records-list.vue'
import SettingPanel from '@/components/setting-panel.vue'

const dial = useDialStore()
const records = useRecordsStore()

onUnmounted(() => {
    dial.pause()
    dial.reset()
    records.pause()
    records.reset()
})
</script>

<style lang="scss" scoped>
.page-stopwatch {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .fixed {
        flex: 0 0 auto;
    }

    .flexable {
        flex: 1 1 0;
        overflow: hidden;
    }
}
</style>