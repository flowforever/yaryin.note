/**
 * Created by trump.wang on 2015/4/24.
 */
(function ($) {

    var getDocName = function () {
        return location.hash.replace('#', '');
    };

    function navigateToNewFile(fileName) {
        fileName = fileName || ( new Date().getTime() ).toString(32);
        document.location.href = '#' + fileName;
    }

    if (!getDocName()) {
        navigateToNewFile();
    }

    var apiServices = {
        preDoc: {}
        , getDocument: function (name, done) {
            if (this.writeXHR) {
                this.writeXHR.abort();
                this.writeXHR = null;
            }
            var self = this
                , otherArg = '';
            if($.browser.msie) {
                otherArg = '?r=' + (new Date()).getTime()
            }
            this.writeXHR = $.ajax({
                url: '/api/get/' + encodeURIComponent(name) + otherArg
                , dataType: 'json'
                , success: function (res) {
                    done(res);
                    self.preDoc = res;
                }
                , error: function () {
                    self.preDoc = {};
                    done({});
                }
            });
        }
        , saveDocument: function (doc, done) {
            done = done || function () {
                };
            var self = this;
            this.saveQ.func(function (next) {
                self._saveDocument(doc, next);
            }).func(function () {
                done();
            });
        }
        , _saveDocument: function (doc, done) {
            if (this.readXHR) {
                this.readXHR.abort();
                this.readXHR = null;
            }
            var self = this;
            self.windowLeaveMessage = 'Saving content';
            var content = doc.content;
            if (content && content !== this.preDoc.content) {
                this.preDoc.content = doc.content;
                this.writeXHR = $.ajax({
                    url: '/api/edit'
                    , dataType: 'json'
                    , data: {
                        name: doc.name
                        , content: doc.content
                        , _id: doc._preDoc._id
                    }
                    , type: 'post'
                    , success: function (res) {
                        if (!doc._preDoc._id) {
                            doc._preDoc._id = res._id;
                        }
                        self.windowLeaveMessage = null;
                        done()
                    }
                    , error: function () {
                        self.windowLeaveMessage = 'Failed to save';
                        done();
                    }
                })
            } else {
                done();
            }
        }
        , saveQ: avQ()
        , isRename: false
        , writeXHR: null
        , readXHR: null
        , windowLeaveMessage: null
    };

    window.onbeforeunload = function () {
        if (apiServices.saveQ.length > 0 && apiServices.windowLeaveMessage) {
            return apiServices.windowLeaveMessage;
        }
    };

    $(function () {
        var $editor = $('#editor')
            , editor = $editor.data('editor')
            , $textarea = $editor.find('textarea')
            , $win = $(window)
            , _preDocName = getDocName()
            , loadDocument = function (name) {
                $('title').html(name + ' - Yindoc');
                toggleLoadingMode(true);
                apiServices.getDocument(name, function (res) {
                    editor.setValue(res.content);
                    editor.clearSelection();
                    toggleLoadingMode(false);
                });
            }
            , toggleLoadingMode = function (loadingMode) {
                if (loadingMode) {
                    $('.x-hide-onready').show();
                } else {
                    $('.x-hide-onready').hide();
                }
            };

        loadDocument(_preDocName);

        $textarea.keyup(function () {
            apiServices.saveDocument({
                name: getDocName()
                , content: editor.getValue()
                , _preDoc: apiServices.preDoc
            });
        });

        $win.hashchange(function () {
            var docName = getDocName();
            if (!docName) {
                navigateToNewFile();
            } else {
                if (!apiServices.isRename && _preDocName != docName) {
                    _preDocName = docName;
                    loadDocument(docName);
                }
            }
        });
    });
})(jQuery);