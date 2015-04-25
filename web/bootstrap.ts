/**
 * Created by trump.wang on 2015/4/23.
 */
///<reference path="./_references.d.ts"/>
var path = require('path');
var fs = require('fs');

global.$injector = require('./../utils/yok').injector;

[
    '../db'
    , '../services'
].forEach(resolveDir);

function resolveDir(dir) {
    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        var filePath = path.join(dir, file);
        var stats = fs.statSync(dir);
        if(/\.js$/.test(filePath) ){
            require(filePath);
        } else if(
            !(/\.ts$|\.map$|\.DS_Store$/i.test(filePath))
            && stats.isDirectory()
        ) {
            resolveDir(filePath);
        }
    });
}



