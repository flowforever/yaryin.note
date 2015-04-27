/**
 * Created by trump on 15/4/27.
 */
/// <reference path="./_references.d.ts"/>
var avril = require('avril');
var url = require('url');
var ServiceConfig = (function () {
    function ServiceConfig() {
    }
    ServiceConfig.prototype.getConfig = function (configName) {
        return avril.getConfig(configName);
    };
    Object.defineProperty(ServiceConfig.prototype, "appConfig", {
        get: function () {
            return this.getConfig('app');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServiceConfig.prototype, "authConfig", {
        get: function () {
            return this.getConfig("auth");
        },
        enumerable: true,
        configurable: true
    });
    ServiceConfig.prototype.absUrl = function (relativeUrl) {
        return url.resolve(this.appConfig.host, relativeUrl);
    };
    return ServiceConfig;
})();
$injector.register('serviceConfig', ServiceConfig);
//# sourceMappingURL=serviceConfig.js.map