<template>
    <view class="quick-tags">
        <scroll-view class="list" v-show="navHeight" :show-scrollbar="false" enhanced scroll-y enable-passive
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
                        <text>删除时间 {{ formatTime(record.dtime) }}</text>
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
import { computed, getCurrentInstance, ref, watchEffect } from 'vue';

import { useGlobalStore } from '@/stores/global';
import { KeepDay4Deleted, useHistoryStore } from '@/stores/history';
import { useSettingsStore } from '@/stores/settings';
import { RecordType } from '@/types/enums';
import { pageTo } from '@/utils/pages';
import { formatTime } from '@/utils/format';
import { bindHeightFor } from '@/utils/node';

import SvgIcon from '@/components/svg-icon.vue';

const global = useGlobalStore()
const history = useHistoryStore()
const settings = useSettingsStore()

const records = computed(() => history.deletedRecords)
const isTimeRecord = computed(() => settings.defaultRecordType === RecordType.Time)

const checked = ref(new Set<string>())
const showTitle = ref(false)
const navHeight = ref(0)
const actionsHeight = ref(0)
const titleHeight = ref(0)

const top = `${global.topGap}px`

function goBack() {
    settings.vibrate()
    pageTo("Stopwatch")
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
        const { confirm } = await uni.showModal({ title: `删除全部 ${history.deletedRecords.length} 段记录?` })
        if (confirm) history.confirmDelete(new Set(history.deletedRecords.map(r => r.id)))
    } else {
        const { confirm } = await uni.showModal({ title: `删除所选 ${checked.value.size} 段记录?` })
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

function observeTitleScroll() {
    const instance = getCurrentInstance()
    const observer = uni.createIntersectionObserver(instance)
    observer.relativeTo('.nav').observe('.tip', (res) => {
        showTitle.value = res.boundingClientRect.top < navHeight.value
    })

    return () => observer.disconnect()
}

onLoad(() => {
    bindHeightFor('.nav').to(navHeight)
    bindHeightFor('.title').to(titleHeight)
    bindHeightFor('.actions').to(actionsHeight)
})

watchEffect((onCleanup) => {
    if (!navHeight.value) return
    onCleanup(observeTitleScroll())
})
</script>

<style lang="scss" scoped>
.quick-tags {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    color: var(--color-text);
    background-color: var(--color-bg);

    .stub {
        width: 100vw;
    }

    .list {
        flex: 1 1 auto;
        overflow: hidden;

        .tips {
            padding: 0 16px;
            padding-bottom: 16px;

            .title {
                font-size: 25px;
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
                padding: 16px;

                .icon-bg {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 15px;
                    height: 15px;
                    border-radius: 50%;
                    background-color: #fff;
                }
            }

            .record {
                flex: 1 1 auto;
                padding: 6px 16px;
                display: flex;
                flex-direction: column;
                border-top: 1px solid var(--color-recycle-border);

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
        }
    }

    .blur-bg {
        background-color: var(--color-blur);
        backdrop-filter: blur(16px);
    }

    .nav {
        width: 100vw;
        position: absolute;
        top: 0;

        .back {
            height: 40px;
            padding: 0 10px;
            position: relative;
            z-index: 1;
            display: inline-flex;
            align-items: center;
            color: var(--color-recycle-action);
        }

        .nav-title {
            width: 100vw;
            height: 40px;
            line-height: 40px;
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
            padding: 16px;
        }
    }


}
</style>