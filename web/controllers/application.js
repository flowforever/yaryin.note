var avril = require('avril');
var appConfig = avril.getConfig('app');
var scriptConfig = avril.getConfig('scriptResources');
var styleConfig = avril.getConfig('styleResources');
var Controller = (function () {
    function Controller() {
        this.version = new Date();
        this.imgResources = [];
        var imgs = [];
        function readDir() {
        }
    }
    Controller.prototype['note'] = function (req, res) {
        if (this.manifest) {
        }
        var version = Date.now(); //appConfig.minifyJs && appConfig.minifyCss ? this.version : new Date();
        var manifest = [
            'CACHE MANIFEST',
            '#' + version,
            '/'
        ];
        cacheResourceItems('base', true);
        cacheResourceItems('editor', true);
        cacheResourceItems('application', true);
        cacheResourceItems('base');
        cacheResourceItems('editor');
        cacheResourceItems('application');
        function cacheResourceItems(resourceName, isJS) {
            if (isJS === void 0) { isJS = false; }
            var items = isJS ? avril.mvc.HtmlHelper.resourceScriptList(resourceName) : avril.mvc.HtmlHelper.resourceStyleList(resourceName);
            for (var k in items) {
                manifest.push(items[k]);
            }
        }
        for (var i in this.imgResources) {
            manifest.push(this.imgResources[i]);
        }
        manifest.push('NETWORK:');
        manifest.push('*');
        this.manifest = manifest.join('\n');
        res.end(this.manifest);
    };
    return Controller;
})();
module.exports = new Controller();
//# sourceMappingURL=application.js.map