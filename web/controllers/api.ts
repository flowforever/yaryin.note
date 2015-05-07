///<reference path="../_references.d.ts"/>
import express = require('express');



import services = require('../../services/documentServices');
import cbs = require('../utils/controllerBase');

import { ControllerBase } from "../utils/controllerBase";


class Controller extends cbs.ControllerBase {

    constructor($documentServices) {
        super();
        this.services = $documentServices;
    }

    services;// = <services.Document>$injector.resolve('documentServices');

    'get/:name'(req:express.Request, res:express.Response) {
        (()=> {
            var doc = this.services.findOne({
                name: req.params.name
            }).wait();
            if (doc && doc.userId && doc.userId != this.helper.getUserId(req)) {
                doc = null;
            }
            res.send(doc || {});
        }).future()();
    }

    'get/:userId/:docName' (req, res) {

    }

    '[post]edit/:userId' (req, res) {

    }

    '[post]edit'(req:express.Request, res:express.Response) {
        (()=> {
            var saved = null;

            var saveNew = () => {
                return this.services.add({
                    name: req.body.name
                    , content: req.body.content
                    , userId: this.helper.getUserId(req)
                }).wait();
            };

            if (!req.body._id) {
                saved = saveNew();
                res.send(saved);
            } else {
                saved = this.services.findById(req.body._id).wait();
                if (saved && saved.userId && saved.userId != this.helper.getUserId(req)) {
                    saved = saveNew();
                    return res.send(saved);
                }
                saved.content = req.body.content;
                saved.name = req.body.name;
                saved.save(function () {
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