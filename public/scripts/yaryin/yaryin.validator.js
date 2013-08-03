/// <reference path="../_reference.js" />
(function ($) {
    yaryin.namespace('yaryin.validator');
    yaryin.validator.extend({
        init: function (form) {
        }
        , parseForm: function ($form) {
            $form.validate(this.getValidObj($form));
        }
        , getValidObj: function ($form, validCfg) {
            validCfg = validCfg || {
                rules: {}
                , messages: {}
            };
            var self = this;
            $form.find('input,select,textarea').each(function () {
                self.parseInput($(this), validCfg);
            });
            return validCfg;
        }
        , parseInput: function ($input, validCfg) {
            var self = this
            , inputName = $input.attr('name')
            , input = $input[0]
            , attrs = input.attributes
            , attrArr = []
            , pre = 'data-val-';

            if ($input.attr('data-val') && $input.is(':enabled')) {
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
        yaryin.validator._paramAdapter[this] = function (attr, $input) {
            return Number(arguments[0]);
        }
    });



})(jQuery);