var Future = require("fibers/future");
var User = (function () {
    function User() {
        this.db = $injector.resolve('db');
        this.$User = Future.wrap(this.db.User);
    }
    User.prototype.getName = function () {
        return 'user';
    };
    User.prototype.getList = function () {
        return this.$User.findFuture({});
    };
    User.prototype.add = function (user) {
        return this.$User.createFuture(user);
    };
    return User;
})();
exports.User = User;
$injector.register('userServices', User);
//# sourceMappingURL=userServices.js.map