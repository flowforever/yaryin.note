var passport = require('passport');
var TqqStrategy = require('passport-tqq').Strategy;
var QQPassportServices = (function () {
    function QQPassportServices($serviceConfig) {
        this.authName = "qq";
        this.authUrl = '/passport/auth/qq';
        this.callbackUrl = '/passport/callback/qq';
        this.authAction = passport.authenticate('qq', {
            state: 'random state value'
        });
        this.authCallback = passport.authenticate('qq', { failureRedirect: '/passport/failed/qq', successRedirect: '/' });
        this.serviceConfig = $serviceConfig;
    }
    QQPassportServices.prototype.init = function () {
        var qqConfig = this.serviceConfig.authConfig.qq;
        passport.use(new TqqStrategy({
            clientID: qqConfig.APP_KEY,
            clientSecret: qqConfig.APP_SECRET,
            state: 'trump',
            callbackURL: this.serviceConfig.absUrl(this.callbackUrl)
        }, function (accessToken, refreshToken, profile, done) {
            console.log(arguments);
            // asynchronous verification, for effect...
            process.nextTick(function () {
                return done(null, profile);
            });
        }));
    };
    QQPassportServices.prototype.saveOrUpdateUser = function (user) {
        return (function () {
        }).future()();
    };
    return QQPassportServices;
})();
$injector.register('qqPassportServices', QQPassportServices);
//# sourceMappingURL=qqPassport.js.map