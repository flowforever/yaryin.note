var avril = require('avril');
var db = avril.require('data.db');
var base = require('./serviceBase')
module.exports = avril.extend(base(db.Note), {
    getByHashKey: function (hashkey, callback) {
        this.findOne({
            hashkey: hashkey
        }).exec(callback);
    }
    , save: function (model, callback) {
        this.update(model, callback);
    }
});