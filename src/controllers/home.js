var Controller = (function () {
    function Controller() {
    }
    Controller.prototype['index'] = function (req, res) {
        res.send('hello typescript');
    };
    Controller.prototype['getName'] = function (req, res) {
    };
    return Controller;
})();
module.exports = new Controller();
//# sourceMappingURL=home.js.map