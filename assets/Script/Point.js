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
        index: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        const bezier = require('Bezier');
        this.bezier = bezier;
    },

    _onTouchMove(touchEvent) {
        let location = touchEvent.getLocation();
        if (location.x > this.bezier.nodeProp.x) {
            // 修改节点位置，注意要使用父节点进行对触摸点进行坐标转换
            let position = this.node.parent.convertToNodeSpaceAR(location);
            this.node.position = position;
            touchEvent.stopPropagation();
            this.bezier.pointList.splice(this.index, 1, {
                x: location.x,
                y: location.y
            });
            this.bezier.repaint();
        }
    }

    // update (dt) {},
});
