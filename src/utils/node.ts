import { type Ref, getCurrentInstance } from 'vue';

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
