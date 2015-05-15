var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cbs = require('../utils/controllerBase');
var Controller = (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        _super.call(this);
    }
    Controller.prototype.newfile = function (req, res) {
    };
    return Controller;
})(cbs.ControllerBase);
module.exports = $injector.resolve(Controller);
//# sourceMappingURL=editor.js.map