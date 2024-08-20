<template>
    <view class="timer">
        <page-timer></page-timer>
        <footer-bar class="footer"></footer-bar>
        <timer-modal></timer-modal>
    </view>
</template>

<script lang="ts" setup>
import PageTimer from '@/components/page-timer.vue'
import FooterBar from '@/components/footer-bar.vue'
import TimerModal from '@/components/timer-modal.vue'
</script>

<style lang="scss" scoped>
.timer {
    width: 100vw;
    height: 100vh;
    background-color: var(--color-bg);
    color: var(--color-text);
}
</style>
