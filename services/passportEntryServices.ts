/**
 * Created by trump on 15/4/27.
 */
/// <reference path="./_references.d.ts"/>

import passports = require('passports');

class PassportEntryServices implements passports.IPassportEntryServices {
    passports = [];

    constructor(
        $sinaPassportServices
        , $qqPassportServices
        , $githubPassportServices
    ) {
        for (var i in arguments) {
            this.passports.push(arguments[i]);
        }
    }
}

$injector.register('passportEntryServices', PassportEntryServices);

