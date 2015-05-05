var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cbs = require('../utils/controllerBase');
var Controller = (function (_super) {
    __extends(Controller, _super);
    function Controller($documentServices) {
        _super.call(this);
        this.services = $documentServices;
    }
    Controller.prototype['get/:name'] = function (req, res) {
        var _this = this;
        (function () {
            var doc = _this.services.findOne({
                name: req.params.name
            }).wait();
            if (doc && doc.userId && doc.userId != _this.helper.getUserId(req)) {
                doc = null;
            }
            res.send(doc || {});
        }).future()();
    };
    Controller.prototype['get/:userId/:docName'] = function (req, res) {
    };
    Controller.prototype['[post]edit/:userId'] = function (req, res) {
    };
    Controller.prototype['[post]edit'] = function (req, res) {
        var _this = this;
        (function () {
            var saved = null;
            var saveNew = function () {
                return _this.services.add({
                    name: req.body.name,
                    content: req.body.content,
                    userId: _this.helper.getUserId(req)
                }).wait();
            };
            if (!req.body._id) {
                saved = saveNew();
                res.send(saved);
            }
            else {
                saved = _this.services.findById(req.body._id).wait();
                if (saved && saved.userId && saved.userId != _this.helper.getUserId(req)) {
                    saved = saveNew();
                    return res.send(saved);
                }
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
})(cbs.ControllerBase);
module.exports = $injector.resolve(Controller);
//# sourceMappingURL=api.js.map