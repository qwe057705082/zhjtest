

let base = new (require('../resource/base/base'))();

cc.Class({
    extends: cc.Component,

    properties: {
        smallKing: cc.Prefab,
        bigKing: cc.Prefab,
        poke: cc.Prefab,
        mySelfPoke: cc.Node,
        userInfoNode: cc.Node,
        playerPrefab: cc.Prefab,
        roomPrefab: cc.Prefab,
        reWardPokePrefab: cc.Prefab,
        cpPrefab: cc.Prefab,
        settlePrefab: cc.Prefab,
        redAtlas: {
            //图集
            default: null,
            type: cc.SpriteAtlas
        },
        avator1: {
            //图集
            default: null,
            type: cc.SpriteAtlas
        },
        avator2: {
            default: null,
            type: cc.SpriteAtlas
        },
        Win: cc.Font,
        Less: cc.Font,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //自己数组
        this.cardArr = [];
        //中间显示数组
        this.centerArr = [];
        this.localUserInfo = [];
        this.pokeNumber = 41;
        this.scoreInfos =
            [
                { playerId: 1, score: 0 },
                { playerId: 2, score: 0 },
                { playerId: 3, score: 0 },
                { playerId: 4, score: 0 },
            ];
        this.whoScoreChange = null
        // this.onGameEvent();
        this.initNodePools();
        this.bindNode();
        this.bindEvent();
        this.initNode();
        this.socketConnect();
        this.showOrHide()
        // tp.info.playerId = 1;
        // let data = {};
        // data.players = tp.testplayers
        // tp.info.players = tp.testplayers
        // this.connectPlayes(data)
        // this.inTurn(1)
        // this.showPoke(tp.pokers)
        // this.updatePlay(tp.clientInfos)
        // this.updateSmallBonus(tp.clientInfos)
        // this.updateRoomScore(100)
        // this.updateScore(tp.scores)
        // this.cancelReadyUI()
        //测试结算
        // this.cancelShowPoke()
        // this.scheduleOnce(()=>{
        //     this.settletotal(tp.settle)
        // },2)

    },
    onGameEvent() {
        let self = this;
        if (window.socket) {
            window.socket.onopen = function (event) {
                console.log("联接开始！")
                // base.setActive(self.registerNode, true)
                // self.postNode.getComponent(cc.Component).sendOne();

            }
            window.socket.onclose = function (err) {
                console.log("socket关闭后收到的onclose事件");
            };
            //收到消息
            window.socket.onmessage = function (event) {
                let data = JSON.parse(event.data)
                console.log("成功获取的数据：", data.eventCode, data)


                if (data.eventCode == 101) {
                    if (data.errorCode == 0) {
                        self.getInfoIDName(data.data)
                        // //显示用户信息
                        self.showInfo()
                        base.setActive(self.chooseRoomNode, false)
                        base.setActive(self.registerNode, false)
                        base.setActive(self.getRoomNode, true)
                        base.setActive(self.setRoomNode, true)
                    } else {
                        console.log("报错了")
                    }

                }
                //获取房间号102
                if (data.eventCode == 102) {
                    tp.info.roomList = data.data.roomList;
                    self.getRoom(data.data.roomList);

                }
                //加入房间103
                if (data.eventCode == 103) {
                    self.userInfoNode.removeAllChildren(true)
                    self.connectPlayes(data.data);
                    base.setActive(self.exitNode, true)

                    base.setActive(self.getRoomNode, false)
                    base.setActive(self.setRoomNode, false)
                    base.setActive(self.chooseRoomNode, false)

                }
                //104出牌
                if (data.eventCode == 104) {
                    if (data.errorCode == 1) {
                        console.log("不符合规则-------")
                    } else {
                        self.showPoke(data.data.pokers, true)
                        self.playCardSuccess();
                    }
                }
                if (data.eventCode == 105) {
                    if (data.errorCode == 0) {
                        self.inTurn(data.data.nextPlayerId)
                    } else {
                        console.log("不能过牌")
                    }
                }
                if (data.eventCode == 106) {
                    if (data.errorCode == 0) {
                        if (data.data) {
                            self.exitRoom(data.data.exitPlayer.playerId)
                        } else {
                            self.meExit()
                        }

                        // base.setActive(self.exitNode, false)
                    }

                }
                if (data.eventCode == 107) {
                    if (data.errorCode == 0) {
                    }
                }
                //创建房间号108
                if (data.eventCode == 108) {
                    tp.roomId = data.data.roomId;
                    self.setRoom()
                    base.setActive(self.chooseRoomNode, false)
                    base.setActive(self.getRoomNode, false),
                        base.setActive(self.exitNode, true)
                    // console.log("成功创建房间号", data)
                }
                //有鬼的都要从这里走一下
                if (data.eventCode == 109) {
                    let placeInfo = data.data.placeInfo
                    self.changePoke(placeInfo)
                }
                if (data.eventCode == 110) {
                    self.showPoke(data.data.pokers, true)
                }
                //112
                if (data.eventCode == 112) {
                    self.state(data.data);
                }
                //准备
                if (data.eventCode == 113) {
                    if (data.errorCode == 0) {
                        if (data.data.playerId == tp.info.playerId) {
                            base.setActive(self.redyBtnNode, false)
                            self.cancelShowPoke();
                            base.setActive(self.allSttleNode, false)

                        }
                        let node = self.getUserByPlayerId(data.data.playerId)
                        node.getComponent(cc.Component).updateReady(true)
                    } else {
                        console.log("报错了113")
                    }

                }
                //玩家分数的变动
                if (data.eventCode == 202) {
                    tp.scoreInfos = data.data.scoreInfos;
                    self.updateScore(data.data.scoreInfos)

                }
                //广播玩家操作203
                if (data.eventCode == 203) {

                    //展示一波数据
                    self.centerShowPoke(data.data)
                    self.inTurn(data.data.nextPlayerId)
                    self.updateNumberCard(data.data)
                }
                //桌面分数变动
                if (data.eventCode == 204) {
                    self.updateRoomScore(data.data.roomScore)
                }
                if (data.eventCode == 205) {
                    tp.status = false
                    base.setActive(self.redyBtnNode, true)
                    self.settletotal(data.data.playerList);
                    self.changeButton(false, false, false)
                }
                //206
                if (data.eventCode == 206) {
                    if (data.data.pokers == undefined) {
                        return
                    }
                    //属于206点的初始化

                    base.setActive(self.redyBtnNode, false)
                    tp.clientInfos = data.clientInfos;
                    self.updatePlay(data.data.clientInfos)
                    self.scheduleOnce(() => {
                        self.inTurn(data.data.nextPlayerId)
                        self.cancelShowPoke()
                    }, 4)
                    self.statrInit(data.data)
                    self.cancelReadyUI()
                    self.updateSmallBonus(data.data.clientInfos)
                }
                //显示队友的牌
                if (data.eventCode == 208) {
                    self.showPoke(data.data.pokers, false)
                }
            }

        }
    },
    updateRoomScore(result) {
        base.setActive(this.roomScoreNode, true)
        base.setLabelStr(this.roomScoreNode, '分:' + result)
    },
    meExit() {
        tp.info.players = []
        this.setRoomNode.getComponent(cc.Component).updateRoomId("");
        this.getRoomNode.getComponent(cc.Component).clickEvent()
        this.userInfoNode.removeAllChildren(true);
        base.setActive(this.allSttleNode, false)
        base.setActive(this.redyBtnNode, false)
        base.setActive(this.getRoomNode, true)
        base.setActive(this.setRoomNode, true)
    },
    //判断是否退出房间
    exitRoom(playerId) {
        if (playerId) {
            if (playerId == tp.info.playerId) {
                this.meExit()
            } else {
                let node = this.getUserByPlayerId(playerId)
                this.playerPool.put(node)
            }
        }
    },

    //取消准备的ui
    cancelReadyUI() {
        let players = tp.info.players
        for (let i = 0; i < players.length; i++) {
            let node = this.getUserByPlayerId(players[i].playerId)
            node.getComponent(cc.Component).updateReady(false)
        }
    },
    //206初始化
    statrInit(data) {
        tp.status = true

        //由于数据延时发射
        this.showPoke(data.pokers, true);

    },
    connectPlayes(data) {
        //全局的players
        tp.info.players = data.players
        // //获取本家id
        this.getMeSeatNo(data.players)
        //玩家初始化
        this.playerInit(data.players)
    },
    //获取infoIDName
    getInfoIDName(data) {
        if (data) {
            tp.info.nickName = data.nickName;
            tp.info.playerId = data.playerId;
        }

    },
    //重新进来状态的判断
    state(data) {
        this.connectPlayes(data);
        base.setActive(this.registerNode, false)
        base.setActive(this.setRoomNode, false)
        base.setActive(this.getRoomNode, false)
        base.setActive(this.exitNode, true)
        if (data.roomStatus == 'STARTING') {
            this.statrInit(data)
            this.inTurn(data.nextPlayerId)
            this.updateBonus(data)
            //当前谁打牌
            let newArr = { playerId: data.lastPlayerId, pokers: data.lastPokers }
            this.centerShowPoke(newArr)
            this.updateSmallBonus(data.players)
        }
        //判断是否准备
        this.judgeReady(data)


    },
    //更新奖数
    updateBonus(data) {

        let playersInfo = data.players
        for (let i = 0; i < playersInfo.length; i++) {
            let node = this.getUserByPlayerId(playersInfo[i].playerId)
            node.getComponent(cc.Component).updatePrice(playersInfo[i].bonusNum)
            node.getComponent(cc.Component).updateScore(playersInfo[i].score)
        }
    },

    //判断是否准备
    judgeReady(data) {
        let players = data.players
        for (let i = 0; i < players.length; i++) {
            let node = this.getUserByPlayerId(players[i].playerId)
            node.getComponent(cc.Component).updateReady(players[i].ready)
        }
    },
    socketConnect() {
        window.socketInit();
    },
    showOrHide() {
        let self = this;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            window.socket.close();
        });

        cc.game.on(cc.game.EVENT_SHOW, function () {
            self.socketConnect();

        });
    },
    //展示奖
    setBonus(data) {
        for (let i = 0; i < data.length; i++) {
            let node = this.getUserByPlayerId(data[i].playerId)
            node.getComponent(cc.Component).showBonus(data[i].bonusPokers)
        }
    },
    //分数更新
    updateScore(data) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < this.scoreInfos.length; j++) {
                if (this.scoreInfos[j].playerId == data[i].playerId) {
                    let changeScore = data[i].score - this.scoreInfos[j].score
                    if (changeScore > 0) {
                        this.whoScoreChange = data[i].playerId
                    }
                }
            }
        }
        let callBack = cc.callFunc(() => {
            this.scoreInfos = data
            for (let i = 0; i < data.length; i++) {
                let node = this.getUserByPlayerId(data[i].playerId)
                node.getComponent(cc.Component).updateScore(data[i].score)
            }
            this.roomScoreNode.setPosition(0, 30)
            this.roomScoreNode.active = false
        })
        let node = this.getUserByPlayerId(this.whoScoreChange)
        let targetNodePs = node.getComponent(cc.Component).setPs()
        if (this.roomScoreNode) {
            this.roomScoreNode.runAction(
                cc.sequence(
                    cc.moveTo(1, targetNodePs),
                    callBack
                ))
        }

    },
    //结算
    settletotal(data) {
        this.allSttleNode.active = true
        this.allSttleContentNode.removeAllChildren(true)
        for (let i = 0; i < data.length; i++) {
            let node = this.getSettleNode();
            let nameNode = base.find("name", node)
            let winNumberNode = base.find("winNumber", node)
            let font = this.Win
            if (data[i].winNumber >= 0) {
                data[i].winNumber += ''
                base.setFont(winNumberNode, this.win)
            } else {
                font = this.Less
            }
            base.setFont(winNumberNode, font)
            base.setLabelStr(nameNode, data[i].nickName)
            base.setLabelStr(winNumberNode, data[i].winNumber)
            node.parent = this.allSttleContentNode;
            // this.onlyData(data[i])
        }
    },
    //获取结算的预制
    getSettleNode() {
        let node = cc.instantiate(this.settlePrefab)
        return node
    },
    //更新牌数
    updateNumberCard(data) {
        let node = this.getUserByPlayerId(data.playerId)
        if (node) {
            node.getComponent(cc.Component).updateData(data.playerPokersNum)
        }
    },
    //判断鬼变成啥数据
    changePoke(data) {
        if (data.length == 0) {
            return
        }
        //一张鬼
        if (data.length == 1) {
            let newData = data[0]
            //只有一种可能一头鬼
            if (newData.length == 1) {
                for (let i = 0; i < tp.playCardData.length; i++) {
                    if (tp.playCardData[i].index == newData[0].index) {
                        tp.playCardData[i].place = newData[0].poker.level

                    }
                }
            } else {
                //多张鬼一种可能
                for (let i = 0; i < newData.length; i++) {
                    for (let j = 0; j < tp.playCardData.length; j++) {
                        if (tp.playCardData[j].index == newData[i].index) {
                            tp.playCardData[j].place = newData[i].poker.level
                        }
                    }
                }

            }
            // console.log("我执行了这里")
            this.playCardTounch();
        } else {
            //1张多张鬼   多种可能
            this.getChangePoke(data)
        }

    },
    //按钮的变化
    changeButton(a, b, c) {
        //出牌
        base.setActive(this.playBtnNode, b)
        //过牌
        base.setActive(this.passBtnNode, c)
    },
    //轮到哪位玩家操作
    inTurn(playerId) {
        for (let i = 0; i < tp.info.players.length; i++) {
            let node = this.getUserByPlayerId(tp.info.players[i].playerId)
            node.getComponent(cc.Component).updateCount(false)
        }
        let nowNode = this.getUserByPlayerId(playerId)
        nowNode.getComponent(cc.Component).updateCount(true)
        if (tp.info.playerId == playerId) {
            this.changeButton(true, true, true)
        } else {
            this.changeButton(false, false, false)
        }
    },

    //通过单个数组获取节点
    getUserByPlayerId(playerId) {
        let node = null
        let players = tp.info.players;
        for (let i = 0; i < players.length; i++) {
            if (players[i].playerId == playerId) {
                node = this.userInfoNode.children[i]
            }
        }
        return node
    },
    //更新小的牌的奖
    updateSmallBonus(data) {
        let players = tp.info.players
        for (let i = 0; i < players.length; i++) {
            let node = this.getUserByPlayerId(players[i].playerId)
            node.getComponent(cc.Component).removeUbpokers()
        }
        for (let i = 0; i < data.length; i++) {
            let bonusPokers = data[i].bonusPokers
            let playerId = data[i].playerId
            for (let j = 0; j < bonusPokers.length; j++) {
                let newPokeData = { idx: j, level: bonusPokers[j].level, type: bonusPokers[j].type, list: false };
                let node = this.pokeNode(newPokeData);
                let userInfoNode = this.getUserByPlayerId(playerId)
                userInfoNode.getComponent(cc.Component).ubPokers(node)
            }
        }
    },
    //更新其他玩家的信息
    updatePlay(data) {
        for (let i = 0; i < data.length; i++) {
            this.scoreInfos[i].playerId = data[i].playerId
            let node = this.getUserByPlayerId(data[i].playerId)
            let arr = { pokers: data[i].bonusPokers, playerId: data[i].playerId }
            node.getComponent(cc.Component).updateData(41)
            node.getComponent(cc.Component).updateScore(0)
            node.getComponent(cc.Component).updatePrice(data[i].bonusNum)
            //第一次显示牌

            this.onlyData(arr)
        }
    },
    //更新自己的数据
    updateMe(data) {
        base.setLabelStr(this.mePriceNdoe, "奖:" + data.bonusNum)
    },

    initNode() {
        base.setActive(this.redyBtnNode, false)
        base.setActive(this.setRoomNode, false)
        base.setActive(this.getRoomNode, false)
        base.setActive(this.registerNode, false)
    },
    //构建对象池
    initNodePools() {
        //构建poke对象池
        let pokePool = new cc.NodePool();
        for (let i = 0; i < 30; i++) {
            let node = cc.instantiate(this.poke)
            pokePool.put(node)
        }
        let smallKingPool = new cc.NodePool();
        for (let i = 0; i < 30; i++) {
            let node = cc.instantiate(this.smallKing)
            smallKingPool.put(node)
        }
        let bigKingPool = new cc.NodePool();
        for (let i = 0; i < 30; i++) {
            let node = cc.instantiate(this.bigKing)
            bigKingPool.put(node)
        }
        //构建用户
        let playerPool = new cc.NodePool();
        for (let i = 0; i < 30; i++) {
            let node = cc.instantiate(this.playerPrefab)
            playerPool.put(node)
        }
        let roomPool = new cc.NodePool();
        for (let i = 0; i < 30; i++) {
            let node = cc.instantiate(this.roomPrefab)
            roomPool.put(node)
        }
        let reWardPokePool = new cc.NodePool();
        for (let i = 0; i < 30; i++) {
            let node = cc.instantiate(this.reWardPokePrefab)
            reWardPokePool.put(node)

        }
        this.reWardPokePool = reWardPokePool;
        this.roomPool = roomPool;
        this.playerPool = playerPool;
        this.bigKingPool = bigKingPool;
        this.smallKingPool = smallKingPool;
        this.pokePool = pokePool;
    },
    //获取在选牌的问题
    getChangePoke(data) {
        for (let i = 0; i < data.length; i++) {
            let group = data[i]
            let node = this.getNodeCp();
            let BackgroundNode = cc.find('Background', node)
            for (let j = 0; j < group.length; j++) {
                let newData = {};
                newData.level = group[j].poker.level
                newData.type = group[j].poker.type
                newData.index = group[j].index
                newData.list = false;
                let nodePoke = this.pokeNode(newData)
                nodePoke.scaleX = 0.3;
                nodePoke.scaleY = 0.3;
                nodePoke.parent = BackgroundNode;
            }
            node.getComponent(cc.Component).init(group)
            node.parent = this.againNode
        }

    },

    //获取cpPrefab
    getNodeCp() {
        let node = cc.instantiate(this.cpPrefab)
        return node
    },
    //获取房间的UI
    getRoom(data) {
        let str = '';
        if (data.length == 0) {
            console.log("获取的房间为空")
        }
        //回收
        this.backRoomButton()
        for (let i = 0; i < data.length; i++) {
            let node = this.roomPool.get();
            if (node == null) {
                node = cc.instantiate(this.roomPrefab)
            }
            node.parent = this.getRoomIdNode
            node.getComponent(cc.Component).updateRoomId(data[i].roomId)
            node.getComponent(cc.Component).updatepeople(data[i].currentPeople)
        }
    },
    //回收roomButoon按钮
    backRoomButton() {
        for (let i = 0; i < this.getRoomIdNode.children.length; i++) {
            this.roomPool.put(this.getRoomIdNode.children[0])
        }
        //后面一个for解决残留的按钮
        for (let i = 0; i < this.getRoomIdNode.children.length; i++) {
            this.roomPool.put(this.getRoomIdNode.children[0])
        }
    },
    //创建房间的ui
    setRoom() {
        this.setRoomNode.getComponent(cc.Component).updateRoomId(tp.roomId);
    },
    // 获取用户显示
    showInfo() {
        base.setLabelStr(this.chooseRoomNode, "用户:" + tp.info.nickName)
    },
    //注册后隐藏事件
    registerHide() {
        base.setActive(this.registerNode, false)
        base.setActive(this.postNode, false)
    },
    //获取本家座位号
    getMeSeatNo(data) {
        for (let i = 0; i < data.length; i++) {
            //先获取seatNo
            if (data[i].playerId == tp.info.playerId) {
                tp.info.seatNo = data[i].seatNo
            }
        }
    },
    playerInit(data) {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                //判断节点是否存在
                if (this.userInfoNode.children[i]) {
                    continue
                } else {
                    let node = this.playerNode();
                    node.parent = this.userInfoNode;
                    node.setPosition(0, 0)
                    node.getComponent(cc.Component).init(data[i], i)
                    node.getComponent(cc.Component).updateReady(data[i].ready)
                }
                if (data[i].ready && data[i].playerId == tp.info.playerId) {
                    base.setActive(this.redyBtnNode, false)
                }
                if (data[i].ready == false && data[i].playerId == tp.info.playerId) {
                    base.setActive(this.redyBtnNode, true)
                }
            }
        } else {
            console.log("数据异常")
        }

    },
    //玩家
    playerNode() {
        let node = this.playerPool.get();
        if (node == null) {
            node = cc.instantiate(this.playerPrefab)
        }
        return node
    },
    initShowPoke(pokers) {
        this.mySelfPoke.removeAllChildren();
        tp.pokers = pokers;
        this.cardArr = []
        //在重新排序后选牌应该初始化
        this.playCardDataInit();
        if (pokers.length > 18) {
            tp.width = (this.pokeNumber / pokers.length) * 34
        } else {
            tp.width = 75
        }
    },
    showPoke(data, list) {
        this.initShowPoke(data)
        for (let i = 0; i < data.length; i++) {
            let newPokeData = { idx: i, level: data[i].level, type: data[i].type, list: list };
            let node = this.pokeNode(newPokeData);
            node.parent = this.mySelfPoke;
            node.isChiose = false;
            node.status = 'down';
            node.level = data[i].level;
            this.cardArr.push(node);
        }
        this.setPos(this.cardArr)
    },
    pokeNode(data) {
        let node = null;
        if (data.level == 14) {
            node = this.smallKingPool.get()
            if (node == null) {
                node = cc.instantiate(this.smallKing)
            }
        } else if (data.level == 15) {
            node = this.bigKingPool.get()
            if (node == null) {
                node = cc.instantiate(this.bigKing)
            }
        } else {
            node = this.pokePool.get()
            if (node == null) {
                node = cc.instantiate(this.poke)
            }

        }
        node.getComponent(cc.Component).init(data)
        return node
    },
    //设置位置
    setPos(data) {
        //计算posx，第一张牌显示的x坐标
        var posx = - (data.length - 1) / 2 * tp.width;
        for (var i = 0; i < data.length; i++) {
            data[i].setPosition(posx + i * tp.width, 0);
        }
    },
    //绑定节点
    bindNode() {
        this.exitNode = cc.find('Canvas/btn')
        this.userName = cc.find("Canvas/New Sprite/userRe/name")
        this.chooseRoomNode = cc.find("Canvas/chooseName/userName")
        this.mePriceNdoe = cc.find("Canvas/chooseName/mePrice");
        this.countNode = cc.find("Canvas/chooseName/count");
        //注册的输入框
        this.registerNode = cc.find('Canvas/register')
        //注册按钮
        this.postNode = cc.find("Canvas/register/post")
        //创建的房间
        this.setRoomNode = cc.find("Canvas/setRoom")
        this.getRoomNode = cc.find("Canvas/getRoom")
        this.getRoomIdNode = cc.find("Canvas/getRoom/getRoomId")
        //出牌
        this.playBtnNode = cc.find('Canvas/playBtn')
        //中间显示poke
        this.centerShowNode = cc.find('Canvas/centerShow')
        //过牌
        this.passBtnNode = cc.find("Canvas/passBtn")
        //在选牌
        this.againNode = cc.find("Canvas/again")
        //结算
        this.allSttleNode = cc.find("Canvas/allSttle")
        this.allSttleContentNode = cc.find("Canvas/allSttle/content")
        this.redyBtnNode = cc.find("Canvas/redyBtn")
        this.roomScoreNode = cc.find("Canvas/content/roomScore")
    },
    //绑定事件
    bindEvent() {
        //出牌绑定
        this.playBtnNode.off('touchend', this.playCardTounch, this)
        this.playBtnNode.on('touchend', this.playCardTounch, this)
        this.passBtnNode.off('touchend', this.passBtnTouch, this)
        this.passBtnNode.on('touchend', this.passBtnTouch, this)

    },
    //过牌
    passBtnTouch() {
        if (tp.status) {
            window.socket.send(JSON.stringify({
                "eventCode": 105,
            }));
        }

    },
    //出牌判断
    playCardTounch() {
        if (tp.playCardData.length == 0) {
            console.log('请选牌----------')

        } else {
            console.log("tp.playCardData---", tp.playCardData)
            if (tp.status) {
                window.socket.send(JSON.stringify({
                    "eventCode": 104,
                    "data": {
                        "pokers": tp.playCardData,
                    }
                }));
            }
        }
    },
    playCardDataInit() {
        tp.playCardData = []
    },
    //出牌成功
    playCardSuccess() {
        this.playCardDataInit();
        for (let i = 0; i < this.cardArr.length; i++) {
            if (this.cardArr[i].status.indexOf("up") == 0) {
                let node = this.cardArr[i];
                node.getComponent(cc.Component).setMaskShowing(false)
                if (this.cardArr[i].level < 14) {
                    this.pokePool.put(node)
                } else if (this.cardArr[i].level == 14) {
                    this.smallKingPool.put(node)
                } else if (this.cardArr[i].level == 15) {
                    this.bigKingPool.put(node)
                }
                this.cardArr[i].status = "out"
            }
        }
    },
    cancelShowPoke() {
        let players = tp.info.players
        for (let i = 0; i < players.length; i++) {
            let node = this.getUserByPlayerId(players[i].playerId)
            node.getComponent(cc.Component).removeShowPoke()
        }
    },
    //中间显示出的牌
    centerShowPoke(data) {
        if (data.pokers && data.playerId) {
            this.cancelShowPoke()
            this.onlyData(data)
        } else {
            console.log("没数据")
        }


    },
    onlyData(data) {
        console.log("data", data)
        let playerId = data.playerId
        if (data.pokers) {
            for (let i = 0; i < data.pokers.length; i++) {
                let newCarrData = {};
                newCarrData.i = i;
                let level = null;
                if (data.pokers[i].kingPlace == 0) {
                    level = 14;
                } else if (data.pokers[i].kingPlace) {
                    level = 15;
                } else {
                    level = data.pokers[i].level
                }
                newCarrData.level = level
                newCarrData.type = data.pokers[i].type
                newCarrData.list = false;
                let node = this.pokeNode(newCarrData)
                this.setParent(node, playerId)
            }
        }
    },
    setParent(node, playerId) {
        let userInitNode = this.getUserByPlayerId(playerId)
        userInitNode.getComponent(cc.Component).setParent(node)
    },
    // update (dt) {},
});
