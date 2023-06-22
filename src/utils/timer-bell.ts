export class TimerBell {
    context: WechatMiniprogram.InnerAudioContext;

    constructor() {
        this.context = wx.createInnerAudioContext({
            useWebAudioImplement: true,
        });
        this.context.src = '/static/ring.mp3';
    }

    ring() {
        this.context.play();
    }

    stop() {
        this.context.stop();
    }
}
