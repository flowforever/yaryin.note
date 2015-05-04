/**
 * Created by trump on 15/5/4.
 */
/// <reference path="./_references.d.ts"/>
var redis = require('redis');
var RedisCacheServices = (function () {
    function RedisCacheServices() {
        this.client = redis.createClient();
    }
    RedisCacheServices.prototype.close = function () {
    };
    return RedisCacheServices;
})();
$injector.register('redisCacheServices', RedisCacheServices);
//# sourceMappingURL=redisServices.js.map