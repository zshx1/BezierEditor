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
        path: null,
        index: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let that = this;
        cc.loader.loadRes('json/bezier0', function(err,res){
            if (err)
                return;
            if (res.json) {
                that.path = res.json
            }
        });
        const animation = this.getComponent(cc.Animation);
        animation.getClips()[0].wrapMode = cc.WrapMode.Loop;
        animation.play('fish');
        this.index = 0;
    },

    changePosition() {
        if (this.index < this.path.length) {
            let res = this.path[this.index];
            this.node.position = {x: res.x, y: res.y};
            this.node.angle = res.rotate;
        } else
            this.index = -1;
    },

    update (dt) {
        if (this.path) {
            this.changePosition();
            this.index++;
        }
    },
});
