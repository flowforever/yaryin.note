///<reference path="../_references.d.ts"/>
import express = require('express');

class Controller {
    'index' (req: express.Request, res: express.Response) { }

    'getName' (req, res) {}
}
module.exports = new Controller();