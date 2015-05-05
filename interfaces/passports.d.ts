/**
 * Created by trump on 15/4/27.
 */
/// <reference path="./_references.d.ts" />
declare module "passports" {
    import express = require('express');

    export interface IPassport {
        authName: string;
        authUrl: string;
        callbackUrl: string;

        init();
        authAction: express.Handler ;
        authCallback: express.Handler;

        saveOrUpdateUser(userInfo): IFuture<any>;
    }

    export interface IPassportEntryServices{
        passports: IPassport[];
    }
}