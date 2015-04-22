/**
 * Created by trump on 15/4/22.
 */
/// <reference path="./_references.d.ts"/>

import mongoose = require('mongoose');

var Schema = mongoose.Schema;

export class DBContext {

    constructor () {
        this.init();
    }

    init() { }

    _UserSchema = new Schema({

    });
    User =  mongoose.model('User', this._UserSchema);

    _NoteSchema = new Schema({
        name: String
        , content: String
    });
    Note = mongoose.model('Note', this._NoteSchema);

}