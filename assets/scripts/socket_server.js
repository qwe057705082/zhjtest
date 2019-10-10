let socketInit = function socketInit() {
    let Socket = require('../scripts/socket/socketInit')
    let data = {
        // url:'ws://10.0.0.162:8888',
        // url:'ws://socketserver.morethantech.cn:80',
        // url: util.getBaseInfo('sockerServerUrl'),
        url: "ws://sanfupai.free.idcfengye.com/ws",
    }
    let socket = new Socket(data);
    window.s=socket;
    console.log("我这里呢")
    socket.connect();
}
module.exports = socketInit;