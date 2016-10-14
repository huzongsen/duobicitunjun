const BaseView = require('BaseView');
cc.Class({
    extends: BaseView,

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
        qiqiu: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.qiqiu.active = false;
        this.anim = this.node.getComponent(cc.Animation);
        this.anim.on('finished',  this.onFinished,    this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
    },

    onClick() {
        this.qiqiu.active = true;
        this.node.getChildByName('normal').rotation = 0;
        this.anim.stop();
        this.anim.play(this.anim._clips[1]._name);
        // anim.play(anim._clips[0]._name);
    },

    onFinished(event) { 
        cc.log(event);
        if (event.target._name == 'rabbitFly') {
            this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
            // this.anim.play(this.anim._clips[0]._name);
        }
    }
});
