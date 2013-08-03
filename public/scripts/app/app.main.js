/// <reference path="../_references.js" />
(function () {
    var app = {
        initView: function () { }
        , initDoc: function () { }
        , config: {
            language: 'zh-cn'
        }
    };

    $.ajax({
        url: '/resources/config'
        , success: function (res) {
            $.extend(app.config, res);

            yaryin.tools.cache.version = app.config.version;

            (function initTinymce() {
                window.tinyMCE ? tinyMCE.init({
                    language: app.config.language.replace('-', '_')
                }) : setTimeout(initTinymce, 100);
            });

        }
    });

    $.datepicker.setDefaults($.datepicker.regional["zh-CN"]);

    yaryin.event.hook(app, 'initView,initDoc');

    app.executePageEvents = function (eventPaths, args) {
        eventPaths = eventPaths.where(function (o) { return !!o; });
        if (eventPaths.length > 0) {
            for (var i = 0; i < eventPaths.length; i++) {
                yaryin.event.get('ready', eventPaths.take(i + 1).join('/'))(args);
            }
        } else {
            yaryin.event.get('ready', 'home')(args);
        }
    }

    app.applyModel = function (ctx, model) {
        $(ctx).find('[data-tmpl]').each(function () {
            yaryin.tools.template.render($(this), model);
        });
    }

    yaryin.app = app;

    yaryin.namespace('yaryin.app.note');

    var localizeKey = 'tinymce';

    app.note.extend({
        save: function (editor, callback) {

        }
        , newFile: function (editor, callback) {

        }
        , getList: function (editor, callback) {
            yaryin.ui.pop.open('/editor/list', callback);
        }
        , changeUrl: function (orgUrl) {

            orgUrl = orgUrl || decodeURI(document.location.pathname);

            if (orgUrl.indexOf('/') >= 0) { orgUrl = orgUrl.replace('/', '') }

            var invalidChart = function () { return /\%|\\|\/|\:|\#|\s+/g };

            yaryin.prompt('input you url please.'.localize(localizeKey), function (url) {
                if (url) {
                    if (invalidChart().test(url)) {

                        yaryin.alert('the file name could not contain %,#,\\,/ and white space'.localize(localizeKey));

                        return false;
                    } else {
                        if (window.history && window.history.pushState) {
                            history.pushState(null, '', url);
                        } else {
                            document.location.href = '/' + url;
                        }
                    }
                } else {
                    yaryin.alert('please input a file name');
                    return false;
                }
            }, orgUrl);
        }
        , initEditor: yaryin.event.get('tinymce.init')
        , share: function () {
            yaryin.alert('<strong>' + 'here is your note address<br/>'.localize(localizeKey) + '</strong>' + decodeURI(document.location.href));
        }
    });

    var note = app.note;

    //init editor
    app.note.initEditor(function (editor, url) {

        // new file command
        editor.addButton('yaryin_newfile', {
            text: 'New',
            icon: false,
            onclick: note.newFile
        });
        editor.addMenuItem('yaryin_newfile', {
            text: 'New',
            context: 'file',
            onclick: note.newFile
        });

        // save file command
        editor.addButton('yaryin_save', {
            text: 'Save',
            icon: false,
            onclick: note.save
        });
        editor.addMenuItem('yaryin_save', {
            text: 'Save',
            context: 'file',
            onclick: note.save
        });

        //recent file list
        editor.addButton('yaryin_recent', {
            text: 'Recent files',
            icon: false,
            onclick: app.note.getList
        });
        editor.addMenuItem('yaryin_recent', {
            text: 'Recent files',
            context: 'file',
            onclick: app.note.getList
        });

        //chanage url
        editor.addButton('yaryin_changeurl', {
            text: 'Change url',
            icon: false,
            onclick: function () { note.changeUrl(decodeURI(document.location.pathname)) }
        });
        editor.addMenuItem('yaryin_changeurl', {
            text: 'Change url',
            context: 'file',
            onclick: function () { note.changeUrl(decodeURI(document.location.pathname)) }
        });

        //share
        editor.addButton('yaryin_share', {
            text: 'Share',
            icon: false,
            onclick: note.share
        });
        editor.addMenuItem('yaryin_share', {
            text: 'Share',
            context: 'file',
            onclick: note.share
        });
    });

    $(function () {
        app.initView(document);
        app.executePageEvents(window.location.pathname.split('/'), [$(document)]);
        app.initDoc();
    });



})();