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
        item: {
            type: cc.Prefab,
            default: null
        },
        itemList: {
            type: cc.ScrollView,
            default: null
        },
        toggleGroup: {
            type: cc.ToggleGroup,
            default: null
        },
        flushing: false
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const that = this;
        that.node.on(cc.Node.EventType.MOUSE_DOWN, that.flush, that);
        that.bezierManager = require('BezierManager');
        that.bezier = require('Bezier');
    },

    flush() {
        window.location.reload();
        // this.itemList.content.removeAllChildren();
        // this.bezierManager.clearAll();
        // this.bezier.drawBackground();
        // this.flushDir();
    },

    flushDir() {
        const that = this;
        cc.loader.loadResDir('originalPath', function(err, res) {
            if (err)
                return;
            for(let i = 0; i < res.length; i++) {
                that.addBezier(res[i].json, res[i].name)
            }
        })
    },

    addBezier(_data, name) {
        let item = cc.instantiate(this.item),
            _index = this.bezierManager.getLength(),
            _toggle = item.getChildByName('bezierCheck').getComponent(cc.Toggle);
        item.getChildByName('bezierCheck').on('toggle', this._toggle, this);
        // 动态设置曲线选中状态
        _toggle.isChecked = false;
        _toggle.toggleGroup = this.toggleGroup;
        // 动态设置曲线名称
        item.getChildByName('bezierName').getComponent(cc.Label).string = name || ('bezier' + _index);
        this.itemList.content.addChild(item);
        this.bezierManager.addBezier({
            status: _toggle.isChecked,
            index: _index,
            id: item.uuid,
            data: _data
        })
    },
});
