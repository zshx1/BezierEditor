# BezierEditor
 cocos create版贝塞尔曲线编辑器，JavaScript，可用于制作捕鱼鱼阵
```
+-- assets 资产目录
|   +--  资源目录
|   |   +-- animation 动画目录
|   |   |   +-- fish.anim 鱼运动动画
|   |   +-- img 图片资源
|   |   +-- json 鱼路径资源（贝塞尔曲线）
|   |   +-- originalPath 原始贝塞尔曲线（控制点路径）
|   |   +-- prefabs 预制体
|   +-- Scene 场景
|   +-- Script 脚本
|   |   +-- AddBezier.js 新增原始曲线
|   |   +-- Bezier.js 贝塞尔曲线编辑器
|   |   +-- BezierManager.js 贝塞尔曲线管理器
|   |   +-- DelBezier.js 删除曲线
|   |   +-- DrawArea.js 绘制区域
|   |   +-- ExportBezier.js 导出曲线
|   |   +-- ExportOldBezier.js 导出原始曲线（控制点）
|   |   +-- Fish.js 鱼
|   |   +-- FlushOriginalPath.js 刷新曲线
|   |   +-- Input.js 文本输入控制
|   |   +-- Point.js 控制点
|   |   +-- Tools.js 工具箱
```

# 工具使用说明：
1. 需要先新增曲线，并选中曲线
  ![步骤演示1](https://www.freedominfo.club/Img/Bezier/step1.png)
2. 然后右键键点击绘制区域，生成控制点；左键可拖动控制点
  ![步骤演示2](https://www.freedominfo.club/Img/Bezier/step2.png)
3. 曲线编辑完成后，可点击【导出编译曲线按钮】导出编译好的曲线数据；点击【导出原始曲线按钮】可导出控制点数据，方便再次编辑。
  ![步骤演示3](https://www.freedominfo.club/Img/Bezier/step3.png)
4. 【刷新原始曲线】按钮可以重新加载保存到assets/resources/originalPath目录下的原始曲线数据
5. 查看曲线效果，可以在Fish.js脚本中更改曲线加载路径，选择并运行fish场景
> > # oldBezier.json 导出的曲线参数是帧数：1000；宽度：960；高度：640；
> > # 工具最好在浏览器中使用
# 如果能帮助到您，请支持作者
  ![收款码](https://www.freedominfo.club/Img/Bezier/my.png)