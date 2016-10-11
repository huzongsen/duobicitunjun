
/*
* TextureManager是一个通过检查texture的引用数安全清理texture的工具
* */
let TextureManager = {
    _textures:{},

    ADD_TEXTURE_COUNT:"add_texture_count",
    SUB__TEXTURE_COUNT:"sub_texture_count",

    loadPrefab:function(obj, completeCallback) {

        let url = obj.url;

        if (cc.path.extname(url) === ".prefab") {
            url = url.replace(".prefab", "");
        }

        cc.loader.loadRes(url, function(err, prefab){
            prefab.url = url;
            this._traverse(prefab.data, this.ADD_TEXTURE_COUNT);
            completeCallback(err, prefab);
        }.bind(this));
    },

    unLoadPrefab:function (prefab) {
        // cc.loader.releaseRes(prefab.url);
        // cc.loader.releaseAll();
        // this._traverse(prefab.data, this.SUB__TEXTURE_COUNT);
        // this._clearTextures();
    },

    loadTexture:function(url, completeCallback) {
        cc.loader.loadRes(url, cc.SpriteFrame, function(err, spriteFrame){
            const TextureListFile = require('TextureListFile');
            if (cc.path.extname(url) === ".png" || cc.path.extname(url) === ".jpg") {

            }else {
                if(TextureListFile[url + '.png']) {
                    url = url + '.png';
                }else if(TextureListFile[url + '.jpg']) {
                    url = url + '.jpg';
                }
            }

            if(this._textures[url]) {
                this._addCount(url);
            }else {
                this._textures[url] = 1;
            }

            if (err) {
                this._subCount(url);
            }

            completeCallback(err, spriteFrame);

        }.bind(this));
    },

    unLoadTexture:function (url) {
        const TextureListFile = require('TextureListFile');
        if (cc.path.extname(url) === ".png" || cc.path.extname(url) === ".jpg") {

        }else {
            if(TextureListFile[url + '.png']) {
                url = url + '.png';
            }else if(TextureListFile[url + '.jpg']) {
                url = url + '.jpg';
            }
        }
        this._subCount(url);
    },

    _clearTextures:function () {
        // for (let k in this._textures) {
        //     if (this._textures[k] != null && this._textures[k] == 0) {
        //         cc.textureCache.removeTextureForKey("res/raw-assets/resources" + k);
        //         delete this._textures[k];
        //     }
        // }
    },

    _addCount:function (url) {
        if(this._textures[url]) {
            this._textures[url]++;
        }
    },
    
    _subCount:function (url) {
        if(this._textures[url]) {
            this._textures[url]--;
        }
    },

    _traverse:function (node, operate) {

        if (node && node instanceof cc.Node) {
            for (let k in node.children){
                let v = node.children[k];
                if(v && v._components) {
                    for (let componentKey in v._components) {
                        let componentValue = v._components[componentKey];
                        if(componentValue instanceof cc.Sprite && componentValue.spriteFrame) {
                            let url = componentValue.spriteFrame._textureFilename.replace("res/raw-assets/resources", "");
                            if(operate == this.ADD_TEXTURE_COUNT) {
                                if(this._textures[url]) {
                                    this._addCount(url);
                                }else {
                                    this._textures[url] = 1;
                                }
                            }else if(operate == this.SUB__TEXTURE_COUNT) {
                                if(this._textures[url]) {
                                    this._subCount(url);
                                }else {
                                    this._textures[url] = 0;
                                }
                            }
                        }
                    }
                }

                this._traverse(v, operate);
            }
        }
    }
};

module.exports = TextureManager;