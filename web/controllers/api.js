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
    Controller.prototype['list/:userId?'] = function (req, res) {
        var _this = this;
        var userId = req.params.userId || this.helper.getSessionId(req, res);
        (function () {
            var list = _this.services.find({
                userId: userId
            }).wait();
            res.send(list);
        }).future()();
    };
    Controller.prototype['get/:name'] = function (req, res) {
        var _this = this;
        (function () {
            var ownerId = req.query.ownerId;
            var query = { name: req.params.name };
            if (ownerId) {
                query.ownerId = ownerId;
            }
            var doc = _this.services.findOne(query).wait();
            if (doc
                && doc.userId
                && !doc.isPublic
                && doc.userId != _this.helper.getUserId(req)) {
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
            var ownerId = req.query.ownerId;
            var saveNew = function () {
                return _this.services.add({
                    name: req.body.name,
                    content: req.body.content,
                    userId: _this.helper.getUserId(req) || _this.helper.getSessionId(req, res),
                    isPublic: ownerId ? false : true
                }).wait();
            };
            if (!req.body._id) {
                saved = saveNew();
                res.send(saved);
            }
            else {
                saved = _this.services.findById(req.body._id).wait();
                if (!saved || saved && saved.userId && saved.userId != _this.helper.getUserId(req)) {
                    saved = saveNew();
                    return res.send(saved);
                }
                saved.content = req.body.content;
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