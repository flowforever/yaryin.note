var avril = require('avril');
var noteService = avril.require('services.note');
var msg = avril.require('data.models.msg');
var auth = avril.auth.get();

module.exports = {
    list: function (req, res, next, helper) {
        noteService.find({
            userId: auth.connectId()
        }).exec(function (err,doc) {
            res.view({
                err: err
                ,doc:doc
            });
        });
    }
    , 'get/:hashkey': function (req, res, next, helper) {
        noteService.findOne({
            hashkey: req.param('hashkey')
        }).exec(function (err, doc) {
            res.send({
                err: err
                , doc: doc
            });
        });
    }
    , '[post]save': function (req, res, next, helper) {
        var model = req.body;
        model.userId = helper.auth.user.id || helper.auth.connectId();
        noteService.save(model, function (err) {
            res.send(msg.success('save succesed.'.localzie(helper)));
        });
    }
};