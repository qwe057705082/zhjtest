

cc.Class({
    extends: cc.Component,

    properties: {
        reWardPokePrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.bindNode();
        this.bindEvent();
    },
    init(data) {
        this.group = data;
    },
    bindEvent() {
        this.node.off('touchend', this.btnTouch, this)
        this.node.on('touchend', this.btnTouch, this)
    },
    btnTouch() {
        let data = this.group;
        for (let i = 0; i < tp.playCardData.length; i++) {
            for (let j = 0; j < data.length; j++) {
                if (tp.playCardData[i].index == data[j].index) {
                    tp.playCardData[i].place = data[i].poker.level;
                }
            }
        }
        this.scriptNode.getComponent(cc.Component).playCardTounch();
        this.scriptNode.getComponent(cc.Component).againNode.removeAllChildren(true)
    
    },
    bindNode() {
        this.scriptNode = cc.find("Canvas/script")
    },
    start() {

    },

    // update (dt) {},
});
