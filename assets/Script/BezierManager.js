module.exports = {
    bezierList: [],
    addBezier(item) {
        this.bezierList.push(item)
    },

    delBezier(index) {
        this.bezierList.splice(index, 1);
    },

    getLength() {
        return this.bezierList.length;
    },

    getCheckedItem() {
        return this.bezierList.find(ele => ele.status);
    },

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

    clearAll() {
        this.bezierList = [];
    }
}