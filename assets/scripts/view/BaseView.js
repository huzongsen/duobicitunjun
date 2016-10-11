const TextureManager = require('TextureManager');
const ViewManager = require('ViewManager');
// const common = require('Common');
const notification = require('Notification');

/*
 * 脚本组件的基类
 * prefab节点绑定的脚本组件应当继承于这个类
 * */
let BaseView = cc.Class({
    extends: cc.Component,

    properties: () => ({

        _AUTO_RELEASE:0,
        _MANUAL_RELEASE:1,

        _releaseMode:0,

        prefab:{
            default:null,
            type:cc.Prefab,
            visible:false,
        },
        nodeInstanceId:{
            default:"",
            visible:false,
        },
    }),
    
    // ctor:function () {
    // //   this.notify =  require('NotifyName')
    // },

    postNoti:function (name, msg) {
        notification.postNoti(name, msg);
    },

    addOb:function (name, cb, obj) {
        notification.addOb(name, cb, obj);
    },

    removeOb:function (name, cb, obj) {
        notification.removeOb(name, cb, obj);
    },

    // use this for initialization
    onLoad: function () {
        // this._super();
        this.notify =  require('NotifyName');
    },

    savePrefab:function (prefab) {
        this.prefab = prefab;
    },

    saveNodeInstanceId:function(instanceId) {
        this.nodeInstanceId = instanceId;
    },

    setReleaseMode:function (mode) {
        this._releaseMode = mode;
    },

    // destroyAllChildren:function () {
    //     common.destoryChildren(this.node);
    // },

    onDestroy:function() {
        if (this._releaseMode == this._AUTO_RELEASE) {
            this.node.parent = null;
            if (this.prefab) {
                TextureManager.unLoadPrefab(this.prefab);
            }

            if (this.nodeInstanceId) {
                ViewManager.deletePrefabNode(this.nodeInstanceId);
            }

            if (this.removeObs) {
                this.removeObs();
            }

            this._traverse(this.node);
        }
    },

    _traverse:function (node) {

        if (node && node instanceof cc.Node) {
            for (let k in node.children){
                let v = node.children[k];

                if(v && v.scriptName) {
                    let component = v.getComponent(v.scriptName);
                    component.destroy();
                }
                this._traverse(v);
            }
        }
    },

    onDisable:function() {
        // ViewManager.deletePrefabNode(this.nodeInstanceId);
        // TextureManager.unLoadPrefab(this.prefab);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
