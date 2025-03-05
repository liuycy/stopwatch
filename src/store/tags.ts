export const useTags = defineStore("tags", () => {
  const state = reactive({
    searching: { byconfm: false, focus: false, key: "" },
    changing: ref<{ tag: Tag; tobecofm: string; focus: boolean }>(),
    binding: new Set<number>(),
    list: [] as Tag[],
  });

  const register = () => {
    const key = "tags";
    watch(state, () => uni.setStorage({ key, data: { list: state.list } }));
    uni.getStorage({ key, success: (res) => Object.assign(state, res.data) });
  };

  const searchreset = async () => {
    if (!state.searching.byconfm) {
      await new Promise((r) => setTimeout(r, 200));
      state.searching.focus = false;
      state.searching.key = "";
      return;
    }

    state.searching.byconfm = false;
    state.searching.focus = false;
    state.searching.key = "";
  };

  const searchadd = (byconfm = false) => {
    state.searching.byconfm = byconfm;
    if (!state.searching.focus) state.searching.focus = true;
    if (!state.searching.key) return;
    state.list.unshift({ id: Date.now(), color: getRandomHex(), text: state.searching.key });
  };

  const change = async (tag: Tag) => {
    state.changing = { tag, focus: false, tobecofm: tag.text };
    await new Promise((r) => setTimeout(r, 200));
    if (!state.changing.focus) state.changing.focus = true;
  };

  const remove = (tag: Tag) => {
    const idx = state.list.findIndex((t) => t.id === tag.id);
    if (idx === -1) return;
    state.list.splice(idx, 1);
  };

  const confirm = () => {
    if (!state.changing) return;
    state.changing.tag.text = state.changing.tobecofm;
    state.changing = undefined;
  };

  return {
    ...toRefs(state),

    searchadd,
    searchreset,
    remove,
    change,
    confirm,
    register,
  };
});
