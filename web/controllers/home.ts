///<reference path="../_references.d.ts"/>
import express = require('express');

import services = require('../../services/documentServices');

class Controller {
    userServices;

    constructor($userServices) {
        this.userServices = $userServices;
    }

    'index'(req:express.Request, res) {
        res.view();
    }

    'accountUser' (req:express.Request, res, next) {
        if(!req.accepts('html')){
            return next();
        }
        var accountId = req.params.accountId;
        (() => {
            var user = this.userServices.findByAccount(accountId).wait();
            if(!user) {
                res.view('user_not_found');
            }else{
                res.view('index', { user: user });
            }
        }).future()();
    }


}
module.exports = $injector.resolve(Controller);