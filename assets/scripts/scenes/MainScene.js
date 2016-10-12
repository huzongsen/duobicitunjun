const BaseView = require('BaseView');
const ViewManager = require('ViewManager');
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        ViewManager.createPrefabNode('/Prefab/Main/MainView', 'MainView', function (node) {
            cc.director.getScene().addChild(node);
        }.bind(this));
    },


})
