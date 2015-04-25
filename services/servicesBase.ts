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
        return this.$table.findFuture.bind(this.table)({});
    }

    add(model): IFuture<any> {
        return this.$table.createFuture.bind(this.table)(model);
    }

    findById(id: string): IFuture<any> {
        return this.$table.findOneFuture.bind(this.table)({
            _id: id
        });
    }

    find(query:any): IFuture<any>{
        return this.$table.findFuture.bind(this.table)(query);
    }

    findOne(query:any): IFuture<any>{
        return this.$table.findOneFuture.bind(this.table)(query);
    }
}