

// let EventModel = require("./EventModel")
function Base() {

};
Base.prototype = {
    /*
    *继承方法
    */
    grant: function (parent, son) {
        let parentP = parent.prototype;
        if (!parentP) {
            parentP = parent;
        }
        let prototype = son.prototype;
        if (!prototype) {
            prototype = son;
        }
        for (let key in parentP) {
            if (!prototype[key]) {
                prototype[key] = parentP[key];
            }
        }

    },
    find: function (path, node) {
        if (path == undefined) {
            node = cc.find("Canvas");
        }
        node = cc.find(path, node)
        return node

    },
    setActive: function (node, state) {
        if (node) {
            node.active = state;
        }
    },
    setFont: function (node, value) {
        if (node) {
            node.getComponent(cc.Label).font = value
        }
    },
    /**
    * 设置带有cc.Label组件的节点的该组件的string值。
    * @augments
    * labelNode:要设置的节点；为cc.Node类型
    * str:显示的文字，为Stirng类型
    */
    setLabelStr: function (labelNode, str) {
        if (labelNode) {
            labelNode.getComponent(cc.Label).string = str;
        }
    },
    /*
    test
    */
    test: function () {
        console.log("22222")
    }
}
// Base.prototype.grant(EventModel, Base)
module.exports = Base;