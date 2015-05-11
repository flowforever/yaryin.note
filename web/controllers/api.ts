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

    services; // = <services.Document>$injector.resolve('documentServices');

    'list/:userId?' (req:express.Request, res:express.Response) {
        var userId = req.params.userId || this.helper.getSessionId(req, res);
        (()=>{
            var list = this.services.find({
                userId: userId
            }).wait();
            res.send(list);
        }).future()();
    }

    'get/:name'(req:express.Request, res:express.Response) {
        (()=> {
            var ownerId = req.query.ownerId;
            var query = <any>{ name: req.params.name };
            if (ownerId) { query.ownerId = ownerId; }
            var doc = this.services.findOne(query).wait();

            if (doc
                && doc.userId
                && !doc.isPublic
                && doc.userId != this.helper.getUserId(req)) {
                doc = null;
            }

            res.send(doc || {});
        }).future()();
    }

    'get/:userId/:docName'(req, res) {

    }

    '[post]edit/:userId'(req, res) {

    }

    '[post]edit'(req:express.Request, res:express.Response) {
        (()=> {
            var saved = null;
            var ownerId = req.query.ownerId;

            var saveNew = () => {
                return this.services.add({
                    name: req.body.name
                    , content: req.body.content
                    , userId: this.helper.getUserId(req) || this.helper.getSessionId(req, res)
                    , isPublic: ownerId? false: true
                }).wait();
            };

            if (!req.body._id) {
                saved = saveNew();
                res.send(saved);
            } else {
                saved = this.services.findById(req.body._id).wait();
                if (!saved || saved && saved.userId && saved.userId != this.helper.getUserId(req)) {
                    saved = saveNew();
                    return res.send(saved);
                }
                saved.content = req.body.content;
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