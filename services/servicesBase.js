var Future = require("fibers/future");
var ServiceBase = (function () {
    function ServiceBase(table) {
        var _this = this;
        this._serviceName = 'services' + Math.random();
        this.cache = {
            getCacheKey: function (key) {
                if (key.indexOf('CacheLayer') === 0) {
                    return key;
                }
                return [
                    'CacheLayer',
                    _this.serviceName,
                    key
                ].join('-');
            },
            getByKey: function (key) {
            },
            setByKey: function (key, value) {
            },
            removeByKey: function (key) {
            },
            clearAll: function () {
            }
        };
        this.table = table;
        this.$table = Future.wrap(table);
        this.db = $injector.resolve('db');
        this.redis = $injector.resolve('redisCacheServices');
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
    ServiceBase.prototype.find = function (query) {
        return this.$table.findFuture.bind(this.table)(query);
    };
    ServiceBase.prototype.findOne = function (query) {
        return this.$table.findOneFuture.bind(this.table)(query);
    };
    ServiceBase.prototype.isObjectId = function (id) {
        return this.db.isObjectId(id);
    };
    Object.defineProperty(ServiceBase.prototype, "serviceName", {
        get: function () {
            return this._serviceName;
        },
        enumerable: true,
        configurable: true
    });
    return ServiceBase;
})();
exports.ServiceBase = ServiceBase;
//# sourceMappingURL=servicesBase.js.map