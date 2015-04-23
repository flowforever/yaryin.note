var Controller = (function () {
    function Controller($documentServices) {
        this.services = $documentServices;
    }
    Controller.prototype['documents'] = function (req, res) {
        (function () {
            var services = $injector.resolve('documentServices');
            var docs = services.getList().wait();
            var docs2 = services.getList().wait();
            var docs3 = services.getList().wait();
            res.send([
                docs,
                docs2,
                docs3
            ]);
        }).future()();
    };
    Controller.prototype['add'] = function (req, res) {
        var _this = this;
        (function () {
            var saved = _this.services.add({
                name: 'hello-' + Math.random(),
                content: 'world-' + new Date()
            }).wait();
            res.send(saved);
        }).future()();
    };
    Controller.prototype['get/:id'] = function (req, res) {
        var _this = this;
        (function () {
            var doc = _this.services.findById(req.params.id).wait();
            _this.services.findById(req.params.id).wait();
            var all = _this.services.getAll().wait();
            var arr = [];
            for (var i = 0; i < 5; i++) {
                arr.push(_this.services.getAll().wait());
                arr.push(_this.services.findById(req.params.id).wait());
            }
            res.send({
                detail: doc,
                all: all,
                total: arr
            });
        }).future()();
    };
    return Controller;
})();
$injector.register('apiHomeController', Controller);
module.exports = $injector.resolve('apiHomeController');
//# sourceMappingURL=api.js.map