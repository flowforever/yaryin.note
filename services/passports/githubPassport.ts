/**
 * Created by trump.wang on 2015/4/28.
 */
///<reference path="./_references.d.ts"/>
import passports = require("passports");

import passport = require('passport');

var GitHubStrategy = require('passport-github').Strategy;

class GithubPassportServices implements passports.IPassport {
    authName = 'github';
    authUrl = '/passport/auth/github';
    callbackUrl = '/passport/callback/github';
    userServices;

    serviceConfig;

    constructor($serviceConfig, $userServices) {
        this.serviceConfig = $serviceConfig;
        this.userServices = $userServices;
    }

    init() {
        var cfg = this.serviceConfig.authConfig.github;
        passport.use(new GitHubStrategy({
                clientID: cfg.APP_KEY,
                clientSecret: cfg.APP_SECRET,
                callbackURL: this.serviceConfig.absUrl(this.callbackUrl)
            },
            (accessToken, refreshToken, profile, done) => {

                return (()=> {

                    var user = this.saveOrUpdateUser(profile).wait();

                    done(null, user);

                }).future()();
            }
        ));
    }

    authAction = passport.authenticate('github');
    authCallback = passport.authenticate('github', {failureRedirect: '/passport/failed/github'});
    saveOrUpdateUser(user):IFuture<any> {
        return (()=> {
            var dbUser = this.userServices.findBySocialId(user.id, this.authName).wait();
            if (dbUser) {
                dbUser.name = this.authName + '_' + user.username;
                //dbUser.email = user._json.email;
                dbUser.socialDescription = user.description;
                dbUser.socialPhoto = user._json.avatar_url;
                dbUser.save.future().bind(user)().wait();
            } else {
                dbUser = this.userServices.add({
                    socialId: user.id
                    , socialType: this.authName
                    , name: this.authName + '_' + user.username
                    //, socialPhoto: user._json.avatar_url
                }).wait();
            }
            return dbUser;
        }).future()();
    }
}

$injector.register('githubPassportServices', GithubPassportServices);