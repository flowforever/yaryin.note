///<reference path="../_references.d.ts"/>
import express = require('express');

class Controller {
    'index' (req: express.Request, res: express.Response) {
        res.send('hello typescript');
    }

    'getName' (req: express.Request, res: express.Response) {}
}
module.exports = new Controller();