/**
 * Created by trump on 15/5/4.
 */
///<reference path="./_references.d.ts"/>
import express = require('express');
import redisCaches = require("redisCaches");
export class ControllerBase {
    helper = {
        getCurrentUser(req:express.Request, res:express.Response):IFuture<any> {
            return (()=> {
                var redis = <redisCaches.CacheServices>$injector.resolve('redisCacheServices');
                var sessionId = this.getSessionId(req, res);
                var user = redis.get(sessionId).wait();
                if(user){
                    user = JSON.parse(user);
                }
                return user;
            }).future()();
        }
        , setCurrentUser(sessionId, user):IFuture<any>{
            return (()=>{
                var redis = <redisCaches.CacheServices>$injector.resolve('redisCacheServices');
                redis.set(sessionId, JSON.stringify(user));
            }).future()();
        }
        , getSessionId(req: express.Request, res: express.Response) {
            var sessionId = req.signedCookies.sessionId;
            if(!sessionId) {
                sessionId = 'av:session-' + Date.now().toString(32) + '-' + Math.floor(Math.random() * 10000).toString(32);
                res.cookie('sessionId', sessionId, {
                    signed: true
                    , httpOnly: true
                });
            }
            return sessionId;
        }
    }
}