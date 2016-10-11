
const TextureManager = require('TextureManager');
const GameConst = require('GameConst');
const AsyncSprite = require('AsyncSprite');

/*
* view的管理器
* */
let ViewManager = {

    _nodes:{},

    InstanceId:0,

    _loadViewNode:null,

    _loadViewPrefab:null,

    _loadPipe:[],

    _IsLoading:false,

    popupNode:null,
    maskNode:null,

    loaderReleaseState:GameConst.CC_LOADER_RELEASE_STATE.IDLE,



    /*
    * @params url - prefab的路径
    * @params scriptName - prefab上所绑定脚本名称
    * 通过prefab创建一个节点，并且将这个node的生命周期纳入ViewManager管理
    * prefab的生命周期通过scriptName对应脚本的父类内部管理
    * @params [object] userdata 用户特殊数据
    * */
    createPrefabNode:function(url, scriptName, completeCallback, userdata) {

        this._showLoadView();
        let instanceId = this._createInstanceId();
        let obj = {
            url:url,
            scriptName:scriptName,
            completeCallback:completeCallback,
            userdata:userdata,
            instanceId:instanceId

        };

        this._loadPipe.push(obj);

        if(this._IsLoading !== true) {
            this._asyncLoad();
        }
    },


    /**
     * 创建多个使用同样prefab的node
     *
     * @param url - prefab的路径
     * @param scriptName - prefab上所绑定脚本名称
     * @param list 数据列表，必须是数组
     * @param completeCallback - 根据list的顺序多次回调，回调的第一个参数是创建的node，第二那个参数是list[i]
     */
    createPrefabNodes:function(url, scriptName, list, completeCallback) {

        this._showLoadView();
        let instanceId = this._createInstanceId();
        let obj = {
            url:url,
            scriptName:scriptName,
            completeCallback:completeCallback,
            list:list,
            instanceId:instanceId

        };

        this._loadPipe.push(obj);

        if(this._IsLoading !== true) {
            this._asyncLoad();
        }
    },

    /**
     * 预制件加载由一个管线顺序加载，只在管线空闲时做loader清理
     * */
    _asyncLoad:function () {
        this._IsLoading = true;

        let obj = this._loadPipe[this._loadPipe.length - 1];

        TextureManager.loadPrefab(obj, function (err, prefab) {
            let instanceId = obj.instanceId;
            //TODO instanceId
            // let count;
            let node;
            if(obj.list) {
                for(let i = 0; i < obj.list.length; i++) {
                    node = cc.instantiate(prefab);
                    this._nodes[instanceId] = node;
                    if(obj.scriptName) {
                        let sprite = node.getComponent(obj.scriptName);
                        if(sprite) {
                            sprite.savePrefab(prefab);
                            sprite.saveNodeInstanceId(instanceId);
                        }
                    }
                    if(i < obj.list.length - 1){
                        TextureManager._traverse(node,'add_texture_count');
                    }
                    node.scriptName = obj.scriptName;
                    obj.completeCallback(node, obj.list[i], instanceId, prefab);
                }
            }else {
                node = cc.instantiate(prefab);
                this._nodes[instanceId] = node;
                if(obj.scriptName) {
                    let sprite = node.getComponent(obj.scriptName);
                    if(sprite) {
                        sprite.savePrefab(prefab);
                        sprite.saveNodeInstanceId(instanceId);
                    }
                }
                node.scriptName = obj.scriptName;
                obj.completeCallback(node, instanceId, prefab, obj.userdata);
            }

            // this._loadPipe.shift();
            let deleteKey;
            for (let k in this._loadPipe) {
                let v = this._loadPipe[k];
                if (v.instanceId == instanceId) {
                    deleteKey = k;
                    break;
                }
            }
            this._loadPipe.splice(deleteKey, 1);
            // cc.loader.removeItem(cc.loader._getResUuid(obj.url));
            // cc.loader.releaseRes(obj.url);
            // if (node) {
            //     this._traverse(node);
            // }
            if (this._loadPipe.length > 0) {
                this._asyncLoad();
            }else {
                this._IsLoading = false;
                this._hideLoadView();
                //使用isFlowing延时释放
                // if(!cc.loader.isFlowing() && cc.loader.getItems().totalCount !== 0) {
                // cc.loader.releaseRes(obj.url);
                // }
                // if (AsyncSprite.loadCount <= 0) {
                //     cc.loader.releaseAll();
                // }else {
                //     ViewManager.loaderReleaseState = GameConst.CC_LOADER_RELEASE_STATE.WAITING;
                // }
                
                // if (AsyncSprite.loadCount <= 0) {
                //     for (let key in cc.loader._cache) {
                //         cc.loader.removeItem(key);
                //     }
                // } else {
                //     ViewManager.loaderReleaseState = GameConst.CC_LOADER_RELEASE_STATE.WAITING;
                // }
            }
        }.bind(this))
    },

    _traverse:function (node) {

        if (node && node instanceof cc.Node) {
            for (let k in node.children){
                let v = node.children[k];
                if(v && v._components) {
                    for (let componentKey in v._components) {
                        let componentValue = v._components[componentKey];
                        if(componentValue instanceof cc.Sprite && componentValue.spriteFrame) {
                            let url = componentValue.spriteFrame._textureFilename.replace("res/raw-assets/resources", "");
                            url = url.replace("res/raw-internal/image", "");
                            // cc.loader.removeItem(cc.loader._getResUuid(url));
                        }
                    }
                }

                this._traverse(v);
            }
        }
    },


    deletePrefabNode:function(instanceId) {
        delete this._nodes[instanceId];
    },

    _createInstanceId:function() {
        if (this.InstanceId < 100000) {
            this.InstanceId++;
        }else {
            this.InstanceId = 0;
        }
        return "" + this.InstanceId;
    },

    loadViewPrefab:function () {
        cc.loader.loadRes('/Prefab/LoadView', function(err, loadViewPrefab){
            this._loadViewPrefab = loadViewPrefab;
        }.bind(this))
    },

    _showLoadView:function () {
        if (this._loadViewNode && this._loadViewNode.parent) {
            this._loadViewNode.parent = null;
            this._loadViewNode.parent = cc.director.getScene();
            return;
        }
        this._loadViewNode = cc.instantiate(this._loadViewPrefab);
        cc.director.getScene().addChild(this._loadViewNode);
    },

    _hideLoadView:function () {
        this._loadViewNode.destroy();
    },
}

module.exports = ViewManager;