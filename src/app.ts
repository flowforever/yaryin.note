/// <reference path="./_references.d.ts"/>
import express = require('express');
import commander = require('commander');

var avril = require('avril').init(process.cwd());
class App {
    get commander(): commander.IExportedCommand {
        return commander;
    }
    constructor() {
    }
    run() {
    }
}
module.exports = new App();