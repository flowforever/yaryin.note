///<reference path="../_references.d.ts"/>
import express = require('express');

import services = require('../../services/documentServices');

class Controller {

    constructor($documentServices) {
        this.services = $documentServices;
    }

    services;// = <services.Document>$injector.resolve('documentServices');

    'get/:name'(req:express.Request, res:express.Response) {
        (()=> {
            var doc = this.services.findOne({
                name: req.params.name
            }).wait();
            res.send(doc||{});
        }).future()();
    }

    '[post]edit'(req:express.Request, res:express.Response) {
        (()=> {
            var saved = null;
            if(!req.body._id) {
                saved = this.services.add({
                    name: req.body.name
                    , content: req.body.content
                }).wait();
                res.send(saved);
            } else {
                saved = this.services.findById(req.body._id).wait();
                saved.content = req.body.content;
                saved.name = req.body.name;
                saved.save(function(){
                    res.send(saved);
                });
            }
        }).future()()
    }

    rename(req:express.Request, res:express.Response) {

    }

    remove(req, res) {

    }

}

module.exports = $injector.resolve(Controller);