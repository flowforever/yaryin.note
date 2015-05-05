/**
 * Created by trump on 15/5/4.
 */
/// <reference path="./_references.d.ts"/>

import redis = require('redis');
import redisCaches = require("redisCaches");
import Future = require("fibers/future");
import Fiber = require('fibers');


class RedisCacheServices implements redisCaches.CacheServices{

    constructor() {
        this.client = redis.createClient();
        this.futureClient = Future.wrap(this.client);
    }

    client: redis.RedisClient;
    futureClient: any;

    close() {

    }

    get(key):IFuture<any> {
        return (()=>{
            return this.futureClient.getFuture(key).wait();
        }).future()();
    }

    set(key, value, timeout = 60):IFuture<any> {
        return (()=>{
            this.futureClient.setFuture(key, value).wait();
            this.expire(key, timeout).wait();
        }).future()();
    }

    expire(key, timeout = 60):IFuture<any> {
        return (()=>{
            this.futureClient.expireFuture(key, timeout);
        }).future()();
    }
}

$injector.register('redisCacheServices', RedisCacheServices);