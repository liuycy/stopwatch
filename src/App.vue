<script lang="ts" setup>
import { onLaunch } from '@dcloudio/uni-app'

import { useSettings } from '@/stores/settings'

const settings = useSettings()

settings.$subscribe((_, state) => {
    const data = JSON.stringify(state)
    uni.setStorage({ key: 'settings', data })
})

onLaunch(() => {
    uni.setKeepScreenOn({ keepScreenOn: true })

    const data = uni.getStorageSync('settings')
    if (!data) return

    settings.$patch(JSON.parse(data))
    uni.setKeepScreenOn({ keepScreenOn: settings.keepScreenOn })
})
</script>

<style lang="scss">
page {
    // font-family: Arial, Helvetica, sans-serif;
    font-family: Arial;

    --color-bg: #000;
    --color-text: #fff;
    --color-line: #202020;
    --color-border: #2b2b2b;

    --color-green: #65ce67;
    --color-green-bg: #112813;
    --color-green-hover: #081609;

    --color-red: #ee534f;
    --color-red-bg: #2d100c;
    --color-red-hover: #180808;

    --color-gray-bg: #333;
    --color-gray-hover: #1b1b1b;

    --color-panel-bg: #f7f7f7;
    --color-panel-action-bg: #fff;
    --color-panel-cancel-border: #e6e6e6;
    --color-panel-cancel-text: #5e6696;
    --color-panel-text: #000;
    --color-panel-label: #999;
    --color-panel-label-highlight: #27bd2d;
}
</style>
