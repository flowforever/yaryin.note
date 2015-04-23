var Future = require("fibers/future");
var ServiceBase = (function () {
    function ServiceBase(table) {
        this.table = table;
        this.$table = Future.wrap(table);
    }
    ServiceBase.prototype.getAll = function () {
        var future = new Future();
        this.table.find({}, function (err, docs) {
            if (err)
                return future.throw(err);
            return future.return(docs);
        });
        return future;
    };
    ServiceBase.prototype.add = function (model) {
        var future = new Future();
        this.table.create(model, function (err, res) {
            if (err)
                return future.throw(err);
            return future.return(res);
        });
        return future;
    };
    ServiceBase.prototype.findById = function (id) {
        return this.$table.findOneFuture.bind(this.table)({
            _id: id
        });
    };
    return ServiceBase;
})();
exports.ServiceBase = ServiceBase;
//# sourceMappingURL=servicesBase.js.map