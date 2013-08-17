module.exports = function (port) {

    var cluster = require('cluster');

    var numCPUs = require('os').cpus().length;

    if (cluster.isMaster) {
        // Fork workers.
        for (var i = 0; i < numCPUs; i++) {
            cluster.fork();
        }

        cluster.on('exit', function (worker, code, signal) {
            console.log('worker ' + worker.process.pid + ' died');
        });

    } else {
        // Workers can share any TCP connection
        // In this case its a HTTP server

        var express = require('express');

        var app = express();

        /**/
        app.use(express['static'](__dirname + '/public'));

        app.use(express.compress());

        app.use(express.cookieParser());

        app.use(function (req, res, next) {

            if (req.method == 'POST') {
                var ended = false, funcList = [], execute = function () {
                    if (ended) {
                        funcList.forEach(function (func) {
                            if (!func.executed) {
                                func();
                                func.executed = true;
                            }
                        });
                    }
                };

                req.rawData = '';

                //addListener
                req.on('data', function (chunk) { req.rawData += chunk; });

                req.on('end', function (chunk) {
                    ended = true;
                    execute();
                });

                req.runOnEnd = function (func) {
                    if (func) {
                        funcList.push(func);
                    }
                    execute();
                }

            }

            next();

        });

        app.use(express.bodyParser());

        var avril = require('avril');

        avril.app = app;

        avril.initRootDir(__dirname);

        avril.initComponent('mvc', {
            app: app
            , viewEngine: require('jshtml')
            , routes: avril.getConfig('route')
            , appConfig: appConfig
            , styleResources: avril.getConfig('styleResources')
            , scriptResources: avril.getConfig('scriptResources')
        });

        avril.initComponent('localize', {});

        var appConfig = avril.getConfig('app');

        appConfig.port = port || appConfig.port;

        app.listen(appConfig.port);

        console.log('app now listening on :' + appConfig.port);
    }
}