

var path = require('path')
    , fs = require('fs')
    , avril = require('avril')
    , scriptResources = avril.getConfig('scriptResources')
    , styleResources = avril.getConfig('styleResources')
    , appConfig = avril.getConfig('app')
;



String.prototype.real = function (helper) {
    return helper.view.lookup(this.toString());
}
var resourceScript = avril.mvc.HtmlHelper.prototype.resourceScript;

var resourceStyle = avril.mvc.HtmlHelper.prototype.resourceStyle

Object.keys(scriptResources).forEach(function (key) {
    resourceScript(key, scriptResources[key].minify || appConfig.minifyJs, scriptResources[key].version || appConfig.version, scriptResources[key].items, scriptResources[key].attrs, appConfig.minifyScriptEx);
    //resourceName, combine, version, scriptList, attrs
});

Object.keys(styleResources).forEach(function (key) {
    resourceStyle(key, styleResources[key].minify || appConfig.minifyCss, styleResources[key].version || appConfig.version, styleResources[key].items, styleResources[key].attrs, appConfig.minifyCssEx);
})

avril.app.use(function (req, res, next) {
    res.viewOrJson = function () {
        if (req.param('_backboneJson')) {
            res.send.apply(this, arguments);
        } else {
            res.view.apply(this, arguments);
        }
    }
    next();
});
