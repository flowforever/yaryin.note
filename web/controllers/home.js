var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cbs = require('../utils/controllerBase');
var Controller = (function (_super) {
    __extends(Controller, _super);
    function Controller($userServices) {
        _super.call(this);
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
        var accountId = req.params.accountId || req.query.accountId;
        (function () {
            var targetUser = _this.userServices.findByAccount(accountId).wait();
            if (!targetUser) {
                res.redirect('/account/notfound?accountId=' + accountId);
            }
            else {
                var currentUser = _this.helper.getCurrentUser(req, res);
                res.view('index', { user: targetUser, currentUser: currentUser });
            }
        }).future()();
    };
    Controller.prototype['/view/:id'] = function (req, res) {
        res.end('view files');
    };
    return Controller;
})(cbs.ControllerBase);
module.exports = $injector.resolve(Controller);
//# sourceMappingURL=home.js.map