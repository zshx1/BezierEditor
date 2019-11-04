module.exports = {
  ctx: null, // 画板
  nodeProp: null, // 编辑器节点信息
  frame: null, // 编辑器绘制信息
  distance: 40, // 编辑器的不可视区域的大小
  pointList: [], // 贝塞尔曲线控制点信息
  movePoints: [], // 贝塞尔曲线动点信息
  targetPoints: [], // 贝塞尔曲线信息

  // 清空曲线控制点
  clearPoint() {
    this.pointList = [];
    this.movePoints = [];
    this.targetPoints = [];
  },

  /**
   * 添加曲线控制点
   * @param {*} item 曲线控制点坐标
   */
  addPoint(item) {
    this.pointList.push(item);
  },

  /**
   * 改变曲线控制点的信息
   * @param {*} _index 曲线下标
   * @param {*} item 坐标信息
   */
  changePoint(_index, item) {
    this.pointList.splice(_index, 1, item);
  },

  /**
   * 初始化曲线编辑器
   * @param {*} node 编辑器节点信息
   * @param {*} frame 编辑器绘制信息
   */
  init(node, frame) {
    this.nodeProp = {
      x: node.position.x, // 编辑器x坐标位置
      y: node.position.y, // 编辑器y坐标位置
      width: node.width, // 编辑器的宽度
      height: node.height // 编辑器的高度
    };
    this.frame = frame;
    this.ctx = node.getComponent(cc.Graphics); // 编辑器获取绘制对象
  },

  /**
   * 改变编辑器的绘制信息
   * @param {*} type 绘制信息类型；包括【绘制曲线帧数】【导出曲线画板宽度】【导出曲线画板高度】
   * @param {*} value 绘制信息值
   */
  changeParam(type, value) {
    this.frame[type] = value;
  },

  /**
   * 绘制编辑器背景，品红色线条以内是可视区域，品红色线条以外是不可视区域
   */
  drawBackground() {
    let ctx = this.ctx,
      nodeProp = this.nodeProp,
      distance = this.distance;
    ctx.lineWidth = 2;
    ctx.strokeColor = cc.Color.BLACK;
    ctx.rect(nodeProp.x, nodeProp.y, nodeProp.width, nodeProp.height);
    ctx.fill();
    ctx.strokeColor = cc.Color.MAGENTA;
    ctx.moveTo(nodeProp.x + distance, nodeProp.y + nodeProp.height - distance);
    ctx.lineTo(nodeProp.x + distance, distance);
    ctx.lineTo(nodeProp.x + nodeProp.width - distance, distance);
    ctx.lineTo(nodeProp.x + nodeProp.width - distance, nodeProp.y + nodeProp.height - distance);
    ctx.lineTo(nodeProp.x + distance, nodeProp.y + nodeProp.height - distance);
    ctx.stroke();
  },

  /**
   * 绘制曲线控制点
   */
  drawPoint() {
    let ctx = this.ctx;
    ctx.clear();
    this.drawBackground();

    let points = this.pointList;
    ctx.strokeColor = '#DCDCDC';
    ctx.lineCap = cc.Graphics.LineCap.ROUND;
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  },

  /**
   * 绘制贝塞尔曲线
   */
  drawLine() {
    let TargetPoints = this.targetPoints,
      ctx = this.ctx;
    // 绘制贝塞尔曲线
    if (TargetPoints.length > 0) {
      ctx.strokeColor = '#FF0000';
      ctx.moveTo(TargetPoints[0].x, TargetPoints[0].y);
      TargetPoints.forEach((p, n) => {
        ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
  },

  /**
   * 计算贝塞尔曲线的坐标信息，以及动点的坐标
   * @param {*} percentage 绘制帧数
   */
  getMovePoint(percentage) {
    let temp = [],
      Points = this.pointList;
    for (let i = 0, len = Points.length; i < len - 1; ++i) {
      let deltaX = Points[i + 1].x - Points[i].x,
        deltaY = Points[i + 1].y - Points[i].y;
      temp.push({
        x: deltaX * percentage + Points[i].x,
        y: deltaY * percentage + Points[i].y
      });
    }
    while (temp.length > 1) {
      let count = temp.length;
      for (let i = 0, len = temp.length; i < len - 1; i++) {
        let deltaX = temp[i + 1].x - temp[i].x,
          deltaY = temp[i + 1].y - temp[i].y;
        temp.push({
          x: deltaX * percentage + temp[i].x,
          y: deltaY * percentage + temp[i].y
        });
      }
      this.movePoints.push([...temp.splice(0, count)]);
    }
    if (temp.length === 1) {
      this.targetPoints.push(temp[0]);
    }
  },

  /**
   * 重绘贝塞尔曲线
   */
  repaint() {
    this.drawPoint();
    this.movePoints = [];
    this.targetPoints = [];
    for (let i = 0; i < this.frame.num; i++) {
        this.getMovePoint(i / this.frame.num);
    }
    this.drawLine();
  },

  /**
   * 导出贝塞尔曲线信息
   */
  exportBezier() {
    let frame = this.frame,
      node = this.nodeProp,
      distance = this.distance,
      pinkPosition = {
        x: node.x + distance,
        y: node.y + distance
      },
      oldAreaSize = {
        width: node.width - 2 * distance,
        height: node.height - 2 * distance
      },
      newAreaSize = {
        width: frame.width,
        height: frame.height
      },
      targetPoints = this.targetPoints,
      showPoints = [],
      exportPoints = [];

    // 把世界坐标转换成显示画布坐标
    showPoints = targetPoints.map((item) => {
      return {
        x: item.x - pinkPosition.x,
        y: item.y - pinkPosition.y
      }
    })

    // 把显示画布坐标转换成导出画布坐标
    exportPoints = showPoints.map((item) => {
      return {
        x: item.x * newAreaSize.width / oldAreaSize.width,
        y: item.y * newAreaSize.height / oldAreaSize.height,
        rotate: 0
      }
    })

    // 计算导出曲线的角度值
    for (let i = 0; i < exportPoints.length; i++) {
      if (i < exportPoints.length - 1) {
        var target = exportPoints[i + 1];
        var dir = new cc.Vec2(exportPoints[i]).sub(target);
        var r = Math.atan2(dir.y, dir.x);
        exportPoints[i].rotate = r * 180 / Math.PI - 180;
      } else {
        exportPoints[i].rotate = exportPoints[i - 1].rotate;
      }
    }

    // 引入工具箱
    let tools = require('Tools');
    if (!exportPoints.length) {
      tools.showMessage('没有数据，不能导出');
      return;
    }
    // 浏览器导出
    var blob = new Blob([JSON.stringify(exportPoints)], {type : 'application/json'});
    var a = document.createElement('a');
    a.href = window.webkitURL.createObjectURL(blob);
    a.download = '';
    a.click();
  },

  /**
   * 导出贝塞尔曲线控制点
   */
  exportOldBezier() {
    // 引入工具箱
    let tools = require('Tools');
    if (!this.pointList.length) {
      tools.showMessage('没有数据，不能导出');
      return;
    }
    // 浏览器导出
    var blob = new Blob([JSON.stringify(this.pointList)], {type : 'application/json'});
    var a = document.createElement('a');
    a.href = window.webkitURL.createObjectURL(blob);
    a.download = '';
    a.click();
  }
}