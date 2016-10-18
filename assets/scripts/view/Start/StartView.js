const BaseView = require('BaseView');
const MessageManager = require('MessageManager');
const ViewManager = require('ViewManager');
let StartView = cc.Class({
    extends: BaseView,

    properties: {},

    onLoad() {
        this._super();
        this.addObs();
        let userData = {
            name: 'huzongsen',
            age: '23'
        }
        MessageManager.saveMessage('userData', userData);

        cc.log(MessageManager.readMessageByName('userData'));
    },

    addObs() {
        this.addOb(this.notify.CLOSE_ABOUT_VIEW, 'returnNormalColor', this);
    },

    removeObs() {
        this.removeOb(this.notify.CLOSE_ABOUT_VIEW, 'returnNormalColor', this);
    },

    returnNormalColor() {
        this.node.opacity = 255;
    },

    onStartBtnClick() {
        cc.director.loadScene('Main');
    },

    onAboutBtnClick() {
        this.node.runAction(cc.sequence(cc.fadeTo(0.2, 150), cc.callFunc(function () {
            ViewManager.createPrefabNode('/Prefab/Start/AboutView', 'AboutView', function (node) {
                cc.director.getScene().addChild(node);
            }.bind(this));
        }.bind(this))));

    }

})