/// <reference path="./_references.d.ts"/>
import db = require('../db/db');

import Future = require("fibers/future");
import Fiber = require('fibers');
import sb = require('./servicesBase');
import passports = require('passports');

export class UserServices extends sb.ServiceBase {

    constructor($db) {
        super($db.User);
    }

    getList():IFuture<any> {
        return this.$table.findFuture({});
    }

    findByAccount(accountId:string):IFuture<any> {
        return (()=> {
            var user;
            if (!this.isObjectId(accountId)) {
                user = this.findOne({
                    name: accountId
                }).wait();
            } else {
                user = this.findById(accountId).wait()
            }
            return user;

        }).future()();
    }

    findBySocialId(socialId, socialType):IFuture<any> {
        return this.findOne({
            socialId: socialId
            , socialType: socialType
        });
    }

    findByUserNameOrId(nameOrId, socialType = null):IFuture<any>{
        var orQuery = [];
        if(this.isObjectId(nameOrId)) { orQuery.push(nameOrId); }
        orQuery.push({ socialId: nameOrId , socialType: socialType }
            , { name: nameOrId });
        return this.findOne({
            $or: orQuery
        });
    }

    checkLoginBySocialId(socialId, socialType):IFuture<any> {
        return (()=>{
            var user = this.findBySocialId(socialId, socialType).wait();
            return user && user.token;
        }).future()();
    }
}

$injector.register('userServices', UserServices);