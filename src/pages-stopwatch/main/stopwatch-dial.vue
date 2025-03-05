<template>
  <view class="h-full w-full" un-flex="~ justify-center items-center">
    <canvas class="h-80% w-80%" id="stopwatch-dial" type="2d"></canvas>
  </view>
</template>

<script lang="ts" setup>
const dial = useDial();
const setting = useSetting();
const records = useRecords();
const instance = getCurrentInstance();

const props = defineProps<{ itemId: string }>();
const duration = computed(() => (setting.record === RecordType.Duration ? records.duration : undefined));

onUnload(() => DialPainter.stopDrawing());

onLoad(async () => {
  const env = await queryCanvasEnv("#stopwatch-dial", instance?.proxy);
  if (!env.ctx) return console.warn("can not query canvas");
  DialPainter.cancelAnimationFrame = env.cancelAnimationFrame;
  DialPainter.requestAnimationFrame = env.requestAnimationFrame;

  const offscreen = getOffscreenCRContext({
    width: env.ctx.canvas.width,
    height: env.ctx.canvas.height,
  });

  const background = new DialBackground({
    ctx: offscreen.ctx,
    font: monoFonts,
    colors: {
      labels: "#444444",
      scales: "#ffffff",
    },
  }).getImageData();

  const painter = new DialPainter({
    ...env,
    dial,
    duration,
    background,
    font: monoFonts,
    colors: {
      text: "#ffffff",
      pointer: "#f1a43d",
      pointer2: "#3788f2",
      background: "#000000",
    },
  });

  DialPainter.keepDrawing({
    when: () => dial.status === DialStatus.Running,
    loop: () => painter.draw(),
    immediate: true,
  });

  watch(
    () => [dial.status, props.itemId, setting.timer],
    () => painter.draw(),
  );
});

class DialPainter<
  Opts extends {
    dial: ReturnType<typeof useDial>;
    duration: Ref<ReturnType<typeof useRecords>["duration"]>;
    ctx: CanvasRenderingContext2D;
    background: ImageData;
    renderHeight: number;
    renderWidth: number;
    colors: {
      text: string;
      pointer: string;
      pointer2: string;
      background: string;
    };
  },
> extends Painter {
  options: Opts;

  constructor(options: Opts) {
    super();
    this.options = options;
  }

  draw() {
    const { background, ctx, renderHeight, renderWidth } = this.options;
    ctx.clearRect(0, 0, renderWidth, renderHeight);
    ctx.putImageData(background, 0, 0);

    this.drawDurationText();
    this.drawMinutesPointer();
    this.drawDurationPointer();
    this.drawSecondsPointer();
  }

  drawDurationText() {
    const { ctx, colors, renderWidth, dial } = this.options;
    const fontSize = 0.08 * renderWidth;
    const center = renderWidth / 2;

    ctx.save();
    ctx.translate(center, center);
    ctx.fillStyle = colors.text;
    ctx.lineWidth = 2;
    ctx.textAlign = "center";

    // 画文字时间戳
    ctx.beginPath();
    ctx.font = `${fontSize * 0.7}px ${monoFonts}`;
    ctx.fillText(formatDuration(dial), 0, center * 0.35);

    ctx.restore();
  }

  drawMinutesPointer() {
    const { ctx, renderWidth, colors, dial } = this.options;
    const { seconds, minutes } = dial;
    const center = renderWidth / 2;
    const radius = center * 0.25;

    ctx.save();
    ctx.translate(center, center * 0.67);

    ctx.beginPath();
    ctx.lineWidth = 2;

    ctx.fillStyle = colors.pointer;
    ctx.arc(0, 0, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = colors.pointer;
    ctx.rotate((Math.PI / 900) * ((seconds + ~~minutes * 60) % 1800));
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius);
    ctx.stroke();

    ctx.restore();
  }

  drawDurationPointer() {
    const { ctx, renderWidth, colors, duration } = this.options;
    if (!duration.value) return;

    const { milliseconds } = duration.value;
    const center = renderWidth / 2;

    ctx.save();
    ctx.translate(center, center);
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.strokeStyle = colors.pointer2;
    ctx.rotate((Math.PI / 30000) * milliseconds);
    ctx.moveTo(0, center * 0.1);
    ctx.lineTo(0, -center + 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = colors.background;
    ctx.arc(0, 0, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
  }

  drawSecondsPointer() {
    const { ctx, renderWidth, colors, dial } = this.options;
    const { milliseconds } = dial;
    const center = renderWidth / 2;

    ctx.save();
    ctx.translate(center, center);
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.strokeStyle = colors.pointer;
    ctx.rotate((Math.PI / 30000) * milliseconds);
    ctx.moveTo(0, center * 0.1);
    ctx.lineTo(0, -center + 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = colors.pointer;
    ctx.arc(0, 0, 4, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = colors.background;
    ctx.arc(0, 0, 2, 0, 2 * Math.PI);
    ctx.fill();

    ctx.restore();
  }
}

class DialBackground {
  options: { ctx: OffscreenCanvasRenderingContext2D; font: string; colors: { labels: string; scales: string } };

  constructor(options: typeof this.options) {
    this.options = options;
    this.drawSecondsDial();
    this.drawMinutesDial();
  }

  getImageData() {
    const { ctx } = this.options;
    const { width, height } = ctx.canvas;
    return ctx.getImageData(0, 0, width, height);
  }

  drawSecondsDial() {
    const { ctx, font, colors } = this.options;
    const { width } = ctx.canvas;
    const center = width / 2;

    ctx.save();
    ctx.translate(center, center);
    ctx.lineWidth = 2;

    // 画指针刻度
    ctx.beginPath();
    ctx.strokeStyle = colors.scales;
    for (let i = 0; i < 12; i++) {
      ctx.moveTo(center - 20, 0);
      ctx.lineTo(center - 35, 0);
      ctx.rotate(Math.PI / 6);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = colors.labels;
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
    const fontSize = 0.08 * width;
    const distance = center - fontSize - 25;
    ctx.fillStyle = colors.scales;
    ctx.font = `${fontSize}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < 12; i++) {
      const angle = -Math.PI / 2 + (Math.PI / 6) * i;
      const x = distance * Math.cos(angle);
      const y = distance * Math.sin(angle);
      ctx.fillText(i === 0 ? "60" : `${5 * i}`, x, y);
    }

    ctx.restore();
  }

  drawMinutesDial() {
    const { ctx, font, colors } = this.options;
    const { width } = ctx.canvas;
    const center = width / 2;
    const radius = center * 0.25;

    ctx.save();
    ctx.translate(center, center * 0.67);
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.strokeStyle = colors.scales;
    for (let i = 0; i < 6; i++) {
      ctx.moveTo(0, radius);
      ctx.lineTo(0, radius - 8);
      ctx.rotate(Math.PI / 3);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = colors.labels;
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
    const distance = radius - 32;
    ctx.fillStyle = colors.scales;
    ctx.font = `${fontSize}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < 6; i++) {
      const angle = -Math.PI / 2 + (Math.PI / 3) * i;
      const x = distance * Math.cos(angle);
      const y = distance * Math.sin(angle);
      ctx.fillText(i === 0 ? "30" : `${5 * i}`, x, y);
    }

    ctx.restore();
  }
}
</script>
