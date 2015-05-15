/**
 * Created by trump.wang on 2015/4/24.
 * scripts/app
 *
 */
(function ($) {
    var $services = {
        preDoc: {}
        , appConfig: {
        }
        , apiUrls: {
            documents: {
                'edit': '/api/edit'
                , get: '/api/get'
            }
            , accounts: {
                currentUser: '/account/currentUser'
                , 'userInfo': '/account/userInfo'
            }
            , applications: {
                config: '/application/config'

            }
        }
        , userInfo: {}
        , ownerInfo: {}
        , getDocName: function () {
            return location.hash.replace('#', '');
        }
        , navigateToNewFile: function (fileName) {
            fileName = fileName || ( new Date().getTime() ).toString(32);
            var newHref = '#' + fileName;
            if (/language/.test(location.search)) {
                newHref = location.pathname + newHref;
            }
            document.location.href = newHref;
        }
        , cacheKey: function (key, group) {
            return ['note-cache', group || 'default', key].join(':');
        }
        , getJSON: function (url, data, next) {
            if (arguments.length == 2 && $.isFunction(data)) {
                next = data;
                data = undefined;
            }
            if (!$.isFunction(next)) {
                next = function () {
                }
            }
            ;
            return $.ajax({
                url: url
                , data: data
                , success: function (res) {
                    next(null, res);
                }
                , error: function (err) {
                    next(err);
                }
            });
        }
        , getCachedJSON: function (url, data, next) {
            if (arguments.length == 2 && $.isFunction(data)) {
                next = data;
                data = undefined;
            }
            return $services.getJSON(url, data, function (err, res) {
                if (err) {
                }
            });
        }
        , postJSON: function (url, data, next) {
            if (arguments.length == 2 && $.isFunction(data)) {
                next = data;
                data = undefined;
            }
            if (!$.isFunction(next)) {
                next = function () {
                }
            }
            ;
            return $.ajax({
                url: url
                , type: 'post'
                , data: data
                , success: function (res) {
                    next(null, res);
                }
                , error: function (err) {
                    next(err);
                }
            });
        }
        , getDocument: function (name, done) {
            if (this.writeXHR) {
                this.writeXHR.abort();
                this.writeXHR = null;
            }
            var self = this;

            this.writeXHR = $.ajax({
                url: '/api/get/' + encodeURIComponent(name)
                , cache: false
                , data: {
                    path: location.pathname
                }
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
        , getUserDocuments: function (userId, next) { }
        , getRecentDocuments: function(userId, next) {}
        , _saveCache: {}
        , addToLatestChange: function (docId) {
            !this._saveCache[docId] && this.postJSON('/api/addLatestDoc', {
                docId: docId
                , userId: this.userInfo._id || this.userInfo.sessionId
            })
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
                        self.addToLatestChange(res._id);
                        self._saveCache[res._id] = true;
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

    if (!$services.getDocName()) {
        $services.navigateToNewFile();
    }

    window.onbeforeunload = function () {
        if ($services.saveQ.length > 0) {
            return "Yindoc is saving the documents. please wait ...";
        }
    };

    avQ()
        .paralFunc(function (next) {
            $services.getJSON('/application/config', function (err, config) {
                config && $.extend($services.appConfig, config);
                next();
            });
        })
        .paralFunc(function (next) {
            $services.getJSON('/account/currentUser', function (err, userInfo) {
                userInfo && $.extend($services.userInfo, userInfo);
                next();
            });
        })
        .func(function (next) {
            var ownerName = location.pathname.substr(1);
            if (ownerName && ownerName != $services.userInfo.name) {
                $services.getJSON('/account/userInfo/' + ownerName, function (err, userInfo) {
                    userInfo && $.extend($services.ownerInfo, userInfo);
                    next();
                })
            } else {
                $services.ownerInfo = $services.userInfo;
                next();
            }
        })
        .func(function () {
            if ($services.appConfig.version !== localStorage.appVersion) {
                try {
                    window.applicationCache && applicationCache.update();
                } catch (E) {
                }
                localStorage.appVersion = $services.appConfig.version;
            }
        })
        .func(function () {
            $(function () {
                var mvvm = avril.mvvm;
                mvvm.setVal('appConfig', $services.appConfig);
                mvvm.setVal('userInfo', $services.userInfo);
                var settings = $services.userInfo && $services.userInfo.settings || {};
                mvvm.setVal('application.theme', $.cookie('application-theme') || settings.appTheme || 'sky-blue');
                !$.cookie('editor-theme') && $.cookie('editor-theme', settings.editorTheme || 'kuroir');
                mvvm.subscribe('$root.application.theme', function (val) {
                    $.cookie('application-theme', val);
                });
                mvvm.bindDom(document);
            });
        })
        .func(applicationReady);

    function applicationReady() {
        $(function () {
            var $editor = $('#editor')
                , editor = $editor.data('editor')
                , $textarea = $editor.find('textarea')
                , saveChange = function () {
                    _triggerChange && $services.saveDocument({
                        name: $services.getDocName()
                        , content: editor.getValue()
                        , _preDoc: $services.preDoc
                        , path: location.pathname
                    });
                }
                , $win = $(window)
                , _preDocName = $services.getDocName()
                , _triggerChange = true
                , loadDocument = function (name) {
                    $('title').html(name + ' - Yindoc');
                    toggleLoadingMode(true);
                    $services.getDocument(name, function (res) {
                        _triggerChange = false;
                        editor.setValue(res.content);
                        editor.clearSelection();
                        toggleLoadingMode(false);
                        _triggerChange = true;
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

            $textarea.on('change', saveChange);
            editor.on('change', saveChange);

            $win.hashchange(function () {
                var docName = $services.getDocName();
                if (!docName) {
                    $services.navigateToNewFile();
                } else {
                    if (!$services.isRename && _preDocName != docName) {
                        _preDocName = docName;
                        loadDocument(docName);
                    }
                }
            });
        });
    }
})
(jQuery);