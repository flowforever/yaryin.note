/// <reference path="../_references.js" />

(function ($) {

    var app = yaryin.app;

    app.initView.onInitView(function () {
        yaryin.tools.template.parse(document);
    });

    app.mvc = {
        currentFragment: function ($fragment) {
            if ($fragment) {
                this._$fragment = $($fragment);
            }
            if (!this._$fragment) { this._$fragment = this.defaultFragment(); }
            return this._$fragment;
        }
        , defaultFragment: function () {
            return $('[data-fragment=home]');
        }
        , request: function (url, callback) {
            $.ajax({
                url: url
                , data: { _backboneJson: true }
                , success: function (model) {

                    var $fragment = app.mvc.currentFragment();

                    app.applyModel($fragment, model);

                    app.executePageEvents((url.split('?')[0] || 'home').split('/'), [$fragment]);

                    if (callback) callback();
                }
            });
        }
        , showFragment: function (fragmentName) {
            $('[data-fragment]').hide();
            $('[data-fragment="' + fragmentName + '"]').show();
        }
    };

    var AppRoute = Backbone.Router.extend({
        routes: {
            '*path': 'default',
        }
        , 'default': function (url) {
            var fragment = (url || '').split('?')[0] || 'home';
            app.mvc.showFragment((url || '').split('?')[0] || 'home');
            app.mvc.request(url);
        }
    });

    app.route = new AppRoute();

    Backbone.history.start();

    //#region home events


    app.initView.onInitView(function (initRes, context) {
        var $ctx = $(context)
            , $$ = function () {
                return $ctx.find.apply($ctx, arguments);
            };
        $$('a.bk,.bk a:not(.no-bk)').live('click', function (e) {
            e.preventDefault();
            Backbone.history.navigate($(this).attr('href'), { trigger: true });
        });
    });
    //#endregion

})(jQuery);