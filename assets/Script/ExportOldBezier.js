/**
 * 导出贝塞尔曲线控制点信息；也叫原始曲线
 */
cc.Class({
    extends: cc.Component,

    properties: {
        status: false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this._mouseDown, this);
    },

    _mouseDown(mouseDown) {
        if (!this.status) {
            this.status = true;
            const bezier = require('Bezier');
            bezier.exportOldBezier();
            this.status = false;
        }
    }

    // update (dt) {},
});
