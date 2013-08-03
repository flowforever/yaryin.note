/// <reference path="../_references.js" />

(function ($) {

    var app = {
        initView: function (context) {
        }
        , initDoc: function () {

        }
    };

    yaryin.event.hook(app, 'initView,initDoc');

    app.executePageEvents = function (eventPaths, args) {
        eventPaths = eventPaths.where(function (o) { return !!o; });
        for (var i = 0; i < eventPaths.length; i++) {
            yaryin.event.get('ready', eventPaths.take(i + 1).join('/'))(args);
        }
    }

    //#region views

    var PageView = Backbone.View.extend({
        name: ''
        , eventPaths: []
        , render: function () {
            var self = this;
            yaryin.tools.template.get(this.options.name, function (tmpl) {

                var template = self.template || (self.template = _.template(tmpl));

                self.options.$el.html(template(self.options.model));

                app.initView(self.$el);

                app.executePageEvents(self.options.eventPaths, [self.options.$el, self.options.model, self]);

            });
            return this;
        }
    });

    //#endregion

    //#region routes

    function request(url, callback) {

        yaryin.ui.progressbar.bottom_right().show();

        $.get(url, {
            __reqtype: 'clientmvc'
        }, function (res) {
            callback(res);
            yaryin.ui.progressbar.bottom_right().hide();
        });
    }

    function getQuery(action) {
        var split = action.split('?')
        , rst = {
            action: ''
            , query: ''
        };
        if (split.length) {
            rst.action = split[0];
            rst.query = split[1];
        }
        return rst;
    }

    var AppRoute = Backbone.Router.extend({
        routes: {
            ':controller': 'controller_action'
            , ':controller/:action*': 'controller_action'
            , ':controller/:action*': 'controller_action'
            , ':area/:controller/:action*': 'area_controller_action'
            , ':area/:controller/:action*?': 'area_controller_action'
            , ':area/:controller/:action/?*': 'area_controller_action'
        }
        , controller_action: function (controller, action) {
            this._request(controller || 'home', action || 'index');
        }
        , area_controller_action: function (area, controller, action) {
            this._request(area, controller || 'home', action || 'index');
        }
        , _request: function () {
            var args = arguments.length ? arguments : ['home', 'index']
            , arr = yaryin.toArray(args)
            , url = arr.join('/')
            , actAndQuery = getQuery(arr[arr.length - 1])
            , viewName;

            arr[arr.length - 1] = actAndQuery.action;

            request(url, function (response) {
                var page = new PageView({
                    $el: $('#app-main')
                    , model: response.model
                    , name: arr.join('/')
                    , eventPaths: arr
                });
                page.render();

            });
        }
    });

    var appRoute = new AppRoute();

    Backbone.history.start();

    app.appRoute = appRoute;

    //#endregion

    yaryin.app = app;

    $(function () {
        app.initView(document);
        app.initDoc();
    });

})(jQuery);