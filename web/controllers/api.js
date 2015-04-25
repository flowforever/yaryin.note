var Controller = (function () {
    function Controller($documentServices) {
        this.services = $documentServices;
    }
    Controller.prototype['get/:name'] = function (req, res) {
        var _this = this;
        (function () {
            var doc = _this.services.findOne({
                name: req.params.name
            }).wait();
            res.send(doc || {});
        }).future()();
    };
    Controller.prototype['[post]edit'] = function (req, res) {
        var _this = this;
        (function () {
            var saved = null;
            if (!req.body._id) {
                saved = _this.services.add({
                    name: req.body.name,
                    content: req.body.content
                }).wait();
                res.send(saved);
            }
            else {
                saved = _this.services.findById(req.body._id).wait();
                saved.content = req.body.content;
                saved.name = req.body.name;
                saved.save(function () {
                    res.send(saved);
                });
            }
        }).future()();
    };
    Controller.prototype.rename = function (req, res) {
    };
    Controller.prototype.remove = function (req, res) {
    };
    return Controller;
})();
$injector.register('apiHomeController', Controller);
module.exports = $injector.resolve('apiHomeController');
//# sourceMappingURL=api.js.map