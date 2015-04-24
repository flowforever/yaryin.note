/**
 * Created by trump.wang on 2015/4/24.
 */
///<reference path="./_references.d.ts"/>
import express = require('express');

import services = require('../../services/documentServices');

var avril = require('avril');
var scriptConfig = avril.getConfig('scriptResources');
var styleConfig = avril.getConfig('styleResources');

class Controller {
    version = Date.now();

    'note' (req: express.Request, res) {
        var version = this.version;

        var manifest = [
            'CACHE MANIFEST'
            , '/'
        ];

        cacheResourceItems( scriptConfig.base );
        cacheResourceItems( scriptConfig.application );

        cacheResourceItems( styleConfig.base );
        cacheResourceItems( styleConfig.application );

        function cacheResourceItems(resource) {
            for(var k in resource.items) {
                manifest.push( resource.items[k] + '?v=' + resource.version);
            }
        }

        res.end( manifest.join('\n') );

    }

}
module.exports = new Controller();