export class Painter {
  private static tid = -1;
  static cancelAnimationFrame = (id: number) => clearTimeout(id);
  static requestAnimationFrame = (callback: (...args: any[]) => any) => setTimeout(callback, 20);
  static keepDrawing = (options: { immediate?: boolean; loop: () => void; when?: () => boolean }) => {
    if (options.immediate) options.loop();
    ~(function start() {
      if (options.when?.() ?? true) options.loop();
      Painter.tid = Painter.requestAnimationFrame(start);
    })();
  };
  static stopDrawing = () => Painter.cancelAnimationFrame(Painter.tid);

  private static images = new Map<string, CanvasImageSource>();
  static getImageSource = (key: string) => Painter.images.get(key) as CanvasImageSource;
  static createImageSource = async (key: string, src: string) => {
    const img = await createImageSource(src);
    Painter.images.set(key, img);
    return img;
  };
}
