///<reference path="../_references.d.ts"/>
import express = require('express');

import services = require('../../services/documentServices');

class Controller {

    'index' (req: express.Request, res) {
        res.view();
    }

}
module.exports = new Controller();