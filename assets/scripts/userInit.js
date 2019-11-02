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
        ready: {
            get: function () {

            },
            set: function (value) {
                base.setActive(this.readyNode, value)
            }
        }

    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {

    },
    init(data, i) {
        this.index = i + 1
        this.nickName = data.nickName
        this.bindNode();
        //玩家名字
        this.updateName(data.nickName)
        // //玩家座位号
        // this.updateSeatNo(data.seatNo)
        //玩家id
        this.updatePlayerId(data.playerId)
        let whereToGo = this.getDirection(data)
        //位置
        this.initPosition(whereToGo)
        this.setAvator()
        this.bindEvent()
    },

    updateData(numberCard) {
        this.numberCard = numberCard;
    },
    updateName(userName) {
        this.userName = userName;
    },
    updatePrice(data) {
        this.price = data;

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
        this.score = '分:' + data;
    },
    updateReady(result) {
        this.ready = result
        // if (!tp.status) {
        //     if (tp.info.playerId == this.playerId && result) {
        //         base.setActive(this.scriptNode.redyBtnNode, false)
        //     }
        //     if (tp.info.playerId == this.playerId && result == false) {
        //         base.setActive(this.scriptNode.redyBtnNode, true)
        //     }
        // }

    },
    bindNode() {
        this.scriptNode = cc.find("Canvas/script").getComponent(cc.Component)
        this.priceNode = cc.find('price', this.node)
        this.userNameNode = cc.find('name', this.node)
        this.numNode = cc.find('num', this.node)
        this.countNode = cc.find("count", this.node)
        this.scoreNode = cc.find('score', this.node)
        this.bonusPokersNode = cc.find('price/bonusPokers', this.node)
        this.readyNode = cc.find('ready', this.node)
        this.showPokeNode = cc.find('showPoke', this.node)
        this.bgNode = cc.find('bg', this.node)
        this.maskNode = cc.find('mask', this.node)
        this.avatorNode = cc.find('mask/avator', this.node)
        this.priceBgNode = cc.find('price/priceBg', this.node)
    },
    bindEvent() {
        let self = this;
        this.priceBgNode.on("touchmove", function () {
            self.bonusPokersNode.active = true
        })
        this.priceBgNode.on("touchend", function () {
            self.bonusPokersNode.active = self.bonusPokersNode.active ? false : true
        })
        this.priceBgNode.on("touchcancel", function () {
            self.bonusPokersNode.active = false
        })
    },
    setAvator() {
        let str = '';
        let atlas = '';
        if (this.nickName == 'wly') {
            str = 'WJTX-MSN-0'
            atlas = this.scriptNode.avator1
        } else {
            str = 'WJTX-MAN-0'
            atlas = this.scriptNode.avator2
        }
        this.avatorNode.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(str + this.index)

    },
    ubPokers(node) {

        node.parent = this.bonusPokersNode
        this.bonusPokersNode.active = false
    },
    removeUbpokers() {
        this.bonusPokersNode.removeAllChildren()
    },
    showBonus(data) {
        let newData = {};
        if (data) {
            for (let i = 0; i < data.length; i++) {
                newData.level = data[i].level
                newData.type = data[i].type
                newData.list = false;
                let node = this.scriptNode.pokeNode(newData)
                node.parent = this.bonusPokersNode;
                node.x = 0;
                node.y = 0;
                node.scaleX = 0.35;
                node.scaleY = 0.35;
            }
        } else {
            console.log("数据为空")
        }

    },
    setParent(node) {
        node.parent = this.showPokeNode
    },
    removeShowPoke() {
        this.showPokeNode.removeAllChildren(true)
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
            case "me": this.node.setPosition(0, -400); break;
            case "left": this.node.setPosition(-700, 0); break;
            case "right": this.node.setPosition(700, 0); break;
            case "up": this.node.setPosition(0, 250); break;
            default: console.log("传入的参数不对")
        }
        //设定本尊的位置
        if (n == "me") {
            this.countNode.setPosition(0,300)
            this.readyNode.setPosition(0, 250)
            this.scoreNode.setPosition(180, -27)
            this.priceNode.setPosition(-340, -28)
            // this.priceNode.setScale(0.9,0.9)
            this.userNameNode.setPosition(-340, 20)
            this.numNode.setPosition(500, -25)
            this.bonusPokersNode.setPosition(200, 20)
            this.showPokeNode.setPosition(0, 300)
            this.setMeSize(this.userNameNode, 50)
            this.setFontSize(this.priceNode, 25)
            this.setMeSize(this.numNode, 50)
            this.bgNode.setScale(0.9, 0.9)
            this.bgNode.setPosition(-400, -10)
            this.maskNode.setPosition(-485, -10)
            this.bgNode.getComponent(cc.Sprite).spriteFrame = this.scriptNode.redAtlas.getSpriteFrame('User_02')
        }
        //右侧玩家的位置
        if (n == "right") {
            this.countNode.setPosition(-400,0)
            this.numNode.setPosition(-140, 80)
            this.scoreNode.setPosition(-150, 20)
            this.showPokeNode.setPosition(-400, 0)
            this.bonusPokersNode.setAnchorPoint(1, 0.5)
            this.bonusPokersNode.setPosition(-100, 0)
        }
        if (n == "left") {
            this.countNode.setPosition(400,0)
            this.showPokeNode.setPosition(400, 0)
            // this.bonusPokersNode.setPosition(250, 0)
        }
        if (n == 'up') {
            this.priceNode.setPosition(140, -12)
        }
        this.setPs()
    },
    setPs() {
        return { x: this.node.x + this.scoreNode.x, y: this.node.y + this.scoreNode.y+30 }
        this.pricePs = this.scoreNode.getPosition()
    },
    reMoveBonus() {
        this.bonusPokersNode.removeAllChildren(true)
    },
    setFontSize(node, size) {
        if (node) {
            node.getComponent(cc.Label).fontSize = size;
        }

    },
    //setSize
    setMeSize(node, size) {
        if (node) {
            node.getComponent(cc.Label).fontSize = size;
            node.getComponent(cc.Label).lineHeight = size;
        }
    },
    //根据座位号来获取所坐的位置
    getDirection(data) {
        let who = '';
        if (data.seatNo == tp.info.seatNo) {
            who = "me"
        } else {
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
