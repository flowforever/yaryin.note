var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Future = require("fibers/future");
var sb = require('./servicesBase');
var Document = (function (_super) {
    __extends(Document, _super);
    function Document($db) {
        _super.call(this, $db.Document);
        this.db = $db;
    }
    Document.prototype.getList = function () {
        return this.getAll();
    };
    Document.prototype.addLatestDocument = function (item) {
        var $latestDocuments = Future.wrap(this.db.LatestDocument);
        return (function () {
            var latestDoc = $latestDocuments.findOneFuture({
                docId: item.docId,
                userId: item.userId
            }).wait();
            if (latestDoc) {
                latestDoc.date = new Date();
                return latestDoc.save.future().bind(latestDoc)().wait();
            }
            else {
                item.date = new Date();
                return $latestDocuments.createFuture(item).wait();
            }
        }).future()();
    };
    return Document;
})(sb.ServiceBase);
exports.Document = Document;
$injector.register('documentServices', Document);
//# sourceMappingURL=documentServices.js.map