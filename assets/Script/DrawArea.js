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
        point: {
            type: cc.Prefab,
            default: null
        },
        frameNum: {
            type: cc.EditBox,
            default: null
        },
        exportWidth: {
            type: cc.EditBox,
            default: null
        },
        exportHeight: {
            type: cc.EditBox,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.debug.setDisplayStats(false);
        //添加鼠标按下监听
        let frame = {};
        try {
            frame.num = parseInt(this.frameNum.string);
            frame.width = parseInt(this.exportWidth.string);
            frame.height = parseInt(this.exportHeight.string);
        } catch(e) {
            this.frameNum.string = '';
        }
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this._mouseDown, this);
        this.bezier = require('Bezier');
        this.bezier.init(this.node, frame);
        this.bezier.drawBackground();
        this.bezierManager = require('BezierManager');
    },

    _mouseDown(mouseDown) {
        let item = this.bezierManager.getCheckedItem();
        if (item) {
            // 判断鼠标按键类型； 0:左键；1：滚动键；2：右键；
            if (mouseDown._button > 0) {
                let location = mouseDown.getLocation();
                this.addPoint(location);
            }
        } else {
            let tools = require('Tools'),
                mes = '';
            if (this.bezierManager.getLength()) {
                mes = '请选择任意一条曲线进行编辑';
            } else {
                mes = '请添加一条原始曲线，并选中后才能进行编辑';
            }
            tools.showMessage(mes);
        }
    },

    addPoint(location) {
        let _point = cc.instantiate(this.point);
        // 设置节点位置，注意要使用父节点进行对触摸点进行坐标转换
        _point.position = this.node.convertToNodeSpaceAR(location);
        _point.parent = this.node;
        _point.getComponent('Point').index = this.bezier.pointList.length;
        let worldPosition = this.node.parent.convertToNodeSpaceAR(location);
        this.bezier.pointList.push({
            x: worldPosition.x,
            y: worldPosition.y
        });
        this.bezier.repaint();
    }

    // update (dt) {},
});
