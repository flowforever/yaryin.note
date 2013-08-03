/// <reference path="../_references.js" />

; (function ($, yaryin) {

    yaryin.namespace('yaryin.tools');

    var _cache = {};

    //#region yaryin.tools.loader
    yaryin.namespace('yaryin.tools.loader');
    yaryin.tools.loader.extend({
        jsonp: function (options) {
            options.success = options.success || function () { };
            options.error = options.error || function () { };
            var jsonpcallback = 'yaryin_' + yaryin.guid();
            window[jsonpcallback] = function () {
                script.jsonp = true;
                if (options.success) {
                    var obj = arguments[0];
                    if (typeof obj == 'string') {
                        obj = eval('(' + obj + ')')
                    }
                    options.success(obj);
                }
            };
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.language = "javascript";
            script.charset = "utf-8";
            script.async = true;
            var head = document.getElementsByTagName('head');

            function removeScript() {
                if (typeof script.jsonp === "undefined") {
                    options.error();
                }
                function clear() {
                    try {
                        (head ? head[0] : document).removeChild(script);
                    } catch (E) { }
                    try {
                        delete window[jsonpcallback];
                    } catch (E) { }
                }
                setTimeout(function () {
                    clear();
                }, 5000);
            }

            head[0].appendChild(script);

            script.onload = script.onreadystatechange = function () {
                if (-[1, ] || /loaded|complete/i.test(this.readyState)) {
                    removeScript();
                }
            }

            script.onerror = function () {
                removeScript();
            }

            var request = yaryin.request(options.url);
            if (options.data) {
                yaryin.object(options.data).each(function (key, value) {
                    if (typeof value != 'function' && typeof value != 'object') {
                        request.param(key, encodeURIComponent(value));
                    }
                });
            }
            request.param(options.jsonp || 'jsonpcallback', jsonpcallback);
            script.src = request.getUrl();
        }
        , json: function (options) {
            if (options.url
                && options.url.indexOf('http') == 0
                && options.url.indexOf('http://' + document.location.host) < 0
                && options.url.indexOf('https://' + document.location.host) < 0
                ) {
                this.jsonp(options);
            } else {
                $.ajax(options);
            }
        }
        , loadScript: function (url, callback) {
            if (!callbackCache.hasOwnProperty(url)) {
                loadingList.push(url);
                callbackCache[url] = callback || function () { };
                if (loadingList.length == 1) {
                    this._loadScript();
                }
            } else {
                callback();
            }
        }
        , loadStyle: function (url) {
            var head = document.getElementsByTagName('head') || document.getElementById('body');
            var style = document.createElement('link');
            style.rel = 'Stylesheet';
            style.type = 'text/css';
            (head ? head[0] : document).appendChild(style);
            style.href = url;
        }
        , template: function (url, callback) {
            var tmpl = yaryin.tools.cache(url);
            if (tmpl) {
                callback(cache);
            } else {
                $.get(url, function (tmpl) {
                    callback(tmpl);
                    yaryin.tools.cache(url, tmpl);
                });
            }
        }
    });
    //#endregion

    //#region yaryin.tools.Communicator
    yaryin.createlib('yaryin.tools.Communicator', function (options) {
        var config = $.extend(this.options(), {
            targetWindow: window
        }, options)
        , self = this
        , _init = yaryin.event.registerOn(this, 'init', this, this)
        , _tasks = _cache._cacheData = {}
        , _lastMessage = [];

        _init(function () {
            if (window.postMessage) {
                if (window.addEventListener) {
                    window.addEventListener("message", function (e) {
                        onMessage([$.parseJSON(e.data).data]);
                    }, false);
                } else if (window.attachEvent) {
                    window.attachEvent("onmessage", function (e) {
                        onMessage([$.parseJSON(e.data).data]);
                    });
                }
            } else {
                //TODO change this implement into from server side
                var hash = '';
                setInterval(function () {
                    if (window.name !== hash) {
                        hash = window.name;
                        onMessage([$.parseJSON(hash).data]);
                    }
                }, 1);
            }
        });

        this.targetWindow = config.targetWindow;

        this.init = function (options) {
            if (options) { this.options(options); }
            _init([this]);
            return this;
        }

        var postMessage = function (data, needFeedback) {
            var guid = yaryin.guid() + '_guid', _d = data;
            data.guid = guid;
            data.needFeedback = !!needFeedback;
            data = $.toJSON({
                data: data
                , guid: guid
            });
            _tasks[guid] = [];
            var times = 0;
            (function post() {
                config.targetWindow.postMessage ? config.targetWindow.postMessage(data, '*') : (function () {
                    config.targetWindow.name = data;
                })();
                if (needFeedback && times++ < 10000) {
                    _tasks[guid].push(setTimeout(post, 500 + times));
                }
            })();
        }

        var onMessage = yaryin.event.registerOn(this, 'onMessage', this, this);

        var onFeedback = this.onFeedback = yaryin.event.registerOn(this, 'onFeedback', this, this);

        var CommandType = this.commandType = {
            im: 'im'
            , command: 'command'
            , feedback: 'feedback'
            , message: 'message'
        };

        this.postCommand = function (data) {
            if (arguments.length == 2) {
                data = {
                    name: arguments[0]
                    , data: arguments[1]
                };
            }
            postMessage({
                type: CommandType.command
                , data: data
            }, true);
        }

        this.onCommand = yaryin.event.registerOn(this, 'onCommand', this, this);

        this.postIM = function (data) {
            postMessage({
                type: CommandType.im
                , data: data
            }, true);
        }

        this.onIM = yaryin.event.registerOn(this, 'onIM', this, this);

        onMessage(function (msg) {
            if (_lastMessage.contain(msg.guid)) {
                return false;
            }
            var result = true;
            switch (msg.type) {
                case CommandType.command: {
                    result = self.onCommand([msg.data]);
                    break;
                }
                case CommandType.im: {
                    result = self.onIM([msg.data]);
                    break;
                }
                case CommandType.feedback: {
                    result = onFeedback([msg.data]);
                    break;
                }
            }

            if (result) {
                _lastMessage.push(msg.guid);
                if (msg.needFeedback) {
                    postMessage({
                        type: CommandType.feedback
                        , data: msg.guid
                    });
                }
            }
        });

        onFeedback(function (guid) {
            if (_cache._cacheData[guid]) {
                _cache._cacheData[guid].each(function (timeoutid) {
                    try { clearTimeout(timeoutid); } catch (E) { }
                });
            }
        });

        this.events.onOptionChange(function (key, config, oldConfig) {
            if (key == 'targetWindow') {
                self.targetWindow = config.targetWindow;
            }
        });
    });
    yaryin.tools.Communicator.current = yaryin.tools.Communicator();
    //#endregion

    //#region yaryin.tools.cache
    yaryin.tools.cache = (function () {
        var cache = window.localStorage || {};

        var handler = function (key, value) {
            switch (arguments.length) {
                case 0: {
                    return cache;
                }
                case 1: {
                    return cache[key];
                }
                case 2: {
                    return cache[key] = value;
                }
            }
        };

        handler.del = function (key) {
            delete cache[key];
        }

        handler.delByPre = function (pre) {
            for (var k in cache) {
                if (k.indexOf(pre) == 0) {
                    handler.del(k);
                }
            }
        }

        handler.list = function (key, list) {
            function init(list) {
                list.save = function () {
                    handler.list(key, list);
                }
                return list;
            }
            switch (arguments.length) {
                case 1: {
                    var arr = [];
                    if (handler(key)) {
                        var list = $.parseJSON(handler(key)).data;
                        init(list);
                        return list;
                    }
                    return init(arr);
                }
                case 2: {
                    if (list instanceof Array) {
                        handler(key, $.toJSON({ data: list }));
                        return init(list);
                    } else {
                        var arr = [list];
                        handler(key, $.toJSON({ data: arr }));
                        return init(arr);
                    }
                }
            }
        }

        handler.object = function (key, obj) {
            function init(obj) {
                obj = obj || {};
                obj.save = function () {
                    handler.object(key, obj);
                    return obj;
                }
                return obj;
            }
            switch (arguments.length) {
                case 1: {
                    obj = handler(key);
                    if (!obj) {
                        return init();
                    }
                    return init($.parseJSON(obj).data);
                }
                case 2: {
                    handler(key, $.toJSON({ data: obj }));
                    return init(obj);
                }
            }
        }

        handler.localStorage = !!window.localStorage;

        return handler;
    })();
    //#endregion

    //#region yaryin.tools.localize
    (function () {
        yaryin.createlib('yaryin.tools.Localize', function (options) {
            var config = $.extend(this.options(), {
                url: '/resources/localize'
                , datatype: 'jsonp' // 'jsonp' || 'json'
                , version: '0.1'
                , language: 'default'
                , type: 'post'
            }, options);

            this.parse = function (context, force) {

                var localizeItems = $(context).is('[data-localize]') ? $(context) : $(force ? '[data-localize]' : '[data-localize][data-localize!=true]', context || 'body');

                var languagePack = yaryin.tools.cache.list(config.language);

                var keys = []
                , handles = []
                , getLocalizeInfo = function (text) {
                    return languagePack.first(function (item) {
                        return item.key == text;
                    });
                };

                localizeItems.each(function () {
                    var handle = $(this);
                    if (handle.is('[data-localize]')) {
                        var localizeInfo = getLocalizeInfo(handle.html());
                        if (localizeInfo == null) {
                            keys.push(handle.html());
                            handles.push(handle);
                        } else {
                            handle.html(localizeInfo.text);
                        }
                    }
                });

                if (keys.length > 0) {
                    $.ajax($.extend({
                        data: { data: keys }
                        , success: function (localizes) {
                            localizes.each(function (text, index) {
                                text = unescape(text);
                                handles[index].html(text).attr('localize', 'true');
                                var lan = languagePack.first(function (lan) {
                                    return lan.key == keys[index]
                                });
                                if (lan == null) {
                                    languagePack.push({ key: keys[index], text: text });
                                } else {
                                    lan.text = text;
                                }
                            });
                            languagePack.save();
                        }
                    }, config));
                }
            }
        });
        yaryin.tools.localize = yaryin.tools.Localize();
    })();

    //#endregion

    //#region yaryin.tools.sql
    yaryin.createlib('yaryin.tools.sql', function (options) {
        var config = $.extend(true, this.options(), {
            dbName: null
        }, options);

        var self = this;

        function init() {
            self.db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
        }

        function createTable() {
        }

        this.collection = function (name, callback) { }
    });
    //#endregion

    //#region yaryin.tools.template
    /*
    (function () {
        yaryin.tools.template = {
            parse: function () { }
            , _cacheKey: function (name) {
                return 'template:' + this.version() + name;
            }
            , version: function () {
                return yaryin.tools.cache('yaryin-template-version')
            }
            , cacheFromEl: function ($tmpl) {
                var tempName = $tmpl.attr(this.config.template_data_name);
                this.cacheTemplate(tempName, $tmpl.html());
                $tmpl.remove();
            }
            , cacheTemplate: function (name, tmpl) {
                var tempName = this._cacheKey(name);
                yaryin.tools.cache(tempName, tmpl);
            }
            , get: function (name, callback) {
                var tmpl = yaryin.tools.cache(this._cacheKey(name));
                if (!tmpl) {
                    this.getRemoteTemplate(name, callback);
                } else {
                    callback(tmpl);
                }
            }
            , getRemoteTemplate: function (name, callback) {
                var self = this;
                $.get(this.config.url, { name: name }, function (tmpl) {
                    self.cacheTemplate(name, tmpl);
                    callback(tmpl);
                });
            }
            , config: {
                'template_data_name': 'data-tmpl-name'
                , url: '/template/get'
                , versionUrl: '/template/version'
                , enabled: true
            }
            , render: function (viewName, options, callback) {
                var self = this;

                this.get(viewName, function (viewTmpl) {

                    var compiledView;

                    try {
                        compiledView = self._render(viewTmpl, options);
                    } catch (E) {

                        compiledView = viewPath + '<br/>';

                        compiledView += E.message + '<br/>';

                        compiledView += E.number;
                    }

                    if (compiledView) {
                        compiledView = compiledView.replace(/^\s*|\s*$/g, '').replace(/\r\n/g, '');
                    }

                    var regObj = getGrammarKeyReg();

                    var layout = regObj.layout.exec(compiledView);

                    if (layout && layout[1]) {

                        compiledView = compiledView.replace(layout[0], '');

                        var layoutTmpl = self.render(layout[1], options);

                        var sections = {}
                            , _compiledView = compiledView + ''
                            , currentSection
                            , _layoutTmpl = layoutTmpl + ''
                            , sectionPos;

                        while (currentSection = regObj.sectionStart.exec(_compiledView)) {
                            var startPos = compiledView.indexOf(currentSection[0]) + currentSection[0].length;
                            var sectionEndFlag = ViewHelper.grammarKey.sectionEnd.replace('sectionName', currentSection[1]);
                            var endPos = compiledView.indexOf(sectionEndFlag);
                            sections[currentSection[1]] = compiledView.substring(startPos, endPos);
                            compiledView = compiledView.replace(sections[currentSection[1]], '');
                            compiledView = compiledView.replace(currentSection[0], '');
                            compiledView = compiledView.replace(sectionEndFlag, '');
                        }

                        while (sectionPos = regObj.section.exec(_layoutTmpl)) {
                            layoutTmpl = layoutTmpl.replace(sectionPos[0], sections[sectionPos[1]] || '');
                        }

                        return layoutTmpl.replace(ViewHelper.grammarKey.body, compiledView);

                    } else {
                        return compiledView;
                    }
                });


            }
            , _render: function (viewTmpl, options) {
                var $temp = $('<div/>');
                $.tmpl(viewTmpl, options).appendTo($temp);
                return $temp.html();
            }
        };

        $(function () {
            if (yaryin.tools.template.config.enabled) {
                $.get(yaryin.tools.template.config.versionUrl, function (version) {
                    if (version != yaryin.tools.template.version()) {
                        yaryin.tools.cache.delByPre('template:');
                        yaryin.tools.template.versionChanged = true;
                    }
                    yaryin.tools.cache('yaryin-template-version', version);
                });
                $('script[type="text/html"],[data-tmpl-name]').each(function () {
                    var $tmpl = $(this);
                    yaryin.tools.template.cacheFromEl($tmpl);
                });
            }
        });

    })();
    */
    //#endregion

    (function ($) {
        $.extend(jQuery.tmpl.tag, {
            "for": {
                _default: { $2: "var i=0;i<0;i++" },
                open: 'for ($2){',
                close: '};'
            }
        });
    })(jQuery);

    yaryin.tools.template = {
        render: function ($el, model) {

            $el = $($el);

            var dataKey = 'data-tmpl';

            var templateName = $el.attr(dataKey);

            if (templateName) {
                $el.html($.tmpl(templateName, model));
            } else {
                templateName = yaryin.guid();
                $el.attr(dataKey, templateName);
                $.template(templateName, $el.html());
                $el.html($.tmpl(templateName, model));
            }
        }
        , parse: function (ctx) {
            ctx = ctx ? $(ctx) : $('body');
            ctx.find('[type="text/x-jquery-tmpl"]').each(function () {
                var $el = $(this), templateName = $el.attr('name');
                $.template(templateName, $el.html());
                $el.remove();
            });
        }
    };

})($, yaryin);