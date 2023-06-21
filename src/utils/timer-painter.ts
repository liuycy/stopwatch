import { CanvasPainter, type CanvasPainterOptions } from '@/types/canvas';
import { formatDuration, formatTime, parseDuration } from './format';

interface TimerPainterOptions extends CanvasPainterOptions {
    timeColor: string;
    tipsColor: string;
    circleColor: string;
    circleBgColor: string;
}

export class TimerPainter extends CanvasPainter {
    static create(options: TimerPainterOptions) {
        return new TimerPainter(options).init();
    }

    options: TimerPainterOptions;

    constructor(options: TimerPainterOptions) {
        super(options);
        this.options = { ...super.options, ...options };
    }

    draw(startAt: number, endAt: number, duration: number) {
        if (!this.ctx) return;
        if (!startAt) return;

        const w = this.canvasWidth;
        const h = this.canvasHeight;

        this.ctx.clearRect(0, 0, w, h);

        this.ctx.save();
        this.ctx.translate(0.5 * w, 0.58 * h);

        this.ctx.beginPath();
        this.ctx.lineWidth = 0.02 * h;
        this.ctx.strokeStyle = this.options.circleBgColor;
        this.ctx.arc(0, 0, 0.4 * h, 0, 2 * Math.PI);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = this.options.circleColor;
        this.ctx.arc(0, 0, 0.4 * h, -0.5 * Math.PI, -0.5 * Math.PI + (duration / (endAt - startAt)) * 2 * Math.PI);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.textAlign = 'center';
        this.ctx.font = `${0.18 * h}px Arial`;
        this.ctx.fillStyle = this.options.timeColor;
        this.ctx.fillText(formatDuration(parseDuration(duration), { noMs: true }), 0, 0);

        this.ctx.beginPath();
        this.ctx.font = ` 18px Arial`;
        this.ctx.fillStyle = this.options.tipsColor;
        this.ctx.fillText(formatTime(endAt, 'hh:MM'), 15, 45);

        if (this.image) {
            this.ctx.drawImage(this.image, -32, 28, 22, 22);
        }

        this.ctx.restore();
    }
}
