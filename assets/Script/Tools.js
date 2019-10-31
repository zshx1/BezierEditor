module.exports = {
    showMessage(mes) {
        const scene = cc.director.getScene();
        let node = new cc.Node(),
            message = node.addComponent(cc.Label);
        message.string = mes;
        message.fontSize = 32;
        node.color = cc.Color.BLACK;
        node.setPosition(new cc.Vec2(cc.winSize.width / 2, cc.winSize.height / 2));
        node.parent = scene;
        setTimeout(function() {
            node.removeFromParent();
        }, 2000)
    }
}