/**
 * 所有的全局变量都写在这个文件里,挂载在window下的命名空间用游戏名，之后跟游戏相关的所有设置都写在该命名空间下
 */
let socketInit = require('./socket_server');
let data = {
    chipCount: 0,
    pokers: [],
    playCardData: [],
    roomId: null,
    info: {},
    status: false,
    testplayers: [
        { playerId: 1, nickName: "test1", seatNo: 1, bonusPokers: [{ level: 1, type: "SPADE" }, { level: 1, type: "SPADE" }, { level: 1, type: "SPADE" }, { level: 1, type: "SPADE" }] },
        { playerId: 2, nickName: "test2", seatNo: 2, bonusPokers: [{ level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }] },
        { playerId: 3, nickName: "test3", seatNo: 3, bonusPokers: [{ level: 3, type: "SPADE" }, { level: 3, type: "SPADE" }, { level: 3, type: "SPADE" }, { level: 3, type: "SPADE" }] },
        { playerId: 4, nickName: "test4", seatNo: 4, bonusPokers: [{ level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }] },
    ],
    test: [
        {}
    ]
};
window.socketInit = socketInit;
window["tp"] = data;
module.exports = window["tp"];