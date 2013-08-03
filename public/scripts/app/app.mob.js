/// <reference path="../_references.js" />

(function ($) {
    var $popMsg = function () {
        return $("#popup-message");
    }
    , msg = {
        show: function (msgObj) {

            $popMsg().removeClass('success error warning').addClass(msgObj.type).html(msgObj.msg);

            $popMsg().popup('open');
        }
    };




    $(document).on('pageinit', function () {
        $('form.ajax').each(function () {
            var form = $(this);

            var validCfg = yaryin.validator.getValidObj(form);

            form.validate($.extend(true, validCfg, {}));

            yaryin.event.get('form.error', form)(function () {
                msg.show({
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
                    msg.show(response);
                    yaryin.event.get('form.success', form)([response, form]);
                }
                , error: function () {
                    yaryin.event.get('form.error', form)(arguments);
                }
            });

        });
        $('.item-list .add-to-buy').click(function () {
            var $el = $(this)
                , dataId = $el.data('id')
                , $clone = $el.parents('li').find('img').clone()
            , $payBtn = $('#pay-btn')
            , json = $el.prev().html();

            $el.offsetParent()

            $clone.appendTo('body').css({
                'position': 'absolute'
                , top: $el.offset().top
                , left: $el.offset().left
            });

            $clone
                .animate({
                    top: $el.offset().top - 50
                    , left: $el.offset().left + 100
                })
                .animate({
                    top: $payBtn.offset().top
                    , left: $payBtn.offset().left
                    , opacity: 0
                }, function () {
                    $clone.remove();
                });

            console.log(json);
            $.post('/mob/addtoshopingcar', JSON.parse(json), function (res) {

            });

        });
        $popMsg().popup();
    })


})(jQuery);