/// <reference path="../_references.js" />
(function ($) {

    //#region app view init

    var app = yaryin.app;

    moment.lang(app.config.language);

    yaryin.app.initView.onInitView(function (initRes, context) {

        var $ctx = $(context)
            , $$ = function () {
                return $ctx.find.apply($ctx, arguments);
            };

        $$('a[confirm],a[data-confirm]').bind('click', function (e) {
            e.preventDefault();
            var handle = $(this);
            if (!handle.is('.disabled')) {
                yaryin.confirm(handle.attr('confirm') || handle.attr('data-confirm'), function (r) {
                    if (r) {
                        document.location.href = handle.attr('href');
                    }
                });
            }
        });

        $$('a[data-ajax-confirm]').bind('click', function (e) {
            e.preventDefault();
            var handle = $(this);
            if (!handle.is('.disabled')) {
                yaryin.confirm(handle.attr('data-ajax-confirm'), function (r) {
                    if (r) {
                        var postData = {};

                        var postCfg = {
                            url: handle.attr('href')
                            , data: postData
                            , type: 'post'
                            , success: function (response) {
                                yaryin.ui.msg().show($$('table').parent(), response);
                                yaryin.event.get('ajaxConfirm.onSuccess', handle)([response, handle]);
                            }
                            , error: function () {
                                yaryin.ui.loadingCover.hideAll();
                            }
                        };
                        if (yaryin.event.get('ajaxConfirm.beforeSubmit', handle)([postData, handle, postCfg])) {
                            $('body').loadingCover();
                            $.ajax(postCfg);
                        }

                    }
                });
            }
        });

        $$('a[data-ajax-post]').bind('click', function (e) {
            e.preventDefault();
            var handle = $(this);
            var postData = {};

            var postCfg = {
                url: handle.attr('href')
                , data: postData
                , type: 'post'
                , success: function (response) {
                    yaryin.ui.msg().show($('.box'), response);
                }
            };
            $.ajax(postCfg);
        });

        yaryin.event.get('ajaxConfirm.onSuccess', $$('a[data-ajax-confirm]'))(function (res) {
            if (res.type == 'success') {
                setTimeout(function () {
                    document.location.reload(true);
                }, 500);
            }
        });

        $$('.dropdown').bind('click', function (e) {
            e.stopPropagation();
            var handle = $(this);
            var content = handle.find('.dropdown-menu');

            $('.dropdown-menu').not(content).slideUp();

            if (!content.is(':visible')) {
                content.slideDown();
            }
        });

        $$('a.patch-remove').each(function () {
            var handle = $(this)
                , $grid = $$('table.yaryin-grid').length == 1 ? $$('table.yaryin-grid') : $$(handle.attr('grid'))
                , checkeds;

            yaryin.event.get('beforePost', handle)(function (data) {
                checkeds = $grid.find('tbody input:checkbox[checked]');
                data.toRemove = checkeds.toArray().select(function () {
                    return $(this).val();
                });
            });

            yaryin.event.get('success.main', handle)(function (response) {
                if (checkeds.length == $grid.find('tbody tr').length) {
                    (ajaxFrame.options().enabled ? ajaxFrame : document.location).reload();
                } else {
                    checkeds.each(function (el) {
                        $(this).parents('tr:eq(0)').fadeOut(function () {
                            $(this).remove();
                        });
                    });
                }
            });
        });

        $$('table a.delete').each(function () {
            var handle = $(this), $grid = handle.parents('table:eq(0)');
            yaryin.event.get('beforePost', handle)(function (data) {
                checkeds = $grid.find('tbody input:checkbox[checked]');
                data.toRemove = [handle.parents('tr:eq(0)').find('input:checkbox').val()];
            });

            yaryin.event.get('success.main', handle)(function (response) {
                if (1 == $grid.find('tbody tr').length) {
                    (ajaxFrame.options().enabled ? ajaxFrame : document.location).reload();
                } else {
                    handle.parents('tr:eq(0)').fadeOut(function () {
                        $(this).remove();
                    });
                }
            });
        });

        $$('[data-pop]').each(function () {

            var $handler = $(this);
            $handler.pop({
                onLoadHandle: function ($content, pop) {

                    setTimeout(function () {
                        app.initView($content);
                    }, 100);

                    var href = $handler.attr('href');

                    if (href) {
                        app.executePageEvents(href.split('?')[0].split('/'), [$content, pop]);
                    }

                    yaryin.ui.progressbar.bottom_right().hide();
                }
                , beforeLoad: function () {
                    yaryin.ui.progressbar.bottom_right().show();
                }
                , onHide: function () {
                    yaryin.ui.progressbar.bottom_right().hide();
                }
            });
        });;

        $$('.nav.nav-tabs li').click(function () {
            $(this).addClass('active').siblings().removeClass('active');
        });

        $$('a.tooltip').tooltip({});

        $$('.box-btn').click(function () {
            var e = $(this);
            var deletedBoxesCookiePrefix = "SimplensoDeletedBoxes_";
            var closedBoxesCookiePrefix = "SimplensoDeletedBoxes_";
            //var p = b.next('a');
            // Control functionality
            switch (e.attr('title').toLowerCase()) {

                case 'toggle':
                    widgetToggle(e);
                    break;

                case 'close':
                    widgetClose(e);
                    break;
            }
            // Toggle button widget
            function widgetToggle(e) {
                // Make sure the bottom of the box has rounded corners
                e.parent().toggleClass("round-all");
                e.parent().toggleClass("round-top");

                // replace plus for minus icon or the other way around
                if (e.html() == "<i class=\"icon-plus\"></i>") {
                    e.html("<i class=\"icon-minus\"></i>");
                } else {
                    e.html("<i class=\"icon-plus\"></i>");
                }

                // close or open box
                e.parent().next(".box-container-toggle").toggleClass("box-container-closed");

                // store closed boxes in cookie
                var closedBoxes = [];
                var i = 0;
                $(".box-container-closed").each(function () {
                    closedBoxes[i] = $(this).parent(".box").attr("id");
                    i++;
                });

                //Prevent the browser jump to the link anchor
                return false;

            }

            // Close button widget with dialog
            function widgetClose(e) {
                // get box element
                var box = e.parent().parent();

                // prompt user to confirm
                yaryin.confirm("Are you sure?", function (confirmed) {
                    if (confirmed) {
                        // remove box
                        box.remove();
                    }
                });
            }
        });

        $$('form select,select.beautify').chosen();

        $$('form input:file,input:file.beautify').each(function () {
            var $el = $(this);
            if (!$el.parent().is('.uploader')) {

                $el.wrap('<div class="uploader"/>');
                $el.before($('<span class="filename" data-localize="false"/>').text("No file selected."));
                $el.before($('<span class="action" data-localize="false"/>').text("Please select a file."));
            }
        });

        $$('input:file').change(function () {
            var $el = $(this), noFileText, $parent = $el.parent();
            if ($el.parent().is('.uploader')) {
                if (!$el.data('no-file-text')) {
                    $el.data('no-file-text', $parent.find('span.filename').text());
                }
                noFileText = $el.data('no-file-text');
                if ($el.val()) {
                    var valArr = $el.val().split('\\');
                    $parent.find('span.filename').text(valArr[valArr.length - 1]);
                } else {
                    $parent.find('span.filename').text(noFileText);
                }
            }
        });

        $$('[data-date-format]').each(function () {
            var $el = $(this)
            , dateStr = $el.text()
            , format = $el.attr('data-date-format');

            $el.text(moment(dateStr, format))
        });

        $$('[data-date-fromnow]').each(function () {
            var $el = $(this)
            , dateStr = $el.text()
            , format = $el.attr('data-date-fromnow');
        });

        $$('[data-date-calendar]').each(function () {
            var $el = $(this)
            , dateStr = $el.text()
            , format = $el.attr('data-date-fromnow');

            if (dateStr) {
                $el.text(moment(dateStr).calendar())
            };
        });

        $$('select[data-param]').change(function () {
            var val = $(this).val();
            var req = yaryin.request(document.location.href);
            req.param($(this).attr('data-param'), val);
            document.location.href = req.getUrl();
        });

        $$('input.datepicker').datepicker();

        $$('[data-toggle="popover"]').popover({
            html: true
        });

        $$('[data-toggle="tooltip"]').tooltip({
            html: true
        });

        yaryin.tools.localize.parse(context);

        yaryin.tools.template.parse(context);

        //#region ajax form

        $$('form.ajax').each(function () {
            var form = $(this);

            var validCfg = yaryin.validator.getValidObj(form);

            form.validate($.extend(validCfg, {
                success: function (label, $el) {
                    label.addClass('help-inline');
                    $($el).parents('div.control-group').removeClass('error').addClass('success');
                }
                , errorPlacement: function (label, $el) {
                    label.addClass('help-inline');
                    label.insertAfter($el).hide();
                    $(label).parent().removeClass('success').addClass('error');
                },
                showErrors: function (errorMap, errorList) {
                    this.defaultShowErrors();
                }
            }));

            yaryin.event.get('form.error', form)(function () {
                yaryin.ui.msg().show(form, {
                    msg: 'Something happends when communicating with the server .'
                    , title: 'Unknown error'
                    , type: 'error'
                });
            });

            form.ajaxForm({
                beforeSerialize: function () {

                    var valid = $(form).valid();

                    if (!valid) { return false; }

                    if (form.find('input:hidden[name="__datatype"]').length == 0) {
                        $('<input type="hidden" name="__datatype"/>').appendTo('form');
                    }
                    form.find('input:hidden[name="__datatype"]').val('ajax');

                    return yaryin.event.get('form.beforeSerialize', form)(arguments);
                }
                , beforeSubmit: function () {
                    return yaryin.event.get('form.beforeSubmit', form)(arguments);
                }
                , success: function (response) {
                    if (typeof response != 'object') {
                        try {
                            response = eval('(' + $(response).text() + ')');
                        } catch (E) { }
                    }
                    yaryin.ui.msg().show(form, response);
                    yaryin.event.get('form.success', form)([response, form]);
                }
                , error: function () {
                    yaryin.event.get('form.error', form)(arguments);
                    yaryin.ui.loadingCover.hideAll();
                }
            });
        });

        var $normalForm = $$('form.normal');

        yaryin.event.get('form.beforeSerialize', $normalForm)(function (res) {

        });

        yaryin.event.get('form.beforeSubmit', $normalForm)(function (res, form) {
            $(form).loadingCover();
        });

        yaryin.event.get('form.success', $normalForm)(function (res) {
            if (res.type == 'success') {
                setTimeout(function () {
                    if (res.data && res.data.url) {
                        window.location.href = res.data.url;
                    } else {
                        window.location.reload();
                    }
                }, 1200);
            }
        });

        yaryin.event.get('form.error', $normalForm)(function (res) {
            yaryin.alert('some thing error happend.');
        });

        //#endregion

    });

    // hide dropdown menu
    yaryin.app.initDoc.onInitDoc(function () {
        var $doc = $(document);
        $doc.click(function () {
            $('.dropdown-menu').slideUp();
        });

    });

    //hightlight main menu & handle click event
    yaryin.app.initDoc.onInitDoc(function () {
        var currentUrl = function () {
            return location.pathname;
        }
        , activeCls = 'active'
        , hightlightEl = function (link) {
            $(link).parent().addClass(activeCls).siblings().removeClass(activeCls);
        };

        var $topMenu = $('#top-menu');

        $topMenu.find('ul.nav:eq(0) a').click(function () {
            hightlightEl(this);
        });

        var $cur = $topMenu.find('ul.nav:eq(0) a').toArray().first(function (a) { return currentUrl().indexOf($(a).attr('href')) == 0; })
        //hightlightEl($cur);
    });

    //init tinymce 
    yaryin.app.initDoc.onInitDoc(function init_tinymce() {

        tinymce.init({
            selector: "textarea.tinymce",
            language: yaryin.app.config.language.replace('-', '_'),
            /*menu: {
                file: { title: 'File', items: 'yaryin_newfile yaryin_recent | yaryin_save' }
            },*/
            plugins: [
           "advlist autolink lists link image charmap print preview hr anchor pagebreak",
           "searchreplace wordcount visualblocks visualchars code fullscreen",
           "insertdatetime media nonbreaking save table contextmenu directionality",
           "template paste textcolor ",
           "yaryin_init" /*yaryin*/
            ],
            toolbar1: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image print preview media |  fontselect fontsizeselect forecolor backcolor emoticons",

        });

        (function setFullScreen() {
            if (window.tinyMCE && !window.tinyMCE.get('note-content')) {
                setTimeout(setFullScreen, 100);
            } else {
                tinyMCE.get('note-content').execCommand('mceFullScreen')
            }
        })();

    });

    //init login&register form 
    yaryin.app.initView.onInitView(function () {

        var form = $('#login-form,#register-form');

        var onFormSuccess = yaryin.event.get('form.success', form);

        onFormSuccess(function (res) {
            if (res.type == "success") {

                window.location.reload();

            }
        });
    });
    //#endregion

    //init localize
    yaryin.app.initDoc.onInitDoc(function () {
        yaryin.tools.localize.options({
            url: '/resources/localize'
        });
    });


})(jQuery);