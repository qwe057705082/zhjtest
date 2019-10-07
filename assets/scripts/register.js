let base = require('../resource/base/base')

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    clickEvent() {
        console.log("设置昵称")
        let inputNode = cc.find("Canvas/register/input")
        let str = inputNode.getComponent(cc.EditBox).string;
        window.socket.send(JSON.stringify({
            "eventCode": 101,
            "nickName": str,
        }));
    },
    init() {
        this.bindNode();
        base.setActive(this.setRoomNode, false)
        base.setActive(this.getRoomNode, false)
    },
    bindNode() {
        this.setRoomNode = base.find('Canvas/setRoom')
        this.getRoomNode = base.find('Canvas/getRoom')
    },
    bindEvent() {

    },
    start() {

    },

    // update (dt) {},
});
