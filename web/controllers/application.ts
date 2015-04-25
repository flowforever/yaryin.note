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

    imgResources = [];

    'note' (req: express.Request, res) {

        if(this.manifest){
            //return res.end( this.manifest );
        }

        var version = Date.now();//appConfig.minifyJs && appConfig.minifyCss ? this.version : new Date();

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

        for(var i in this.imgResources){
            manifest.push( this.imgResources[i] );
        }

        manifest.push('NETWORK:');
        manifest.push('*');

        this.manifest = manifest.join('\n');

        res.end( this.manifest );

    }

}
module.exports = new Controller();