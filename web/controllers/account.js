var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path="../_references.d.ts"/>
var cbs = require('../utils/controllerBase');
var Controller = (function (_super) {
    __extends(Controller, _super);
    function Controller($userServices, $documentServices) {
        _super.call(this);
    }
    Controller.prototype.currentUser = function (req, res, next) {
        var _this = this;
        (function () {
            var user = _this.helper.getCurrentUser(req, res).wait();
            res.send(user);
        }).future()();
    };
    Controller.prototype.notfound = function (req, res) {
        res.send('not found: ' + req.query.accountId);
    };
    Controller.prototype.authFailed = function (req, res) {
        res.send('auth failed');
    };
    Controller.prototype.login = function (req, res, next) {
        var isFromLoginAction = req.path.toLowerCase() === '/account/login';
    };
    Controller.prototype.logout = function (req, res, next) {
    };
    return Controller;
})(cbs.ControllerBase);
$injector.register('accountController', Controller);
module.exports = $injector.resolve('accountController');
//# sourceMappingURL=account.js.map