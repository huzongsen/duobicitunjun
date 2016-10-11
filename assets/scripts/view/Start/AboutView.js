const BaseView = require('BaseView');
const ViewManager = require('ViewManager');
cc.Class({
    extends: BaseView,

    properties: {
        content: {
            default: null,
            type:cc.Node
        },
        backBtn: {
            default: null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad() {
        this._super();
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) { 
            event.stopPropagation();
        },this)
        this.backBtn.on(cc.Node.EventType.TOUCH_END, this.onBackBtnClick, this);
        this.setContent();
    },

    setContent() { 
        
    },

    onBackBtnClick() {
        this.postNoti(this.notify.CLOSE_ABOUT_VIEW);
        this.destroy();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
