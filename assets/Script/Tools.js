module.exports = {
    /**
     * 显示提示信息
     * @param {*} mes 信息
     */
    showMessage(mes) {
        // 获取场景
        const scene = cc.director.getScene();
        let node = new cc.Node(), // 初始化节点
            message = node.addComponent(cc.Label); // 给节点新增文字组件
        message.string = mes; // 设置消息
        message.fontSize = 32; // 设置字体大小
        node.color = cc.Color.BLACK; // 设置字体颜色
        // 设置节点位置
        node.setPosition(new cc.Vec2(cc.winSize.width / 2, cc.winSize.height / 2));
        // 把节点添加到场景中
        node.parent = scene;
        // 延时删除节点
        setTimeout(function() {
            node.removeFromParent();
        }, 2000)
    }
}