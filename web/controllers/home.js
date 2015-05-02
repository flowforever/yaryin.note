var Controller = (function () {
    function Controller($userServices) {
        this.userServices = $userServices;
    }
    Controller.prototype['index'] = function (req, res) {
        res.view();
    };
    Controller.prototype['accountUser'] = function (req, res, next) {
        var _this = this;
        if (!req.accepts('html')) {
            return next();
        }
        var accountId = req.params.accountId;
        (function () {
            var user = _this.userServices.findByAccount(accountId).wait();
            if (!user) {
                res.view('user_not_found');
            }
            else {
                res.view('index', { user: user });
            }
        }).future()();
    };
    Controller.prototype['/view/:id'] = function (req, res) {
        res.end('view files');
    };
    return Controller;
})();
module.exports = $injector.resolve(Controller);
//# sourceMappingURL=home.js.map