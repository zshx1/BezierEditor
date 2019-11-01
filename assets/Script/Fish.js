/**
 * 鱼对象，加载贝塞尔曲线编辑器生成的曲线，并游动
 */
cc.Class({
    extends: cc.Component,

    properties: {
        path: null,
        index: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let that = this;
        // 加载贝塞尔曲线编辑器生成的曲线
        cc.loader.loadRes('json/bezier', function(err,res){
            if (err)
                return;
            if (res.json) {
                that.path = res.json
            }
        });
        // 获取鱼的动画对象
        const animation = this.getComponent(cc.Animation);
        // 设置动画对象的循环模式为一直循环
        animation.getClips()[0].wrapMode = cc.WrapMode.Loop;
        // 播放鱼的动画
        animation.play('fish');
        // 设置路径下标
        this.index = 0;
    },

    /**
     * 改变鱼的坐标与角度信息
     */
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
