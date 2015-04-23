///<reference path="../_references.d.ts"/>
var Controller = (function () {
    function Controller($userServices, $documentServices) {
    }
    return Controller;
})();
$injector.register('accountController', Controller);
module.exports = $injector.resolve('accountController');
//# sourceMappingURL=account.js.map