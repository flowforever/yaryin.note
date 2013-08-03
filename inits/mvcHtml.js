var path = require('path')
    , fs = require('fs')
    , avril = require('avril')
    , appConfig = avril.getConfig('app')
    , scriptResources = avril.getConfig('scriptResources')
    , styleResources = avril.getConfig('styleResources')
    , minify = avril.mvc.minify
    , generateScript = function (src, attrs) {
        var attrStr = '';
        for (var a in attrs) {
            attrStr += ' ' + a + '="' + attrs[a] + '" ';
        }
        return '<script type="text/javascript" language="javascript" src="' + src + '" ' + attrStr + '></script>';
    }
    , generateStyle = function (src, attrs) {
        var attrStr = '';
        if (attrs) {
            for (var a in attrs) {
                attrStr += ' ' + a + '="' + attrs[a] + '" ';
            }
        }
        return '<link href="' + src + '" type="text/css" rel="stylesheet" ' + attrStr + '/>';
    }
    , compressor = require('node-minify')
    , flags = {};

var resourceScript =
    avril.mvc.HtmlHelper.prototype.resourceScript =
    function (resourceName, combine, version, scriptList, attrs) {
        version = version || appConfig.version;
        combine = (combine != undefined ? combine : appConfig.combine);
        var resObj = scriptResources[resourceName] || {};
        scriptList = scriptList || resObj.items;
        attrs = attrs || resObj.attrs;
        var output = '';

        if (scriptList && (scriptList instanceof Array)) {
            if (combine) {
                var fileName = resourceName + '-' + version + '.js';

                var relativePath = '/scripts/bin/' + fileName;

                if (!flags[relativePath]) {
                    var _list = [];
                    scriptList.forEach(function (scriptPath) {
                        _list.push(path.join(avril._rootDir, 'public', scriptPath));
                    });

                    var releasePath = path.join(avril._rootDir, 'public', relativePath);

                    fs.exists(releasePath, function (exists) {
                        if (!exists) {
                            minify.minifyJs(_list, function (err, script) {
                                fs.writeFile(releasePath, script, 'utf8');
                            }, appConfig.minifyJs, version);
                        }
                    });

                    flags[relativePath] = true;
                }

                output = generateScript(relativePath);
            } else {
                scriptList.forEach(function (src) {
                    output += generateScript(src, attrs);
                });
            }
        }
        return output;
    };

var resourceStyle = avril.mvc.HtmlHelper.prototype.resourceStyle = function (resourceName, combine, version, styleList, attrs) {
    version = version || appConfig.version;
    combine = (combine != undefined ? combine : appConfig.minifyCss);
    var resObj = styleResources[resourceName] || {};
    styleList = styleList || resObj.items;
    attrs = attrs || resObj.attrs;
    var output = '';

    if (styleList && (styleList instanceof Array)) {
        if (combine) {

            var mappedStyleList = [];

            styleList.forEach(function (src) {
                mappedStyleList.push(path.join(avril._rootDir, 'public', src));
            });

            var fileName = resourceName + '-' + version + '.css';

            var relativePath = '/styles/bin/' + fileName;

            if (!flags[relativePath]) {
                var releasePath = path.join(avril._rootDir, 'public', relativePath);

                var _list = [];

                styleList.forEach(function (scriptPath) {
                    _list.push(path.join(avril._rootDir, 'public', scriptPath));
                });

                var releasePath = path.join(avril._rootDir, 'public', relativePath);

                fs.exists(releasePath, function (exists) {
                    if (!exists) {
                        minify.minifyCss(_list, function (err, css) {
                            fs.writeFile(releasePath, css, 'utf8');
                        }, appConfig.minifyCss, version);
                    }
                });

                flags[relativePath] = true;
            }

            output = generateStyle(relativePath, attrs);
        } else {
            styleList.forEach(function (src) {
                output += generateStyle(src, attrs);
            });
        }

        return output;
    }
}

Object.keys(scriptResources).forEach(function (key) {
    resourceScript(key);
});

