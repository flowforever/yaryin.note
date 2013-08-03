var avril = require('avril')
, Page = avril.require('data.models.page');
function helper(model) {
    return avril.extend(model, {
         list: function (query, callback, currentIndex, pageSize, pageOrder) {
            Page.mongoose(model, query, pageOrder, callback, currentIndex, pageSize);
        }
        , all: function (query, callback) {
            model.find(query, callback);
        }
    });
}

module.exports = helper;