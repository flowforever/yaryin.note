/// <reference path="./_references.d.ts"/>
import db = require('../db/db');

import Future = require("fibers/future");
import Fiber = require('fibers');

export class User {

    db = $injector.resolve('db');

    $User = Future.wrap( this.db.User );

    getName() {
        return 'user';
    }

    getList() : IFuture<any> {
        return this.$User.findFuture({});
    }

    add(user) : IFuture<void>{
        return this.$User.createFuture(user);
    }
}

$injector.register('userServices', User);