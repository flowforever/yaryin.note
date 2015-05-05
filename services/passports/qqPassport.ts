/**
 * Created by trump on 15/4/27.
 */
/// <reference path="./_references.d.ts"/>
import passports = require("passports");

import passport = require('passport');

var TqqStrategy = require('passport-tqq').Strategy;

class QQPassportServices implements passports.IPassport {
    serviceConfig;

    constructor($serviceConfig) {
        this.serviceConfig = $serviceConfig;
    }

    authName = "qq";
    authUrl = '/passport/auth/qq';
    callbackUrl = '/passport/callback/qq';

    init() {
        var qqConfig = this.serviceConfig.authConfig.qq;
        passport.use(new TqqStrategy({
                clientID: qqConfig.APP_KEY,
                clientSecret: qqConfig.APP_SECRET,
                state: 'trump',
                callbackURL: this.serviceConfig.absUrl(this.callbackUrl)
            },
            function(accessToken, refreshToken, profile, done) {
                console.log( arguments );
                // asynchronous verification, for effect...
                process.nextTick(function () {
                    return done(null, profile);
                });
            }
        ));
    }

    authAction = passport.authenticate('qq', {
        state: 'random state value'
    });

    authCallback = passport.authenticate('qq', {failureRedirect: '/passport/failed/qq', successRedirect: '/'});

    saveOrUpdateUser(user): IFuture<any>{
        return (()=>{

        }).future()();
    }
}

$injector.register('qqPassportServices', QQPassportServices);