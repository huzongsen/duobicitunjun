let MessageManager = {

    saveMessage(name, data) {
        let dataJson = JSON.stringify(data);
        cc.sys.localStorage.setItem(name, dataJson);
    },

    readMessageByName(name) {
        let dataJson = cc.sys.localStorage.getItem(name);
        if (dataJson) {
            let data = JSON.parse(dataJson);
            return data;
        }
        return undefined;
    },

    getConfigByName(name,callBack) { 
        let path = `/res/raw-assets/resources/Config/${name}.json`;
        cc.loader.load(path, function (err, results) {
            if (err) { 
                cc.log('Error url [' + err[i] + ']: ' + results.getError(err[i]));
                return;
            }
            callBack(results);
        });
    },
    

}
module.exports = MessageManager;