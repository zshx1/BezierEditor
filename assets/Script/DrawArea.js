/**
 * 绘制区域
 * 鼠标右键点击该区域生成控制点；鼠标左键按住控制点，可调整控制位置
 */
cc.Class({
    extends: cc.Component,

    properties: {
        point: { // 曲线控制点预制体
            type: cc.Prefab,
            default: null
        },
        frameNum: { // 曲线帧数
            type: cc.EditBox,
            default: null
        },
        exportWidth: { // 导出曲线画板宽度
            type: cc.EditBox,
            default: null
        },
        exportHeight: { // 导出曲线画板高度
            type: cc.EditBox,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 隐藏cocos create的状态信息
        cc.debug.setDisplayStats(false);
        let frame = {};
        // 获取编辑器绘制信息
        try {
            frame.num = parseInt(this.frameNum.string);
            frame.width = parseInt(this.exportWidth.string);
            frame.height = parseInt(this.exportHeight.string);
        } catch(e) {
            this.frameNum.string = '';
        }
        // 添加鼠标按下监听
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this._mouseDown, this);
        // 引入贝塞尔曲线编辑器
        this.bezier = require('Bezier');
        // 初始化曲线编辑器
        this.bezier.init(this.node, frame);
        // 绘制曲线背景
        this.bezier.drawBackground();
        // 引入贝塞尔曲线管理器
        this.bezierManager = require('BezierManager');
    },

    /**
     * 鼠标按下事件处理
     * @param {*} mouseDown 事件对象
     */
    _mouseDown(mouseDown) {
        let item = this.bezierManager.getCheckedItem(); // 获取曲线选中对象
        if (item) {
            // 判断鼠标按键类型； 0:左键；1：滚动键；2：右键；
            if (mouseDown._button > 0) {
                // 获取点击坐标
                let location = mouseDown.getLocation();
                // 添加控制点
                this.addPoint(location);
            }
        } else {
            // 引入工具箱
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

    /**
     * 添加曲线控制点，并绘制路径
     * @param {*} location 控制点坐标信息
     */
    addPoint(location) {
        // 实例化控制点预制体
        let _point = cc.instantiate(this.point);
        // 设置节点位置，注意要使用父节点进行对触摸点进行坐标转换
        _point.position = this.node.convertToNodeSpaceAR(location);
        // 设置控制点的父节点
        _point.parent = this.node;
        // 设置控制点的下表
        _point.getComponent('Point').index = this.bezier.pointList.length;
        // 计算控制点的全局坐标
        let worldPosition = this.node.parent.convertToNodeSpaceAR(location);
        // 获取选中曲线
        let bezier = this.bezierManager.getCheckedItem();
        // 添加选中曲线数据
        bezier.data.push({
            x: worldPosition.x,
            y: worldPosition.y
        });
        // 把控制点的全局坐标添加到曲线编辑器中
        this.bezier.addPoint({
            x: worldPosition.x,
            y: worldPosition.y
        });
        // 绘制贝塞尔曲线
        this.bezier.repaint();
    }

    // update (dt) {},
});
