/// <reference path="../_references.js" />

(function ($) {

    //#region jquery.hashchange
    (function ($, window, undefined) {
        '$:nomunge'; // Used by YUI compressor.

        // Reused string.
        var str_hashchange = 'hashchange',

    // Method / object references.
    doc = document,
    fake_onhashchange,
    special = $.event.special,

    // Does the browser support window.onhashchange? Note that IE8 running in
    // IE7 compatibility mode reports true for 'onhashchange' in window, even
    // though the event isn't supported, so also test document.documentMode.
    doc_mode = doc.documentMode,
    supports_onhashchange = 'on' + str_hashchange in window && (doc_mode === undefined || doc_mode > 7);

        // Get location.hash (or what you'd expect location.hash to be) sans any
        // leading #. Thanks for making this necessary, Firefox!
        function get_fragment(url) {
            url = url || location.href;
            return '#' + url.replace(/^[^#]*#?(.*)$/, '$1');
        };

        $.fn[str_hashchange] = function (fn) {
            return fn ? this.bind(str_hashchange, fn) : this.trigger(str_hashchange);
        };

        $.fn[str_hashchange].delay = 50;

        // Override existing $.event.special.hashchange methods (allowing this plugin
        // to be defined after jQuery BBQ in BBQ's source code).
        special[str_hashchange] = $.extend(special[str_hashchange], {
            // Called only when the first 'hashchange' event is bound to window.
            setup: function () {
                // If window.onhashchange is supported natively, there's nothing to do..
                if (supports_onhashchange) { return false; }

                // Otherwise, we need to create our own. And we don't want to call this
                // until the user binds to the event, just in case they never do, since it
                // will create a polling loop and possibly even a hidden Iframe.
                $(fake_onhashchange.start);
            },

            // Called only when the last 'hashchange' event is unbound from window.
            teardown: function () {
                // If window.onhashchange is supported natively, there's nothing to do..
                if (supports_onhashchange) { return false; }

                // Otherwise, we need to stop ours (if possible).
                $(fake_onhashchange.stop);
            }
        });

        // fake_onhashchange does all the work of triggering the window.onhashchange
        // event for browsers that don't natively support it, including creating a
        // polling loop to watch for hash changes and in IE 6/7 creating a hidden
        // Iframe to enable back and forward.
        fake_onhashchange = (function () {
            var self = {},
      timeout_id,

      // Remember the initial hash so it doesn't get triggered immediately.
      last_hash = get_fragment(),

      fn_retval = function (val) { return val; },
      history_set = fn_retval,
      history_get = fn_retval;

            // Start the polling loop.
            self.start = function () {
                timeout_id || poll();
            };

            // Stop the polling loop.
            self.stop = function () {
                timeout_id && clearTimeout(timeout_id);
                timeout_id = undefined;
            };

            // This polling loop checks every $.fn.hashchange.delay milliseconds to see
            // if location.hash has changed, and triggers the 'hashchange' event on
            // window when necessary.
            function poll() {
                var hash = get_fragment(),
        history_hash = history_get(last_hash);

                if (hash !== last_hash) {
                    history_set(last_hash = hash, history_hash);

                    $(window).trigger(str_hashchange);
                } else if (history_hash !== last_hash) {
                    location.href = location.href.replace(/#.*/, '') + history_hash;
                }

                timeout_id = setTimeout(poll, $.fn[str_hashchange].delay);
            };

            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            // vvvvvvvvvvvvvvvvvvv REMOVE IF NOT SUPPORTING IE6/7/8 vvvvvvvvvvvvvvvvvvv
            // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
            $.browser.msie && !supports_onhashchange && (function () {
                // Not only do IE6/7 need the "magical" Iframe treatment, but so does IE8
                // when running in "IE7 compatibility" mode.

                var iframe,
        iframe_src;

                // When the event is bound and polling starts in IE 6/7, create a hidden
                // Iframe for history handling.
                self.start = function () {
                    if (!iframe) {
                        iframe_src = $.fn[str_hashchange].src;
                        iframe_src = iframe_src && iframe_src + get_fragment();

                        // Create hidden Iframe. Attempt to make Iframe as hidden as possible
                        // by using techniques from http://www.paciellogroup.com/blog/?p=604.
                        iframe = $('<iframe tabindex="-1" title="empty"/>').hide()

            // When Iframe has completely loaded, initialize the history and
            // start polling.
            .one('load', function () {
                iframe_src || history_set(get_fragment());
                poll();
            })

            // Load Iframe src if specified, otherwise nothing.
            .attr('src', iframe_src || 'javascript:0')

            // Append Iframe after the end of the body to prevent unnecessary
            // initial page scrolling (yes, this works).
            .insertAfter('body')[0].contentWindow;

                        // Whenever `document.title` changes, update the Iframe's title to
                        // prettify the back/next history menu entries. Since IE sometimes
                        // errors with "Unspecified error" the very first time this is set
                        // (yes, very useful) wrap this with a try/catch block.
                        doc.onpropertychange = function () {
                            try {
                                if (event.propertyName === 'title') {
                                    iframe.document.title = doc.title;
                                }
                            } catch (e) { }
                        };
                    }
                };

                // Override the "stop" method since an IE6/7 Iframe was created. Even
                // if there are no longer any bound event handlers, the polling loop
                // is still necessary for back/next to work at all!
                self.stop = fn_retval;

                // Get history by looking at the hidden Iframe's location.hash.
                history_get = function () {
                    return get_fragment(iframe.location.href);
                };

                // Set a new history item by opening and then closing the Iframe
                // document, *then* setting its location.hash. If document.domain has
                // been set, update that as well.
                history_set = function (hash, history_hash) {
                    var iframe_doc = iframe.document,
          domain = $.fn[str_hashchange].domain;

                    if (hash !== history_hash) {
                        // Update Iframe with any initial `document.title` that might be set.
                        iframe_doc.title = doc.title;

                        // Opening the Iframe's document after it has been closed is what
                        // actually adds a history entry.
                        iframe_doc.open();

                        // Set document.domain for the Iframe document as well, if necessary.
                        domain && iframe_doc.write('<script>document.domain="' + domain + '"</script>');

                        iframe_doc.close();

                        // Update the Iframe's hash, for great justice.
                        iframe.location.hash = hash;
                    }
                };
            })();
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            // ^^^^^^^^^^^^^^^^^^^ REMOVE IF NOT SUPPORTING IE6/7/8 ^^^^^^^^^^^^^^^^^^^
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

            return self;
        })();
    })($, this);
    //#endregion

    var mvc = {};

    yaryin.createlibOn(mvc, 'Mvc', function (options) {

        //#region cfg
        var config = $.extend(true, this.options(), {
            templateUrl: '/template/get'
            , rootPath: '/'
            , pushState: false
            , rootEl: 'body'
        }, options);
        //#endregion
        /* private  */

        //#region private method and attrs
        var self = this
        , flags = {}
        , getHash = function () {
            return document.location.hash.substring(1);
        };
        //#endregion

        self.app = mvc.App();

        self.start = function () {
            if (!flags.started) {
                $(window).hashchange(function () {
                    self.hashchange();
                });
                flags.started = true;
            }
        }

        self.hashchange = function () {
            self.app.navigate(getHash());
        }

        self.hook('start,hashchange');

    });

    yaryin.createlibOn(mvc, 'Req', function (options) {
        //#region cfg
        var config = $.extend(true, this.options(), {
            raw: ''
            , app: null
        }, options);
        //#endregion
        var queryObj = function () {
            return yaryin.request(config.raw);
        }
        this.queryObj = queryObj;
        this.param = function (key) {
            return this.queryObj().param(key);
        }
        this.queryString = function () {
            return this.queryObj().queryString;
        }
        this.route = function (name) {

        }
    });

    yaryin.createlibOn(mvc, 'Res', function (options) {

        //#region cfg
        var config = $.extend(true, this.options(), {
            name: ''
            , app: null
        }, options);
        //#endregion

        this.view = function () {
            var viewName, model;
            if (arguments.length == 1) {
                if (typeof arguments[0] == 'string') {
                    viewName = arguments[0];
                } else {
                    model = arguments[0];
                }
            }
            if (arguments.length == 2) {
                viewName = arguments[0];
                model = arguments[1];
            }

            mvc.View({
                name: viewName || config.name
                , model: model || {}
            }).render();
        }

        this.redirect = function () { }

    });

    yaryin.createlibOn(mvc, 'View', function (options) {
        //#region cfg
        var config = $.extend(true, this.options(), {
            raw: ''
            , app: null
            , rootEl: ''
        }, options);
        //#endregion

        var getView = function (name, callback) {

        }

        this.render = function () {
            getView(name, function (html) {

            });
        }
    });

    yaryin.createlibOn(mvc, 'ViewEngine', function () {
        this.render = function () { }
    })

    yaryin.createlibOn(mvc, 'App', function () {

        //#region cfg
        var config = $.extend(true, this.options(), {
            viewEngine: mvc.ViewEngine()
            , templateUrl: '/template/get'
            , rootPath: '/'
            , pushState: false
            , rootEl: 'body'
        }, options);
        //#endregion

        //#region routers
        var router = {}
        , execRouteHandler = function (req, res) {
            var url = req.options().raw
            , action = req.param('action')
            , controller = req.param('controller')
            , area = req.param('controller')
            , handler = router[url];

            if (!handler) {

            }

            handler(req, res);

        };
        //#endregion

        var self = this;

        this.init = function (options) {
            yaryin.extend(this.options, options);
            return this;
        }

        this.router = function () {
            return router;
        }

        this.route = function (route, handler) {
            router[route] = handler;
            return this;
        }

        this.registerController = function (controllerName, controllerDefine, area) { }

        this.map = function (route, routeObj) {

        }

        this.reload = function () {
            this.navigate(document.location.hash.substring(1));
        }

        this.navigate = function (url) {
            var req = mvc.Req({
                raw: url
                , app: this
            })
            , res = mvc.Res({
                req: req
                , app: this
                , rootEl: config.rootEl
            });
            execRouteHandler(req, res);
        }

        self.hook('navigate');

    });

    yaryin.mvc = mvc.Mvc();


})(jQuery);