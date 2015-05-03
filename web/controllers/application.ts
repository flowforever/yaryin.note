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

    version = appConfig.version;

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
            , '#version:' + version + ', language ' + avril.localize.currentLanguage(req, res)
            , '/'
            , "/styles/bin/resources/css/_fonts_ionicons.ttf?v=2.0.0"
            , "/styles/bin/resources/css/_fonts_fontawesome-webfont.woff?v=4.3.0"
            , "/styles/bin/resources/css/_fonts_ionicons.woff?v=2.0.0"
            , "/styles/bin/resources/css/_fonts_fontawesome-webfont.ttf?v=4.3.0"
            , "/styles/bin/resources/css/_fonts_fontawesome-webfont.woff2?v=4.3.0"

            , "/bower_components/font-awesome-min/fonts/fontawesome-webfont.woff2?v=4.3.0"

            , "/third-party/font-awesome-4.3.0/fonts/fontawesome-webfont.woff2?v=4.3.0"
            , "/bower_components/ionicons-min/fonts/ionicons.ttf?v=2.0.0"
            , "/bower_components/font-awesome-min/fonts/fontawesome-webfont.woff2?v=4.3.0"
            , "http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic"
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

    'languagePack' (req, res) {
        var currentLanguage = avril.localize.currentLanguage(req, res);
        res.send(avril.localize.languagePack(currentLanguage));
    }
}
module.exports = new Controller();