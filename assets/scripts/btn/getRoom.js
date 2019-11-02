let base = new (require('../../resource/base/base'))();


cc.Class({
    extends: cc.Component,

    properties: {
        roomId: {
            get: function () {

            },
            set: function (value) {
                base.setLabelStr(this.roomIdNode, "获取房间:" + value)
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
            "eventCode": 102,
        }));
    },
    updateRoomId(roomId) {
        this.roomId = roomId;
    },
    bindNode() {
        this.roomIdNode = cc.find('getRoomId', this.node)
    },

    // update (dt) {},
});
