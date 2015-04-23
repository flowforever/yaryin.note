/// <reference path="./_references.d.ts"/>
import db = require('../db/db');

import Future = require("fibers/future");
import Fiber = require('fibers');
import sb = require('./servicesBase');

export class UserServices extends sb.ServiceBase {

    constructor($db) {
        super($db.User);
        this.db = $db;
    }

    db;

    getList() : IFuture<any> {
        return this.$table.findFuture({});
    }

    add(user) : IFuture<void>{
        return this.$table.createFuture(user);
    }
}

$injector.register('userServices', UserServices);