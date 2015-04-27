/**
 * Created by trump on 15/4/27.
 */
/// <reference path="./_references.d.ts"/>
var passport = require('passport');
var passport_sina = require('passport-sina');
var SinaPassportServices = (function () {
    function SinaPassportServices($serviceConfig) {
        this.authName = "sina";
        this.authUrl = '/passport/auth/sina';
        this.callbackUrl = '/passport/callback/sina';
        this.authAction = passport.authenticate('sina');
        this.authCallback = passport.authenticate('sina', { failureRedirect: '/passport/failed/sina', successRedirect: '/' });
        this.serviceConfig = $serviceConfig;
    }
    SinaPassportServices.prototype.init = function () {
        var sinaConfig = this.serviceConfig.authConfig.sina;
        passport.use(new passport_sina({
            clientID: sinaConfig.APP_KEY,
            clientSecret: sinaConfig.APP_SECRET,
            callbackURL: this.serviceConfig.absUrl(this.callbackUrl)
        }, function (accessToken, refreshToken, profile, callback) {
            process.nextTick(function () {
                return callback(null, profile);
            });
        }));
    };
    return SinaPassportServices;
})();
$injector.register('sinaPassportServices', SinaPassportServices);
//# sourceMappingURL=sinaPassport.js.map