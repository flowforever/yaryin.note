/**
 * Created by trump on 15/4/22.
 */
/// <reference path="./_references.d.ts"/>

import mongoose = require('mongoose');

var Schema = mongoose.Schema;

export class DBContext {

    constructor () {

    }

    init (connectionStr?: string) {
        mongoose.connect(connectionStr || 'mongodb://localhost/notes');
    }

    _UserSchema = new Schema({
    });
    User =  mongoose.model('User', this._UserSchema);

    _Document = new Schema({
        name: String
        , content: String
    });
    Document = mongoose.model('Document', this._Document);

}

$injector.register('db', DBContext);