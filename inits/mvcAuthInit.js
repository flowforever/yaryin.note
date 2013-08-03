var avril = require('avril');

avril.mvc.Authorize.prototype.auth = function (next) {
    var self = this;
    var req = self.req()
    , res = self.res();

    var authProvider = this.controllerConfig().provider ?
        avril.auth.get(this.controllerConfig().provider) : avril.auth.get();

    authProvider.isAuth(req, res, function (result, user) {
        user = user || {};
        self.result = result;
        self.user = user;
        self.isLogin = !!user._id;
        next(result);
    });

}

avril.mvc.Authorize.prototype.onUnAuthorize = function (req, res, next, helper) {
    var authProvider = helper.controllerConfig().provider;
    if (authProvider == 'system') {
        res.redirect(helper.url.action('unauthorized', 'account').toString());
    } else {
        res.redirect(helper.url.action('login', 'account', { area: null }).toString());
    }
}

avril.mvc.Authorize.prototype.provider = function () {
    return avril.auth.get(this.controllerConfig().provider);
}

var weixinAuth = avril.auth.get('weixin');
weixinAuth.isAuth = function (req, res, callback) {
    var weixinReg = /weixin/i
    , userAgent = req.headers['user-agent']
    , isFromWeixin = weixinReg.test(userAgent)
    , cacheKey = req.param('wxId');

    this.getCacheUser(cacheKey, function () {

    });
}

var systemAuth = avril.auth.get('system');