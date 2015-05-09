var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var GithubPassportServices = (function () {
    function GithubPassportServices($serviceConfig, $userServices) {
        this.authName = 'github';
        this.authUrl = '/passport/auth/github';
        this.callbackUrl = '/passport/callback/github';
        this.authAction = passport.authenticate('github');
        this.authCallback = passport.authenticate('github', { failureRedirect: '/passport/failed/github' });
        this.serviceConfig = $serviceConfig;
        this.userServices = $userServices;
    }
    GithubPassportServices.prototype.init = function () {
        var _this = this;
        var cfg = this.serviceConfig.authConfig.github;
        passport.use(new GitHubStrategy({
            clientID: cfg.APP_KEY,
            clientSecret: cfg.APP_SECRET,
            callbackURL: this.serviceConfig.absUrl(this.callbackUrl)
        }, function (accessToken, refreshToken, profile, done) {
            return (function () {
                var user = _this.saveOrUpdateUser(profile).wait();
                done(null, user);
            }).future()();
        }));
    };
    GithubPassportServices.prototype.saveOrUpdateUser = function (user) {
        var _this = this;
        return (function () {
            var dbUser = _this.userServices.findBySocialId(user.id, _this.authName).wait();
            if (dbUser) {
                dbUser.name = _this.authName + '_' + user.username;
                //dbUser.email = user._json.email;
                dbUser.socialDescription = user.description;
                dbUser.socialPhoto = user._json.avatar_url;
                dbUser.save.future().bind(user)().wait();
            }
            else {
                dbUser = _this.userServices.add({
                    socialId: user.id,
                    socialType: _this.authName,
                    name: _this.authName + '_' + user.username
                }).wait();
            }
            return dbUser;
        }).future()();
    };
    return GithubPassportServices;
})();
$injector.register('githubPassportServices', GithubPassportServices);
//# sourceMappingURL=githubPassport.js.map