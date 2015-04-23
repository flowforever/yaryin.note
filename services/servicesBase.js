var Future = require("fibers/future");
var ServiceBase = (function () {
    function ServiceBase(table) {
        this.table = table;
        this.$table = Future.wrap(table);
    }
    ServiceBase.prototype.getAll = function () {
        return this.$table.findFuture.bind(this.table)({});
    };
    ServiceBase.prototype.add = function (model) {
        return this.$table.createFuture.bind(this.table)(model);
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