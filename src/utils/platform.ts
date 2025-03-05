export const monoFonts =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

export const serifFonts = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

export const createImageSource = (src: string) => {
  const canvas = wx.createOffscreenCanvas({ type: "2d" });
  const img = canvas.createImage();
  img.src = src;
  return new Promise<CanvasImageSource>((resolve, reject) => {
    img.onload = () => resolve(img as any);
    img.onerror = reject;
  });
};

export const getOffscreenCRContext = (options: { width: number; height: number }) => {
  let ctx: OffscreenCanvasRenderingContext2D;
  const canvas = wx.createOffscreenCanvas({ type: "2d", ...options });
  ctx = canvas.getContext("2d");
  return { ctx };
};

export const queryCanvasEnv = async (selector: string, instance?: unknown) => {
  return new Promise<{
    ctx: CanvasRenderingContext2D;
    renderWidth: number;
    renderHeight: number;
    requestAnimationFrame(callback: (...args: any[]) => any): number;
    cancelAnimationFrame(requestID: number): void;
  }>((resolve, reject) => {
    const _this = (instance ?? wx) as WechatMiniprogram.Wx;
    const ref = _this.createSelectorQuery().select(selector);
    ref.fields({ node: true, size: true }).exec((res) => {
      const { node, height, width } = res[0];
      const canvas = node as WechatMiniprogram.Canvas;
      const ctx = canvas.getContext("2d");
      const renderHeight = height;
      const renderWidth = width;

      const dpr = wx.getWindowInfo().pixelRatio;
      canvas.width = renderWidth * dpr;
      canvas.height = renderHeight * dpr;
      ctx.scale(dpr, dpr);

      resolve({
        renderWidth,
        renderHeight,
        ctx: ctx as unknown as CanvasRenderingContext2D,
        requestAnimationFrame: canvas.requestAnimationFrame,
        cancelAnimationFrame: canvas.cancelAnimationFrame,
      });
    });
  });
};

export class WebAudio {
  context: WechatMiniprogram.InnerAudioContext;

  constructor(src: string) {
    this.context = wx.createInnerAudioContext({ useWebAudioImplement: true });
    this.context.loop = true;
    this.context.src = src;
  }
}

export class BgAudio {
  static fs = wx.getFileSystemManager();
  static context?: WechatMiniprogram.BackgroundAudioManager;
  static files = new Map<string, Promise<string>>();
  static playurl = Promise.resolve("");

  static destory() {
    this.playurl = Promise.resolve("");
    this.context?.stop();
    this.context = undefined;
  }

  static stop() {
    this.context?.pause();
  }

  static async play(key: string | number) {
    if (!this.context) return;
    if (typeof key === "number") key = key == 2 ? "quick" : "slow";
    this.playurl = this.files.get(key)!;
    this.context.src = await this.playurl;
  }

  static create(opts: { files: Record<string, string> }) {
    for (let key in opts.files) this.files.set(key, this.build(opts.files[key]));
    this.context = wx.getBackgroundAudioManager();
    this.init();
  }

  static async init() {
    this.context!.title = "Excel秒表计时器";
    this.context!.onStop(() => uni.$emit("bgaudio-stop"));
    this.context!.onEnded(async () => {
      if (!this.context) return;
      this.context.src = await this.playurl;
    });
  }

  static clearBuilds() {
    const fs = this.fs;
    const dirPath = `${wx.env.USER_DATA_PATH}/mp3`;
    return new Promise((success, fail) => {
      fs.rmdir({ dirPath, success, fail, recursive: true });
    });
  }

  static async build(filePath: string) {
    const fs = this.fs;
    const [filename] = filePath.match(/\w+\.mp3$/)!;
    const dirPath = `${wx.env.USER_DATA_PATH}/mp3`;
    const path = `${dirPath}/${filename}`;

    try {
      await new Promise((success, fail) => fs.access({ path, success, fail }));
      return path;
    } catch (error: any) {
      if (!/no such file/.test(error.errMsg)) throw error;
    }

    try {
      await new Promise((success, fail) => fs.mkdir({ success, fail, dirPath }));
    } catch (error: any) {
      if (!/exists/.test(error.errMsg)) throw error;
    }

    const res = await new Promise((success, fail) => fs.readFile({ success, fail, filePath }));
    const { data } = res as { data: ArrayBuffer };

    await new Promise((success, fail) => fs.writeFile({ success, fail, data, filePath: path, encoding: "binary" }));

    return path;
  }
}
