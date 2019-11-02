/**
 * 所有的全局变量都写在这个文件里,挂载在window下的命名空间用游戏名，之后跟游戏相关的所有设置都写在该命名空间下
 */
let socketInit = require('./socket_server');
let data = {
    chipCount: 0,
    // pokers: [],
    playCardData: [],
    roomId: null,
    info: {},
    width: 75,//牌之间的距离
    status: false,
    testplayers: [
        { playerId: 1, nickName: "test1", seatNo: 1, bonusPokers: [{ level: 1, type: "SPADE" }, { level: 1, type: "SPADE" }, { level: 1, type: "SPADE" }, { level: 1, type: "SPADE" }] },
        { playerId: 2, nickName: "wly", seatNo: 2, bonusPokers: [{ level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }] },
        { playerId: 3, nickName: "test3", seatNo: 3, bonusPokers: [{ level: 3, type: "SPADE" }, { level: 3, type: "SPADE" }, { level: 3, type: "SPADE" }, { level: 3, type: "SPADE" }] },
        { playerId: 4, nickName: "test4", seatNo: 4, bonusPokers: [{ level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }] },
    ],
    clientInfos: [
        { playerId: 1, bonusNum: 1, bonusPokers: [{ level: 1, type: "SPADE" }, { level: 1, type: "SPADE" }, { level: 1, type: "SPADE" }, { level: 1, type: "SPADE" }, { level: 1, type: "SPADE" }, { level: 1, type: "SPADE" },] },
        { playerId: 2, bonusNum: 1, bonusPokers: [{ level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" }, { level: 2, type: "SPADE" },] },
        { playerId: 3, bonusNum: 1, bonusPokers: [{ level: 3, type: "SPADE" }, { level: 3, type: "SPADE" }, { level: 3, type: "SPADE" }, { level: 3, type: "SPADE" }, { level: 3, type: "SPADE" }, { level: 3, type: "SPADE" },] },
        { playerId: 4, bonusNum: 1, bonusPokers: [{ level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" }, { level: 4, type: "SPADE" },] },
    ],
    scores:
        [
            { playerId: 1, score: 2 },
            { playerId: 2, score: 0 },
            { playerId: 3, score: 0 },
            { playerId: 4, score: 0 },
        ],

    pokers: [
        { level: 3, type: "SPADE" },
        { level: 3, type: "SPADE" },
        { level: 3, type: "SPADE" },
        { level: 3, type: "SPADE" },
        { level: 4, type: "SPADE" },
        { level: 4, type: "SPADE" },
        { level: 4, type: "SPADE" },
        { level: 4, type: "SPADE" },
        { level: 5, type: "SPADE" },
        { level: 5, type: "SPADE" },
        { level: 5, type: "SPADE" },
        { level: 5, type: "SPADE" },
        { level: 6, type: "SPADE" },
        { level: 6, type: "SPADE" },
        { level: 6, type: "SPADE" },
        { level: 6, type: "SPADE" },
        { level: 7, type: "SPADE" },
        { level: 7, type: "SPADE" },
        { level: 7, type: "SPADE" },
        { level: 7, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
        { level: 8, type: "SPADE" },
    ],
    settle: [
        { playerId: 1, nickName: "wo", winNumber: -11, pokers: [{ level: 7, type: "SPADE" }] },
        { playerId: 2, nickName: "ya", winNumber: 22, pokers: [{ level: 8, type: "SPADE" }] },
        { playerId: 3, nickName: "zhu", winNumber: -22, pokers: [{ level: 9, type: "SPADE" }] },
        { playerId: 4, nickName: "ss", winNumber: 33, pokers: [{ level: 10, type: "SPADE" }] }
    ]
};
window.socketInit = socketInit;
window["tp"] = data;
module.exports = window["tp"];