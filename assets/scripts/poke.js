

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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let self = this;
        //自己数组
        this.cardArr = [];
        //中间显示数组
        this.centerArr = [];
        this.localUserInfo = [];
        this.pokeNumber = 41;
        // let socket = new WebSocket("ws://sanfupai.free.idcfengye.com/ws");
        let socket = new WebSocket("ws://47.106.207.157:1024/ws");
        window.socket = socket;
        //连接打开
        socket.onopen = function (event) {
            console.log("联接开始！")
            base.setActive(self.registerNode, true)

        }


        //发送206
        console.log("socket", socket)
        window.IO = socket;

        //收到消息
        socket.onmessage = function (event) {
            let data = JSON.parse(event.data)
            console.log("成功获取的数据：", data.eventCode, data)
            //101
            if (data.eventCode == 101) {
                tp.info.nickName = data.data.nickName;
                tp.info.playerId = data.data.playerId;
                //显示用户信息
                self.showInfo()
                base.setActive(self.registerNode, false)
                base.setActive(self.getRoomNode, true)
                base.setActive(self.setRoomNode, true)

            }
            //获取房间号102
            if (data.eventCode == 102) {
                tp.info.roomList = data.data.roomList;
                self.getRoom(data.data.roomList);

            }
            //加入房间103
            if (data.eventCode == 103) {
                tp.info.players = data.data.players;
                self.getMeSeatNo(data.data.players)
                self.playerInit(data.data.players)
                base.setActive(self.getRoomNode, false)
                base.setActive(self.setRoomNode, false)
                base.setActive(self.chooseRoomNode, false)
            }
            //104出牌
            if (data.eventCode == 104) {
                if (data.errorCode == 1) {
                    console.log("不符合规则-------")
                } else {
                    self.playCardSuccess();
                }
            }
            if (data.eventCode == 105) {
                if (data.errorCode == 0) {
                    let inTurnData = {}
                    inTurnData.playerId = data.data.nextPlayerId
                    self.inTurn(inTurnData)
                } else {
                    console.log("不能过牌")
                }
            }
            //创建房间号108
            if (data.eventCode == 108) {
                tp.info.roomId = data.data.roomId;
                self.setRoom()
                base.setActive(self.chooseRoomNode, false)
                base.setActive(self.getRoomNode, false)
                // console.log("成功创建房间号", data)
            }
            //有鬼的都要从这里走一下
            if (data.eventCode == 109) {
                let placeInfo = data.data.placeInfo
                self.changePoke(placeInfo)

            }
            //玩家分数的变动
            if (data.eventCode == 202) {
                tp.scoreInfos = data.data.scoreInfos;
                self.updateScore(data.data.scoreInfos)

            }
            //广播玩家操作203
            if (data.eventCode == 203) {
                //先回收一波数据
                self.centerPokeRc();
                //展示一波数据
                self.centerShowPoke(data.data.pokers)
                let inTurnData = {}
                inTurnData.playerId = data.data.nextPlayerId
                self.inTurn(inTurnData)
                self.updateNumberCard(data.data)
            }
            if (data.eventCode == 205) {
                tp.status = false
                self.centerPokeRc();
                self.settletotal(data.data.playerList);
                self.changeButton(false, false, false)
            }
            //206
            if (data.eventCode == 206) {
                if (data.data.pokers == undefined) {
                    return
                }
                tp.status = true;
                //玩家手牌的数据
                tp.pokers = data.data.pokers;
                //其他玩家的奖的数据
                tp.clientInfos = data.data.clientInfos;
                self.updatePlay(data.data.clientInfos)
                // self.updateMe(data.data)
                //由于数据延时发射
                self.showPoke(data.data.pokers);
                let inTurnData = {}
                inTurnData.seatNo = data.data.seatNo;
                inTurnData.playerId = data.data.nextPlayerId;
                //根据id判断谁先操作
                self.inTurn(inTurnData)
                //
            }
        }

        this.initNodePools();
        this.bindNode();
        this.bindEvent();
        this.init();
    },
    //分数更新
    updateScore(data) {
        for (let i = 0; i < data.length; i++) {
            let node = this.getUserByPlayerId(data[i].playerId)
            node.getComponent(cc.Component).updateScore(data[i].score)

        }

    },
    //结算
    settletotal(data) {
        for (let i = 0; i < data.length; i++) {
            let node = this.getSettleNode();
            let nameNode = base.find("name", node)
            let winNumberNode = base.find("winNumber", node)
            base.setLabelStr(nameNode, data[i].nickName)
            base.setLabelStr(winNumberNode, data[i].winNumber)
            node.parent = this.allSttleNode;
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
                    // console.log("tp.playCardData[i].index", tp.playCardData[i].index)
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
        //重新选牌
        base.setActive(this.reSelectBtnNode, a)
        //出牌
        base.setActive(this.playBtnNode, b)
        //过牌
        base.setActive(this.passBtnNode, c)
    },
    //轮到哪位玩家操作
    inTurn(data) {
        this.cancelCount(data);
        if (tp.info.playerId == data.playerId) {
            base.setActive(this.countNode, true)
            this.changeButton(true, true, true)
           
        } else {
            base.setActive(this.countNode, false)
            this.changeButton(false, false, false)
            let node = this.getUserByPlayerId(data.playerId)
            if (node) {
                node.getComponent(cc.Component).updateCount(true)
            } else {
                console.log("节点为空")
            }
        }
    },
    //当自己操作时，别人的1应该取消
    cancelCount(data) {
        let players = tp.info.players;
        for (let i = 0; i < players.length; i++) {
            let node = this.userInfoNode.children[i]
            if (players[i].playerId == data.playerId) {
                if(players[i].playerId==tp.info.playerId){
                    node.getComponent(cc.Component).updateCount(false)
                }else{
                    node.getComponent(cc.Component).updateCount(true)
                }
               
            }else{
                node.getComponent(cc.Component).updateCount(false)
            }
        }

    },
    //通过单个数组获取节点
    getUserByPlayerId(data) {
        let node = null
        let players = tp.info.players;
        for (let i = 0; i < players.length; i++) {
            if (players[i].playerId == data) {
                node = this.userInfoNode.children[i]
            }
        }
        return node
    },
    //更新其他玩家的信息
    updatePlay(data) {
        for (let i = 0; i < data.length; i++) {
            let node = this.getUserByPlayerId(data[i].playerId)
            node.getComponent(cc.Component).updateData(41)
            node.getComponent(cc.Component).updateScore(0)
            node.getComponent(cc.Component).updatePrice(data[i].bonusNum)
        }
    },
    //更新自己的数据
    updateMe(data) {
        base.setLabelStr(this.mePriceNdoe, "奖:" + data.bonusNum)
    },

    init() {
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
        // console.log("data", data)
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
            // console.log(data[i].roomId)
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
        this.setRoomNode.getComponent(cc.Component).updateRoomId(tp.info.roomId);

    },
    // 获取用户显示
    showInfo() {
        base.setLabelStr(this.chooseRoomNode, "用户:" + tp.info.nickName)
        // base.find("Canvas")
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
        for (let i = 0; i < data.length; i++) {
            //判断节点是否存在
            if (this.userInfoNode.children[i]) {
                continue
            } else {
                let node = this.playerNode();
                node.parent = this.userInfoNode;
                node.setPosition(0, 0)
                node.getComponent(cc.Component).init(data[i])
            }
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
    showPoke(data) {
        // console.log("data", data)
        for (let i = 0; i < data.length; i++) {
            let newPokeData = {};
            newPokeData.idx = i;
            newPokeData.level = data[i].level;
            newPokeData.type = data[i].type;
            newPokeData.list = true;//判断是否绑定事件
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
        var posx = - (data.length - 1) / 2 * 34;
        // console.log('posx', posx)
        for (var i = 0; i < data.length; i++) {
            data[i].setPosition(posx + i * 34, 0);
        }
    },
    //绑定节点
    bindNode() {
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
        //重新选牌
        this.reSelectBtnNode = cc.find('Canvas/reSelectBtn')
        //中间显示poke
        this.centerShowNode = cc.find('Canvas/centerShow')
        //过牌
        this.passBtnNode = cc.find("Canvas/passBtn")
        //在选牌
        this.againNode = cc.find("Canvas/again")
        //结算
        this.allSttleNode = cc.find("Canvas/allSttle")
    },
    //绑定事件
    bindEvent() {
        //出牌绑定
        this.playBtnNode.off('touchend', this.playCardTounch, this)
        this.playBtnNode.on('touchend', this.playCardTounch, this)
        //重新选牌绑定
        this.reSelectBtnNode.off('touchend', this.reSelectTounch, this)
        this.reSelectBtnNode.on('touchend', this.reSelectTounch, this)
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
    //重新选牌
    reSelectTounch() {
        tp.playCardData = [];
        this.cancelSelect();
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
    //出牌成功
    playCardSuccess() {
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
        let newCardArr = [];
        for (let j = 0; j < this.cardArr.length; j++) {
            if (this.cardArr[j].status.indexOf("down") == 0) {
                newCardArr.push(this.cardArr[j])
            }
        }

        this.cardArr = [];
        this.cardArr = newCardArr;
        tp.playCardData = []
        this.setPos(this.cardArr)
        //改变idx
        this.changeIdx();
        // console.log("this.cardArr", this.cardArr)
    },
    //改变牌的idx
    changeIdx() {
        for (let i = 0; i < this.cardArr.length; i++) {
            this.cardArr[i].getComponent(cc.Component).idx = i;
        }
    },
    //取消选中
    cancelSelect() {
        for (let i = 0; i < this.cardArr.length; i++) {
            // console.log("this.cardArr", this.cardArr[i].status)
            if (this.cardArr[i].status === 'up') {
                this.cardArr[i].getComponent(cc.Component).cancelSelect(i);
                this.cardArr[i].getComponent(cc.Component).setMaskShowing(false)
            }
        }
    },
    //中间显示出的牌
    centerShowPoke(data) {
        this.centerArr = [];
        for (let i = 0; i < data.length; i++) {
            let newCarrData = {};
            newCarrData.i = i;
            let level = null;
            if (data[i].kingPlace == 0) {
                level = 14;
            } else if (data[i].kingPlace) {
                level = 15;
            } else {
                level = data[i].level
            }
            newCarrData.level = level
            newCarrData.type = data[i].type
            newCarrData.list = false;
            let node = this.pokeNode(newCarrData)
            node.parent = this.centerShowNode
            this.centerArr.push(node)
            this.setPos(this.centerArr)
        }
    },
    //回收中间的牌
    centerPokeRc() {
        this.centerShowNode.removeAllChildren(true)
        // for (let i = 0; i < this.centerShowNode.children.length; i++) {
        //     this.roomPool.put(this.centerShowNode.children[0])
        // }
        // //后面一个for解决残留的按钮
        // for (let i = 0; i < this.centerShowNode.children.length; i++) {
        //     this.roomPool.put(this.centerShowNode.children[0])
        // }
    },
    // update (dt) {},
});
