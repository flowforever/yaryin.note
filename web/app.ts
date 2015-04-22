/// <reference path="./_references.d.ts"/>

import express = require('express');

var commander = require('commander')
    , bodyParser = require('body-parser')
    , multer = require('multer')
    , avril = require('avril').initRootDir(process.cwd())
    , appConfig = avril.getConfig('app');

class App {
    constructor() {

    }

    private _app: express.Express;
    get app(): express.Express{
        if(!this._app) {
            this._app = express();
        }
        return this._app;
    }

    run(): App {
        App.initCommander();

        this.initExpress();

        this.initAvril();

        this.app.listen(appConfig.port);

        console.log('Application running on:', appConfig.port);
        return this;
    }

    initExpress(){
        var app = this.app;
        //use nginx to serve static files on production
        process.env.NODE_ENV !== 'production' && app.use(express['static'](__dirname + '/public'));

        app.use(require('cookie-parser')());
        app.use(bodyParser.json()); // for parsing application/json
        app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
        app.use(multer()); // for parsing multipart/form-data
    }

    initAvril() {
        console.log('init avril components');
        avril.initComponent('mvc', {
            app: this.app
            , routes: avril.getConfig('route')
            , appConfig: appConfig
            , styleResources: avril.getConfig('styleResources')
            , scriptResources: avril.getConfig('scriptResources')
        });
    }

    static initCommander () {
        var program = commander
            .version(appConfig.version)
            .option('-p, --port <n>', 'port')
            .parse(process.argv);

        appConfig.mode =  program.mode;
        appConfig.port = program.port || appConfig.port;
    }
}
module.exports = new App();
module .exports.run();