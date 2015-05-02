/// <reference path="./_references.d.ts"/>
require('./bootstrap');

import express = require('express');
import passport = require('passport');
import passports = require('passports');

var commander = require('commander')
    , bodyParser = require('body-parser')
    , multer = require('multer')
    , avril = require('avril').initRootDir(process.cwd())
    , appConfig = avril.getConfig('app');

class App {
    constructor($passportEntryServices) {
        this.passportEntry = $passportEntryServices;

        App.initCommander();

        this.initExpress();

        this.initPasport();

        this.initAvril();

        App.initDB();
    }

    passportEntry:passports.IPassportEntryServices;

    private _app:express.Express;
    get app():express.Express {
        if (!this._app) {
            this._app = express();
        }
        return this._app;
    }

    static initCommander() {
        var program = commander
            .version(appConfig.version)
            .option('-p, --port <n>', 'port')
            .parse(process.argv);

        appConfig.mode = program.mode;
        appConfig.port = program.port || process.env.port || appConfig.port;
    }

    initExpress() {
        var app = this.app;
        //use nginx to serve static files on production
        process.env.NODE_ENV !== 'production' && app.use(express['static'](__dirname + '/public'));

        app.use(require('cookie-parser')())
        app.use(require('cookie-session')({ secret: 'a keyboard cat' }));
        app.use(bodyParser.json()); // for parsing application/json
        app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
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

        avril.initComponent('localize', {});
    }

    initPasport() {
        passport.serializeUser(function(user, callback) {
            callback(null, user);
        });

        passport.deserializeUser(function(obj, callback) {
            callback(null, obj);
        });

        this.passportEntry.passports.forEach(p => {
            p.init();
        });

        // initialize for express
        this.app.use(passport.initialize());

        // passport session for express
        this.app.use(passport.session());

        this.passportEntry.passports.forEach(p => {
            this.app.get(p.authUrl, p.authAction);
            this.app.get(p.callbackUrl, p.authCallback);
        });
    }

    run():App {

        this.app.listen(appConfig.port);

        console.log('Application running on:', appConfig.port);

        return this;
    }

    static initDB() {
        var dbConfig = avril.getConfig('db');
        var db = $injector.resolve('db');

        db.init(dbConfig.default_db);
    }

}

$injector.resolve(App).run();