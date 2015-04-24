var avril = require('avril');
var scriptConfig = avril.getConfig('scriptResources');
var styleConfig = avril.getConfig('styleResources');
var Controller = (function () {
    function Controller() {
        this.version = Date.now();
    }
    Controller.prototype['note'] = function (req, res) {
        var version = this.version;
        var manifest = [
            'CACHE MANIFEST',
            '/'
        ];
        cacheResourceItems(scriptConfig.base);
        cacheResourceItems(scriptConfig.application);
        cacheResourceItems(styleConfig.base);
        cacheResourceItems(styleConfig.application);
        function cacheResourceItems(resource) {
            for (var k in resource.items) {
                manifest.push(resource.items[k] + '?v=' + resource.version);
            }
        }
        res.end(manifest.join('\n'));
    };
    return Controller;
})();
module.exports = new Controller();
//# sourceMappingURL=application.js.map