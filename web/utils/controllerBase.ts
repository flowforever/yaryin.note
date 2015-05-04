/**
 * Created by trump on 15/5/4.
 */
///<reference path="./_references.d.ts"/>
import express = require('express');

export class ControllerBase {
    helper = {
        getCurrentUser(req:express.Request, res:express.Response):IFuture<any> {
            return (()=> {
                return null;
            }).future()();
        }
        , getSessionId(req, res) {

        }
        , getUserId(req, res) {

        }
    }
}