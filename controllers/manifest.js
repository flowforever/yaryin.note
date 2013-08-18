var avril = require('avril');
var appConfig = avril.getConfig('app');
module.exports = {
    get1: function (req, res, next, help) {
        if (appConfig.minifyJs) {
            var path = req.param('path');
            if (path) {
                res.view(path);
            } else {
                res.send('CACHE MANIFEST');
            }
        } else {
            res.send('');
        }
    }
};