Object.keys(styleResources).forEach(function (key) {
    resourceStyle(key);
})

String.prototype.real = function (helper) {
    return helper.view.lookup(this.toString());
}

function generateAttrs(attrs) {
    var arr = [];
    Object.keys(attrs).forEach(function (key) {
        var value = attrs[key] || '';

        if (value && value.toString() == '[object Object]') {
            value = JSON.stringify(value);
        }
        if (typeof (value) == 'string' && value.indexOf('"') >= 0) {
            arr.push(key + '=\'' + value + '\'');
        } else {
            arr.push(key + '="' + value + '"');
        }
    });
    return arr.join(' ');
}

function generateInput(type, name, value, attrs) {
    var arr = ['<input']
    , obj = avril.extend({
        name: name
        , id: name
        , value: value || null
        , type: type
    }, attrs);

    arr.push(generateAttrs(obj));

    arr.push('/>');
    return arr.join(' ');
}

avril.mvc.HtmlHelper.prototype.attrs = generateAttrs;

avril.mvc.HtmlHelper.prototype.input = function (name, value, attrs) {
    return generateInput('text', name, value, attrs);
}

avril.mvc.HtmlHelper.prototype.textarea = function (name, value, attrs) {
    var arr = ['<textarea']
    , obj = avril.extend({
        name: name
        , id: name
    }, attrs);
    arr.push(generateAttrs(obj));
    arr.push('>');
    arr.push(value)
    arr.push('</textarea>');
    return arr.join(' ');
}

avril.mvc.HtmlHelper.prototype.select = function (name, val, datasource, attrs) {
    var arr = ['<select']
    , obj = avril.extend({
        name: name
        , value: val
    }, attrs);

    arr.push(generateAttrs(obj));

    arr.push('>');


    if (datasource && datasource.length) {
        datasource.forEach(function (item) {
            var value = item, text = item;
            if (item) {
                if (item.value) { value = item.value; }
                text = value;
                if (item.text) {
                    text = item.text;
                }
            }
            arr.push('<option value="' + value + '"' + (val == value ? 'selected="selected"' : '') + '>');
            arr.push(text);
            arr.push('</option>');
        });
    }

    arr.push('</select>');
    return arr.join(' ');
}

avril.mvc.HtmlHelper.prototype.checkbox = function (name, value, attrs) {
    return generateInput('checkbox', name, value, attrs);
}

avril.mvc.HtmlHelper.prototype.radio = function (name, value, attrs) {
    return generateInput('radio', name, value, attrs);
}

avril.mvc.HtmlHelper.prototype.editor = function (tempName, name, value, attrs) {
    var viewHelper = new ViewHelper(this.app(), this.req(), this.res(), this.routes(), this.controllerConfig(), this.mvc());
    return viewHelper.render(tempName, {
        name: name
        , value: value
        , attrs: attrs
    });
}

avril.mvc.HtmlHelper.prototype.label = function (name, text, attrs) {
    if (arguments.length == 2) {
        if (text.toString() == '[object Object]') {
            attrs = text;
            text = name;
        }
    }
    var helper = new avril.mvc.Helper(this.app(), this.req(), this.res(), this.routes(), this.controllerConfig(), this.mvc());
    var arr = ['<label']
    , obj = avril.extend({
        'for': name
    }, attrs);
    arr.push(generateAttrs(obj));
    arr.push('>');
    arr.push(text.localize(helper));
    arr.push('</label>');
    return arr.join(' ');
}

avril.mvc.HtmlHelper.prototype.tagBegin = function (tag, attrs) {
    if (arguments.length == 2) {
        if (text.toString() == '[object Object]') {
            attrs = text;
            text = name;
        }
    }
    var arr = ['<' + tag]
    , obj = avril.extend({
    }, attrs);
    arr.push(generateAttrs(obj));
    arr.push('>');
    return arr.join(' ');
}

avril.mvc.HtmlHelper.prototype.tagEnd = function (tag) {
    return '</' + tag + '>'
}

/*init for backbone*/
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