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
        },
        score: {
            get: function () {

            },
            set: function (value) {
                base.setLabelStr(this.scoreNode, value)
            }
        },

    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        let self = this;

        let index = 1;
        this.newSeatNo = 0;
        this.playerId = 0;


    },
    init(data) {
        this.bindNode();
        //玩家名字
        this.updateName(data.nickName)
        //玩家座位号
        this.updateSeatNo(data.seatNo)
        //玩家id
        this.updatePlayerId(data.playerId)
        let whereToGo = this.getDirection(data)
        //位置
        this.initPosition(whereToGo)
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
    updateCount(state) {
        base.setActive(this.countNode, state)

    },
    updateScore(data) {
        this.score = '分:'+data;
    },
    bindNode() {
        this.priceNode = cc.find('price', this.node)
        this.userNameNode = cc.find('name', this.node)
        this.numNode = cc.find('num', this.node)
        this.seatNoNode = cc.find("seatNo", this.node)
        this.countNode = cc.find("count", this.node)
        this.scoreNode = cc.find('score', this.node)
    },
    setCountDown(time, cb) {
        let self = this;
        window.clearInterval()  // 去除定时器
        let v2 = window.setInterval(function () {
            time--;
            self.count = time;
            if (time == 0 || self.countNode == false) {
                self.count = 0;
                window.clearInterval(v2)  // 去除定时器
            }
        }, 1000)

    },
    //me ,left,right,up
    initPosition(n) {
        switch (n) {
            case "me": ; break;
            case "left": this.node.x = -600; break;
            case "right": ; break;
            case "up": this.node.y = 250; break;
            default: console.log("传入的参数不对")
        }
        //设定本尊的位置
        if (n == "me") {
            this.node.setPosition(0, -350)
            this.scoreNode.setPosition(180, -27)
            this.priceNode.setPosition(320, -27)
            this.userNameNode.setPosition(-350, -27)
            this.seatNoNode.setPosition(-500, -27)
            this.numNode.setPosition(500, -25)

            this.setSize(this.userNameNode)
            this.setSize(this.seatNoNode)
            this.setSize(this.priceNode)
            this.setSize(this.numNode)
        }
        //右侧玩家的位置
        if (n == "right") {
            this.node.setPosition(600, 0)
            this.numNode.setPosition(-140, 29)
            this.scoreNode.setPosition(-140, -40)
            this.seatNoNode.setPosition(116, 29)
        }


    },
    //setSize
    setSize(node) {
        if (node) {
            node.getComponent(cc.Label).fontSize = 50;
            node.getComponent(cc.Label).lineHeight = 50;
        }

    },
    //根据座位号来获取所坐的位置
    getDirection(data) {
        let who = '';
        if (data.seatNo == tp.info.seatNo) {
            who = "me"
        } else {
            console.log(data.seatNo, tp.info.seatNo)
            if (this.numBeealoon(tp.info.seatNo) == this.numBeealoon(data.seatNo)) {
                who = "up"
            } else {
                if (tp.info.seatNo == 2 || tp.info.seatNo == 3) {
                    if (tp.info.seatNo < data.seatNo) {
                        who = "right"
                    } else if (tp.info.seatNo > data.seatNo) {
                        who = "left"
                    }
                } else {
                    //判断4和1
                    if (tp.info.seatNo == 1) {
                        if (data.seatNo - tp.info.seatNo == 1) {
                            who = "right"
                        } else {
                            who = "left"
                        }
                    } else if (tp.info.seatNo == 4) {
                        if (tp.info.seatNo - data.seatNo == 1) {
                            who = "left"
                        } else {
                            who = "right"
                        }
                    }
                }
            }
        }
        return who
    },
    //判断偶数为true，奇数为false
    numBeealoon(seatNo) {
        return seatNo % 2 == 0 ? true : false
    },
    start() {

    },

    // update (dt) {},
});
