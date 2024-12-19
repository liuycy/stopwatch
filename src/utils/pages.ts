const PageURLs = {
    QuickTags: '/pages/index/quick-tags',
    RecycleBin: '/pages/index/recycle-bin',
    Stopwatch: '/pages/index/stopwatch',
    Timer: '/pages/index/timer',
    TimerFullscreen: '/pages/index/timer-fullscreen',
};

export function pageTo(page: keyof typeof PageURLs) {
    return uni.reLaunch({ url: PageURLs[page] });
}
