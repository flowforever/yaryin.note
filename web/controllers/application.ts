/**
 * Created by trump.wang on 2015/4/24.
 */
///<reference path="./_references.d.ts"/>
import express = require('express');

import services = require('../../services/documentServices');

var avril = require('avril');
var appConfig = avril.getConfig('app');
var scriptConfig = avril.getConfig('scriptResources');
var styleConfig = avril.getConfig('styleResources');

class Controller {
    constructor() {
        var imgs = [];
        function readDir() {
        }
    }
    version = new Date();

    manifest: string;

    staticResources = [
        "/bower_components/ace-min-noconflict/ace.js",
        "/bower_components/ace-min-noconflict/ext-static_highlight.js",
        "/bower_components/ace-min-noconflict/theme-tomorrow_night_eighties.js",
        "/bower_components/ace-min-noconflict/ext-modelist.js",
        "/bower_components/ace-min-noconflict/keybinding-vim.js",
        "/bower_components/ace-min-noconflict/keybinding-emacs.js",
        "/bower_components/ace-min-noconflict/mode-markdown.js"
    ];

    'note' (req: express.Request, res) {

        if(this.manifest){
            return res.end( this.manifest );
        }

        var version = !appConfig.devMode && appConfig.minifyJs && appConfig.minifyCss ? this.version : new Date();

        var manifest = [
            'CACHE MANIFEST'
            , '#' + version
            , '/'
        ];

        cacheResourceItems( 'base', true);
        cacheResourceItems( 'editor', true);
        cacheResourceItems( 'application', true);

        cacheResourceItems( 'base' );
        cacheResourceItems( 'editor');
        cacheResourceItems( 'application');

        function cacheResourceItems(resourceName, isJS = false) {
            var items = isJS ? avril.mvc.HtmlHelper.resourceScriptList(resourceName)
                :  avril.mvc.HtmlHelper.resourceStyleList(resourceName);

            for(var k in items) {
                manifest.push( items[k] );
            }
        }

        for(var i in this.staticResources){
            manifest.push( this.staticResources[i] );
        }

        manifest.push('NETWORK:');
        manifest.push('*');

        this.manifest = manifest.join('\n');

        res.end( this.manifest );

    }

}
module.exports = new Controller();