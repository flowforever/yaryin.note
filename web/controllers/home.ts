///<reference path="../_references.d.ts"/>
import express = require('express');

import db = require('../../db/db');

class Controller {

    'index' (req: express.Request, res) {

        res.view();
    }

    'getName' (req: express.Request, res: express.Response) {
        res.send('ok');
    }
}
module.exports = new Controller();