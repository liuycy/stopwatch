<template>
  <view class="box-border px-4 h-110rpx w-750rpx -translate-y-75rpx" un-flex="~ justify-between">
    <action-btn label="取消" color="gray" :disabled="timer.status === 'stopped'" @click="timer.stop" />
    <template v-if="timer.status === 'stopped'">
      <action-btn label="开始" color="green" :disabled="timer.startDisabled" @click="timer.start" />
    </template>
    <template v-else>
      <action-btn label="暂停" color="orange" @click="timer.pause" v-if="timer.status === 'running'" />
      <action-btn label="继续" color="green" @click="timer.start" v-else />
    </template>
  </view>
</template>

<script lang="ts" setup>
const timer = useTimer();
onUnload(() => timer.reset());
</script>
