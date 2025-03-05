const Pages = {
  clock: "/pages-clock/main/main",
  stopwatch: "/pages-stopwatch/main/main",
  trash: "/pages-stopwatch/trash/trash",
  tagsview: "/pages-stopwatch/tagsview/tagsview",
  tags: "/pages-stopwatch/tags/tags",
  timer: "/pages-timer/main/main",
};

const SubModules = (() => {
  const skeys: pkey[] = ["stopwatch", "timer", "clock"];
  const smods = Object.entries(Pages).filter((p) => skeys.includes(p[0] as pkey));
  return Object.fromEntries(smods);
})();

export type pkey = keyof typeof Pages;

const RouteTypes = {
  zoom: "wx://zoom",
  upwards: "wx://upwards",
  modal: "wx://cupertino-modal-inside",
};

export const useRouter = defineStore("router", () => {
  const state = reactive({
    lastmod: ref<pkey>(),
  });

  const register = () => {
    state.lastmod = uni.getStorageSync("router-lastmod") || "stopwatch";
    watchEffect(() => uni.setStorage({ key: "router-lastmod", data: state.lastmod }));
  };

  const back = () => uni.navigateBack();

  const modto = (key: pkey) => {
    if (key in SubModules) state.lastmod = key;
    return uni.reLaunch({ url: SubModules[key] });
  };

  const to = (key: keyof typeof Pages, opts?: { routype?: keyof typeof RouteTypes }) => {
    return uni.navigateTo({
      routeType: opts?.routype ? RouteTypes[opts.routype] : RouteTypes.zoom,
      url: Pages[key],
    });
  };

  return { ...toRefs(state), register, back, modto, to };
});
