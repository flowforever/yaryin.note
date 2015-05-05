/**
 * Created by trump.wang on 2015/5/5.
 */
///<reference path="./_references.d.ts"/>

declare module "redisCaches" {
    import redis = require('redis');
    export interface CacheServices {
        client: redis.RedisClient

        get(key): IFuture<any>;
        set(key, value): IFuture<any>;
        expire(key, timeout): IFuture<any>;
    }

}