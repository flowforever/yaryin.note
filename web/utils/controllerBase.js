var ControllerBase = (function () {
    function ControllerBase() {
        this.helper = {
            getCurrentUser: function (req, res) {
                return (function () {
                    return null;
                }).future()();
            },
            getSessionId: function (req, res) {
            },
            getUserId: function (req, res) {
            }
        };
    }
    return ControllerBase;
})();
exports.ControllerBase = ControllerBase;
//# sourceMappingURL=controllerBase.js.map