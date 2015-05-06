/// <reference path="../_references.js" />

; (function ($, avril) {

    avril.namespace('avril.tools');

    //#region avril.request
    (function (avril) {
        if (avril.request) {
            return false;
        }
        avril.request = (function () {
            function request(queryStr) {
                var api = {
                };

                api.queryString = (function () {
                    if (queryStr.indexOf('?') < 0) {
                        return {};
                    }
                    var urlParams = {},
                    e,
                    d = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); },
                    q = queryStr.substring(queryStr.indexOf('?') + 1),
                    r = /([^&=]+)=?([^&]*)/g;

                    while (e = r.exec(q))
                        urlParams[d(e[1])] = d(e[2]);

                    return urlParams;
                })();

                var setParam = function (key, value) {
                    var hasKey = false;
                    avril.object(api.queryString).each(function (k, v) {
                        if (key.toLower() == k.toLower()) {
                            hasKey = true;
                            api.queryString[k] = value;
                        }
                    });
                    if (!hasKey) {
                        api.queryString[key] = value;
                    }
                    return api;
                }

                var getParam = function (key) {
                    var val;
                    avril.object(api.queryString).each(function (k, v) {
                        if (key.toLower() == k.toLower()) {
                            val = v;
                        }
                    });
                    return val;
                }

                api.param = function (key, value) {
                    if (arguments.length == 0) {
                        return this;
                    }
                    if (arguments.length == 1) {
                        if (typeof key == 'string') {
                            return getParam(key);
                        } else if (typeof key == 'object') {
                            for (var k in key) {
                                setParam(k,key[k]);
                            }
                        }
                        return this;
                    }
                    if (arguments.length == 2) {
                        return setParam(key, value);
                    }
                }

                api.getUrl = function () {
                    var url = queryStr.split('?')[0];

                    if (url.indexOf('?') < 0) {
                        url = url + '?';
                    }

                    for (var p in api.queryString) {
                        if (api.queryString[p] != null) {
                            url += p + '=' + encodeURI(api.queryString[p]) + "&";
                        }
                    }

                    if (url.lastIndexOf('&') == url.length - 1) {
                        return url.substring(0, url.lastIndexOf('&'));
                    }

                    if (url.lastIndexOf('?') == url.length - 1) {
                        return url.substring(0, url.lastIndexOf('?'));
                    }

                    return url;
                }

                api.toString = function () {
                    return this.getUrl();
                }

                return api;
            }

            $.extend(request, request(window.location.href));

            return request;
        })();
    })(avril);
    //#endregion

    //#region avril.tools.loader
    avril.namespace('avril.tools.loader');
    avril.tools.loader.extend({
        jsonp: function (options) {
            options.success = options.success || function () { };
            options.error = options.error || function () { };
            var jsonpcallback = 'avril_' + avril.guid();
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

            var request = avril.request(options.url);
            if (options.data) {
                avril.object(options.data).each(function (key, value) {
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
            var tmpl = avril.tools.cache(url);
            if (tmpl) {
                callback(cache);
            } else {
                $.get(url, function (tmpl) {
                    callback(tmpl);
                    avril.tools.cache(url, tmpl);
                });
            }
        }
    });
    //#endregion

    //#region avril.tools.cache
    avril.tools.cache = (function () {
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


    //avril.tools.queue
    avril.tools.queue = (function(){
        var queues = {};
        function Queue(name){
            this.name = name;
            var queue = [];
            var pickNext = function(){
                var task = queue[0];
                if(task ){
                    var fn =task.fn;
                    if(!task.status){
                        task.status = 'doing';
                        fn( function(){
                            task.status = 'done';
                            queue.shift();
                            pickNext();
                        });
                    }
                }
            };
            this.func = function(fn){
                queue.push({fn: wrapFn(fn) } );
                pickNext();
            };
            var wrapFn = function(fn){
                if(fn.length >0){
                    return fn;
                }
                return function(cb){
                    fn();
                    cb();
                }
            }
        }

        return function(name){
            name = name || new Date().getTime();
            return queues[name] || (queues[name] = new Queue(name));
        };

    })();
})($, avril);
