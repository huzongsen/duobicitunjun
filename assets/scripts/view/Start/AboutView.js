const BaseView = require('BaseView');
const ViewManager = require('ViewManager');
const MessageManager = require('MessageManager');
cc.Class({
    extends: BaseView,

    properties: {
        content: {
            default: null,
            type: cc.Node
        },
        backBtn: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad() {
        this._super();
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation();
        }, this)
        this.backBtn.on(cc.Node.EventType.TOUCH_END, this.onBackBtnClick, this);
        this.setContent();
    },

    setContent() {
        cc.log(MessageManager._message);
        let about = MessageManager._message.about;
        let textList = [];
        for (let key in about) { 
            let one = {};
            one.key = key;
            one.info = about[key];
            textList.push(one);
        }
        ViewManager.createPrefabNodes('/Prefab/Start/TextCell', 'TextCell', textList, function (node, data) {
            let component = node.getComponent(node.scriptName);
            component.setData(data);
            this.content.addChild(node);
        }.bind(this));
    },

    onBackBtnClick() {
        this.postNoti(this.notify.CLOSE_ABOUT_VIEW);
        this.destroy();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
