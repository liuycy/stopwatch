<script setup lang="ts">
TODO_to_be_deleted_next_version();

function TODO_to_be_deleted_next_version() {
  try {
    const settings = uni.getStorageSync("settings");
    if (settings) {
      const old = JSON.parse(settings);
      const cur = {
        screenOn: old.keepScreenOn,
        reversed: old.isActionsReverse,
        history: old.historyVisible,
        trash: old.recycleBinEnabled,
        vibrateType: old.vibrateType,
        record: 0,
        timer: 0,
      };
      uni.setStorageSync("stopwatch-settings", cur);
      uni.removeStorageSync("settings");
    }

    const history = uni.getStorageSync("history");
    if (history) {
      const old = JSON.parse(history);
      uni.setStorageSync("history", old);
    }

    const tags = uni.getStorageSync("tags");
    if (tags) {
      const old = JSON.parse(tags);
      uni.setStorageSync("tags", old);
    }
  } catch {
    return;
  }
}

useRouter().register();
useSystem().register();
useSetting().register();
useHistory().register();
useTimer().register();
useTags().register();
</script>

<style>
page {
  width: 100vw;
  height: 100vh;
  font-size: 16rpx;
  color: var(--color-text);
  background-color: var(--color-bg);

  --color-bg: #000000;
  --color-bg2: #2c2c2c;
  --color-text: #ffffff;
  --color-text2: #5e6696;
  --color-border: #2b2b2b;
  --color-border2: #3a3a3a;
  --color-border3: #373737;
  --color-tips: #c6c6c6;
  --color-tips2: #767676;
  --color-line: #202020;
  --color-blur: rgba(0, 0, 0, 0.3);
  --color-mask: rgba(255, 255, 255, 0.15);
  --color-overlay: rgba(0, 0, 0, 0.6);
  --color-action: #3183f4;
  --color-green: #65ce67;
  --color-red: #ee534f;
}

.picker-view-remove-mask-bg {
  background: none;
}
.picker-view-remove-indicator-border::after {
  border: none;
}
.picker-view-remove-indicator-border::before {
  border: none;
}

.animate-fold {
  transform-origin: bottom center;
  animation: fold 0.5s ease-in;
}

@keyframes fold {
  from {
    transform: rotateX(0deg);
  }
  to {
    transform: rotateX(165deg);
  }
}

.animate-shaking {
  animation: 0.5s shaking infinite;
}

@keyframes shaking {
  0% {
    transform: rotate(0);
  }

  25% {
    transform: rotate(-10deg);
  }

  30% {
    transform: rotate(-15deg);
  }

  70% {
    transform: rotate(5deg);
  }

  100% {
    transform: rotate(0);
  }
}
</style>
