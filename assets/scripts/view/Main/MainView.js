const BaseView = require('BaseView');
const ViewManager = require('ViewManager');
let MainView = cc.Class({
    extends: BaseView,

    properties: {
        // expProgress: {
        //     default: null,
        //     type:cc.ProgressBar
        // }
        rabbit: {
            default: null,
            type:cc.Prefab
        }
    },

    onLoad() {
        this._super();
        this.addObs();
        let tu = cc.instantiate(this.rabbit);
        this.node.addChild(tu);
    },

    addObs() {
        this.addOb(this.notify.GAME_OVER, 'gameOver', this);
    },

    removeObs() {
        this.removeOb(this.notify.GAME_OVER, 'gameOver', this);
    },

    onPauseBtnClick() {
        
    },

    gameOver() { 
        cc.director.loadScene('Over');
    },

})