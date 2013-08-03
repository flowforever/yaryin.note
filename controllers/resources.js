var avril = require('avril')
, appConfig = avril.getConfig('app')
;

function configObj(req, res, helper) {
    var obj = {
        port: appConfig.port
        , version: appConfig.version
        , language: avril.localize.currentLanguage(req, res)
    };
    return obj;
}

module.exports = {
    '[post]localize': function (req, res, next, helper) {
        var arr = [], keys = req.param('keys');
        if (req.body.data && req.body.data.forEach) {
            req.body.data.forEach(function (item) {
                arr.push({ text: item.text.localize(helper, item.group), group: item.group });
            });
        }
        res.json(arr);
    }
    , config: function (req, res, next, helper) {
        res.send(configObj(req, res, helper));
    }
    , 'configScript': function (req, res, next, helper) {
        var variable = req.param('var') || 'AVRIL_CONFIG';
        res.writeHead(200, { 'Content-Type': 'application/javascript; charset=UTF-8' });
        res.end('var ' + variable + ' = ' + JSON.stringify(configObj(req, res, helper)) + ';');
    }
    , map: function (req, res, next, helper) {
        res.view();
    }
};