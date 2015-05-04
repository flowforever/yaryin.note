///<reference path="../_references.d.ts"/>
import express = require('express');

import services = require('../../services/documentServices');
import cbs = require('../utils/controllerBase');

class Controller extends cbs.ControllerBase {
    userServices;

    constructor($userServices) {
        super();
        this.userServices = $userServices;
    }

    'index'(req:express.Request, res) {
        res.view();
    }

    'accountUser' (req:express.Request, res: express.Response, next) {
        if(!req.accepts('html')){
            return next();
        }
        var accountId = req.params.accountId || req.query.accountId;
        (() => {
            var targetUser = this.userServices.findByAccount(accountId).wait();
            if(!targetUser) {
                res.redirect('/account/notfound?accountId=' + accountId);
            } else {
                var currentUser = this.helper.getCurrentUser(req, res);
                res.view('index', { user: targetUser, currentUser: currentUser });
            }
        }).future()();
    }

    '/view/:id' (req, res) {
        res.end('view files')
    }

}
module.exports = $injector.resolve(Controller);