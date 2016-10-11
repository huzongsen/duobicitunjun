'use strict';

module.exports = {

    load () {
        // 当 package 被正确加载的时候执行
    },

    unload () {
        // 当 package 被正确卸载的时候执行
    },

    messages: {
        'asset-db:assets-changed' () {
            let build = require("./Build");
            build.doBuild();
        },
        'asset-db:assets-uuid-changed' () {
            let build = require("./Build");
            build.doBuild();
        },
        'asset-db:assets-created' () {
            let build = require("./Build");
            build.doBuild();
        },
        'asset-db:assets-deleted' () {
            let build = require("./Build");
            build.doBuild();
        },
        'asset-db:assets-moved' () {
            let build = require("./Build");
            build.doBuild();
        },
        'preBuild:build' () {
            let build = require("./Build");
            build.doBuild();
        }
    },
};