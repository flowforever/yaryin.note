/// <reference path="./_references.d.ts"/>
require('./bootstrap');
var express = require('express');
var commander = require('commander'), bodyParser = require('body-parser'), multer = require('multer'), avril = require('avril').initRootDir(process.cwd()), appConfig = avril.getConfig('app');
var App = (function () {
    function App() {
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
    App.prototype.run = function () {
        App.initCommander();
        this.initExpress();
        this.initAvril();
        this.initDB();
        this.app.listen(appConfig.port);
        console.log('Application running on:', appConfig.port);
        return this;
    };
    App.prototype.initDB = function () {
        var dbConfig = avril.getConfig('db');
        var db = $injector.resolve('db');
        db.init(dbConfig.default_db);
    };
    App.prototype.initExpress = function () {
        var app = this.app;
        //use nginx to serve static files on production
        process.env.NODE_ENV !== 'production' && app.use(express['static'](__dirname + '/public'));
        app.use(require('cookie-parser')());
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
    };
    App.initCommander = function () {
        var program = commander.version(appConfig.version).option('-p, --port <n>', 'port').parse(process.argv);
        appConfig.mode = program.mode;
        appConfig.port = program.port || appConfig.port;
    };
    return App;
})();
module.exports = new App();
module.exports.run();
//# sourceMappingURL=app.js.map