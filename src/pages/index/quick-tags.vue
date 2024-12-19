<template>
    <view class="quick-tags">
        <view class="nav" :style="{ paddingTop: top }">
            <view @click="goBack()" class="back">
                <svg-icon src="/static/icon-left-arrow.svg" size="48rpx" color="#3183f4"></svg-icon>
                <text>返回</text>
            </view>
        </view>

        <view class="tips">
            <view class="title">自定义序号</view>
            <view class="tip">点击运行中的记录可选择替换其序号为下列文本</view>
            <view class="tip">长按历史记录也可选择替换其序号为下列文本</view>
        </view>

        <view class="actions">
            <input v-model="tags.searchKey" class="textinput" type="text" placeholder="请输入文本"
                placeholder-style="color: var(--color-tips);" @confirm="addTag()">
            <view class="action" @click="addTag()">添加</view>
        </view>

        <scroll-view class="list" :show-scrollbar="false" enhanced scroll-y enable-passive enable-back-to-top>
            <view class="item actions" v-for="tag in tags.searchList" :key="tag.id">
                <template v-if="tags.changing?.id === tag.id">
                    <input v-model="tags.changing.text" class="tag" type="text" :cursor-spacing="16" focus>
                    <view class="action" @click="changeTag()">确定</view>
                </template>
                <template v-else>
                    <view class="tag" :style="{ color: tag.color }">{{ tag.text }}</view>
                    <view class="action" @click="removeTag(tag)">删除</view>
                    <view class="action" @click="changeTag(tag)">修改</view>
                </template>
            </view>
            <view class="stub" :style="{ height: '40px' }"></view>
        </scroll-view>
    </view>
</template>

<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global';
import { useSettingsStore } from '@/stores/settings';
import { useTagsStore } from '@/stores/tags';

import { pageTo } from '@/utils/pages';

import SvgIcon from '@/components/svg-icon.vue';

import type { Tag } from '@/types/time';

const global = useGlobalStore()
const settings = useSettingsStore()
const tags = useTagsStore()

const top = `${global.topGap}px`

function goBack() {
    settings.vibrate()
    pageTo("Stopwatch")
}

function addTag() {
    settings.vibrate()
    tags.addFromSearch()
}

function removeTag(tag: Tag) {
    settings.vibrate()
    tags.remove(tag)
}

function changeTag(tag?: Tag) {
    settings.vibrate()
    if (tag) return tags.change(tag)
    tags.changing?.confirm()
}
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

    .actions {
        padding: 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .textinput {
            flex: 1 1 0;
            border: 1px solid var(--color-border);
            color: var(--color-text);
            border-radius: 4px;
            font-size: 20px;
            padding: 8px;
        }

        .action {
            flex-shrink: 0;
            padding-left: 16px;
            color: var(--color-recycle-action);
        }
    }

    .list {
        flex: 1 1 auto;
        overflow: hidden;
        padding-top: 16px;
        padding-bottom: env(safe-area-inset-bottom, 0);

        .item {
            border-top: 1px solid var(--color-recycle-border);
            margin: 0 16px;
            padding: 8px 0;

            .tag {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: bold;
                flex: 1 1 0;
                padding: 0 10px;
            }
        }
    }

    .stub {
        width: 100vw;
    }
}
</style>