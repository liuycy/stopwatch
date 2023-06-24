import { formatDuration, formatTime, parseDuration } from '@/utils/format';
import { CanvasPainter, type CanvasPainterOptions } from '@/types/canvas';
import type { useTimerStore } from '@/stores/timer';

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

    draw(timer: ReturnType<typeof useTimerStore>) {
        if (!this.ctx) return;
        if (!timer.startAt) return;

        const w = this.canvasWidth;
        const h = this.canvasHeight;
        const part = timer.duration / (timer.endAt - timer.startAt);

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
        this.ctx.arc(0, 0, 0.4 * h, -0.5 * Math.PI, -0.5 * Math.PI + part * 2 * Math.PI);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.textAlign = 'center';
        this.ctx.font = `${0.18 * h}px "Courier New", Courier, monospace`;
        this.ctx.fillStyle = this.options.timeColor;
        this.ctx.fillText(formatDuration(parseDuration(timer.duration), { noMs: true }), 0, 0);

        this.ctx.beginPath();
        this.ctx.globalAlpha = timer.state === 'paused' ? 0.3 : 1;
        this.ctx.font = ` 18px "Courier New", Courier, monospace`;
        this.ctx.fillStyle = this.options.tipsColor;
        this.ctx.fillText(formatTime(timer.endAt, 'hh:MM'), 15, 45);

        if (this.image) {
            this.ctx.drawImage(this.image, -40, 30, 22, 22);
        }

        this.ctx.restore();
    }
}
