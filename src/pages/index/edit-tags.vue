<template>
    <view class="edit-tags">
        <view class="nav" :style="{ paddingTop: top }">
            <view @click="goBack()" class="back">
                <svg-icon src="/static/icon-left-arrow.svg" size="48rpx" color="#3183f4"></svg-icon>
                <text>返回</text>
            </view>
        </view>

        <view class="tips">
            <view class="title">替换序号</view>
            <view class="tip">点击列表行选择弹出的自定义文本进行替换</view>
            <view class="tip">返回时确认保存修改,直接返回不自动保存</view>
        </view>

        <view class="header" v-if="history.tempSheet">
            <view class="sheet">
                <view class="column tag">
                    <text>{{ history.tempSheet[0][0] }}</text>
                </view>
                <scroll-view id="xscroll" class="other" enable-flex enable-passive enhanced :bounces="false">
                    <template v-for="(col, c) in history.tempSheet[0]" :key="col">
                        <view class="column" :style="{ width: `${rects?.[c - 1].width ?? 0}px` }" v-if="c !== 0">
                            <text class="txt">{{ col }}</text>
                        </view>
                    </template>
                </scroll-view>
            </view>
        </view>

        <scroll-view class="table" scroll-y enable-back-to-top enable-passive enhanced :bounces="false"
            :show-scrollbar="false">
            <view class="sheet">
                <view class="tags">
                    <template v-for="(row, r) in history.tempSheet" :key="row[0]">
                        <view :class="['column', { active: selected === r }]"
                            :style="{ backgroundColor: bindingMap.get(r)?.color }" @click="selectRow(r)">
                            <text class="txt" v-if="bindingMap.has(r)">{{ bindingMap.get(r)?.text }}</text>
                            <text class="txt" v-else>{{ row[0] }}</text>
                        </view>
                    </template>
                </view>
                <scroll-view class="others" scroll-x enable-passive enhanced :bounces="false" @scroll="onScroll">
                    <view class="grids">
                        <template v-for="(row, r) in history.tempSheet" :key="r">
                            <template v-for="(col, c) in row" :key="`${r}-${c}`">
                                <view :class="['column', { sticky: r === 0, active: selected === r }]" v-if="c !== 0"
                                    @click="selectRow(r)">
                                    <text class="txt">{{ col }}</text>
                                </view>
                            </template>
                        </template>
                    </view>
                </scroll-view>
            </view>
        </scroll-view>
    </view>

    <page-container round position="top" :show="selected !== -1 && tags.list.length" @clickoverlay="hidePopup()">
        <tags-page @bindtag="bindTag"></tags-page>
    </page-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { useGlobalStore } from '@/stores/global';
import { useHistoryStore } from '@/stores/history';
import { useSettingsStore } from '@/stores/settings';
import { useTagsStore } from '@/stores/tags';

import { useNodesRects, useScrollViewContext } from '@/utils/node';
import { saveAsUserData } from '@/utils/excel';
import { pageTo } from '@/utils/pages';

import SvgIcon from '@/components/svg-icon.vue';
import TagsPage from '@/components/tags-page.vue'

import type { Tag } from '@/types/time';
import { onUnload } from '@dcloudio/uni-app';

const global = useGlobalStore()
const settings = useSettingsStore()
const history = useHistoryStore()
const tags = useTagsStore()

const xscroll = useScrollViewContext('#xscroll')
const rects = useNodesRects('.grids .sticky')

const selected = ref(-1)
const bindingMap = ref(new Map<number, Tag>())

const top = `${global.topGap}px`

async function save() {
    if (!history.tempSheet) return

    for (const [idx, tag] of bindingMap.value) {
        history.tempSheet[idx][0] = tag.text
    }
    await saveAsUserData(history.tempFilename, history.tempSheet);
}

async function goBack() {
    if (bindingMap.value.size) {
        const { confirm } = await uni.showModal({
            title: '确认修改',
            content: '即将覆盖之前记录,确定保存当前这份数据',
            cancelText: '直接返回'
        })
        if (confirm) await save()
    }
    settings.vibrate()
    pageTo("Stopwatch")
}

function bindTag(tag: Tag) {
    bindingMap.value.set(selected.value, tag)
}

function selectRow(r: number) {
    selected.value = r
}

function hidePopup() {
    selected.value = -1
}

function onScroll(e: any) {
    xscroll.value?.scrollTo({ left: e.detail.scrollLeft })
}

onUnload(() => {
    tags.binding.clear()
})
</script>

<style lang="scss" scoped>
.edit-tags {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    color: var(--color-text);
    background-color: var(--color-bg);

    .nav {
        width: 100vw;

        .back {
            height: 40px;
            padding: 0 10px;
            position: relative;
            z-index: 1;
            display: inline-flex;
            align-items: center;
            color: var(--color-recycle-action);
        }
    }

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

    .header {
        z-index: 1;
        overflow: hidden;
        box-sizing: border-box;
        padding: 0 16px;

        .sheet {
            display: flex;
        }

        .column {
            height: 38px;
            box-sizing: border-box;
            background-color: var(--color-border);
        }

        .tag {
            width: 160rpx;
        }

        .other {
            width: calc(100% - 160rpx);
            white-space: nowrap;
            display: flex;

            .column {
                flex-shrink: 0;
                width: 0;
            }
        }
    }

    .table {
        flex: 1 1 0;
        overflow: hidden;
        box-sizing: border-box;
        margin-bottom: env(safe-area-inset-bottom, 20px);
        padding: 0 16px;
        position: relative;
        top: -36px;

        .sheet {
            border: 1px solid var(--color-border);
            border-bottom: none;
            display: flex;

            .tags {
                width: 160rpx;
            }

            .others {
                width: calc(100% - 160rpx);
                white-space: nowrap;

                .grids {
                    display: grid;
                    grid-template-columns: repeat(5, fit-content(200rpx));
                }
            }
        }
    }

    .column {
        padding: 0 12px;
        height: 36px;
        display: flex;
        align-items: center;
        border-right: 1px solid var(--color-border);
        border-bottom: 1px solid var(--color-border);

        &.active {
            background-color: var(--color-orange);
        }

        .txt {
            color: var(--color-text);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }

}
</style>
