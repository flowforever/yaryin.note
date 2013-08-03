function Page() {
    if (!(this instanceof Page)) {
        var __inst = new Page();
        __inst.init.apply(__inst, arguments);
        return __inst;
    }
    var self = this;

    this.init = function (items, total, pageSize, index) {
        return this;
    }

    this._pageSize = 10;
    this._total = 0;
    this._items = [];

    'pageSize,total,currentIndex,items,error'.split(',')
    .forEach(function (prop) {
        self[prop] = function () {
            if (arguments.length == 0) {
                return self['_' + prop];
            } else if (arguments.length == 1) {
                self['_' + prop] = arguments[0];
            }
            return this;
        }
    })

    this.pageNum = function () {
        var total = this.total()
        , pageSize = this.pageSize()
        , pageNum = (total % pageSize == 0 ? 0 : 1) + Math.floor(total / pageSize);
        return pageNum;
    }

    this.setItems = function (err, items) {
        if (err) {
            this.error(err);
        } else if (items) {
            this.items(items);
        }
    }

    this.getData = function () {
        var obj = {};
        'pageSize,total,currentIndex,items,error'.split(',')
        .forEach(function (prop) {
            obj[prop] = self[prop]();
        });
        obj.pageNum = this.pageNum();
        return obj;
    }
}

module.exports = Page;

Page.mongoose = function (model, query, orderQuery,callback, currentIndex, pageSize) {
    
    currentIndex = currentIndex || 0;
    orderQuery = orderQuery || '-_id';
    if (!isNaN(currentIndex)) {
        currentIndex = parseInt(currentIndex);
    }
    var page = Page();
    if (pageSize) { page.pageSize(pageSize); }
    model.count(query, function (err,size) {
        page.total(size);
        page.currentIndex(currentIndex);
        model.find(query).sort(orderQuery).skip(page.pageSize() * page.currentIndex()).limit(page.pageSize()).exec(function (err, docs) {
            page.setItems(err, docs || []);
            callback(page.getData());
        });
    });
}
