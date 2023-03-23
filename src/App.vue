<script lang="ts" setup>
    import {
        onLaunch
    } from '@dcloudio/uni-app'

    onLaunch((options) => {
        console.log(options)
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
}
</style>
