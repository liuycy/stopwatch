import { onLaunch } from '@dcloudio/uni-app';
import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import { getRandomHex } from '@/utils/color';

import type { Tag } from '@/types/time';

type ChangingTag = Tag & {
    confirm: () => void;
};

export const useTagsStore = defineStore('tags', () => {
    const list = ref<Tag[]>([]);
    const changing = ref<ChangingTag>();
    const binding = ref(new Set<number>());
    const bindingList = computed(() => list.value.filter(t => !binding.value.has(t.id)));
    const searchKey = ref('');
    const searchList = computed(() => list.value.filter(t => t.text.includes(searchKey.value)));

    function add(text: string) {
        list.value.unshift({ text, id: Date.now(), color: getRandomHex() });
    }

    function addFromSearch() {
        if (searchKey.value === '') return;
        add(searchKey.value);
        searchKey.value = '';
    }

    function remove(tag: Tag) {
        const idx = list.value.findIndex(t => t.id === tag.id);
        if (idx === -1) return;
        list.value.splice(idx, 1);
    }

    function change(tag: Tag) {
        changing.value = {
            ...tag,
            confirm() {
                if (!changing.value) return;
                const ntag = changing.value;
                const idx = list.value.findIndex(t => t.id === ntag.id);
                if (idx === -1) return;
                list.value.splice(idx, 1, ntag);
                changing.value = undefined;
            },
        };
    }

    return {
        list,
        changing,
        binding,
        bindingList,
        searchKey,
        searchList,

        add,
        addFromSearch,
        remove,
        change,
    };
});

export const useTagsLaunch = () => {
    const tags = useTagsStore();

    tags.$subscribe((_, state) => {
        const { list } = state;
        const data = JSON.stringify({ list });
        uni.setStorage({ key: 'tags', data });
    });

    onLaunch(() => {
        const data = uni.getStorageSync('tags');
        if (!data) return;
        tags.$patch(JSON.parse(data));
    });
};
