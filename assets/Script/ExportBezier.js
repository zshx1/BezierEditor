/**
 * 导出贝塞尔曲线
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
            bezier.exportBezier();
            this.status = false;
        }
    }

    // update (dt) {},
});
