var path = require('path')
    , fs = require('fs')
    , avril = require('avril')
    , scriptResources = avril.getConfig('scriptResources')
    , styleResources = avril.getConfig('styleResources')
    ;

String.prototype.real = function (helper) {
    return helper.view.lookup(this.toString());
}

var resourceScript = avril.mvc.HtmlHelper.prototype.resourceScript;

var resourceStyle = avril.mvc.HtmlHelper.prototype.resourceStyle

Object.keys(scriptResources).forEach(function (key) {
    resourceScript(key);
});

Object.keys(styleResources).forEach(function (key) {
    resourceStyle(key);
})


