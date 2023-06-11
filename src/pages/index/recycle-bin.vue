<template>
    <view class="recycle-bin" @touchmove.stop.prevent="() => { }">
        <scroll-view class="list" @scroll="onScroll" :show-scrollbar="false" scroll-y enhanced enable-passive
            enable-back-to-top>
            <view class="stub" :style="{ height: `${navHeight}px` }"></view>

            <view class="tips">
                <view class="title">最近删除</view>
                <view class="tip">记录最多保留 {{ KeepDay4Deleted }} 天, 之后会被永久删除</view>
            </view>

            <view :class="['item', { highlight: checked.has(record.id) }]" @click="toggleCheck(record.id)"
                v-for="record in records" :key="record.id">
                <view class="checkbox">
                    <template v-if="checked.has(record.id)">
                        <view class="icon-bg"></view>
                        <svg-icon src="/static/icon-check.svg" size="42rpx" color="#3183f4"></svg-icon>
                    </template>
                    <template v-else>
                        <svg-icon src="/static/icon-uncheck.svg" size="42rpx" color="#767676"></svg-icon>
                    </template>
                </view>

                <view class="record">
                    <view class="header">
                        <text>删除时间: {{ formatTime(record.dtime) }}</text>
                        <text>{{ isTimeRecord ? '计时' : '计次' }}: {{ record.total }}</text>
                    </view>
                    <view class="body">
                        <view class="content">
                            <view>
                                <text>最小记录: </text>
                                <text class="min" v-if="isTimeRecord">{{ record.firstTime }}</text>
                                <text class="min" v-else>{{ record.min }}</text>
                            </view>
                            <view>
                                <text>最大记录: </text>
                                <text class="max" v-if="isTimeRecord">{{ record.lastTime ?? '-' }}</text>
                                <text class="max" v-else>{{ record.max ?? '-' }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <view class="stub" :style="{ height: `${actionsHeight}px` }"></view>
        </scroll-view>

        <view class="nav blur-bg" :style="{ paddingTop: top }">
            <view @click="goBack()" class="back">
                <svg-icon src="/static/icon-left-arrow.svg" size="48rpx" color="#3183f4"></svg-icon>
                <text>返回</text>
            </view>
            <view class="nav-title" v-if="showTitle">最近删除</view>
        </view>

        <view class="actions blur-bg" v-if="records.length">
            <view class="action" @click="remove()">{{ checked.size ? '删除' : '全部删除' }}</view>
            <view class="action" @click="recovery()">{{ checked.size ? '恢复' : '全部恢复' }}</view>
        </view>
    </view>
</template>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { getCurrentInstance, computed, ref, type Ref } from 'vue';

import { useSettingsStore } from '@/stores/settings';
import { useHistoryStore, KeepDay4Deleted } from '@/stores/history';
import { formatTime } from '@/utils/format';
import { RecordType } from '@/types/enums';

import SvgIcon from '@/components/svg-icon.vue';

const history = useHistoryStore()
const settings = useSettingsStore()
const records = computed(() => history.deletedRecords)
const isTimeRecord = computed(() => settings.defaultRecordType === RecordType.Time)

const top = `${uni.getSystemInfoSync().safeArea?.top ?? 0}px`
const checked = ref(new Set<string>())
const showTitle = ref(false)
const navHeight = ref(0)
const actionsHeight = ref(0)
const titleHeight = ref(0)

function goBack() {
    settings.vibrate()
    uni.navigateBack()
}

function toggleCheck(id: string) {
    settings.vibrate()

    if (checked.value.has(id)) {
        checked.value.delete(id)
    } else {
        checked.value.add(id)
    }
}

async function remove() {
    settings.vibrate()

    if (!checked.value.size) {
        const { confirm } = await uni.showModal({ title: `删除全部 ${history.deletedRecords.length} 条记录?` })
        if (confirm) history.confirmDelete(new Set(history.deletedRecords.map(r => r.id)))
    } else {
        const { confirm } = await uni.showModal({ title: `删除所选 ${checked.value.size} 条记录?` })
        if (confirm) {
            history.confirmDelete(checked.value)
            checked.value = new Set()
        }
    }
}

async function recovery() {
    settings.vibrate()

    if (!checked.value.size) {
        history.records.unshift(...history.deletedRecords.reverse())
        history.deletedRecords = []
    } else {
        history.recovery(checked.value)
        checked.value = new Set()
    }

    history.sortRecords()
}

function bindHeightFor(selector: string) {
    const instance = getCurrentInstance()
    const query = uni.createSelectorQuery().in(instance).select(selector)
    const result = new Promise(r => query.boundingClientRect(r).exec())

    return {
        to: async (ref: Ref<number>) => {
            const { height } = await result as UniApp.NodeInfo ?? {}
            ref.value = height ?? 0
        }
    }
}

function onScroll(e: any) {
    showTitle.value = e.detail.scrollTop > titleHeight.value
}

onLoad(() => {
    bindHeightFor('.nav').to(navHeight)
    bindHeightFor('.title').to(titleHeight)
    bindHeightFor('.actions').to(actionsHeight)
})
</script>

<style lang="scss" scoped>
.recycle-bin {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-size: 32rpx;
    color: var(--color-text);
    background-color: var(--color-bg);

    .stub {
        width: 100vw;
    }

    .list {
        flex: 1 1 auto;
        overflow: hidden;

        .tips {
            padding: 0 32rpx;
            padding-bottom: 32rpx;

            .title {
                font-size: 50rpx;
                font-weight: bold;
            }

            .tip {
                color: var(--color-recycle-tips);
            }
        }

        .item {
            display: flex;
            align-items: center;

            &.highlight {
                background-color: var(--color-recycle-border);
            }

            .checkbox {
                position: relative;
                padding: 32rpx;

                .icon-bg {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 30rpx;
                    height: 30rpx;
                    border-radius: 50%;
                    background-color: #fff;
                }
            }

            .record {
                flex: 1 1 auto;
                padding: 12rpx 32rpx;
                display: flex;
                flex-direction: column;
                border-top: 1px solid var(--color-recycle-border);

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
        }
    }

    .blur-bg {
        background-color: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(20px)
    }

    .nav {
        width: 100vw;
        position: absolute;
        top: 0;

        .back {
            height: 80rpx;
            padding: 0 20rpx;
            display: inline-flex;
            align-items: center;
            color: var(--color-recycle-action);
        }

        .nav-title {
            width: 100vw;
            height: 80rpx;
            line-height: 80rpx;
            position: absolute;
            bottom: 0;
            text-align: center;
        }
    }

    .actions {
        width: 100vw;
        position: absolute;
        bottom: 0;
        padding-bottom: env(safe-area-inset-bottom, 0);
        display: flex;
        justify-content: space-between;
        color: var(--color-recycle-action);

        .action {
            padding: 32rpx;
        }
    }


}
</style>