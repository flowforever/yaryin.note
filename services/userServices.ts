/// <reference path="./_references.d.ts"/>
import db = require('../db/db');

import Future = require("fibers/future");
import Fiber = require('fibers');
import sb = require('./servicesBase');

export class UserServices extends sb.ServiceBase {

    constructor($db) {
        super($db.User);
    }

    getList() : IFuture<any> {
        return this.$table.findFuture({});
    }

    add(user) : IFuture<void>{
        return this.$table.createFuture(user);
    }

    findByAccount (accountId: string): IFuture<any> {
         return (()=>{
            var user;
            if(!this.isObjectId(accountId)) {
                user = this.findOne({
                    name: accountId
                }).wait();
            }else{
                user = this.findById(accountId).wait()
            }
            return user;

        }).future()();
    }
}

$injector.register('userServices', UserServices);