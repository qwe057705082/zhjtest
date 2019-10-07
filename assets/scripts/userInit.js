let base = new (require('../resource/base/base'))();
cc.Class({
    extends: cc.Component,
    properties: {
        userName: {
            get: function () {

            },
            set: function (value) {
                base.setLabelStr(this.userNameNode, value)
            },
        },
        numberCard: {
            get: function () {
            },
            set: function (newVaule) {
                base.setLabelStr(this.numNode, newVaule)
            }
        },
        price: {
            get: function () {

            },
            set: function (value) {
                base.setLabelStr(this.priceNode, value)
            }
        },
        seatNo: {
            get: function () {

            },
            set: function (value) {
                base.setLabelStr(this.seatNoNode, value)
            }
        },
        count: {
            get: function () {

            },
            set: function (value) {
                base.setLabelStr(this.countNode, value)
            }
        }
    },
    // LIFE-CYCLE CALLBACKS:
    base(node, value) {
        if (node) {
            node.getComponent(cc.Label).string = value;
        }
    },
    onLoad() {
        let self = this;
        this.bindNode();
        let index = 1;
        this.newSeatNo = 0;
        this.playerId = 0;

    },
    updateData(numberCard) {
        this.numberCard = '牌数:' + numberCard;
    },
    updateName(userName) {
        this.userName = userName;
    },
    updatePrice(data) {
        this.price = '奖：' + data;

    },
    updateSeatNo(data) {
        this.seatNo = data;
        this.newSeatNo = data

    },
    updatePlayerId(data) {

        this.playerId = data;

    },
    updateCount(data,state) {
        this.count = data
        base.setActive(this.countNode, state)
        if(state){
            this.setCountDown(data)
        }
    },
    bindNode() {
        this.priceNode = cc.find('price', this.node)
        this.userNameNode = cc.find('name', this.node)
        this.numNode = cc.find('num', this.node)
        this.seatNoNode = cc.find("seatNo", this.node)
        this.countNode = cc.find("count", this.node)
    },
    setCountDown(time, cb) {
        let self=this;
        window.clearInterval()  // 去除定时器
        let v2 = window.setInterval(function () {
            time--;
            self.count=time;
            if (time==0 ||self.countNode==false) {
                self.count=0;
                window.clearInterval(v2)  // 去除定时器
            }
        }, 1000)
    
  
    },
    start() {

    },

    // update (dt) {},
});
