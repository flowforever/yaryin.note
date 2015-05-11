var ControllerBase = (function () {
    function ControllerBase() {
        this.helper = {
            getCurrentUser: function (req, res) {
                var _this = this;
                return (function () {
                    var redis = $injector.resolve('redisCacheServices');
                    var sessionId = _this.getSessionId(req, res);
                    var user = redis.get(sessionId).wait();
                    if (user) {
                        user = JSON.parse(user);
                        redis.expire(sessionId, 3600 * 24 * 7);
                    }
                    return user;
                }).future()();
            },
            setCurrentUser: function (sessionId, user) {
                return (function () {
                    var redis = $injector.resolve('redisCacheServices');
                    redis.set(sessionId, JSON.stringify(user)).wait();
                }).future()();
            },
            getUserId: function (req) {
                return req.user && req.user._id;
            },
            setUserId: function (res, id) {
                res.cookie('userId', id, {
                    signed: true,
                    httpOnly: true
                });
            },
            getSessionId: function (req, res) {
                var sessionId = req.signedCookies.sessionId;
                if (!sessionId) {
                    sessionId = 'av:session-' + Date.now().toString(32) + '-' + Math.floor(Math.random() * 10000).toString(32);
                    res.cookie('sessionId', sessionId, {
                        signed: true,
                        httpOnly: true
                    });
                }
                return sessionId;
            }
        };
    }
    return ControllerBase;
})();
exports.ControllerBase = ControllerBase;
//# sourceMappingURL=controllerBase.js.map