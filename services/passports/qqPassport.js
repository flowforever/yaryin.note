var passport = require('passport');
var TqqStrategy = require('passport-tqq').Strategy;
var QQPassportServices = (function () {
    function QQPassportServices($serviceConfig) {
        this.authName = "qq";
        this.authUrl = '/passport/auth/qq';
        this.callbackUrl = '/passport/callback/qq';
        this.authAction = passport.authenticate('qq');
        this.authCallback = passport.authenticate('qq', { failureRedirect: '/passport/failed/qq', successRedirect: '/' });
        this.serviceConfig = $serviceConfig;
    }
    QQPassportServices.prototype.init = function () {
        var qqConfig = this.serviceConfig.authConfig.qq;
        passport.use(new TqqStrategy({
            clientID: qqConfig.APP_KEY,
            clientSecret: qqConfig.APP_SECRET,
            callbackURL: this.serviceConfig.absUrl(this.callbackUrl)
        }, function (accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {
                return done(null, profile);
            });
        }));
    };
    return QQPassportServices;
})();
$injector.register('qqPassportServices', QQPassportServices);
//# sourceMappingURL=qqPassport.js.map