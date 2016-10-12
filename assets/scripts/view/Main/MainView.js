const BaseView = require('BaseView');
const ViewManager = require('ViewManager');
let MainView = cc.Class({
    extends: BaseView,

    properties: {},

    onLoad() {
        this._super();
        this.addObs();
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
    }

})