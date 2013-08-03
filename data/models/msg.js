module.exports = {
    error: function (msg, data, title) {
        return this.msg('error', title, msg, data);
    }
    , info: function (msg, data, title) {
        return this.msg('success', title, msg, data);
    }
    , success: function (msg, data, title) {
        return this.msg('success', title, msg, data);
    }
    , confirm: function (msg, data, title) {
        return this.msg('confirm', title, msg, data, 'confirm');
    }
    , alert: function (msg, data, title) {
        return this.msg('alert', title, msg, data, 'confirm');
    }
    , promot: function () {
        return this.msg('alert', title, msg, data, 'confirm');
    }
    , msg: function (type, title, msg, data, innerType) {
        title = title || type;
        return {
            msg: msg || title
            , type: type
            , title: title
            , data: data || {}
            , innerType: innerType || 'tip'
        };
    }
};