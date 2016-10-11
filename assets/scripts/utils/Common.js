
let common = {


    /**
     * 数字转换字符串
     * 
     * @params [Integer] num 需要转换的数字
     * @params [Integer] length 总长度
     * @return [String] num:1 length:2 : 1-->01
     */ 
    fix(num, length){
        return  ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num;
    },
    
    /**
     * 深拷贝对象
     */ 
    clone:function(o){
		var k, ret= o, b;
		if(o && ((b = (o instanceof Array)) || o instanceof Object)) {
			ret = b ? [] : {};
			for(k in o){
				if(o.hasOwnProperty(k)){
					ret[k] = this.clone(o[k]);
				}
			}
		}
		return ret;
	},

	createNodeWithAsyncSprite(texturePath) {
		const AsyncSprite = require('AsyncSprite');
		let node = new cc.Node('nodeWithAsyncSprite');
		let asp = node.addComponent(AsyncSprite);
		asp.setAsyncTexture(texturePath);
		return node;
	},

	/*
	* 销毁一个节点的Children，代替removeAllChildren
	* */

	// destory:function (node) {
	// 	let component = node.getComponent(node.scriptName);
	// 	component.destory();
	// },

	destoryChildren:function (node) {
		if (node && node instanceof cc.Node) {
			for (let k in node.children){
				let v = node.children[k];

				if(v && v.scriptName) {
					let component = v.getComponent(v.scriptName);
					component.destroy();
				}
				this.destoryChildren(v);
			}
		}
		
		if(node) {
			node.removeAllChildren();
		}

	},

	/**
	 * 监听长按触摸事件
	 * @param node 监听的触摸节点
	 * @param time 长按时间
	 * @param callback 回调
     */
	addHoldTouchEventListener:function (node, time, callback) {

		const GameConst = require('GameConst')

		let onNodeTouchStartHandler = function (event) {
			let node = event.target;
			node.timerComponent = node.addComponent(cc.Component);
			node.timerComponent.scheduleOnce(function () {
				callback();
			}, time);
		};

		let onNodeTouchEndHandler = function (event) {
			let node = event.target;
			node.timerComponent.unscheduleAllCallbacks();
		};

		let onNodeTouchCancelHandler = function (event) {
			let node = event.target;
			node.timerComponent.unscheduleAllCallbacks();
		};

		node.on(cc.Node.EventType.TOUCH_START, onNodeTouchStartHandler);
		node.on(cc.Node.EventType.TOUCH_END, onNodeTouchEndHandler);
		node.on(cc.Node.EventType.TOUCH_CANCEL, onNodeTouchCancelHandler);


	},
	
	
	showConsole:function () {
		const ViewManager = require('ViewManager');
		ViewManager.createPrefabNode('/Prefab/Console', 'Console', function (node) {
			common.consoleNode = node;
			cc.director.getScene().addChild(node);
		}.bind(this))
	},
	
	showText(text){
	    const ViewManager = require('ViewManager');
	    ViewManager.createPrefabNode('/Prefab/TipsNode', 'TipsNode', function(node) {
	        cc.director.getScene().addChild(node);
	        node.x = cc.winSize.width / 2;
	        node.y = cc.winSize.height / 2;
	        node.getComponent('TipText').setText(text);
	    });
	},

	/*
	 * 获取字典的长度
	 */
	getDicLength(dic){
		let dicLength = 0;
		for(let key in dic){
			dicLength ++;
		}
		return dicLength;
	},

    /*
     * 加载列表
     * 每次加载两屏左右长度的cell，当滚动视图滑到底端时再加载两屏，直到加载完毕
     * 参数:
     *   maskHeigth: 滚动视图中遮罩层的高度(num)
     *   scrollView: 滚动视图(cc.Node 带cc.ScrollView组件)
     *   tabelView:  scrollView上的content
     *   path:       cell的预制件路径
     *   scriptName: 脚本名
     *   list:       要加载的列表(Array)
     *   callback:   回调
     *   obj:        传this就行:)
     */
	addListView:function( maskHeigth, scrollView, tabelView, path, scriptName ,list ,callback ,obj){
        tabelView.height = 0;
        let heightNum = maskHeigth * 2; //可以加载的长度
        let isLoad = true;  //是否可以加载
        let idx = 0;
		let testNode = new cc.Node();
		let handler = new cc.Component.EventHandler();
		let component = testNode.addComponent('ScrollEvent');
		handler.target = testNode;
		handler.component = 'ScrollEvent';
		handler.handler = 'scroll';
		handler.isAddNodeScroll = true;
		let eventArray = scrollView.getComponent(cc.ScrollView).scrollEvents;
		if(eventArray.length == 0){
			scrollView.getComponent(cc.ScrollView).scrollEvents[0] = handler;
		}else {
			if(eventArray[eventArray.length - 1].isAddNodeScroll == true){
				scrollView.getComponent(cc.ScrollView).scrollEvents[eventArray.length - 1] = handler;
			}else {
				scrollView.getComponent(cc.ScrollView).scrollEvents[eventArray.length] = handler;
			}
		}
        this.createCell = function(){
        	if(obj.callBack){
        	    obj.unschedule(obj.callBack);
        	    obj.callBack = null;
        	}
        	require('ViewManager').createPrefabNode( path, scriptName, function (node,instanceId,prefab,userdata) {
        	    obj.callBack = function(){
        	        if(idx === list.length){ 
        	            obj.unschedule(obj.callBack);
        	            obj.callBack = null;
                        isLoad = false;
        	            return;
        	        }
        	        let data = list[idx];

        	        if( tabelView.height > heightNum ){ //当已加载的长度超过可以加载的长度停止加载
        	            obj.unschedule(obj.callBack);
        	            obj.callBack = null;
        	            isLoad = true;
        	            return ;
        	        }
                    idx++;

                    let cell = cc.instantiate(prefab);
                    if (idx < list.length - 1) {
                    	require('TextureManager')._traverse(node, 'add_texture_count');
                    }
                    cell.scriptName = node.scriptName;
                    callback(cell,data);
                    // cc.log(idx)
        	    }
        	    obj.schedule(obj.callBack,0.02);
        	});

		};
		this.createCell();

        component.scroll = function(srview,eventType){
            // let totalHeight = scrollView.getComponent(cc.ScrollView).getContentPosition().y + maskHeigth / 2; //当前滚动的位置
            // if(isLoad == true && totalHeight > tabelView.height ){ //当可以加载并且滚动视图滑到底端
            if( isLoad == true && eventType === cc.ScrollView.EventType.BOUNCE_BOTTOM ){
				// cc.log(component);
                isLoad = false;
                heightNum = tabelView.height + maskHeigth * 2;
                this.createCell();
            }

        }.bind(this);
	},
}

module.exports = common;
