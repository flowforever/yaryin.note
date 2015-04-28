var passport = require('passport');
var GitHubStrategy = require('passport-github');
var GithubPassportServices = (function () {
    function GithubPassportServices($serviceConfig) {
        this.authName = 'github';
        this.authUrl = '/passport/auth/github';
        this.callbackUrl = '/passport/callback/github';
        this.authAction = passport.authenticate('github');
        this.authCallback = passport.authenticate('github', { failureRedirect: '/passport/failed/github', successRedirect: '/' });
        this.serviceConfig = $serviceConfig;
    }
    GithubPassportServices.prototype.init = function () {
        var cfg = this.serviceConfig.authConfig.github;
        passport.use(new GitHubStrategy({
            clientID: cfg.APP_KEY,
            clientSecret: cfg.APP_SECRET,
            callbackURL: this.serviceConfig.absUrl(this.callbackUrl)
        }, function (accessToken, refreshToken, profile, done) {
            console.log(arguments);
            done();
        }));
    };
    return GithubPassportServices;
})();
//# sourceMappingURL=githubPassport.js.map