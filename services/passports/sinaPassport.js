/**
 * Created by trump on 15/4/27.
 */
/// <reference path="./_references.d.ts"/>
var passport = require('passport');
var passport_sina = require('passport-sina');
var SinaPassportServices = (function () {
    function SinaPassportServices($serviceConfig, $db, $userServices) {
        this.authName = "sina";
        this.authUrl = '/passport/auth/sina';
        this.callbackUrl = '/passport/callback/sina';
        this.authAction = passport.authenticate('sina');
        this.authCallback = passport.authenticate('sina', { failureRedirect: '/passport/failed/sina' });
        this.serviceConfig = $serviceConfig;
        this.userServices = $userServices;
        this.db = $db;
    }
    SinaPassportServices.prototype.init = function () {
        var sinaConfig = this.serviceConfig.authConfig.sina;
        passport.use(new passport_sina({
            clientID: sinaConfig.APP_KEY,
            clientSecret: sinaConfig.APP_SECRET,
            callbackURL: this.serviceConfig.absUrl(this.callbackUrl)
        }, function (accessToken, refreshToken, profile, callback) {
            console.log(arguments);
            process.nextTick(function () {
                return callback(null, profile);
            });
        }));
    };
    SinaPassportServices.prototype.saveOrUpdateUser = function (user) {
        var _this = this;
        return (function () {
            var dbUser = _this.userServices.findBySocialId(user.id, _this.authName).wait();
            if (dbUser) {
                dbUser.name = _this.authName + '_' + user.name;
                dbUser.socialDescription = user.description;
                dbUser.socialPhoto = user.avatar_hd;
                dbUser.save.future().bind(user)().wait();
            }
            else {
                dbUser = _this.userServices.add({
                    socialId: user.id,
                    socialType: _this.authName,
                    name: _this.authName + '_' + user.name
                }).wait();
            }
            return dbUser;
        }).future()();
    };
    return SinaPassportServices;
})();
$injector.register('sinaPassportServices', SinaPassportServices);
//# sourceMappingURL=sinaPassport.js.map