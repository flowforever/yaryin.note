/**
 * Created by trump on 15/4/27.
 */
/// <reference path="./_references.d.ts"/>

import passports = require("passports");

import passport = require('passport');

var passport_sina = require('passport-sina');

class SinaPassportServices implements passports.IPassport {
    serviceConfig;
    db;
    userServices;

    constructor($serviceConfig, $db, $userServices) {
        this.serviceConfig = $serviceConfig;
        this.userServices = $userServices;
        this.db = $db;
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
                console.log( arguments );
                process.nextTick(function () {
                    return callback(null, profile);
                });
            }));
    }

    authAction = passport.authenticate('sina');

    authCallback = passport.authenticate('sina', {failureRedirect: '/passport/failed/sina'});

    saveOrUpdateUser(user): IFuture<any>{
        return (()=>{
            var dbUser = this.userServices.findBySocialId( user.id, this.authName ).wait();
            if(dbUser) {
                dbUser.name = this.authName + '_' + user.name;
                dbUser.socialDescription = user.description;
                dbUser.socialPhoto = user.avatar_hd;
                dbUser.save.future().bind(user)().wait();
            }else{
                dbUser = this.userServices.add({
                    socialId: user.id
                    , socialType: this.authName
                    , name: this.authName + '_' + user.name
                }).wait();
            }
            return dbUser;
        }).future()();
    }
}

$injector.register('sinaPassportServices', SinaPassportServices);