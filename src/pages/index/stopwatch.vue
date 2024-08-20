<template>
    <view class="stopwatch">
        <page-stopwatch></page-stopwatch>
        <footer-bar class="footer"></footer-bar>
        <history-modal></history-modal>
    </view>
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

import { bindHeightFor } from '@/utils/node'

import PageStopwatch from '@/components/page-stopwatch.vue'
import FooterBar from '@/components/footer-bar.vue'
import HistoryModal from '@/components/history-modal.vue'

const footerHeight = ref(0)

provide('footerHeight', footerHeight)

onLoad(() => {
    bindHeightFor('.footer >>> .footer-bar').to(footerHeight)
})
</script>

<style lang="scss" scoped>
.stopwatch {
    width: 100vw;
    height: 100vh;
    background-color: var(--color-bg);
    color: var(--color-text);
}
</style>
