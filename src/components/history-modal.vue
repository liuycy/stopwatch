<template>
    <view class="confirm-modal" v-if="record">
        <view class="modal-content">
            <view class="title">确定要删除这段记录吗?</view>
            <view class="record">
                <view class="header">
                    <text>记录时间 {{ formatTime(record.ctime) }}</text>
                    <text>{{ record.total }} 条记录</text>
                </view>
                <view class="body">
                    <view class="content">
                        <view>
                            <text>最小记录 </text>
                            <text class="min">{{ record.min }}</text>
                        </view>
                        <view>
                            <text>最大记录 </text>
                            <text class="max">{{ record.max ?? '-' }}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view class="actions">
                <view @click="cancel()" class="action cancel" hover-class="hover">取消</view>
                <view @click="confirm()" class="action confirm" hover-class="hover">确定</view>
            </view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance } from 'vue';

import { useHistoryStore } from '@/stores/history';
import { formatTime } from '@/utils/format';

const history = useHistoryStore()
const record = computed(() => history.recordToBeConfirmed)

const instance: any = getCurrentInstance()
const _this = instance.ctx.$scope;

function cancel() {
    //#ifdef MP-WEIXIN
    _this.animate('.modal-content', [
        { opacity: 1.0, scale: [1, 1], ease: 'ease-out' },
        { opacity: 0.1, scale: [0.1, 0.1], ease: 'ease-out' },
    ], 200, () => {
        record.value?.cancel()
    })
    //#endif
    // #ifndef MP-WEIXIN
    record.value?.cancel()
    // #endif
}

function confirm() {
    //#ifdef MP-WEIXIN
    _this.animate('.modal-content', [
        { opacity: 1.0, scale: [1, 1], ease: 'ease-out' },
        { opacity: 0.1, scale: [0.1, 0.1], ease: 'ease-out' },
    ], 200, () => {
        record.value?.confirm()
    })
    //#endif
    // #ifndef MP-WEIXIN
    record.value?.confirm()
    // #endif
}
</script>

<style lang="scss" scoped>
@keyframes slidein {
    from {
        opacity: 0.1;
        transform: scale(0.1);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

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
        width: calc(100vw - 64px);
        background-color: var(--color-modal-bg);
        border-radius: 10px;
        animation: 0.2s ease-in slidein;

        .title {
            padding-top: 16px;
            text-align: center;
            font-weight: bold;
            color: var(--color-tips);
        }

        .record {
            display: flex;
            flex-direction: column;
            padding: 16px;

            .header {
                display: flex;
                justify-content: space-between;
                font-size: 10px;
                color: var(--color-tips);
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
            }
        }

        .actions {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid var(--color-modal-border);

            .action {
                height: 40px;
                flex: 0 0 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;

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