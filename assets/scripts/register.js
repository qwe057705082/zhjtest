

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        // console.log("base", base)
    },
    initData() {
        this.username = null;
        this.password = null;
    },
    clickEvent() {
        this.initData();
        this.bindNode();
        console.log("设置昵称");
        this.username = this.getEditBox(this.usernameNode)
        this.password = this.getEditBox(this.passwordNode)
        this.sendOne();
    },
    sendOne() {
        if (this.username && this.password) {
            window.socket.send(JSON.stringify({
                "eventCode": 101,
                "account": this.username,
                "password": this.password,
            }));
        } else {
            console.log("登录数据异常--可能为空")
        }

    },
    getEditBox(node) {
        let result = node.getComponent(cc.EditBox).string
        return result
    },
    init() {

        base.setActive(this.setRoomNode, false)
        base.setActive(this.getRoomNode, false)
    },
    bindNode() {
        this.setRoomNode = cc.find('Canvas/setRoom')
        this.getRoomNode = cc.find('Canvas/getRoom')
        this.usernameNode = cc.find("Canvas/register/username")
        this.passwordNode = cc.find("Canvas/register/password")
    },
    bindEvent() {

    },
    start() {

    },

    // update (dt) {},
});
