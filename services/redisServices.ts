/**
 * Created by trump on 15/5/4.
 */
/// <reference path="./_references.d.ts"/>

import redis = require('redis');

class RedisCacheServices {
    constructor() {
        this.client = redis.createClient();
    }
    client;
    close() {

    }
}

$injector.register('redisCacheServices', RedisCacheServices);