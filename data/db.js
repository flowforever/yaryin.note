var avril = require('avril');
var connectionString = avril.getConfig('db').mongo;
var ctx = avril.require('data.base')(connectionString)
, plugins = avril.require('data.dbPlugins')
, mongoose = require('mongoose')
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId
, commonStatus = {
    actived: 'actived'
    , inactived: 'inactived'
    , blocked: 'blocked'
}
, platForm = {
    pc: 'pc'
    , wechat: 'wechat'
    , mobweb: 'mobweb'
};

ctx.define
/* system administrator */
('Admin', {
    name: String
    , email: String
    , password: String
    , phone: String
    , date: Date
    , status: String
})

('Note', {
    userId: String
    , idType: String
    , content: String
    , date: Date
    , hashkey: String
}, {
    idType: {
        connectId: 'connectId'
        , userId: 'userId'
    }
})
/*normal user & shop*/
('User', {
    email: String
    , password: String
    , phone: String
    , wxId: String
    , wxPass: String
    , wxFakeId: String
    , email: String
    , name: String
    , date: Date

    , address: String

    , status: String
}, {
    status: commonStatus
})

('UserLoginInfo', {
    ip: String
    , userId: String
    , date: String
    , from: String
    , cacheKey: String
    , platform: String
}, {
    platform: platForm
})

;

ctx.User.UserStatus = {
    actived: 'actived'
    , blocked: 'blocked'
    , unconfirmed: 'unconfirmed'
};

ctx._schema.User.plugin(plugins.unique, { key: 'email', table: ctx.User });

for (var s in ctx._schema) {
    ctx._schema[s].pre('save', plugins.dateNow);
}

module.exports = ctx;