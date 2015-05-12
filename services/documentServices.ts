/// <reference path="./_references.d.ts"/>
import db = require('../db/db');

import Future = require("fibers/future");
import Fiber = require('fibers');
import sb = require('./servicesBase');

export class Document extends sb.ServiceBase {

    constructor($db) {
        super($db.Document);
        this.db = $db;
    }

    db;

    getList():IFuture<any> {
        return this.getAll();
    }

    addLatestDocument(item):IFuture<any> {
        var $latestDocuments = Future.wrap(this.db.LatestDocument);

        return (()=> {
            var latestDoc = $latestDocuments.findOneFuture({
                docId: item.docId
                , userId: item.userId
            }).wait();

            if (latestDoc) {
                latestDoc.date = new Date();
                return latestDoc.save.future().bind(latestDoc)().wait();
            }
            else {
                item.date = new Date();
                return $latestDocuments.createFuture(item).wait();
            }
        }).future()();
    }

}

$injector.register('documentServices', Document);