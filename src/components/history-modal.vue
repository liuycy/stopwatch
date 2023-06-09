<template>
    <view class="confirm-modal" v-if="record">
        <view class="modal-content">
            <view class="title">确定要删除这条记录吗?</view>
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
                </view>
            </view>
            <view class="actions">
                <view @click="record.cancel()" class="action cancel" hover-class="hover">取消</view>
                <view @click="record.confirm()" class="action confirm" hover-class="hover">确定</view>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useHistoryStore } from '@/stores/history';

const history = useHistoryStore()
const record = computed(() => history.recordToBeConfirmed)
</script>

<style lang="scss" scoped>
.confirm-modal {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-overlay);
    color: var(--color-modal-text);

    .modal-content {
        width: 75vw;
        background-color: var(--color-modal-bg);
        border-radius: 20rpx;

        .title {
            padding-top: 32rpx;
            text-align: center;
            font-weight: bold;
            color: var(--color-tips);
        }

        .record {
            display: flex;
            flex-direction: column;
            padding: 32rpx;

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
            }
        }

        .actions {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid var(--color-modal-border);

            .action {
                height: 80rpx;
                flex: 0 0 50%;
                display: flex;
                justify-content: center;
                align-items: center;

                &.hover {
                    opacity: 0.5;
                }

                &+.action {
                    border-left: 1px solid var(--color-modal-border);
                }
            }

            .cancel {
                color: var(--color-tips);
            }

            .confirm {
                color: var(--color-modal-confirm-text)
            }
        }
    }
}
</style>