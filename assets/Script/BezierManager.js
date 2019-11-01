module.exports = {
    bezierList: [], // 贝塞尔曲线列表

    /**
     * 新增贝塞尔曲线
     * @param {*} item 曲线信息
     */
    addBezier(item) {
        this.bezierList.push(item)
    },

    /**
     * 删除贝塞尔曲线
     * @param {*} index 曲线下标
     */
    delBezier(index) {
        this.bezierList.splice(index, 1);
    },

    // 返回曲线列表长度
    getLength() {
        return this.bezierList.length;
    },

    // 获取曲线列表中选中的项，并返回
    getCheckedItem() {
        return this.bezierList.find(ele => ele.status);
    },

    /**
     * 改变曲线的选中状态，并返回曲线的路径信息
     * @param {*} id 曲线的唯一编码
     * @param {*} _status 曲线的状态
     */
    changeItem(id, _status) {
        let returnData = null;
        let select = this.bezierList.find(ele => ele.status);
        if (select)
            select.status = false;
        let _item = this.bezierList.find(ele => ele.id === id);
        if (_item) {
            this.bezierList.splice(_item.index, 1, {
                status: _status,
                index: _item.index,
                id: id,
                data: _item.data,
                type: _item.type
            });
            returnData = _item.data;
        }
        return returnData;
    },

    // 清空曲线列表
    clearAll() {
        this.bezierList = [];
    }
}