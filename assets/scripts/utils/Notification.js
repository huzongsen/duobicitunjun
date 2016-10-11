let notification = {
    noti:{},
    /**
     * 广播通知
     * 
     * @params <String> name 通知key
     * @params <Object> msg 消息
     * 
     * @return null
     */ 
    postNoti(name, msg) {
        const cbs = this.noti[name];
        if (!cbs) {
            return;
        }
        for (let i = 0; i < cbs.length; i++) {
            const dic = cbs[i];
            const obj = dic.obj;
            const cb = dic.cb;
            obj[cb].call(obj, msg);
        }
    },
    
    /**
     * 添加通知
     * 
     * @params <String> name 通知key
     * @params <String> cb 回调方法
     * @params <Object> obj 回调方法所属对象
     * 
     * @return null
     */ 
    addOb(name, cb, obj) {
        let cbs = this.noti[name];
        if (!cbs) {
            cbs = [{cb:cb, obj:obj}];
            this.noti[name] = cbs;
        } else {
            for (let i = 0; i < cbs.length; i++) {
                let dic = cbs[i];
                if (dic.cb === cb && dic.obj === obj) {
                    return;
                }
            }
            cbs.push({cb:cb, obj:obj});
        }
    },
    
    /**
     * 移除通知
     * 
     * @params <String> name 通知key
     * @params <String> cb 回调方法
     * @params <String> obj 回调方法所属对象
     * 
     * @return null
     */ 
    removeOb(name, cb, obj) {
        let cbs = this.noti[name];
        if (!cbs) {
            return;
        }
        for (let i = cbs.length - 1; i >= 0; i--) {
            let dic = cbs[i];
            if (dic.cb === cb && dic.obj === obj) {
                cbs.splice(i, 1);
            }
        }
        if (!cbs.length) {
            delete this.noti[name];
        }
    },
}

module.exports = notification;