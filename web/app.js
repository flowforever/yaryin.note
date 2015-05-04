/// <reference path="./_references.d.ts"/>
require('./bootstrap');
var express = require('express');
var passport = require('passport');
var commander = require('commander'), bodyParser = require('body-parser'), multer = require('multer'), avril = require('avril').initRootDir(process.cwd()), appConfig = avril.getConfig('app');
var App = (function () {
    function App($passportEntryServices) {
        this.passportEntry = $passportEntryServices;
        App.initCommander();
        this.initExpress();
        this.initPasport();
        this.initAvril();
        App.initDB();
        this.initProcessEvents();
    }
    Object.defineProperty(App.prototype, "app", {
        get: function () {
            if (!this._app) {
                this._app = express();
            }
            return this._app;
        },
        enumerable: true,
        configurable: true
    });
    App.initCommander = function () {
        var program = commander.version(appConfig.version).option('-p, --port <n>', 'port').parse(process.argv);
        appConfig.mode = program.mode;
        appConfig.port = program.port || process.env.port || appConfig.port;
    };
    App.prototype.initExpress = function () {
        var app = this.app;
        //use nginx to serve static files on production
        process.env.NODE_ENV !== 'production' && app.use(express['static'](__dirname + '/public'));
        app.use(require('cookie-parser')());
        app.use(require('cookie-session')({ secret: 'a keyboard cat' }));
        app.use(bodyParser.json()); // for parsing application/json
        app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
        app.use(multer()); // for parsing multipart/form-data
    };
    App.prototype.initAvril = function () {
        console.log('init avril components');
        avril.initComponent('mvc', {
            app: this.app,
            routes: avril.getConfig('route'),
            appConfig: appConfig,
            styleResources: avril.getConfig('styleResources'),
            scriptResources: avril.getConfig('scriptResources')
        });
        avril.initComponent('localize', {});
    };
    App.prototype.initPasport = function () {
        var _this = this;
        passport.serializeUser(function (user, callback) {
            callback(null, user);
        });
        passport.deserializeUser(function (obj, callback) {
            callback(null, obj);
        });
        this.passportEntry.passports.forEach(function (p) {
            p.init();
        });
        // initialize for express
        this.app.use(passport.initialize());
        // passport session for express
        this.app.use(passport.session());
        this.passportEntry.passports.forEach(function (p) {
            _this.app.get(p.authUrl, p.authAction);
            _this.app.get(p.callbackUrl, p.authCallback, function (req, res) {
                var user = req.user;
            });
        });
    };
    App.prototype.initProcessEvents = function () {
        var _this = this;
        process.on('uncaughtException', function (arg) { return _this.onUnCaughtException(arg); });
        process.on('beforeExit', function (arg) { return _this.beforeExit(arg); });
        process.on('exit', function (arg) { return _this.onProcessExit(arg); });
    };
    App.prototype.run = function () {
        this.app.listen(appConfig.port);
        console.log('Application running on:', appConfig.port);
        return this;
    };
    App.initDB = function () {
        var dbConfig = avril.getConfig('db');
        var db = $injector.resolve('db');
        db.init(dbConfig.default_db);
    };
    //region process events
    App.prototype.beforeExit = function (arg) {
        var redis = $injector.resolve('redisCacheServices');
    };
    App.prototype.onProcessExit = function (arg) {
    };
    App.prototype.onUnCaughtException = function (arg) {
    };
    return App;
})();
$injector.resolve(App).run();
//# sourceMappingURL=app.js.map