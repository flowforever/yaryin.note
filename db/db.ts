/**
 * Created by trump on 15/4/22.
 */
/// <reference path="./_references.d.ts"/>

import mongoose = require('mongoose');

var Schema = mongoose.Schema;

enum UserSocialTypes {
    sina
    , qq
    , github
}

export class DBContext {

    constructor () {

    }

    init (connectionStr?: string) {
        mongoose.connect(connectionStr || 'mongodb://localhost/notes');
    }

    _UserSchema = new Schema({
        name: String
        , email: String
        , password: String
        , nickName: String
        , phone: String

        //begin social ids
        , socialId: String
        , socialType: String //weibo, qq, github
        //end social ids
    });

    User =  mongoose.model('User', this._UserSchema);
    UserSocialTypes = UserSocialTypes;

    _Document = new Schema({
        name: String
        , content: String
        , password: String
        , mode:String // html, markdown
    });
    Document = mongoose.model('Document', this._Document);

    isObjectId (id) {
        return mongoose.Types.ObjectId.isValid(id);
    }

}

$injector.register('db', DBContext);