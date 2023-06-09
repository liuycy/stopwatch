<template>
    <template v-if="top">
        <view @click="changePanelVisible" class="setting-button" hover-class="hover" :hover-start-time="0"
            :hover-stay-time="50" :style="{ top }">
            <image class="icon" src="@/static/icon-setting.svg"></image>
            <text>设置</text>
        </view>
    </template>

    <page-container @clickoverlay="hidePanel" :show="visible" round>
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

                <view class="item" v-if="settings.recycleBinEnabled">
                    <text>查看历史记录的回收站</text>
                    <view class="action">
                        <image class="icon" src="@/static/icon-right-arrow.svg"></image>
                    </view>
                </view>
            </view>

            <view class="function-list">
                <view class="item">
                    <text>保持屏幕常亮</text>
                    <switch @change="settings.changeScreenOn()" :checked="settings.keepScreenOn" class="switch"></switch>
                </view>

                <view class="item">
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

                <button class="item" open-type="feedback" plain>
                    <text>小程序有问题或想要更多功能</text>
                    <view class="action">
                        <svg-icon src="/static/icon-right-arrow.svg" size="28rpx" :color="iconColor"></svg-icon>
                    </view>
                </button>
            </view>

            <view @click="hidePanel" class="cancel-button" hover-class="hover">
                <text>取消</text>
            </view>
        </view>
    </page-container>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

import { useSettingsStore } from '@/stores/settings'
import { VibrateType, DialType } from '@/types/enums'

import SvgIcon from './svg-icon.vue'

const visible = ref(false)
const iconColor = ref('#000')
const top = ref<string | null>(null)

const settings = useSettingsStore()

onLoad(() => {
    const result = uni.getSystemInfoSync()
    top.value = `${4 + (result.safeArea?.top ?? 0)}px`

    uni.onThemeChange(({ theme }) => {
        iconColor.value = theme === 'dark' ? '#fff' : '#000'
    })
})

function changePanelVisible() {
    visible.value = !visible.value
}

function hidePanel() {
    visible.value = false
}
</script>

<style lang="scss" scoped>
.setting-button {
    width: 80rpx;
    padding-left: 55rpx;
    position: absolute;
    left: 32rpx;
    font-size: 30rpx;
    line-height: 60rpx;
    border-radius: 30rpx;
    border: 1px solid var(--color-border);

    .icon {
        width: 0.7 * 60rpx;
        height: 0.7 * 60rpx;
        position: absolute;
        left: 30rpx;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    &.hover {
        opacity: 0.5;
    }
}

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