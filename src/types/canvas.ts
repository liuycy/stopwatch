import { useGlobalStore } from '@/stores/global';
import { getCurrentInstance } from 'vue';

export interface CanvasPainterOptions {
    canvasId: string;
}

export abstract class CanvasPainter {
    private images = new Map<string, WechatMiniprogram.Image>();

    cancelAnimationFrame!: WechatMiniprogram.Canvas['cancelAnimationFrame'];
    requestAnimationFrame!: WechatMiniprogram.Canvas['requestAnimationFrame'];
    ctx?: WechatMiniprogram.CanvasRenderingContext.CanvasRenderingContext2D;
    background?: WechatMiniprogram.ImageData;
    canvas?: WechatMiniprogram.Canvas;
    image?: WechatMiniprogram.Image;
    canvasHeight!: number;
    canvasWidth!: number;

    dpr: number;
    options: CanvasPainterOptions;

    constructor(options: CanvasPainterOptions) {
        this.dpr = useGlobalStore().pixelRatio;
        this.options = options;
    }

    querySize(nodesRef: UniApp.NodesRef) {
        return new Promise<UniApp.NodeInfo>((resolve, reject) => {
            try {
                nodesRef
                    .fields({ size: true }, v => {
                        if (Array.isArray(v)) {
                            return reject(`CanvasPainter.initSize(): too many nodes`);
                        }

                        resolve(v);
                    })
                    .exec();
            } catch (error) {
                reject(error);
            }
        });
    }

    queryCanvas(nodesRef: UniApp.NodesRef) {
        return new Promise<WechatMiniprogram.Canvas>((resolve, reject) => {
            try {
                nodesRef.node(res => resolve(res.node)).exec();
            } catch (error) {
                reject(error);
            }
        });
    }

    setCurrentImage(key?: string) {
        if (!key) this.image = undefined;
        else this.image = this.images.get(key);
    }

    createImage(key: string, src: string) {
        return new Promise<WechatMiniprogram.Image | undefined>((resolve, reject) => {
            try {
                if (!this.canvas) return reject(new Error('no canvas'));
                const image = this.canvas.createImage();
                image.src = src;
                image.onload = () => {
                    this.images.set(key, image);
                    resolve(image);
                };
                image.onerror = reject;
            } catch (error) {
                reject(error);
            }
        });
    }

    async init() {
        const { canvasId } = this.options;
        const instance = getCurrentInstance();

        try {
            const node = uni.createSelectorQuery().in(instance).select(`#${canvasId}`);
            const { width, height } = await this.querySize(node);

            this.canvas = await this.queryCanvas(node);
            this.requestAnimationFrame = this.canvas.requestAnimationFrame;
            this.cancelAnimationFrame = this.canvas.cancelAnimationFrame;
            this.canvas.height = this.dpr * height!;
            this.canvas.width = this.dpr * width!;
            this.canvasHeight = height!;
            this.canvasWidth = width!;

            this.ctx = this.canvas.getContext('2d');
            this.ctx.scale(this.dpr, this.dpr);
        } catch (error) {
            this.ctx = undefined;
            throw error;
        }

        return this;
    }

    abstract draw(...args: any[]): void;
}
