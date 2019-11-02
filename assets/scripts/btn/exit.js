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
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bindEvent()
    },
    bindEvent(){
        let self=this;
        this.node.on('touchend',function(){
            self.clickEvent()
        })
    },
    clickEvent(){
        if(!tp.status){
            window.socket.send(JSON.stringify({
                "eventCode": 106,
                "roomId":1
            }));
        }else{
            console.log("您还在游戏中")
        }
      
    },

    start () {

    },

    // update (dt) {},
});
