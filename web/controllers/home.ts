///<reference path="../_references.d.ts"/>
import express = require('express');

import services = require('../../services/documentServices');

class Controller {

    services = <services.Document>$injector.resolve('documentServices');

    'index' (req: express.Request, res) {
        res.send( this.services.getName() );
    }

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

    'get' (req: express.Request, res: express.Response) {

    }
}
module.exports = new Controller();