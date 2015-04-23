/// <reference path="./_references.d.ts"/>
import db = require('../db/db');

import Future = require("fibers/future");
import Fiber = require('fibers');
import sb = require('./servicesBase');

export class Document extends sb.ServiceBase {

    constructor() {
        var db = $injector.resolve('db');
        super( db.Document );
    }

    getList() : IFuture<any> {
        return this.getAll();
    }

}

$injector.register('documentServices', Document);