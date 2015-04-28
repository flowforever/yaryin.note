var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var sb = require('./servicesBase');
var UserServices = (function (_super) {
    __extends(UserServices, _super);
    function UserServices($db) {
        _super.call(this, $db.User);
        this.db = $db;
    }
    UserServices.prototype.getList = function () {
        return this.$table.findFuture({});
    };
    UserServices.prototype.add = function (user) {
        return this.$table.createFuture(user);
    };
    UserServices.prototype.findByAccount = function (accountId) {
        var _this = this;
        return (function () {
            var user = _this.$table.findById(accountId).wait();
            if (!user) {
                user = _this.$table.findOne({
                    name: accountId
                }).wait();
            }
            return user;
        }).future()();
    };
    return UserServices;
})(sb.ServiceBase);
exports.UserServices = UserServices;
$injector.register('userServices', UserServices);
//# sourceMappingURL=userServices.js.map