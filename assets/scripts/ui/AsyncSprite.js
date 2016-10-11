/**
 * Created by wesley on 2016/5/19.
 */
const textureList = require('TextureListFile');
const TextureManager = require('TextureManager');

const GameConst = require('GameConst');

/**
 * !#zh 该组件用于在场景中渲染一个异步加载texture的精灵。
 * @class AsyncSprite
 * @extends cc.Sprite
 * @example
 *  // Create a new node and add AsyncSprite components.
 *  var node = new cc.Node("New AsyncSprite");
 *  var sp = node.addComponent(AsyncSprite);
 *  sp.setAsyncTexture(`/Texture/Battle/atk_icon.png`)
 *  node.parent = this.node;
 */
let AsyncSprite = cc.Class({
    extends: cc.Sprite,

    statics: {
        loadCount: 0,

    },
    properties: {
        _isLoadingTexture: false,
        _loadPipe: [],
        _AsyncUrlDic: {
            default: {},
        },
    },


    exchangeAsyncTexture: function (texturePath, sizeMode) {
        let Obj = {texturePath, sizeMode};
        this._loadPipe.push(Obj);

        if (this._isLoadingTexture !== true) {
            this.changeSyncTexture();
        }

    },

    changeSyncTexture: function () {

        // cc.log('changeSyncTexture ++');
        AsyncSprite.loadCount ++;

        this._isLoadingTexture = true;
        let obj = this._loadPipe[this._loadPipe.length - 1];


        this.node.scriptName = "AsyncSprite";

        let size;
        if (cc.path.extname(obj.texturePath) === ".png" || cc.path.extname(obj.texturePath) === ".jpg") {
            size = textureList[obj.texturePath];
        } else {
            size = textureList[obj.texturePath + ".png"] || textureList[obj.texturePath + ".jpg"];
        }

        if (!size) {
            cc.warn('texture missing:' + obj.texturePath);
            size = cc.size(100, 100);
        } else {
        }


        this.node.setContentSize(size);

        //默认填充方式为 SIMPLE
        //this.type = cc.Scale9Sprite.RenderingType.SIMPLE;
        //默认sizeMode 为 cc.Sprite.SizeMode.TRIMMED,所以这里要修改如下
        this.sizeMode = obj.sizeMode || cc.Sprite.SizeMode.CUSTOM;

        TextureManager.loadTexture(obj.texturePath, function (err, spriteFrame) {
            // cc.log('changeSyncTexture load complete');

            const ViewManager = require('ViewManager');
            AsyncSprite.loadCount --;

            // cc.log( AsyncSprite.loadCount + " " + ViewManager.loaderReleaseState);
            if(ViewManager.loaderReleaseState === GameConst.CC_LOADER_RELEASE_STATE.WAITING && AsyncSprite.loadCount <= 0) {
                ViewManager.loaderReleaseState = GameConst.CC_LOADER_RELEASE_STATE.IDLE;
                for (let key in cc.loader._cache) {
                    cc.loader.removeItem(key);
                }
            }
            if (err) {
                return;
            }


            this.spriteFrame = spriteFrame;
            if (this.url) {
                TextureManager.unLoadTexture(this.url);
            }
            this.url = obj.texturePath;

            let deleteKey;
            for (let k in this._loadPipe) {
                let v = this._loadPipe[k];
                if (v.texturePath == obj.texturePath) {
                    deleteKey = k;
                    break;
                }
            }
            this._loadPipe.splice(deleteKey, 1);
            if (this._loadPipe.length > 0) {
                this.changeSyncTexture();
            } else {
                this._IsLoading = false;

                // if (!cc.loader.isFlowing() && cc.loader.getItems().totalCount !== 0) {
                //     cc.loader.releaseAll();
                // }
                // cc.loader.releaseRes(obj.texturePath);
                // cc.loader.removeItem(cc.loader._getResUuid(obj.texturePath));

            }

        }.bind(this));

    },

    /**
     * 设置sprite的texture，可对一个AsyncSprite多次设置texture
     * 对一个AsyncSprite多次设置texture时会对之前的texture进行清理
     * @param texturePath
     * @param sizeMode
     */
    setAsyncTexture: function (texturePath, sizeMode, specialSize) {

        AsyncSprite.loadCount ++;

        if (!this.node.scriptName) {
            this.node.scriptName = "AsyncSprite";
        }

        let size;
        if (cc.path.extname(texturePath) === ".png" || cc.path.extname(texturePath) === ".jpg") {
            size = textureList[texturePath];
        } else {
            size = textureList[texturePath + ".png"] || textureList[texturePath + ".jpg"];
        }

        if (!size) {
            cc.warn('texture missing:' + texturePath);
            size = cc.size(100, 100);
        } else {
            // AsyncSprite.loadCount ++;
        }

        if (specialSize) {
            // 如果有指定的size，就设置为指定的size
            this.node.setContentSize(specialSize);
        } else {
            this.node.setContentSize(size);
        }
        ;

        //默认填充方式为 SIMPLE
        //this.type = cc.Scale9Sprite.RenderingType.SIMPLE;
        //默认sizeMode 为 cc.Sprite.SizeMode.TRIMMED,所以这里要修改如下
        this.sizeMode = sizeMode || cc.Sprite.SizeMode.CUSTOM;
        //如果上一个texture同当前，则不作操作
        if (this._AsyncUrlDic === undefined) {
            this._AsyncUrlDic = {};
        }

        if (this._AsyncUrlDic[texturePath] === true) {
            return;
        } else if (this._AsyncUrlDic[texturePath] === false) {
            //如果已经有当前url在loading或最后一个load完成，将当前url设置为true，之前url设置为失效false
            for (let key in this._AsyncUrlDic) {
                this._AsyncUrlDic[key] === false;
            }
            this._AsyncUrlDic[texturePath] === true;
            return;
        } else {//this._AsyncUrlDic[texturePath] === undefined
            for (let key in this._AsyncUrlDic) {
                this._AsyncUrlDic[key] === false;
            }
        }

        this._AsyncUrlDic[texturePath] = true;

        TextureManager.loadTexture(texturePath, function (err, spriteFrame) {
            const ViewManager = require('ViewManager');
            AsyncSprite.loadCount --;
            // cc.log( AsyncSprite.loadCount + " " + ViewManager.loaderReleaseState);
            // if(ViewManager.loaderReleaseState === GameConst.CC_LOADER_RELEASE_STATE.WAITING && AsyncSprite.loadCount <= 0) {
            //     ViewManager.loaderReleaseState = GameConst.CC_LOADER_RELEASE_STATE.IDLE;
            //     for (let key in cc.loader._cache) {
            //         cc.loader.removeItem(key);
            //     }
            // }

            if (err) {
                delete this._AsyncUrlDic[texturePath];
                return;
            }

            if (this._AsyncUrlDic == null) {
                return;
            }

            if (this._AsyncUrlDic[texturePath] === false) {
                TextureManager.unLoadTexture(texturePath);
                delete this._AsyncUrlDic[texturePath];
                return;
            }
            
            // cc.loader.releaseRes(texturePath);
            // cc.loader.removeItem(cc.loader._getResUuid(texturePath));

            this.spriteFrame = spriteFrame;
            if (this.url) {

                TextureManager.unLoadTexture(this.url);
            }
            this.url = texturePath;
            delete this._AsyncUrlDic[texturePath];

        }.bind(this));
    },

    onDestroy: function () {
        this.node.parent = null;
        TextureManager.unLoadTexture(this.url);
    }
})