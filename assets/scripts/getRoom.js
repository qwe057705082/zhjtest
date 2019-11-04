let base = new (require('../resource/base/base'))();

cc.Class({
    extends: cc.Component,

    properties: {
        roomId: {
            get: function () {

            },
            set: function (value) {
                base.setLabelStr(this.roomIdNode, "获取房间:"+value)
            },
        },

    },
    clickEvent() {
        console.log("获取房间号")
        window.socket.send(JSON.stringify({
            "eventCode": 102,
        }));
    },
    updateRoomId(roomId) {
        console.log("roomId",roomId)
        this.roomId = roomId;
    },
    bindNode() {
        this.roomIdNode = cc.find('getRoomId', this.node)
    },
    start() {
        this.bindNode()
    },

    // update (dt) {},
});
