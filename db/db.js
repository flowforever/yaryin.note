/**
 * Created by trump on 15/4/22.
 */
/// <reference path="./_references.d.ts"/>
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DBContext = (function () {
    function DBContext() {
        this._UserSchema = new Schema({});
        this.User = mongoose.model('User', this._UserSchema);
        this._NoteSchema = new Schema({
            name: String,
            content: String
        });
        this.Note = mongoose.model('Note', this._NoteSchema);
        this.init();
    }
    DBContext.prototype.init = function () {
    };
    return DBContext;
})();
exports.DBContext = DBContext;
//# sourceMappingURL=db.js.map