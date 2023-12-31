<template>
    <scroll-view class="records-history" :show-scrollbar="false" enhanced scroll-y enable-passive enable-back-to-top>
        <view class="wrapper" v-for="record in history.records" :key="record.id">
            <view class="record">
                <view class="header">
                    <text>记录时间 {{ formatTime(record.ctime) }}</text>
                    <text>{{ record.total }} 条记录</text>
                </view>
                <view class="body">
                    <view class="content">
                        <view>
                            <text>最小记录 </text>
                            <text class="min" v-if="isTimeRecord">{{ record.firstTime }}</text>
                            <text class="min" v-else>{{ record.min }}</text>
                        </view>
                        <view>
                            <text>最大记录 </text>
                            <text class="max" v-if="isTimeRecord">{{ record.lastTime ?? '-' }}</text>
                            <text class="max" v-else>{{ record.max ?? '-' }}</text>
                        </view>
                    </view>

                    <view class="actions">
                        <view @click="confirmRemove(record)" class="action" v-if="record.status !== 'saving'">
                            <svg-icon src="/static/icon-delete.svg" size="14px" color="#ffffff"></svg-icon>
                            <text class="label">删除</text>
                        </view>
                        <view @click="exportExcel(record)" :class="['action', { loading: record.status === 'saving' }]">
                            <svg-icon class="icon" v-if="record.status === 'saving'" src="/static/icon-loading.svg"
                                size="14px" color="#ffffff"></svg-icon>
                            <svg-icon v-else src="/static/icon-export.svg" size="14px" color="#ffffff"></svg-icon>
                            <text class="label">导出</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <view class="footer" :style="{ height: `${footerHeight ?? 0}px` }"></view>
    </scroll-view>
</template>

<script lang="ts" setup>
import { computed, inject, type Ref } from 'vue';

import { useHistoryStore } from '@/stores/history';
import { useSettingsStore } from '@/stores/settings';
import { formatTime } from '@/utils/format';

import { RecordType } from '@/types/enums';
import { RecordConfirmRejectError, type HistoryRecord } from '@/types/history';

import SvgIcon from '@/components/svg-icon.vue';

const settings = useSettingsStore()
const history = useHistoryStore()

const isTimeRecord = computed(() => settings.defaultRecordType === RecordType.Time)

const footerHeight = inject<Ref<number>>('footerHeight')

async function confirmRemove(record: HistoryRecord) {
    settings.vibrate()

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
    settings.vibrate()

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
        margin: 5px 16px;

        .record {
            padding: 5px;
            display: flex;
            flex-direction: column;
            border: 1px solid var(--color-border);
            border-radius: 5px;

            .header {
                display: flex;
                justify-content: space-between;
                color: var(--color-tips);
                font-size: 10px;
                margin-bottom: 4px;
            }

            .body {
                display: flex;
                justify-content: space-between;
                align-items: flex-end;

                .content {
                    font-size: 14px;

                    .min {
                        color: var(--color-green);
                    }

                    .max {
                        color: var(--color-red);
                    }
                }

                .actions {
                    margin-left: 10px;

                    .action {
                        width: 40px;
                        height: 20px;
                        padding: 2px 4px;
                        display: inline-flex;
                        justify-content: space-between;
                        align-items: center;
                        border-radius: 5px;
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
                            margin-left: 8px;
                        }

                        .label {
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }

    .footer {
        width: 100%;
    }
}
</style>