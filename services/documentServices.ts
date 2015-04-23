/// <reference path="./_references.d.ts"/>
import db = require('../db/db');

import Future = require("fibers/future");
import Fiber = require('fibers');
import sb = require('./servicesBase');

export class Document extends sb.ServiceBase {

    constructor($db) {
        super( $db.Document );
        this.db = $db;
    }

    db;

    getList() : IFuture<any> {
        return this.getAll();
    }

}

$injector.register('documentServices', Document);