/**
 * Created by trump on 15/4/23.
 */
///<reference path="../_references.d.ts"/>
/// <reference path="./_references.d.ts"/>
import db = require('../db/db');
import Future = require("fibers/future");
import Fiber = require('fibers');
import redis = require('redis');

export class ServiceBase {
    redis;

    constructor(table) {
        this.table = table;
        this.$table = Future.wrap(table);
        this.db = $injector.resolve('db');

        this.redis = $injector.resolve('redisCacheServices');
    }

    db;
    table;
    $table;

    getAll():IFuture<any> {
        return this.$table.findFuture.bind(this.table)({});
    }

    add(model):IFuture<any> {
        return this.$table.createFuture.bind(this.table)(model);
    }

    findById(id:string):IFuture<any> {
        return this.$table.findOneFuture.bind(this.table)({
            _id: id
        });
    }

    find(query:any):IFuture<any> {
        return this.$table.findFuture.bind(this.table)(query);
    }

    findOne(query:any):IFuture<any> {
        return this.$table.findOneFuture.bind(this.table)(query);
    }

    isObjectId(id) {
        return this.db.isObjectId(id);
    }


    _serviceName = 'services' + Math.random();
    get serviceName() {
        return this._serviceName;
    }


    cache = {
        getCacheKey: (key)=> {
            if (key.indexOf('CacheLayer') === 0) {
                return key;
            }
            return [
                'CacheLayer'
                , this.serviceName
                , key
            ].join('-');
        }
        , getByKey(key) {

        }
        , setByKey(key, value) {
        }
        , removeByKey(key) {

        }
        , clearAll() {

        }
    }
}

