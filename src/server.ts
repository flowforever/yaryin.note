/**
 * Created by trump.wang on 2015/4/21.
 */
/// <reference path="./_references.d.ts"/>

var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;

var avril = require('avril')
    , q = avril.simpleQueue()
    ;

avril.initRootDir(__dirname);

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    // Workers can share any TCP connection
    // In this case its a HTTP server
    require('./app');
}