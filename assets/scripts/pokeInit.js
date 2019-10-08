// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        pkpzy: {//图集
            default: null,
            type: cc.SpriteAtlas
        },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let scriptNode = cc.find("Canvas/script")
        this.game = scriptNode.getComponent('poke')

    },
    init(data) {
        this.idx = data.idx;
        this.height = false;
        //过滤大小王
        this.bgNode = cc.find("bg", this.node)
        if (data.level < 14) {
            this.pzNode = cc.find("bg/pz", this.node)
            this.bgNode.getComponent(cc.Sprite).spriteFrame = this.pkpzy.getSpriteFrame(this.initBg(data.type, data.level))
            this.pzNode.getComponent(cc.Sprite).spriteFrame = this.pkpzy.getSpriteFrame(this.initpz(data.type, data.level))
        }
        if (data.list) {
            //开始的点
            this.bgNode.off('touchstart', this.touchBegan, this)
            this.bgNode.on('touchstart', this.touchBegan, this)
            this.bgNode.off('touchmove', this.touchMoved, this)
            this.bgNode.on('touchmove', this.touchMoved, this)
            this.bgNode.off('touchcancel', this.touchCancel, this)
            this.bgNode.on('touchcancel', this.touchCancel, this)
            this.bgNode.off('touchend', this.touchend, this)
            this.bgNode.on('touchend', this.touchend, this)

        }

    },
    touchend: function (event) {
        cc.log("Touch touchend");
        this.game.cardArr[this.idx].isChiose = true;
        this.setMaskShowing(true)
        this.touchCancel();

    },
    /**
    * 开始点击  TOUCH_START回调函数
    * */
    touchBegan: function (event) {
        cc.log("Touch begin");
        this._touchBegan = this.node.x + 1550 / 2;
        this._getCardForTouch(this._touchBegan, this.game.cardArr);
    },
    /**
    * 移动  TOUCH_MOVE回调函数
    * */
    touchMoved: function (event) {
        // cc.log("Touch move");
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        this._touchMoved = touchLoc.x;
        this._getCardForTouch(this._touchMoved, this.game.cardArr);
        this._checkSelectCardReserve(this._touchBegan, this._touchMoved);
    },
    /**
    * 点击结束  TOUCH_END回调函数
    * */
    touchCancel: function (event) {
        cc.log("Touch Cancel");
        for (var k in this.game.cardArr) {
            if (this.game.cardArr[k].isChiose === true) {
                this.game.cardArr[k].isChiose = false;
                if (this.game.cardArr[k].status === 'down') {
                    let obj = new Object();
                    obj.index = k;
                    tp.playCardData.push(obj)
                    this.select(k)


                } else {
                    let index = k;
                    let type = tp.pokers[k].type
                    for (let i = 0; i < tp.playCardData.length; i++) {
                        if (tp.playCardData[i].index == index && tp.playCardData[i].type == type) {
                            tp.playCardData.splice(i, 1)
                        }
                    }
                    this.game.cardArr[k].status = 'down';
                    this.game.cardArr[k].y -= 19;
                    this.game.cardArr[k].getComponent(cc.Component).setMaskShowing(false);  //显示阴影遮罩
                }
            }
        }
    },
    /**
    * Touch move
    *
    * */
    _checkSelectCardReserve(touchBegan, touchMoved) {
        //获取左边的点 为起始点
        var p1 = touchBegan.x < touchMoved.x ? touchBegan : touchMoved;
        //如果是从右向左滑动
        if (p1 === touchMoved) {
            for (let i = this.game.cardArr.length - 1; i >= 0; i--) {
                //从右往左滑时，滑到一定距离，又往右滑
                //这是要判断反选
                if (this.game.cardArr[i].x - p1.x < 24) {  //
                    this.game.cardArr[i].isChiose = false;
                }
            }
        }

    },

    /**
    * Touch begin
    * 当前触摸的点 是否在牌的区域
    * */
    _getCardForTouch: function (touch, cardArr) {
        cardArr.reverse();      //to 1
        for (var k in cardArr) {
            var box = cardArr[k].getBoundingBox();   //获取card覆盖坐标范围
            var max = box.x + box.width / 2
            var min = max - 34
            var news = touch - 1550 / 2 + 34
            if (min < news && news < max) {      //判断触摸的点，是否在当前牌的范围内
                // console.log('最小min:', min, '最大max：', max, '对比news：', news)
                cardArr[k].isChiose = true;
                cardArr[k].getComponent("pokeInit").setMaskShowing(true);  //显示阴影遮罩
                cc.log("CCC touch select: " + k);
                cardArr.reverse();
                return cardArr[k];
            }
        }
        cardArr.reverse();
    },
    initBg(color, num) {
        let bg2 = '';
        switch (color) {
            case 'SPADE'://黑桃
                color = 'pai-heitao'
                bg2 = 'PAI-heit'
                break;
            case 'DIAMOND'://方块
                color = 'pai-fankuai'
                bg2 = 'PAI-fk'
                break;
            case 'HEART'://红心
                color = 'pai-hontao'
                bg2 = 'PAI-hongt'
                break;
            case 'CLUB'://梅花
                color = 'pai-meihua'
                bg2 = 'PAI-mh'
                break;
            default: break;
        }

        if (num == "J") {
            color = bg2 + '-J';
        }
        if (num == "Q") {
            color = bg2 + '-Q';
        }
        if (num == "K") {
            color = bg2 + '-K';
        }
        return color;
    },
    initpz(color, num) {
        let str = '';
        num = parseInt(num)
        if (color == 'HEART' || color == 'DIAMOND') {
            if (num <= 10) {
                str = 'PZ-hon-' + num
            }
            if (num == 11) {
                str = 'PZ-hon-J'
            }
            if (num == 12) {
                str = 'PZ-hon-Q'
            }
            if (num == 13) {
                str = 'PZ-hon-K'
            }
        } else if (color == 'SPADE' || color == 'CLUB') {
            if (num <= 10) {
                str = 'PZ-hei-' + num
            }
            if (num == 11) {
                str = 'PZ-hei-J'
            }
            if (num == 12) {
                str = 'PZ-hei-Q'
            }
            if (num == 13) {
                str = 'PZ-hei-K'
            }
        }
        return str;

    },
    setMaskShowing(boer) {
        let grayNode = cc.find('gray', this.node)
        if (boer) {
            if (grayNode && grayNode.active == false) {
                grayNode.active = true;
            }
        } else {
            grayNode.active = false;
        }

    },
    //选中
    select(k) {
        this.game.cardArr[k].status = 'up';
        this.game.cardArr[k].y += 19;
    },
    //取消选中
    cancelSelect(k) {
        this.game.cardArr[k].status = 'down';
        this.game.cardArr[k].y -= 19;
    },
    start() {

    },

    // update (dt) {},
});
