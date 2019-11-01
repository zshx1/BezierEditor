/**
 * 删除原始曲线按钮
 * 在原始曲线列表中删除原始曲线
 */
cc.Class({
    extends: cc.Component,

    properties: {
        itemList: { // 原始曲线列表
            type: cc.ScrollView,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 监听鼠标按下事件
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this._mouseDown, this);
        // 引入贝塞尔曲线管理器
        this.bezierManager = require('BezierManager');
        // 引入工具箱
        this.tools = require('Tools');
    },

    _mouseDown() {
        let item = null,
            _bezierList = this.bezierManager.bezierList,
            _content = this.itemList.content;
        for (let i = 0; i < _bezierList.length; i++) {
            if (_bezierList[i].status) {
                item = _bezierList[i];
                break;
            }
        }

        if (item && item.type !== 'old') {
            _content.removeChild(_content.getChildByUuid(item.id));
            this.bezierManager.delBezier(item.index);
        }

        if (item.type === 'old') {
            this.tools.showMessage('不能删除原始曲线');
        }
    }

    // update (dt) {},
});
