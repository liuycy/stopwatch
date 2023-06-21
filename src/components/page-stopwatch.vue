<template>
    <view class="page-stopwatch" v-if="settings.defaultPageType === PageType.Stopwatch">
        <dial-panel class="fixed"></dial-panel>
        <actions-group></actions-group>
        <records-list class="flexable"></records-list>
        <setting-panel></setting-panel>
    </view>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '@/stores/settings';
import { PageType } from '@/types/enums'

import DialPanel from '@/components/dial-panel.vue'
import ActionsGroup from '@/components/actions-group.vue'
import RecordsList from '@/components/records-list.vue'
import SettingPanel from '@/components/setting-panel.vue'

const settings = useSettingsStore()
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