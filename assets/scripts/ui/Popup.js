cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        touchRect:{
            default:null,
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this.node.on('touchstart', function(event){
            if (this.touchRect && !cc.rectContainsPoint(this.touchRect.getBoundingBoxToWorld(), 
                event.getLocation())) {
                this.outside = true;
            }
            event.stopPropagation();
        }.bind(this));
        this.node.on('touchend', function(event){
            if (this.touchRect && this.outside && !cc.rectContainsPoint(this.touchRect.getBoundingBoxToWorld(), 
                event.getLocation())) {
                this.getComponent(this.node.scriptName).destroy();
            }
        }.bind(this));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
