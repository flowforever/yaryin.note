/**
 * Created by trump on 15/4/23.
 */
///<reference path="../_references.d.ts"/>
/// <reference path="./_references.d.ts"/>
import db = require('../db/db');
import Future = require("fibers/future");
import Fiber = require('fibers');

export class ServiceBase {
    constructor(table) {
        this.table = table;
        this.$table = Future.wrap(table);
    }

    table;
    $table;

    getAll() : IFuture<any> {
        var future = new Future<any>();
        this.table.find({}, (err, docs) => {
            if(err) return future.throw(err);
            return future.return(docs);
        });
        return future;
    }

    add(model): IFuture<any> {
        var future = new Future<any>();
        this.table.create(model, (err, res) => {
            if(err) return future.throw(err);
            return future.return(res);
        });
        return future;
    }

    findById(id: string): IFuture<any> {
        return this.$table.findOneFuture.bind(this.table)({
            _id: id
        });
    }
}