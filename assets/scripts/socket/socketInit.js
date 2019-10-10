function Socket(data) {
    this.url = data.url;
    this.io = null;
    this.account = data.account;
    this.password = data.password;
}
Socket.prototype = {

    connect: function () {

        this.io = new WebSocket(this.url);
        window.socket = this.io;
        this.io.onopen = function (e) {
            console.log("socket connected")
        }
        // this.io.onclose = function (err) {
        //     console.log("---onclose----");
        // };
    },
    close: function () {
        console.log("aaaaa")
        this.io.onclose = function (err) {
            console.log("socket关闭后收到的onclose事件");
        };
        this.io.close();
        this.io = null;
    }
}
module.exports = Socket;
