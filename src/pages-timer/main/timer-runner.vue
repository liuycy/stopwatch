<template>
  <view class="h-750rpx w-750rpx flex justify-center items-center">
    <canvas class="h-full w-full" id="timer" type="2d"></canvas>
  </view>
</template>

<script lang="ts" setup>
const instance = getCurrentInstance();
const timer = useTimer();

onUnmounted(() => TimerPainter.stopDrawing());
onMounted(async () => {
  const env = await queryCanvasEnv("#timer", instance?.proxy);
  if (!env.ctx) return console.warn("can not query canvas");
  TimerPainter.cancelAnimationFrame = env.cancelAnimationFrame;
  TimerPainter.requestAnimationFrame = env.requestAnimationFrame;
  await TimerPainter.createImageSource("ring", "/static/icon-phone-ring.png");
  await TimerPainter.createImageSource("shake", "/static/icon-phone-shake.png");

  const painter = new TimerPainter({
    ...env,
    timer,
    colors: {
      time: "#fff",
      tips: "#999",
      ring: "#eca449",
      ringbg: "#262628",
    },
  });

  TimerPainter.keepDrawing({
    when: () => timer.status === "running",
    loop: () => painter.draw(),
  });

  watchEffect(() => {
    painter.tiplogo = undefined;
    if (timer.settings.vibrate) painter.tiplogo = TimerPainter.getImageSource("shake");
    if (timer.settings.ring) painter.tiplogo = TimerPainter.getImageSource("ring");
    if (timer.status === "stopped") painter.draw();
  });
});

class TimerPainter<
  Opts extends {
    timer: ReturnType<typeof useTimer>;
    renderHeight: number;
    renderWidth: number;
    ctx: CanvasRenderingContext2D;
    colors: {
      time: string;
      tips: string;
      ring: string;
      ringbg: string;
    };
  },
> extends Painter {
  options: Opts;
  tiplogo?: CanvasImageSource;

  constructor(options: Opts) {
    super();
    this.options = options;
  }

  draw() {
    const { ctx, timer, renderWidth: w, renderHeight: h } = this.options;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.translate(0.5 * w, 0.58 * h);

    this.drawCircleBg();
    if (timer.settings.reversed) {
      this.drawReverseCircle();
      this.drawDuration();
      this.drawEndtime();
    } else {
      this.drawCircle4Seconds();
      this.drawDuration();
      this.drawStartime();
    }

    ctx.restore();
  }

  drawCircleBg() {
    const { ctx, colors, renderHeight: h } = this.options;

    ctx.beginPath();
    ctx.lineWidth = 0.02 * h;
    ctx.strokeStyle = colors.ringbg;
    ctx.arc(0, 0, 0.4 * h, 0, 2 * Math.PI);
    ctx.stroke();
  }

  drawReverseCircle() {
    const { ctx, timer, colors, renderHeight: h } = this.options;
    const part = timer.duration / (timer.endAt - timer.startAt);

    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.strokeStyle = colors.ring;
    ctx.arc(0, 0, 0.4 * h, -0.5 * Math.PI, -0.5 * Math.PI + part * 2 * Math.PI);
    ctx.stroke();
  }

  drawCircle4Seconds() {
    const { ctx, timer, colors, renderHeight: h } = this.options;
    const part = (timer.duration % 60000) / 60000;

    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.strokeStyle = colors.ring;
    ctx.arc(0, 0, 0.4 * h, -0.5 * Math.PI, -0.5 * Math.PI + part * 2 * Math.PI);
    ctx.stroke();
  }

  drawDuration() {
    const { ctx, timer, colors, renderHeight: h } = this.options;
    const duration = parseDuration(timer.duration);
    const fontSize = duration.hours ? 0.12 * h : 0.18 * h;

    ctx.beginPath();
    ctx.textAlign = "center";
    ctx.font = `${fontSize}px ${monoFonts}`;
    ctx.fillStyle = colors.time;
    ctx.fillText(formatDuration(duration, { noColon: true }), 0, 0);
    ctx.font = `${0.8 * fontSize}px ${serifFonts}`;
    ctx.fillText(":", 0, -10);
  }

  drawStartime() {
    const { ctx, timer, colors } = this.options;
    if (!timer.firstStartAt) return;

    ctx.beginPath();
    ctx.font = `18px ${serifFonts}`;
    ctx.fillStyle = colors.tips;
    ctx.fillText(formatTime(timer.firstStartAt, "hh:MM"), 0, 55);
  }

  drawEndtime() {
    const { ctx, timer, colors } = this.options;

    ctx.beginPath();
    ctx.globalAlpha = timer.status === "paused" ? 0.3 : 1;
    ctx.font = `18px ${serifFonts}`;
    ctx.fillStyle = colors.tips;

    if (this.tiplogo) {
      ctx.fillText(formatTime(timer.endAt, "hh:MM"), 15, 55);
      ctx.drawImage(this.tiplogo, -40, 40, 22, 22);
    } else {
      ctx.fillText(formatTime(timer.endAt, "hh:MM"), 0, 55);
    }
  }
}
</script>
