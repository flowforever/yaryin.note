///<reference path="../_references.d.ts"/>
class  Controller {
    constructor($userServices, $documentServices){

    }
}
$injector.register('accountController', Controller);
module.exports = $injector.resolve('accountController');