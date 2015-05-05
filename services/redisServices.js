/**
 * Created by trump on 15/5/4.
 */
/// <reference path="./_references.d.ts"/>
var redis = require('redis');
var Future = require("fibers/future");
var RedisCacheServices = (function () {
    function RedisCacheServices() {
        this.client = redis.createClient();
        this.futureClient = Future.wrap(this.client);
    }
    RedisCacheServices.prototype.close = function () {
    };
    RedisCacheServices.prototype.get = function (key) {
        var _this = this;
        return (function () {
            return _this.futureClient.getFuture(key).wait();
        }).future()();
    };
    RedisCacheServices.prototype.set = function (key, value, timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = 60; }
        return (function () {
            _this.futureClient.setFuture(key, value).wait();
            _this.expire(key, timeout).wait();
        }).future()();
    };
    RedisCacheServices.prototype.expire = function (key, timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = 60; }
        return (function () {
            _this.futureClient.expireFuture(key, timeout);
        }).future()();
    };
    return RedisCacheServices;
})();
$injector.register('redisCacheServices', RedisCacheServices);
//# sourceMappingURL=redisServices.js.map