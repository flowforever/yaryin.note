/// <reference path="../_reference.js" />
(function ($) {
    if (!$.validator) { return false; }

    avril.namespace('avril.validator');

    (function () {
        var orgShowLabel = $.validator.prototype.showLabel;

        $.validator.prototype.showLabel = function (element) {
            var errElements = orgShowLabel.apply(this, arguments);
            this.errorsFor(element).addClass('help-block');
            return errElements;
        }
    })();

    avril.validator.extend({
        parseForm: function ($form) {
            var self = this;
            $form = $($form);
            $form.each(function () {
                $.data(this, 'validator', null);
                $(this).validate(self.getValidObj($(this)));
            });
            return this;
        }
        , getValidObj: function ($form, validCfg) {
            var cfg = validCfg
            , errorCls = cfg && cfg.errCls || 'has-error'
            , successCls = cfg && cfg.errCls || 'has-success'
            ;

            if (!cfg) {
                cfg = {
                    rules: {}
                    , errorElement: 'small'
                    , messages: {}
                    , success: function (label) {
                        $(label).parent().removeClass(errorCls).addClass(successCls);
                        label.remove();
                        label.addClass('help-block');
                    }
                    , errorPlacement: function (label, $el) {
                        $($el).after(label);
                        label.addClass('help-block');
                        label.hide();
                        $($el).parent().removeClass(successCls).addClass(errorCls);
                    }
                };
            }

            var self = this;
            $form.find('input,select,textarea').each(function () {
                self.parseInput($(this), cfg);
            });
            return cfg;
        }
        , parseInput: function ($input, validCfg) {
            var self = this
            , inputName = $input.attr('name')
            , input = $input[0]
            , attrs = input.attributes
            , attrArr = []
            , pre = 'data-val-';

            if (!inputName) {
                $input.attr('name', inputName = ('input-name-' + avril.getHash($input)));
            }

            if ($input.attr('data-val')==='true' && $input.is(':enabled')) {
                if (!validCfg.rules[inputName]) { validCfg.rules[inputName] = {}; }
                if (!validCfg.messages[inputName]) { validCfg.messages[inputName] = {}; }
                for (var i = 0; i < attrs.length; i++) {
                    attrArr.push(attrs[i]);
                }
                var dataValAttrs = attrArr.each(function (attr) {
                    var name = attr.name;
                    if (attr.name.indexOf(pre) >= 0) {
                        var methodName = self._getOrgAttrName(name.replace(pre, ''));
                        if (methodName.indexOf('-') < 0) {
                            var ruleMessage = $input.attr('data-val-msg-' + methodName) || $input.attr(name);

                            validCfg.messages[inputName][methodName] = ruleMessage;

                            self._getRuleParam($input, name, methodName, attrArr, validCfg);

                            if (!validCfg.rules[inputName][methodName]) {
                                validCfg.rules[inputName][methodName] = true;
                            }
                        }
                    }
                });
            }
        }
        , _getOrgAttrName: function (attrName) {
            var adapter = {
                'equalto': 'equalTo',
                dateiso: 'dateISO'
            };

            return adapter[attrName] || attrName;
        }
        , _getRuleParam: function ($input, methodPath, methodName, dataValAttrs, validCfg) {
            var inputName = $input.attr('name');
            var self = this;
            dataValAttrs.each(function (attr) {
                if (attr.name.indexOf(methodPath) == 0) {
                    validCfg.rules[inputName][methodName] = self._paramAdapter[methodName] ? self._paramAdapter[methodName]($input.attr(attr.name), $input) : $input.attr(attr.name);
                }
            });


        }
        , _paramAdapter: {
            required: function () {
                return true;
            }
            , range: function (attr, $el) {
                return attr.split(',').select(function () {
                    return Number(this);
                });
            }
            , rangelength: function (attr, $el) {
                return attr.split(',').select(function () {
                    return Number(this);
                });
            }
        }
    });

    $.each(['minlength', 'maxlength', 'min', 'max'], function () {
        avril.validator._paramAdapter[this] = function (attr, $input) {
            return Number(arguments[0]);
        }
    });



})(jQuery);