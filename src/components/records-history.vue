<template>
    <scroll-view class="records-history" scroll-y>
        <view class="wrapper" v-for="record in history.records" :key="record.id">
            <view class="record">
                <view class="header">
                    <text>记录时间: {{ record.ctime }}</text>
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
                        <view @click="confirmRemove(record)" class="action delete-action">
                            <image class="icon" src="@/static/icon-delete.svg"></image>
                            <text class="label">删除</text>
                        </view>
                        <view @click="history.exportExcel(record.id)" class="action export-ation">
                            <image class="icon" src="@/static/icon-export.svg"></image>
                            <text class="label">导出</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </scroll-view>
</template>

<script lang="ts" setup>
import { useSettingsStore } from '@/stores/settings';
import { useHistoryStore } from '@/stores/history';

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
</script>

<style lang="scss" scoped>
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

                        &+.action {
                            margin-left: 16rpx;
                        }

                        .icon {
                            width: 28rpx;
                            height: 28rpx;
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