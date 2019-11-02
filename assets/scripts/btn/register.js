

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initData();
        this.bindNode();
        this.bindEvent()
        console.log("222")
        // console.log("base", base)
    },
    initData() {
        this.username = null;
        this.password = null;
    },
    bindEvent(){
        let self=this;
        this.node.on('touchend',function(){
            self.clickEvent()
        })

    },
    clickEvent() {
        console.log("设置昵称");
        this.username = this.getEditBox(this.usernameNode)
        this.password = this.getEditBox(this.passwordNode)
        this.sendOne();
    },
    sendOne() {
        let self = this;
        console.log('this.username',this.username)
        console.log('this.password',this.password)
        if (this.username && this.password) {
            window.socket.send(JSON.stringify({
                "eventCode": 101,
                "account": self.username,
                "password": self.password,
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
    start() {
      
    },

    // update (dt) {},
});
