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
        itemList: {
            type: cc.ScrollView,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this._mouseDown, this);
        this.bezierManager = require('BezierManager');
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
        console.log(item)
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
