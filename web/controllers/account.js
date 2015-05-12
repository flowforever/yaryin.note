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
        this.userServices = $userServices;
    }
    Controller.prototype.currentUser = function (req, res) {
        var currentUser = req.user || {};
        currentUser.sessionId = this.helper.getSessionId(req, res);
        res.send(currentUser);
    };
    Controller.prototype['userInfo/:accountName'] = function (req, res) {
        var self = this;
        (function () {
            var user = self.userServices.findByUserNameOrId(req.params.accountName).wait();
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
        var _this = this;
        var isFromLoginAction = req.path.toLowerCase() === '/account/login';
        (function () {
            if (req.user) {
                var sessionId = _this.helper.getSessionId(req, res);
                _this.helper.setCurrentUser(sessionId, req.user);
                var shortNs = req.user.name || req.user.id;
                res.redirect('/' + shortNs);
            }
            else {
                res.redirect('/account/login');
            }
        }).future()();
    };
    Controller.prototype.logout = function (req, res, next) {
    };
    Controller.prototype.sessionId = function (req, res) {
        res.send(this.helper.getSessionId(req, res));
    };
    return Controller;
})(cbs.ControllerBase);
$injector.register('accountController', Controller);
module.exports = $injector.resolve('accountController');
//# sourceMappingURL=account.js.map