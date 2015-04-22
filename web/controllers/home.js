var Controller = (function () {
    function Controller() {
    }
    Controller.prototype['index'] = function (req, res) {
        res.view();
    };
    Controller.prototype['getName'] = function (req, res) {
        res.send('ok');
    };
    return Controller;
})();
module.exports = new Controller();
//# sourceMappingURL=home.js.map