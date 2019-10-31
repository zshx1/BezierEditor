module.exports = {
  ctx: null,
  nodeProp: null,
  frame: 0,
  distance: 40,
  pointList: [],
  movePoints: [],
  targetPoints: [],

  init(node, frame) {
    this.nodeProp = {
      x: node.position.x,
      y: node.position.y,
      width: node.width,
      height: node.height
    };
    this.frame = frame;
    this.ctx = node.getComponent(cc.Graphics);
  },

  changeParam(type, value) {
    this.frame[type] = value;
  },

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

  repaint() {
    this.drawPoint();
    this.movePoints = [];
    this.targetPoints = [];
    for (let i = 0; i < this.frame.num; i++) {
        this.getMovePoint(i / this.frame.num);
    }
    this.drawLine();
  },

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

    let tools = require('Tools');
    if (!exportPoints.length) {
      tools.showMessage('没有数据，不能导出');
      return;
    }

    var blob = new Blob([JSON.stringify(exportPoints)], {type : 'application/json'});
    var a = document.createElement('a');
    a.href = window.webkitURL.createObjectURL(blob);
    a.download = '';
    a.click();
  },

  exportOldBezier() {
    let tools = require('Tools');
    if (!this.pointList.length) {
      tools.showMessage('没有数据，不能导出');
      return;
    }

    var blob = new Blob([JSON.stringify(this.pointList)], {type : 'application/json'});
    var a = document.createElement('a');
    a.href = window.webkitURL.createObjectURL(blob);
    a.download = '';
    a.click();
  }
}