function Socket(data) {
    console.log(data)
    this.url = data.url;
    this.io = null;
    this.account = data.account;
    this.password = data.password;
}
Socket.prototype = {

    connect: function () {

        this.io = new WebSocket(this.url);
        window.socket = this.io;
        // this.io.onopen = function (e) {
        //     console.log("socket connected")
        // }
        cc.find("Canvas/script").getComponent(cc.Component).onGameEvent()
        
        // this.io.onclose = function (err) {
        //     console.log("---onclose----");
        // };
    },
    close: function () {
        console.log("aaaaa")
        window.socket.onclose = function (err) {
            console.log("socket关闭后收到的onclose事件");
        };
        window.socket.close();
        this.io = null;
    }
}
module.exports = Socket;
