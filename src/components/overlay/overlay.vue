<template>
  <view
    v-if="vsble"
    un-flex="~ justify-center items-center"
    class="absolute top-0 left-0 h-screen w-screen bg-[--color-overlay] text-#ffffff"
    @click="$emit('clickoverlay')"
  >
    <view @click.stop="() => {}" class="content" :class="[position, enterclass]" v-if="show">
      <slot></slot>
    </view>
    <view @click.stop="() => {}" class="content" :class="[position, leaveclass]" v-else>
      <slot></slot>
    </view>
  </view>
</template>

<script lang="ts" setup>
defineOptions({ options: { virtualHost: true, styleIsolation: "shared" } });

const vsble = ref(false);
const props = defineProps<{
  position?: "top" | "bottom";
  show?: boolean;
}>();

watchEffect(() => {
  if (props.show) return (vsble.value = true);
  setTimeout(() => (vsble.value = false), 200);
});

const enterclass = computed(() => {
  if (props.position === "bottom") return "slideup-enter";
  if (props.position === "top") return "slidedown-enter";
  return "fadein";
});

const leaveclass = computed(() => {
  if (props.position === "bottom") return "slidedown-leave";
  if (props.position === "top") return "slideup-leave";
  return "fadeout";
});
</script>

<style scoped>
.content {
  animation-duration: 0.2s;
  animation-timing-function: ease;
  will-change: transform, opacity;
}

.content.top {
  position: absolute;
  top: 0;
}

.content.bottom {
  position: absolute;
  bottom: 0;
}

.content.fadein {
  animation-name: fadein;
}
@keyframes fadein {
  from {
    opacity: 0.1;
    transform: scale(0.1);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.content.fadeout {
  animation-name: fadeout;
}
@keyframes fadeout {
  from {
    opacity: 0.9;
    transform: scale(0.9);
  }
  to {
    opacity: 0;
    transform: scale(0);
  }
}

.content.slideup-enter {
  animation-name: slideup-enter;
}
@keyframes slideup-enter {
  from {
    opacity: 0.1;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content.slideup-leave {
  animation-name: slideup-leave;
}
@keyframes slideup-leave {
  from {
    opacity: 0.9;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-100%);
  }
}

.content.slidedown-enter {
  animation-name: slidedown-enter;
}
@keyframes slidedown-enter {
  from {
    opacity: 0.1;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content.slidedown-leave {
  animation-name: slidedown-leave;
}
@keyframes slidedown-leave {
  from {
    opacity: 0.9;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
}
</style>
