/**
 * Created by trump.wang on 2015/4/28.
 */
///<reference path="./_references.d.ts"/>
import passports = require("passports");

import passport = require('passport');

var GitHubStrategy = require('passport-github').Strategy;

class GithubPassportServices implements passports.IPassport{
    authName = 'github';
    authUrl = '/passport/auth/github';
    callbackUrl = '/passport/callback/github';

    serviceConfig;
    constructor($serviceConfig) {
        this.serviceConfig = $serviceConfig;
    }

    init(){
        var cfg = this.serviceConfig.authConfig.github;
        passport.use(new GitHubStrategy({
                clientID: cfg.APP_KEY,
                clientSecret: cfg.APP_SECRET,
                callbackURL: this.serviceConfig.absUrl(this.callbackUrl)
            },
            function(accessToken, refreshToken, profile, done) {
                console.log( arguments );
                done();
            }
        ));
    }

    authAction = passport.authenticate('github');
    authCallback = passport.authenticate('github', {failureRedirect: '/passport/failed/github', successRedirect: '/'});
}

$injector.register('githubPassportServices', GithubPassportServices);