import { formatDuration, formatTime, parseDuration } from '@/utils/format';
import { CanvasPainter, type CanvasPainterOptions } from '@/types/canvas';
import type { useTimerStore } from '@/stores/timer';

type Timer = ReturnType<typeof useTimerStore>;

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

    drawCircleBg(w: number, h: number) {
        this.ctx!.beginPath();
        this.ctx!.lineWidth = 0.02 * h;
        this.ctx!.strokeStyle = this.options.circleBgColor;
        this.ctx!.arc(0, 0, 0.4 * h, 0, 2 * Math.PI);
        this.ctx!.stroke();
    }

    drawReverseCircle(w: number, h: number, timer: Timer) {
        const part = timer.duration / (timer.endAt - timer.startAt);
        this.ctx!.beginPath();
        this.ctx!.lineCap = 'round';
        this.ctx!.strokeStyle = this.options.circleColor;
        this.ctx!.arc(0, 0, 0.4 * h, -0.5 * Math.PI, -0.5 * Math.PI + part * 2 * Math.PI);
        this.ctx!.stroke();
    }

    drawCircle4Seconds(w: number, h: number, timer: Timer) {
        const part = (timer.duration % 60000) / 60000;
        this.ctx!.beginPath();
        this.ctx!.lineCap = 'round';
        this.ctx!.strokeStyle = this.options.circleColor;
        this.ctx!.arc(0, 0, 0.4 * h, -0.5 * Math.PI, -0.5 * Math.PI + part * 2 * Math.PI);
        this.ctx!.stroke();
    }

    drawDuration(w: number, h: number, timer: Timer) {
        const duration = parseDuration(timer.duration);
        const fontSize = duration.hours ? 0.12 * h : 0.18 * h;

        this.ctx!.beginPath();
        this.ctx!.textAlign = 'center';
        this.ctx!.font = `${fontSize}px "Courier New", Courier, monospace`;
        this.ctx!.fillStyle = this.options.timeColor;
        this.ctx!.fillText(formatDuration(duration, { noMs: true }), 0, 0);
    }

    drawEndtime(timer: Timer) {
        this.ctx!.beginPath();
        this.ctx!.globalAlpha = timer.state === 'paused' ? 0.3 : 1;
        this.ctx!.font = ` 18px "Courier New", Courier, monospace`;
        this.ctx!.fillStyle = this.options.tipsColor;

        if (this.image) {
            this.ctx!.fillText(formatTime(timer.endAt, 'hh:MM'), 15, 45);
            this.ctx!.drawImage(this.image, -40, 30, 22, 22);
        } else {
            this.ctx!.fillText(formatTime(timer.endAt, 'hh:MM'), 0, 45);
        }
    }

    drawStartime(timer: Timer) {
        if (!timer.firstStartAt) return;
        this.ctx!.beginPath();
        this.ctx!.font = ` 18px "Courier New", Courier, monospace`;
        this.ctx!.fillStyle = this.options.tipsColor;
        this.ctx!.fillText(formatTime(timer.firstStartAt, 'hh:MM'), 0, 45);
    }

    draw(timer: Timer, isReverseTimer = true) {
        if (!this.ctx) return;

        const w = this.canvasWidth;
        const h = this.canvasHeight;

        this.ctx.clearRect(0, 0, w, h);
        this.ctx.save();
        this.ctx.translate(0.5 * w, 0.58 * h);

        this.drawCircleBg(w, h);

        if (isReverseTimer) {
            this.drawReverseCircle(w, h, timer);
            this.drawDuration(w, h, timer);
            this.drawEndtime(timer);
        } else {
            this.drawCircle4Seconds(w, h, timer);
            this.drawDuration(w, h, timer);
            this.drawStartime(timer);
        }

        this.ctx.restore();
    }
}
