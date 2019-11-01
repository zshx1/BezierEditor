/**
 * 控制点脚本
 */
cc.Class({
    extends: cc.Component,

    properties: {
        index: 0
    },

    onLoad () {
        // 注册移动事件
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        // 引入曲线编辑器
        this.bezier = require('Bezier');
    },

    _onTouchMove(touchEvent) {
        // 获取移动坐标
        let location = touchEvent.getLocation();
        // 限制拖动范围
        if (location.x > this.bezier.nodeProp.x) {
            // 修改节点位置，注意要使用父节点进行对触摸点进行坐标转换
            let position = this.node.parent.convertToNodeSpaceAR(location);
            // 设置控制点坐标
            this.node.position = position;
            // 阻止事件冒泡
            touchEvent.stopPropagation();
            // 在曲线编辑器中更新控制点
            this.bezier.changePoint(this.index, {
                x: location.x,
                y: location.y
            });
            // 重绘曲线
            this.bezier.repaint();
        }
    }
});
