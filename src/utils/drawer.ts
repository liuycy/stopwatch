import { formatDuration } from '@/utils/format';
import type { Duration } from '@/types/time';

interface DrawerOptions {
    instance: any;
    canvasId: string;
    bgColor: string;
    color: string;
    secondaryColor: string;
    pointerColor: string;
    durationPointerColor: string;
}

export class Drawer {
    static async create(options: DrawerOptions) {
        return new Drawer(options).init();
    }

    dpr!: number;
    width!: number;

    ctx?: CanvasRenderingContext2D;
    cancelAnimationFrame!: (id: number) => void;
    requestAnimationFrame!: (fn: Function) => number;

    options: DrawerOptions;

    constructor(options: DrawerOptions) {
        this.options = options;
    }

    async init() {
        this.initWindow();
        //#ifdef MP-WEIXIN
        await this.initContext();
        return this;
        //#endif
        //#ifndef MP-WEIXIN
        throw new Error('需要实现 initContext');
        //#endif
    }

    initWindow() {
        const info = uni.getWindowInfo();
        this.dpr = info.pixelRatio;
        this.width = info.screenWidth;
    }

    async initContext() {
        const { instance, canvasId } = this.options;

        try {
            const query = wx.createSelectorQuery().in(instance).select(`#${canvasId}`);
            const info: any = await new Promise(r => query.fields({ size: true, node: true }).exec(r));
            const canvas = info[0].node;
            const renderWidth = info[0].width;
            const renderHeight = info[0].height;
            const ctx = canvas.getContext('2d');
            this.requestAnimationFrame = canvas.requestAnimationFrame;
            this.cancelAnimationFrame = canvas.cancelAnimationFrame;
            canvas.width = renderWidth * this.dpr;
            canvas.height = renderHeight * this.dpr;
            ctx.scale(this.dpr, this.dpr);

            this.ctx = ctx;
        } catch (error) {
            this.ctx = undefined;
            throw error;
        }
    }

    drawSecondsDial(duration: Duration) {
        const { color, secondaryColor } = this.options;
        const center = this.width / 2;
        const ctx = this.ctx!;

        ctx.save();
        ctx.translate(center, center);
        ctx.lineWidth = 2;

        // 画指针刻度
        ctx.beginPath();
        ctx.strokeStyle = color;
        for (let i = 0; i < 12; i++) {
            ctx.moveTo(center - 20, 0);
            ctx.lineTo(center - 35, 0);
            ctx.rotate(Math.PI / 6);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = secondaryColor;
        for (let i = 0; i < 60 * 4; i++) {
            if (i % 20 !== 0) {
                if (i % 4 === 0) {
                    ctx.moveTo(center - 20, 0);
                    ctx.lineTo(center - 35, 0);
                } else {
                    ctx.moveTo(center - 20, 0);
                    ctx.lineTo(center - 28, 0);
                }
            }
            ctx.rotate(Math.PI / 120);
        }
        ctx.stroke();

        // 画刻度文字标签
        ctx.beginPath();
        const fontSize = 0.08 * this.width;
        const distance = center - fontSize - 25;
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        for (let i = 0; i < 12; i++) {
            const angle = -Math.PI / 2 + (Math.PI / 6) * i;
            const x = distance * Math.cos(angle);
            const y = distance * Math.sin(angle);
            ctx.fillText(i === 0 ? '60' : `${5 * i}`, x, y);
        }
        // 画文字时间戳
        ctx.font = `${fontSize * 0.7}px Arial`;
        ctx.fillText(formatDuration(duration), 0, center * 0.35);

        ctx.restore();
    }

    drawMinutesDial() {
        const { color, secondaryColor } = this.options;
        const center = this.width / 2;
        const radius = center * 0.25;
        const ctx = this.ctx!;

        ctx.save();
        ctx.translate(center, center * 0.67);
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.strokeStyle = color;
        for (let i = 0; i < 6; i++) {
            ctx.moveTo(0, radius);
            ctx.lineTo(0, radius - 8);
            ctx.rotate(Math.PI / 3);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = secondaryColor;
        for (let i = 0; i < 60; i++) {
            if (i % 10 !== 0) {
                if (i % 2 === 0) {
                    ctx.moveTo(0, radius);
                    ctx.lineTo(0, radius - 8);
                } else {
                    ctx.moveTo(0, radius);
                    ctx.lineTo(0, radius - 4);
                }
            }
            ctx.rotate(Math.PI / 30);
        }
        ctx.stroke();

        ctx.beginPath();
        const fontSize = 0.3 * radius;
        const distance = radius - 18;
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < 6; i++) {
            const angle = -Math.PI / 2 + (Math.PI / 3) * i;
            const x = distance * Math.cos(angle);
            const y = distance * Math.sin(angle);
            ctx.fillText(i === 0 ? '30' : `${5 * i}`, x, y);
        }

        ctx.restore();
    }

    drawMinutesPointer(duration: Duration) {
        const { pointerColor } = this.options;
        const center = this.width / 2;
        const radius = center * 0.25;
        const ctx = this.ctx!;

        ctx.save();
        ctx.translate(center, center * 0.67);

        ctx.beginPath();
        ctx.lineWidth = 2;

        ctx.fillStyle = pointerColor;
        ctx.arc(0, 0, 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = pointerColor;
        ctx.rotate((Math.PI / 900) * ((duration.seconds + ~~duration.minutes * 60) % 1800));
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius);
        ctx.stroke();

        ctx.restore();
    }

    drawSecondsPointer(duration: Duration) {
        const { bgColor, pointerColor } = this.options;
        const center = this.width / 2;
        const ctx = this.ctx!;

        ctx.save();
        ctx.translate(center, center);
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.strokeStyle = pointerColor;
        ctx.rotate((Math.PI / 30000) * duration.milliseconds);
        ctx.moveTo(0, center * 0.1);
        ctx.lineTo(0, -center + 20);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = pointerColor;
        ctx.arc(0, 0, 4, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = bgColor;
        ctx.arc(0, 0, 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }

    drawDurationPointer(duration?: Duration) {
        if (!duration) return;

        const { bgColor, durationPointerColor } = this.options;
        const center = this.width / 2;
        const ctx = this.ctx!;

        ctx.save();
        ctx.translate(center, center);
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.strokeStyle = durationPointerColor;
        ctx.rotate((Math.PI / 30000) * duration.milliseconds);
        ctx.moveTo(0, center * 0.1);
        ctx.lineTo(0, -center + 20);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = bgColor;
        ctx.arc(0, 0, 2, 0, 2 * Math.PI);
        ctx.fill();

        ctx.restore();
    }

    draw(dialStatus: Duration, duration?: Duration) {
        this.ctx!.clearRect(0, 0, this.width, this.width);

        this.drawSecondsDial(dialStatus);
        this.drawMinutesDial();
        this.drawMinutesPointer(dialStatus);
        this.drawDurationPointer(duration);
        this.drawSecondsPointer(dialStatus);
    }
}
