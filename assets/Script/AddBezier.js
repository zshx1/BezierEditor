/**
 * 添加原始曲线按钮
 * 在原始曲线列表中新增原始曲线
 */

cc.Class({
    extends: cc.Component,

    properties: {
        item: { // 原始曲线预制体
            type: cc.Prefab,
            default: null
        },
        itemList: { // 原始曲线列表
            type: cc.ScrollView,
            default: null
        },
        toggleGroup: { // 多选组
            type: cc.ToggleGroup,
            default: null
        },
        point: { // 曲线控制点预制体
            type: cc.Prefab,
            default: null
        },
        drawArea: { // 曲线绘制区域
            type: cc.Node,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const that = this;
        // 监听鼠标按下事件
        that.node.on(cc.Node.EventType.MOUSE_DOWN, that._mouseDown, that);
        // 引入贝塞尔曲线管理器
        that.bezierManager = require('BezierManager');
        // 引入贝塞尔曲线编辑器
        this.bezier = require('Bezier');
        // 导入本地存在的原始贝塞尔曲线
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

    /**
     * 添加原始贝塞尔曲线，并设置曲线选择状态
     * @param {*} _data 原始曲线数据
     * @param {*} name 原始曲线名称
     * @param {*} _type 原始曲线标志，用于区分新增的原始曲线和存在的原始曲线
     */
    addBezier(_data, name, _type) {
        let item = cc.instantiate(this.item), // 实例化曲线预制体
            _index = this.bezierManager.getLength(), // 新增曲线下标
            _toggle = item.getChildByName('bezierCheck').getComponent(cc.Toggle); // 获取曲线的复选框
        item.getChildByName('bezierCheck').on('toggle', this._toggle, this); // 给曲线复选框添加选择事件
        _toggle.isChecked = false; // 默认不选中该条曲线
        _toggle.toggleGroup = this.toggleGroup; // 设置曲线复选框属于一个组，让曲线列表中的数据同时只能选中一条数据
        item.getChildByName('bezierName').getComponent(cc.Label).string = name || ('bezier' + _index); // 动态设置原始曲线名称
        this.itemList.content.addChild(item); // 把原始曲线预制体添加到滚动列表中
        console.log(item.uuid)
        this.bezierManager.addBezier({ // 把原始曲线的信息存放在原始曲线管理器中
            status: _toggle.isChecked,
            index: _index,
            id: item.uuid,
            data: _data,
            type: _type || ''
        })
    },

    /**
     * 选择事件处理
     * @param {*} event 事件对象
     */
    _toggle(event) {
        const that = this;
        if (event.isChecked) { // 判断原始曲线选择状态
            that.drawArea.removeAllChildren(); // 清空曲线绘制区域的控制点
            const path = that.bezierManager.changeItem(event.node.parent.uuid, event.isChecked); // 在原始曲线管理器中改变选中的曲线信息，并返回曲线的路径信息
            if (path) { // 判断路径信息
                that.bezier.clearPoint(); // 清空曲线编辑器的控制点信息
                for(let i = 0; i < path.length; i++) {
                    that.drawOriginalPath(path[i]) // 绘制曲线控制点
                }
            } else {
                that.bezier.drawBackground(); // 清空绘制区域的图像
            }
        } else {
            that.drawArea.removeAllChildren(); // 清空曲线绘制区域的控制点
            that.bezier.drawBackground(); // 清空绘制区域的图像
        }
    },

    /**
     * 绘制原始曲线
     * @param {*} location 曲线坐标信息
     */
    drawOriginalPath(location) {
        let _point = cc.instantiate(this.point); // 实例化控制点预制体
        let worldPosition = this.drawArea.parent.convertToNodeSpaceAR(location); // 计算坐标对应的全局坐标
        _point.position = this.drawArea.convertToNodeSpaceAR(location); // 计算坐标对应绘制区域的坐标，并设置
        _point.parent = this.drawArea; // 设置控制点的父节点
        _point.getComponent('Point').index = this.bezier.pointList.length; // 设置控制节点的序号
        this.bezier.addPoint({ // 把控制点对应的全局坐标添加到曲线编辑器中
            x: worldPosition.x,
            y: worldPosition.y
        });
        this.bezier.repaint(); // 曲线编辑器绘制曲线
    }

    // update (dt) {},
});
