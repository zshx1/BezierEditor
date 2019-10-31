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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
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

    // start () {

    // },

    // update (dt) {},
});
