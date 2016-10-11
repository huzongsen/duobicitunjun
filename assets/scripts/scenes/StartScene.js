const ViewManager = require('ViewManager');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        cc.loader.loadRes('/Prefab/LoadView', function (err, loadViewPrefab) {
            ViewManager._loadViewPrefab = loadViewPrefab;
            ViewManager.createPrefabNode('/Prefab/Start/StartView', 'StartView', function (node) {
                this.node.addChild(node);
            }.bind(this));
        }.bind(this))

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
