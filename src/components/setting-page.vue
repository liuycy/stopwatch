<template>
    <view class="setting-page">
        <view class="function-list">
            <view class="item">
                <text>显示可导出的历史记录</text>
                <switch @change="settings.changeHistoryVisible()" :checked="settings.historyVisible" class="switch">
                </switch>
            </view>

            <view class="item">
                <text>删除历史记录到回收站</text>
                <switch @click="settings.toggleRecyleBin()" :checked="settings.recycleBinEnabled" class="switch">
                </switch>
            </view>

            <view @click="goToRecycleBinPage()" class="item" v-if="settings.recycleBinEnabled">
                <text>查看历史记录的回收站</text>
                <view class="action">
                    <svg-icon src="/static/icon-right-arrow.svg" size="28rpx" :color="iconColor"></svg-icon>
                </view>
            </view>

            <view @click="goToQuickTagsPage()" class="item" v-if="settings.historyVisible">
                <text>查看自定义序号</text>
                <view class="action">
                    <svg-icon src="/static/icon-right-arrow.svg" size="28rpx" :color="iconColor"></svg-icon>
                </view>
            </view>
        </view>

        <view class="function-list">
            <view class="item">
                <text>保持屏幕常亮</text>
                <switch @change="settings.changeScreenOn()" :checked="settings.keepScreenOn" class="switch">
                </switch>
            </view>

            <view class="item" @click="hitEgg()">
                <text>调换操作按钮的位置</text>
                <switch @change="settings.reverseActions()" :checked="settings.isActionsReverse" class="switch">
                </switch>
            </view>

            <view class="item">
                <text>操作按钮的振动强度</text>
                <view @click="settings.nextVibrateType()" class="action">
                    <view class="label">
                        <text :class="{ highlight: settings.vibrateType === VibrateType.Short }">弱</text>
                        <text>/</text>
                        <text :class="{ highlight: settings.vibrateType === VibrateType.Long }">强</text>
                        <text>/</text>
                        <text :class="{ highlight: settings.vibrateType === VibrateType.Disabled }">禁用</text>
                    </view>
                    <svg-icon src="/static/icon-select.svg" size="28rpx" :color="iconColor"></svg-icon>
                </view>
            </view>

            <view class="item">
                <text>默认显示的时间类型</text>
                <view @click="settings.nextDefaultRecordType()" class="action">
                    <view class="label">
                        <text :class="{ highlight: settings.defaultRecordType === RecordType.Duration }">每次间隔</text>
                        <text>/</text>
                        <text :class="{ highlight: settings.defaultRecordType === RecordType.Time }">总用时</text>
                    </view>
                    <svg-icon src="/static/icon-select.svg" size="28rpx" :color="iconColor"></svg-icon>
                </view>
            </view>

            <view class="item">
                <text>默认显示的秒表类型</text>
                <view @click="settings.nextDefaultDialType()" class="action">
                    <view class="label">
                        <text :class="{ highlight: settings.defaultDialType === DialType.Number }">数字秒表</text>
                        <text>/</text>
                        <text :class="{ highlight: settings.defaultDialType === DialType.Emulate }">模拟秒表</text>
                    </view>
                    <svg-icon src="/static/icon-select.svg" size="28rpx" :color="iconColor"></svg-icon>
                </view>
            </view>

            <button @click="settings.vibrate()" class="item" open-type="feedback" plain>
                <text>小程序有问题或想要更多功能</text>
                <view class="action">
                    <svg-icon src="/static/icon-right-arrow.svg" size="28rpx" :color="iconColor"></svg-icon>
                </view>
            </button>

            <view class="item" @click="clearAllStorage()" v-if="eggHits > 10">
                <text>清除小程序所有缓存数据</text>
                <view class="action">
                    <svg-icon src="/static/icon-right-arrow.svg" size="28rpx" :color="iconColor"></svg-icon>
                </view>
            </view>
        </view>

        <view @click="hidePanel" class="cancel-button" hover-class="hover">
            <text>取消</text>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { inject, ref } from 'vue'

import { useGlobalStore } from '@/stores/global'
import { useHistoryStore } from '@/stores/history'
import { useSettingsStore } from '@/stores/settings'

import { pageTo } from '@/utils/pages'
import { removeExcelDir } from '@/utils/excel'

import { VibrateType, DialType, RecordType } from '@/types/enums'
import type { SettingPopup } from '@/types/ui'

const global = useGlobalStore()
const history = useHistoryStore()
const settings = useSettingsStore()


let eggTimer = -1
const eggHits = ref(0)
const iconColor = ref(global.theme === 'dark' ? '#fff' : '#000')
const popup = inject<SettingPopup>('popup')!

uni.onThemeChange(({ theme }) => {
    iconColor.value = theme === 'dark' ? '#fff' : '#000'
})

function hitEgg() {
    clearTimeout(eggTimer)
    eggHits.value += 1
    if (eggHits.value > 10) return
    eggTimer = setTimeout(() => {
        eggHits.value = 0
    }, 300)
}

function hidePanel() {
    popup.show = false
    eggHits.value = 0
}

function goToRecycleBinPage() {
    settings.vibrate()
    history.checkRecordDeleted()
    hidePanel()
    pageTo("RecycleBin")
}

function goToQuickTagsPage() {
    settings.vibrate()
    hidePanel()
    pageTo("QuickTags")
}

async function clearAllStorage() {
    settings.vibrate()
    const { confirm } = await uni.showModal({ title: '清除所有缓存数据?' })
    if (confirm) {
        uni.clearStorage();
        removeExcelDir();
        eggHits.value = 0
    }
}
</script>

<style lang="scss" scoped>
.setting-page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: var(--color-panel-bg);

    .function-list {
        margin: 32rpx;
        border-radius: 20rpx;
        background-color: var(--color-panel-action-bg);

        &+.function-list {
            margin-top: 0;
        }

        .item {
            border: unset;
            box-sizing: content-box;
            height: 60rpx;
            padding: 10rpx;
            padding-left: 30rpx;
            font-size: 28rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--color-panel-text);

            .switch {
                transform: scale(0.8);
            }

            .action {
                height: 100%;
                padding-right: 15rpx;
                display: flex;
                align-items: center;

                .label {
                    color: var(--color-panel-label);

                    .highlight {
                        color: var(--color-panel-label-highlight);
                    }
                }
            }

            &+.item {
                border-top: 1px solid var(--color-panel-bg);
            }
        }
    }

    .cancel-button {
        width: 100%;
        height: 120rpx;
        color: var(--color-panel-cancel-text);
        border-top: 1px solid var(--color-panel-cancel-border);
        padding-bottom: env(safe-area-inset-bottom, 0);
        font-size: 34rpx;
        line-height: 120rpx;
        text-align: center;

        &.hover {
            background-color: var(--color-panel-cancel-border);
        }
    }
}
</style>
