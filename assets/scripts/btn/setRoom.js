let base = new (require('../../resource/base/base'))();


cc.Class({
    extends: cc.Component,

    properties: {
        roomId: {
            get: function () {

            },
            set: function (value) {
                base.setLabelStr(this.roomIdNode, "创建房间:" + value)
            },
        },
    },
    onLoad() {
        this.bindNode()
        this.bindEvent();
    },
    bindEvent() {
        let self = this;
        this.node.on("touchend", function () {
            self.clickEvent()
        })
    },
    clickEvent() {
        window.socket.send(JSON.stringify({
            "eventCode": 108,
        }));
    },
    updateRoomId(roomId) {
        this.roomId = roomId;
    },
    bindNode() {
        this.roomIdNode = cc.find('roomId', this.node)
    },
});
