/**
 * 输入框值改变处理
 */
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        // 注册输入框值改变事件
        this.node.on('text-changed', this._change, this);
    },

    _change(event) {
        let key = event.name,
            value = event.string,
            bezier = require('Bezier');

        switch(key) {
            case 'bezierFrame<EditBox>':
                bezier.changeParam('num', value);
            break;
            case 'windowWidth<EditBox>':
                bezier.changeParam('width', value);
            break;
            case 'windowHeight<EditBox>':
                bezier.changeParam('height', value);
            break;
            case 'bezierFrameRate<EditBox>':
            break;
        }
        bezier.repaint();
    }
});
