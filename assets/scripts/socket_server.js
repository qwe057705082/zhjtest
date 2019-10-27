let socketInit = function socketInit() {
    let Socket = require('../scripts/socket/socketInit')
    let data = {
        // url:'ws://47.106.207.157:1024/ws',//阿里云

        url: "ws://sanfupai.free.idcfengye.com/ws",//域名
    }
    let socket = new Socket(data);
    window.socket=socket;
    console.log("我这里呢")
    socket.connect();
}
module.exports = socketInit;