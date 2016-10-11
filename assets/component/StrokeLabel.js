cc.Class({
    extends: cc.Label,

    properties: {

        /**
         * !#en Change the outline color
         * !#zh 改变描边的颜色
         * @property color
         * @type {Color}
         * @example
         * outline.color = new cc.Color(0.5, 0.3, 0.7, 1.0);;
         */
        // _outline_color: cc.color(255,255,255,255),
        // _outline_width: 1,
        outline_color: {
            default:cc.color(255,255,255,255),
            notify:function () {
                if(this._labelSGNode) {
                    this._labelSGNode.setOutlineColor(cc.color(this.outline_color));
                }
            }
        },
        /**
         * !#en Change the outline width
         * !#zh 改变描边的宽度
         * @property width
         * @type {Number}
         * @example
         * outline.width = 3;
         */
        outline_width: {
            default:1,
            notify:function () {
                if(this._labelSGNode) {
                    // this._labelSGNode.setSize(this.)
                    this._labelSGNode.setOutlineWidth(this.outline_width);
                }
            }
        },

    },

    onEnable: function () {
        this._super();
        var label = this;
        var sgNode = this._labelSGNode = label && label._sgNode;
        if(this._labelSGNode) {
            sgNode.setOutlined(true);
            sgNode.setOutlineColor(cc.color(this.outline_color));
            sgNode.setOutlineWidth(this.outline_width);
        }
    },

    onDisable: function () {
        this._super();
        if(this._labelSGNode) {
            this._labelSGNode.setOutlined(false);
        }

        this._labelSGNode = null;
    },
 });

