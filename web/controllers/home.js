var Controller = (function () {
    function Controller() {
        this.services = $injector.resolve('documentServices');
    }
    Controller.prototype['index'] = function (req, res) {
        res.send(this.services.getName());
    };
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
            _this.services.add({
                name: 'hello-' + Math.random(),
                content: 'world-' + new Date()
            }).wait();
            res.send('ok');
        }).future()();
    };
    Controller.prototype['get'] = function (req, res) {
    };
    return Controller;
})();
module.exports = new Controller();
//# sourceMappingURL=home.js.map