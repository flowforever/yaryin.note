var Controller = (function () {
    function Controller() {
    }
    Controller.prototype['index'] = function (req, res) {
        res.view();
    };
    return Controller;
})();
module.exports = new Controller();
//# sourceMappingURL=home.js.map