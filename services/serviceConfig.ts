/**
 * Created by trump on 15/4/27.
 */
/// <reference path="./_references.d.ts"/>
var avril = require('avril');
var url = require('url');

class ServiceConfig {

    getConfig(configName: string): any{
        return avril.getConfig(configName);
    }

    get appConfig(){
        return this.getConfig('app');
    }

    get authConfig(){
        return this.getConfig("auth");
    }

    absUrl(relativeUrl){
        return url.resolve(this.appConfig.host, relativeUrl);
    }
}

$injector.register('serviceConfig', ServiceConfig);