///<reference path="../_references.d.ts"/>
import express = require('express');

import services = require('../../services/documentServices');

class Controller {

    constructor($documentServices) {
        this.services = $documentServices;
    }

    services;// = <services.Document>$injector.resolve('documentServices');

    'documents' (req: express.Request, res: express.Response) {
        (()=>{
            var services = <services.Document>$injector.resolve('documentServices');
            var docs = services.getList().wait();
            var docs2 = services.getList().wait();
            var docs3 = services.getList().wait();
            res.send( [
                docs,
                docs2,
                docs3
            ] )
        }).future()();
    }

    'add' (req: express.Request, res: express.Response) {
        (()=>{
            this.services.add({
                name: 'hello-'+ Math.random()
                , content: 'world-' + new Date()
            }).wait();
            res.send('ok')
        }).future()()
    }

    'get/:id' (req: express.Request, res: express.Response) {
        (()=>{
            var doc = this.services.findById( req.params.id ).wait();
            this.services.findById( req.params.id ).wait();

            var all = this.services.getAll().wait();

            var arr = [];
            for(var i=0; i<5;i++){
                arr.push( this.services.getAll().wait() );
                arr.push( this.services.findById( req.params.id ).wait() );
            }
            res.send({
                detail: doc
                , all: all
                , total: arr
            });
        }).future()();
    }
}

$injector.register('apiHomeController', Controller);

module.exports = $injector.resolve('apiHomeController');