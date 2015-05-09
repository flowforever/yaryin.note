///<reference path="../_references.d.ts"/>
import cbs = require('../utils/controllerBase');
class Controller extends cbs.ControllerBase {
    constructor($userServices, $documentServices) {
        super();
    }

    currentUser(req, res) {
        res.send(req.user || {});
    }

    notfound(req, res) {
        res.send('not found: ' + req.query.accountId)
    }

    authFailed(req, res) {
        res.send('auth failed');
    }

    login(req, res, next) {
        var isFromLoginAction = req.path.toLowerCase() === '/account/login';
        (()=> {
            if (req.user) {
                var sessionId = this.helper.getSessionId(req, res);
                this.helper.setCurrentUser(sessionId, req.user);
                var shortNs = req.user.name || req.user.id;
                res.redirect('/' + shortNs);
            } else {
                res.redirect('/account/login');
            }
        }).future()();
    }

    logout(req, res, next) {

    }

    sessionId(req, res) {
        res.send(this.helper.getSessionId(req, res));
    }
}
$injector.register('accountController', Controller);
module.exports = $injector.resolve('accountController');