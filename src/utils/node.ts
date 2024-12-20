import { type Ref, getCurrentInstance, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

export function bindHeightFor(selector: string) {
    const instance = getCurrentInstance();
    const query = uni.createSelectorQuery().in(instance).select(selector);
    const result = new Promise(r => query.boundingClientRect(r).exec());

    return {
        to: async (ref: Ref<number>) => {
            const { height } = ((await result) as UniApp.NodeInfo) ?? {};
            ref.value = height ?? 0;
        },
    };
}

export function useNodesRects(selector: string) {
    const rects = ref<UniApp.NodeInfo[]>();

    onLoad(() => {
        const instance = getCurrentInstance();
        uni.createSelectorQuery()
            .in(instance)
            .selectAll(selector)
            .boundingClientRect(res => {
                rects.value = res as UniApp.NodeInfo[];
            })
            .exec();
    });

    return rects;
}

export function useScrollViewContext(selector: string) {
    const context = ref<WechatMiniprogram.ScrollViewContext>();

    onLoad(async () => {
        const instance = getCurrentInstance();
        uni.createSelectorQuery()
            .in(instance)
            .select(selector)
            .node(ref => {
                context.value = ref.node;
            })
            .exec();
    });

    return context;
}
