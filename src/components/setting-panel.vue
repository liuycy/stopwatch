<template>
    <template>
        <view @click="showPopup()" class="setting-button" hover-class="hover" :hover-start-time="0"
            :hover-stay-time="50" :style="{ top }">
            <svg-icon class="icon" src="/static/icon-setting.svg" size="20px" color="#fff"></svg-icon>
            <text>设置</text>
        </view>
    </template>

    <page-container @clickoverlay="hidePopup()" :position="popup.position" :show="popup.show" round>
        <setting-page v-if="popup.type === 'settings'"></setting-page>
        <tags-page v-if="popup.type === 'tags'" @bindtag="bindTag"></tags-page>
    </page-container>
</template>

<script lang="ts" setup>
import { inject } from 'vue'

import { useGlobalStore } from '@/stores/global'
import { useSettingsStore } from '@/stores/settings'
import { useRecordsStore } from '@/stores/records'
import { useTagsStore } from '@/stores/tags'

import SvgIcon from '@/components/svg-icon.vue'
import SettingPage from '@/components/setting-page.vue'
import TagsPage from '@/components/tags-page.vue'

import type { SettingPopup } from '@/types/ui'
import type { Tag } from '@/types/time'

const global = useGlobalStore()
const settings = useSettingsStore()
const records = useRecordsStore()
const tags = useTagsStore()

const top = `${4 + global.topGap}px`

const popup = inject<SettingPopup>('popup')!

function showPopup() {
    settings.vibrate()
    popup.position = 'bottom'
    popup.type = 'settings'
    popup.show = true
}

function hidePopup() {
    popup.show = false
}

function bindTag(tag: Tag) {
    if (popup.recordId) {
        const oldTag = records.bindTag(popup.recordId, tag)
        if (oldTag) tags.binding.delete(oldTag.id)
        tags.binding.add(tag.id)
    }
    popup.show = false
}
</script>

<style lang="scss" scoped>
.setting-button {
    width: 66px;
    height: 30px;
    position: absolute;
    left: 16px;
    font-size: 16px;
    border-radius: 18px;
    border: 1px solid var(--color-border);
    display: flex;
    justify-content: center;
    align-items: center;

    .icon {
        margin-right: 2px;
    }

    &.hover {
        opacity: 0.5;
    }
}
</style>