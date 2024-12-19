<template>
    <scroll-view class="tags-page" :style="{ paddingTop: top }" scroll-y>
        <view class="tags-box">
            <view class="tag" v-for="tag in tags.bindingList" :key="tag.id"
                :style="{ backgroundColor: hex2rgba(tag.color, 0.5).rgba }" @click="bindTag(tag)">
                <text class="label">{{ tag.text }}</text>
            </view>
        </view>
    </scroll-view>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import { useGlobalStore } from '@/stores/global';
import { useRecordsStore } from '@/stores/records';
import { useTagsStore } from '@/stores/tags';

import { hex2rgba } from '@/utils/color';

import type { SettingPopup } from '@/types/ui';
import type { Tag } from '@/types/time';

const global = useGlobalStore()
const records = useRecordsStore()
const tags = useTagsStore()

const popup = inject<SettingPopup>('popup')!

const top = `${4 + global.topGap}px`

function bindTag(tag: Tag) {
    if (popup.recordId) {
        const oldTag = records.bindTag(popup.recordId, tag)
        if (oldTag) tags.binding.delete(oldTag.id)
        tags.binding.add(tag.id)
    }
    popup.show = false
}
</script>

<style lang="scss" scoped>
.tags-page {
    background-color: #333;
    max-height: 750rpx;

    .tags-box {
        padding: 16px;
        padding-top: 48px;
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 10px;

        .tag {
            color: #fff;
            border: 1px solid #ddd;
            border-radius: 50%;
            aspect-ratio: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;

            .label {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

}
</style>