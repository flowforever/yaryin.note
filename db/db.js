/**
 * Created by trump on 15/4/22.
 */
/// <reference path="./_references.d.ts"/>
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSocialTypes;
(function (UserSocialTypes) {
    UserSocialTypes[UserSocialTypes["sina"] = 0] = "sina";
    UserSocialTypes[UserSocialTypes["qq"] = 1] = "qq";
    UserSocialTypes[UserSocialTypes["github"] = 2] = "github";
})(UserSocialTypes || (UserSocialTypes = {}));
var DBContext = (function () {
    function DBContext() {
        this._UserSchema = new Schema({
            name: String,
            email: String,
            password: String,
            nickName: String,
            phone: String,
            socialId: String,
            socialType: String //weibo, qq, github
            ,
            socialDescription: String,
            socialPhoto: String
        });
        this.User = mongoose.model('User', this._UserSchema);
        this.UserSocialTypes = UserSocialTypes;
        this._Document = new Schema({
            name: String,
            content: String,
            password: String,
            mode: String // html, markdown
            ,
            userId: String
        });
        this.Document = mongoose.model('Document', this._Document);
    }
    DBContext.prototype.init = function (connectionStr) {
        mongoose.connect(connectionStr || 'mongodb://localhost/notes');
    };
    DBContext.prototype.isObjectId = function (id) {
        return mongoose.Types.ObjectId.isValid(id);
    };
    return DBContext;
})();
exports.DBContext = DBContext;
$injector.register('db', DBContext);
//# sourceMappingURL=db.js.map