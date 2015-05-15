/**
 * Created by trump.wang on 2015/5/15.
 */
///<reference path="../_references.d.ts"/>
import express = require('express');

import services = require('../../services/documentServices');
import cbs = require('../utils/controllerBase');

class Controller extends cbs.ControllerBase {
    constructor (){
        super();
    }
    newfile (req, res) {

    }
}

module.exports = $injector.resolve(Controller);