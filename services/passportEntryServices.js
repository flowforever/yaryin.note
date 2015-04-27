/**
 * Created by trump on 15/4/27.
 */
/// <reference path="./_references.d.ts"/>
var PassportEntryServices = (function () {
    function PassportEntryServices($sinaPassportServices) {
        this.passports = [];
        for (var i in arguments) {
            this.passports.push(arguments[i]);
        }
    }
    return PassportEntryServices;
})();
$injector.register('passportEntryServices', PassportEntryServices);
//# sourceMappingURL=passportEntryServices.js.map