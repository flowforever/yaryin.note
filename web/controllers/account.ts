///<reference path="../_references.d.ts"/>
import cbs = require('../utils/controllerBase');
class Controller extends cbs.ControllerBase {
    constructor($userServices, $documentServices) {
        super();
    }

    currentUser(req, res, next) {
        (()=>{
            var user = this.helper.getCurrentUser(req, res).wait();
            res.send(user);
        }).future()();
    }

    notfound(req, res) {
        res.send('not found: ' + req.query.accountId)
    }

    authFailed(req, res) {
        res.send('auth failed');
    }

    login(req, res, next) {
        var isFromLoginAction = req.path.toLowerCase() === '/account/login';

    }

    logout(req, res, next) {

    }
}
$injector.register('accountController', Controller);
module.exports = $injector.resolve('accountController');