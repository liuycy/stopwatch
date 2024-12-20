<template>
    <scroll-view class="tags-page" :style="{ paddingTop: top }" scroll-y>
        <view class="tags-box">
            <view class="tag" v-for="tag in tags.bindingList" :key="tag.id"
                :style="{ backgroundColor: hex2rgba(tag.color, 0.5).rgba }" @click="emit('bindtag', tag)">
                <text class="label">{{ tag.text }}</text>
            </view>
        </view>
    </scroll-view>
</template>

<script lang="ts" setup>
import { onUnload } from '@dcloudio/uni-app';

import { useGlobalStore } from '@/stores/global';
import { useTagsStore } from '@/stores/tags';

import { hex2rgba } from '@/utils/color';

import type { Tag } from '@/types/time';

const emit = defineEmits<{ bindtag: [tag: Tag] }>()

const global = useGlobalStore()
const tags = useTagsStore()

const top = `${4 + global.topGap}px`

onUnload(() => {
    tags.binding.clear()
})
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