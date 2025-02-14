export class TimerBell {
    context: WechatMiniprogram.InnerAudioContext;

    constructor(type: 'ring' | 'tick-slow' | 'tick-quick') {
        this.context = wx.createInnerAudioContext({
            useWebAudioImplement: true,
        });
        this.context.src = `/static/${type}.mp3`;
    }
}
