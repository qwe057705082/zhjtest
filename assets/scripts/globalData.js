/**
 * 所有的全局变量都写在这个文件里,挂载在window下的命名空间用游戏名，之后跟游戏相关的所有设置都写在该命名空间下
 */
let data = {
    chipCount: 0,
    pokers: [],
    playCardData:[],
    roomId:null,
    info:{},
    status:false,
};

window["tp"] = data;
module.exports = window["tp"];