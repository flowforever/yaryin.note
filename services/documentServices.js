var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var sb = require('./servicesBase');
var Document = (function (_super) {
    __extends(Document, _super);
    function Document() {
        var db = $injector.resolve('db');
        _super.call(this, db.Document);
    }
    Document.prototype.getName = function (id) {
        return this.table.findByIdFuture(id);
    };
    Document.prototype.getList = function () {
        return this.getAll();
    };
    return Document;
})(sb.ServiceBase);
exports.Document = Document;
$injector.register('documentServices', Document);
//# sourceMappingURL=documentServices.js.map