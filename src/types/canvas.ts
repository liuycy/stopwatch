import { useGlobalStore } from '@/stores/global';
import { getCurrentInstance } from 'vue';

export interface CanvasPainterOptions {
    canvasId: string;
    imageSrc?: string;
}

export abstract class CanvasPainter {
    cancelAnimationFrame!: WechatMiniprogram.Canvas['cancelAnimationFrame'];
    requestAnimationFrame!: WechatMiniprogram.Canvas['requestAnimationFrame'];
    image?: CanvasImageSource;
    ctx?: CanvasRenderingContext2D;
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

    initImage(canvas: WechatMiniprogram.Canvas) {
        return new Promise<CanvasImageSource | undefined>((resolve, reject) => {
            try {
                if (!this.options.imageSrc) return resolve(undefined);
                const image = canvas.createImage();
                image.src = this.options.imageSrc;
                image.onload = () => resolve(image as CanvasImageSource);
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

            const canvas = await this.queryCanvas(node);
            this.image = await this.initImage(canvas);
            this.requestAnimationFrame = canvas.requestAnimationFrame;
            this.cancelAnimationFrame = canvas.cancelAnimationFrame;
            this.canvasWidth = width!;
            this.canvasHeight = height!;
            canvas.width = this.dpr * width!;
            canvas.height = this.dpr * height!;

            const ctx = canvas.getContext('2d');
            ctx.scale(this.dpr, this.dpr);
            this.ctx = ctx;
        } catch (error) {
            this.ctx = undefined;
            throw error;
        }

        return this;
    }

    abstract draw(...args: any[]): void;
}
