/**
 * 重新加载原始曲线
 */
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
        // 在回调事件中不能进行异步操作所以没有采用以下方法
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
                that.addBezier(res[i].json, res[i].name);
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
