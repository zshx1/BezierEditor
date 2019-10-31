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
        point: {
            type: cc.Prefab,
            default: null
        },
        drawArea: {
            type: cc.Node,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const that = this;
        that.node.on(cc.Node.EventType.MOUSE_DOWN, that._mouseDown, that);
        that.bezierManager = require('BezierManager');
        this.bezier = require('Bezier');
        cc.loader.loadResDir('originalPath', function(err, res) {
            if (err)
                return;
            for(let i = 0; i < res.length; i++) {
                that.addBezier(res[i].json, res[i].name, 'old')
            }
        })
    },

    _mouseDown() {
        this.addBezier();
    },

    addBezier(_data, name, _type) {
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
            data: _data,
            type: _type || ''
        })
    },

    _toggle(event) {
        if (event.isChecked) {
            this.drawArea.removeAllChildren();
            const path = this.bezierManager.changeItem(event.node.parent.uuid, event.isChecked);
            if (path) {
                this.bezier.pointList = [];
                for(let i = 0; i < path.length; i++) {
                    this.drawOriginalPath(path[i])
                }
            } else {
                this.bezier.drawBackground();
            }
        }
    },

    drawOriginalPath(location) {
        let _point = cc.instantiate(this.point);
        // 设置节点位置，注意要使用父节点进行对触摸点进行坐标转换
        let worldPosition = this.drawArea.parent.convertToNodeSpaceAR(location);
        _point.position = this.drawArea.convertToNodeSpaceAR(location);
        _point.parent = this.drawArea;
        _point.getComponent('Point').index = this.bezier.pointList.length;
        this.bezier.pointList.push({
            x: worldPosition.x,
            y: worldPosition.y
        });
        this.bezier.repaint();
    }

    // update (dt) {},
});
