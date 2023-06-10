<template>
    <scroll-view class="records-history" scroll-y>
        <view class="wrapper" v-for="record in history.records" :key="record.id">
            <view class="record">
                <view class="header">
                    <text>记录时间: {{ formatTime(record.ctime) }}</text>
                    <text>计次: {{ record.total }}</text>
                </view>
                <view class="body">
                    <view class="content">
                        <view>
                            <text>最小记录: </text>
                            <text class="min">{{ record.min }}</text>
                        </view>
                        <view>
                            <text>最大记录: </text>
                            <text class="max">{{ record.max ?? '-' }}</text>
                        </view>
                    </view>

                    <view class="actions">
                        <view @click="confirmRemove(record)" class="action" v-if="record.status !== 'saving'">
                            <svg-icon src="/static/icon-delete.svg" size="28rpx" color="#ffffff"></svg-icon>
                            <text class="label">删除</text>
                        </view>
                        <view @click="exportExcel(record)" :class="['action', { loading: record.status === 'saving' }]">
                            <svg-icon class="icon" v-if="record.status === 'saving'" src="/static/icon-loading.svg"
                                size="28rpx" color="#ffffff"></svg-icon>
                            <svg-icon v-else src="/static/icon-export.svg" size="28rpx" color="#ffffff"></svg-icon>
                            <text class="label">导出</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </scroll-view>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/svg-icon.vue';

import { useSettingsStore } from '@/stores/settings';
import { useHistoryStore } from '@/stores/history';
import { formatTime } from '@/utils/format';

import { RecordConfirmRejectError, type HistoryRecord } from '@/types/history';

const settings = useSettingsStore()
const history = useHistoryStore()

async function confirmRemove(record: HistoryRecord) {
    if (settings.recycleBinEnabled) {
        return history.remove(record.id)
    }

    try {
        const id = await history.confirmRemove(record)
        return history.remove(id)
    } catch (error) {
        if (error instanceof RecordConfirmRejectError) return
        throw error
    }
}

async function exportDeadRecord(record: HistoryRecord) {
    const { confirm } = await uni.showModal({ title: '无法导出', content: 'Excel 文件已损坏，要删除吗？' })
    if (confirm) history.remove(record.id)
}

async function exportExcel(record: HistoryRecord) {
    if (record.status === 'dead') return await exportDeadRecord(record)

    if (record.status === 'saved') {
        try {
            await history.exportExcel(record.id)
        } catch {
            record.status = 'dead'
            return exportDeadRecord(record)
        }
    }
}
</script>

<style lang="scss" scoped>
@keyframes spining {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}

.records-history {
    width: 750rpx;
    height: 100%;
    box-sizing: border-box;

    .wrapper {
        margin: 10rpx 30rpx;

        .record {
            display: flex;
            flex-direction: column;
            border: 1px solid var(--color-border);
            border-radius: 10rpx;
            padding: 10rpx;

            .header {
                display: flex;
                justify-content: space-between;
                font-size: 24rpx;
                color: var(--color-tips);
                margin-bottom: 8rpx;
            }

            .body {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;

                .content {
                    font-size: 30rpx;
                    line-height: 36rpx;

                    .min {
                        color: var(--color-green);
                    }

                    .max {
                        color: var(--color-red);
                    }
                }

                .actions {
                    margin-left: 20rpx;

                    .action {
                        padding: 4rpx 8rpx;
                        width: 84rpx;
                        height: 40rpx;
                        line-height: 40rpx;
                        display: inline-flex;
                        justify-content: space-between;
                        align-items: center;
                        border-radius: 10rpx;
                        border: 1px solid var(--color-border);

                        &.loading {
                            .icon {
                                animation: 1s ease-in-out spining infinite;
                            }

                            .label {
                                opacity: 0.3;
                            }
                        }

                        &+.action {
                            margin-left: 16rpx;
                        }

                        .label {
                            font-size: 24rpx;
                        }
                    }
                }
            }
        }
    }
}
</style>