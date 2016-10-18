
let AudioManager = cc.Class({
    ctor() {
        this.notify = require('NotifyName');
        this.noti = require('Notification');
        let ls = cc.sys.localStorage;
        let musicState;
        if (ls.getItem('isMusic') == 'ON') {
            musicState = true;
        } else if (ls.getItem('isMusic') == 'OFF') {
            musicState = false;
        } else {
            ls.setItme('isMusic', 'ON');
            musicState = true;
        }
        this.noti.postNoti(this.notify.MUSIC_STATE_CHANGE, musicState);
    }
})
module.exports = AudioManager;