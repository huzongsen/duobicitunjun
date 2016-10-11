/**
 * Created by wesley on 2016/5/21.
 */
'use strict';

let Build = {
    doBuild:function () {
        let os = require('os');
        let process = require('process');
        let path = require('path');
        let scriptDir = path.dirname(__filename);
        // get Texture dir
        let textureDir = path.resolve(scriptDir, '../../assets/resources/Texture')
        Editor.info("检测到assets目录发生变化 开始在以下目录计算textureList " + textureDir);

        let fs = require('fs');
        let fileArr = [];
        let str = "let textureList = {};";

        let async = function(arr, callback1, callback2) {
            if (Object.prototype.toString.call(arr) !== '[object Array]') {
                return callback2(new Error('first arg must be Array'));
            }
            if (arr.length === 0)
                return callback2(null);
            (function walk(i) {
                if (i >= arr.length) {
                    return callback2(null);
                }
                callback1(arr[i], function () {
                    walk(++i);
                });
            })(0);
        }

        let getAllFiles = function (dir, callback) {
            var filesArr = [];
            dir = ///$/.test(dir) ? dir : dir + '/';
                (function dir(dirpath, fn) {
                    var files = fs.readdirSync(dirpath);
                    async(files, function (item, next) {
                        var info = fs.statSync(dirpath + item);
                        if (info.isDirectory()) {
                            dir(dirpath + item + '/', function () {
                                next();
                            });
                        } else {
                            filesArr.push(dirpath + item);
                            callback && callback(dirpath + item);
                            next();
                        }
                    }, function (err) {
                        !err && fn && fn();
                    });
                })(dir);
            return filesArr;
        }

        let filesArr = getAllFiles(textureDir + "/", function (item) {

            if (path.extname(item) == ".png" || path.extname(item) == ".jpg") {
                const nativeImage = require('electron').nativeImage;
                // Editor.log(item)
                let image = nativeImage.createFromPath(item);
                // Editor.log(item + " width:"+ image.getSize().width + " height:" + image.getSize().height);
                // Editor.log(path.resolve(scriptDir, '../../assets/resources'))
                if (os.platform() == "win32") {
                    item = item.replace(path.resolve(scriptDir, '../../assets/resources') + "\\", "");
                }else if (os.platform() == "darwin") {
                    item = item.replace(path.resolve(scriptDir, '../../assets/resources') + "/", "");
                }
                
                // Editor.log(item + " width:"+ image.getSize().width + " height:" + image.getSize().height)
                item = {item:item, width:image.getSize().width, height:image.getSize().height};
                // fileArr.push(item);

                let objStr = 'textureList["/' + item.item + '"] = ';
                objStr += '{width:' + item.width + ', height:' +  item.height + "};"
                str += '\r\n' + objStr
            }
        })

        str += '\r\nmodule.exports = textureList;'
        let textureListFile = path.resolve(scriptDir, '../../assets/component/')
        textureListFile = textureListFile + "/TextureListFile.js"

        fs.writeFile(textureListFile, str, function(err){
            if(err)
                console.log("fail " + err);
            // else
            //     console.log("写入文件ok");
        });

        Editor.info("textureList 写入文件ok！！！");
    }
}

module.exports = Build;