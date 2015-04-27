/**
 * Created by trump on 15/4/27.
 */
/// <reference path="./_references.d.ts"/>

import passports = require("passports");

import passport = require('passport');

var passport_sina = require('passport-sina');

class SinaPassportServices implements passports.IPassport {
    serviceConfig;

    constructor($serviceConfig) {
        this.serviceConfig = $serviceConfig;
    }

    authName = "sina";
    authUrl = '/passport/auth/sina';
    callbackUrl = '/passport/callback/sina';

    init() {
        var sinaConfig = this.serviceConfig.authConfig.sina;
        passport.use(new passport_sina({
                clientID: sinaConfig.APP_KEY,
                clientSecret: sinaConfig.APP_SECRET,
                callbackURL: this.serviceConfig.absUrl(this.callbackUrl)
            },
            function (accessToken, refreshToken, profile, callback) {
                process.nextTick(function () {
                    return callback(null, profile);
                });
            }));
    }

    authAction = passport.authenticate('sina');

    authCallback = passport.authenticate('sina', {failureRedirect: '/passport/failed/sina', successRedirect: '/'});
}

$injector.register('sinaPassportServices', SinaPassportServices);