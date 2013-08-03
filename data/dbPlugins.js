module.exports = {
    unique: function (schema, options) {
        var key = options.key;
        schema.path(key).validate(function (v, fn) {
            var query = {};
            query[key] = v;
            options.table.findOne(query, function (err, doc) {
                if (err) {
                    fn(false);
                } else {
                    if (doc) {
                        fn(false);
                    } else {
                        fn(true);
                    }
                }
            });
        }, key + ': is existed.');
    }
    , dateNow: function (next) {
        this.date = this.date || new Date();
        next();
    }
};