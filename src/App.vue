<script lang="ts" setup>
import { useGlobalStore } from '@/stores/global'
import { useSettingsLanuch } from '@/stores/settings'
import { useHistoryLaunch } from '@/stores/history'

useGlobalStore()
useSettingsLanuch()
useHistoryLaunch()
</script>

<style lang="scss">
page,
root-portal {
    // font-family: Arial, Helvetica, sans-serif;
    font-family: Arial;

    --color-bg: #000;
    --color-text: #fff;
    --color-tips: #c6c6c6;
    --color-line: #202020;
    --color-border: #2b2b2b;
    --color-blur: rgba(0, 0, 0, 0.3);

    --color-green: #65ce67;
    --color-green-bg: #112813;
    --color-green-hover: #081609;

    --color-red: #ee534f;
    --color-red-bg: #2d100c;
    --color-red-hover: #180808;

    --color-orange: #efa448;
    --color-orange-bg: #30200a;
    --color-orange-hover: #191103;

    --color-gray-bg: #333;
    --color-gray-hover: #1b1b1b;

    --color-panel-bg: #f7f7f7;
    --color-panel-action-bg: #fff;
    --color-panel-cancel-border: #e6e6e6;
    --color-panel-cancel-text: #5e6696;
    --color-panel-text: #000;
    --color-panel-label: #999;
    --color-panel-label-highlight: #27bd2d;

    --color-overlay: rgba(0, 0, 0, 0.6);
    --color-modal-bg: #2c2c2c;
    --color-modal-text: #fff;
    --color-modal-confirm-text: #5e6696;
    --color-modal-border: #373737;

    --color-recycle-action: #3183f4;
    --color-recycle-tips: #767676;
    --color-recycle-border: #3a3a3a;

    --color-mask-bar: rgba(255, 255, 255, 0.2);
}

@media (prefers-color-scheme: dark) {
    page {
        --color-panel-bg: #1e1e1e;
        --color-panel-action-bg: #2c2c2c;
        --color-panel-cancel-border: #202020;
        --color-panel-cancel-text: #7e88a1;
        --color-panel-text: #808080;
        --color-panel-label: #999;
        --color-panel-label-highlight: #26c067;
    }
}

.picker-mask {
    background: none;
}

.picker-indicator {
    &::after {
        border: none;
    }

    &::before {
        border: none;
    }
}
</style>
