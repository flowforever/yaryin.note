var avril = require('avril')

, mongoose = require('mongoose')

, Schema = mongoose.Schema

, ObjectId = Schema.ObjectId

, cache = {};

module.exports = function (connection) {
    connection = connection || 'mongodb://localhost/avril_meal';
    if (!cache[connection]) {
        var Context = avril.mongoose.init(connection);

        Context.define

            ('SysUser', {
                id: ObjectId,
                name: String,
                email: String,
                password: String,
                date: Date
            })

            ('SysAction', {
                id: ObjectId
                , name: String
                , url: String
                , level: String
            })

            ('UserGroup', {
                id: ObjectId
                    , name: String
                    , code: String
            })

            ('Log', {
                title: String
                , Content: String
                , date: Date
            })

            ('SysLocation', {

            })
        ;

        cache[connection] = Context;

        return Context;
    }
    return cache[connection];
};
