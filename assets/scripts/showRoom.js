let base = new (require('../resource/base/base'))();

cc.Class({
    extends: cc.Component,

    properties: {
        roomId: {
            get: function () {

            },
            set: function (value) {
                console.log("this.roomIdNode",this.roomIdNode,value)
                base.setLabelStr(this.roomIdNode, "房间:" + value)
            },
        },
        people: {
            get: function () {

            },
            set: function (value) {
                base.setLabelStr(this.peopleNode, "人数:" + value)
            },
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.bindNode();
        this.bindEvent();
    },
    //更新玩家的房间数
    updateRoomId(data) {
        this.roomId = data;
        this.idx = data;
    },
    //更新玩家的人数
    updatepeople(data) {
        this.people = data;
    },
    bindNode() {
        this.roomIdNode = cc.find('Background/roomId', this.node)
        this.peopleNode = cc.find('Background/people', this.node)
    },
    bindEvent() {
        this.node.off('touchstart', this.touchBegan, this)
        this.node.on('touchstart', this.touchBegan, this)
    },
    touchBegan: function (event) {
        window.socket.send(JSON.stringify({
            "eventCode": 103,
            "roomId":this.idx,
        }));
    },
    // update (dt) {},
});
