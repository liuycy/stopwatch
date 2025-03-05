export const useEgg = defineStore("utils-egg", () => {
  const state = reactive({
    crack: false,
    hits: 0,
  });

  const hit = () => {
    if (state.hits < 8) return (state.hits += 1);
    state.crack = true;
  };

  return { ...toRefs(state), state, hit };
});

export const useSystem = defineStore("utils-system", () => {
  const state = reactive({
    theme: ref<string>(),
  });

  const { safeAreaInsets, statusBarHeight } = uni.getWindowInfo();

  const register = () => {
    state.theme = uni.getAppBaseInfo().hostTheme;
    uni.onThemeChange((res) => (state.theme = res.theme));
  };

  return {
    ...toRefs(state),
    bottom: safeAreaInsets.bottom,
    top: 4 + (safeAreaInsets.top || statusBarHeight),

    register,
  };
});
