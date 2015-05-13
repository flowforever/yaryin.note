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
        return (()=> {
            var LatestDocument = this.db.LatestDocument;
            var $LatestDocument = Future.wrap(LatestDocument);

            var findFuture = $LatestDocument.findOneFuture.bind(LatestDocument);

            var latestDoc = findFuture({
                docId: item.docId
                , userId: item.userId
            }).wait();

            if (latestDoc) {
                latestDoc.date = new Date();
                var $latestDoc = Future.wrap(latestDoc);
                return $latestDoc.saveFuture.bind(latestDoc)().wait()
                //return latestDoc.save.bind(latestDoc).future()().wait();
            }
            else {
                item.date = new Date();
                return $LatestDocument.createFuture.bind(LatestDocument)(item).wait();
            }
        }).future()();
    }

}

$injector.register('documentServices', Document);