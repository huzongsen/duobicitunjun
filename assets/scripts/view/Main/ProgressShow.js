const GameConst = require('GameConst');
const BaseView = require('BaseView');
const Common = require('Common');
cc.Class({
    extends: BaseView,

    properties: {
        timeNode: {
            default: null,
            type: cc.Node
        },
    },

    // use this for initialization
    onLoad() {
        this._super();
        this.initTime = GameConst.GAME_TIME;
        this.time = this.initTime;
    },

    calculateTime(time) {
        let second = Common.fix(parseInt(time),2);
        let ms = Common.fix(parseInt(((time - parseInt(time))*100)),2);
        return `${second}:${ms}`;
    },

    // called every frame, uncomment this function to activate update callback
    update(dt) {
        this.time -= dt;
        if (this.time <= 0) {
            this.time = 0;
            this.postNoti(this.notify.GAME_OVER);
        }
        this.timeNode.getComponent(cc.Label).string = this.calculateTime(this.time);
        this.node.getComponent(cc.ProgressBar).progress = this.time / this.initTime;
    },
});
