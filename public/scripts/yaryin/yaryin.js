(function () {
    var hasYaryin = window.yaryin && yaryin.yaryin;

    if (hasYaryin) {
        return yaryin;
    }



    //#region js extenstion
    /*
    extensions for :
    string
    array : array.ex()
    */
    (function () {
        /*---
        String Extension
        */
        String.prototype.toUnicode = function () {
            return escape(this).replace(/\%/g, '\\');
        }

        String.prototype.endWidth = function (str, ignoreCase) {
            if (ignoreCase) {
                var source = this.toLower();
                var target = str.toLower();
                return source.indexOf(target, source.length - target.length) !== -1;
            }
            return this.indexOf(str, this.length - str.length) !== -1;
        }

        String.prototype.beginWidth = function (str, ignoreCase) {
            if (ignoreCase) {
                var source = this.toLower();
                var target = str.toLower();
                return source.indexOf(target) == 0;
            }
            return this.indexOf(str) == 0;
        }

        String.prototype.replaceAll = function (word, replacement) {
            var reg = new RegExp(word, 'gi');
            return this.replace(reg, replacement);
        }

        String.prototype.equals = function (target, ignoreCase) {
            if (ignoreCase == undefined) { ignoreCase = true; }
            if (target != undefined && target != null) {
                return this == target || this.toLower() == target.toLower();
            }
            return this == target;
        }

        String.prototype.trim = function () {
            var reg = /(^\s*)|(\s*$)/g;
            return this.replace(reg, "");
        }

        String.prototype.trimAll = function () {
            var reg = /\s*/g;
            return this.replace(reg, '');
        }

        String.prototype.uperChar0 = function () {
            var name = this;
            var char0 = name.charAt(0);
            var r = char0.toUpperCase();
            return name.replace(new RegExp('^' + char0), r);
        }

        String.prototype.lowerChar0 = function () {
            var name = this;
            var char0 = name.charAt(0);
            var r = char0.toLowerCase();
            return name.replace(new RegExp('^' + char0), r);
        }

        String.prototype.toLower = String.prototype.toLowerCase;

        String.prototype.toUpper = String.prototype.toUpperCase;

        String.prototype.ellipsis = function (length, ellipsisLength) {
            var str = this.toString();
            if (str.length <= length)
                return str;

            ellipsisLength = ellipsisLength || 3;
            var ret = str.substr(0, length - ellipsisLength);
            for (var i = 0; i < ellipsisLength; i++) {
                ret = ret + ".";
            }
            return ret;
        }

        function isLambda(str) {
            return str && typeof (str) == 'string' && str.indexOf('=>') > 0;
        }

        String.prototype.lambda = function () {
            var str = this;
            if (isLambda(str)) {
                var lambdaKey = str.indexOf('=>')
                    , args = str.substring(0, lambdaKey)
                    , funcContent = str.substring(lambdaKey + 2)
                    , funcStr = 'function';
                if (args.indexOf('(') < 0) {
                    funcStr += ' (' + args + ')';
                } else {
                    funcStr += args;
                }

                if (funcContent.indexOf('{') >= 0) {
                    if (funcContent.indexOf(';') >= 0) {
                        funcStr += funcContent;
                    } else {
                        funcStr += '{ return ' + funcContent + '; }';
                    }
                } else {
                    funcStr += '{ return ' + funcContent + '; }'
                }



                return eval('(' + funcStr + ')');

                /*
                {
                    return o.b;
                }
    
                o.b
    
                { a:o.b }
    
                {
                    
                }
                */
            }
        }

        //end string extension

        /*---
        Array Extension
        */


        function arrayEx(instance) {
            function isFunc(func) {
                return typeof func == 'function';
            }

            function parseFuncLambda(func) {
                return isFunc(func) ?
                    func :
                    (isLambda(func) ? func.lambda() : function () {

                    });
            }

            function sort(field, dirc) {
                dirc = dirc || 1;
                return instance.sort(function (x, y) {
                    if (field) {
                        if (x[field] > y[field]) {
                            return dirc;
                        } else {
                            return -1 * dirc;
                        }
                    } else {
                        if (x > y) {
                            return dirc;
                        } else {
                            return -1 * dirc;
                        }
                    }
                });
            }

            instance.asc = function (field) {
                return sort(field, 1);
            }

            instance.desc = function (field) {
                return sort(field, -1);
            }

            instance.each = function (func) {
                func = parseFuncLambda(func);
                for (var i = 0; i < this.length; i++) {
                    if (func(this[i], i) == false) {
                        break;
                    }
                }
                return this;
            }

            instance.where = function (func) {
                func = parseFuncLambda(func);
                var results = [];
                this.each(function (value, index) {
                    if (func(value, index) == true) {
                        results.push(value);
                    }
                });
                return results;
            }

            instance.first = function (func) {
                func = parseFuncLambda(func);
                if (this.length == 0) {
                    return null;
                }
                if (func) {
                    return this.where(func)[0];
                } else {
                    return this[0];
                }
            }

            instance.last = function (func) {
                func = parseFuncLambda(func);
                if (this.length == 0) {
                    return null;
                }
                if (isFunc(func)) {
                    return this.where(func).last();
                } else {
                    return this[this.length - 1];
                }
            }

            instance.groupBy = function (func) {
                func = parseFuncLambda(func);
                if (func) {
                    var obj = {};
                    this.each(function (item, index) {
                        var key = func(item, index) + '';
                        if (!obj[key]) {
                            obj[key] = [];
                        }
                        obj[key].push(item);
                    });
                    return obj;
                }
                return this;
            }

            instance.take = function (num) {
                var result = [];
                for (var i = 0; i < num; i++) {
                    result.push(this[i]);
                }
                return result;
            }

            instance.skip = function (num) {
                var result = [];
                for (var i = num; i < this.length; i++) {
                    result.push(this[i]);
                }
                return result;
            }

            instance.select = function (func) {
                func = parseFuncLambda(func);
                var results = [];
                this.each(function (value, index) {
                    results.push(func.call(value, value, index));
                });
                return results;
            }

            instance.remove = function (func) {
                func = parseFuncLambda(func);
                var toRemove = [];
                this.each(function (val, index) {
                    if (func(val, index)) { toRemove.push(index); }
                });
                var arr = this;
                toRemove.reverse().each(function (val) { arr.splice(val, 1) });
                return arr;
            }

            instance.removeElement = function (elment) {
                return this.remove(function (value, index) { return value == elment; });
            }

            instance.removeAt = function (index) {
                return this.remove(function (value, index) { return index == index; });
            }

            if ($.browser.msie && ($.browser.msie <= 8.0)) {
                instance.indexOf = function (element) {
                    var i = -1;
                    this.each(function (value, index) {
                        if (value == element) {
                            i = index;
                            return false;
                        }
                    });

                    return i;
                }
            }

            instance.contain = function (element, elementIsFunction) {
                if (true != elementIsFunction && typeof element == 'function') {
                    return this.where(element).length > 0;
                }
                return this.indexOf(element) >= 0;
            }

            instance.distinc = function (compareFunc) {
                var arr = [];
                instance.each(function (value, index) {
                    if (yaryin.isFunc(compareFunc)
                        && compareFunc(value, index) != false) {
                        arr.push(value);
                    } else if (!yaryin.isFunc(compareFunc)
                    && !arr.contain(value)) {
                        arr.push(value);
                    }
                });
                return arr;
            }

            instance.sum = function (func) {
                func = parseFuncLambda(func);
                if (!this.length) {
                    return 0;
                }
                var result = [];
                if (typeof func == 'function') {
                    result = this.select(func);
                } else if (typeof func == 'string') {
                    result = this.select(function (obj) {
                        return yaryin.object(obj).getVal(func);
                    });
                } else {
                    result = this;
                }
                return eval('(' + result.join('+') + ')');
            }

            instance.avg = function (func) {
                func = parseFuncLambda(func);
                return this.length == 0 ? 0 : this.sum(func) / this.length;
            }

            return instance;
        }

        arrayEx(Array.prototype);

        Array.prototype.clone = function () {
            var arr = [];
            for (var i = 0; i < this.length; i++) {
                arr.push(this[i]);
            }
            return arr;
        }
    })();

    //#endregion

    //#region yaryin

    (function () {
        var _yaryin = window.yaryin;

        var yaryin = function () {
            ///<summary>
            /// yaryin js framework
            /// by yaryin.namespace("adminJs.global"); adminJs.global is avaliable
            /// adminJs.global.extend({ sayHello: function(){ alert('hello ') }});
            /// adminJs.global.extend({ sayHi: function(){ alert('hi ') }});
            /// adminJs.global.extend({ ready: function(){ alert('i am going here! ') }});//ready method will execute immediately
            /// yaryin.namespace("adminJs.fileJs");
            /// adminJs.fileJs.extend({ sayHello: function(){ alert('hello ') }});
            /// yaryin.using(adminJs.global,function(global){
            ///     sayHello();
            ///     global.sayHello();
            /// });
            /// yaryin.using([adminJs.global,adminJs.fileJs],function(global,fileJs){
            ///     fileJs.sayHello();
            ///     global.sayHello();
            ///     sayHi();
            /// });
            ///</summary>
        };

        yaryin.yaryin = 'yaryin';

        yaryin.$ = jQuery.sub();

        var _extendMethod = function (obj) {
            if (typeof (obj) == 'function' || typeof (obj) == 'object') {
                obj.extend = function (objx, objx2) {
                    if (objx) {
                        if (objx2) {
                            if (typeof (objx) == 'string') {
                                obj[objx] = objx2;
                            }
                        } else {
                            if (typeof (objx) == 'function' || typeof (objx) == 'object') {
                                for (var p in objx) {
                                    obj[p] = objx[p];
                                    _extendMethod(obj[p]);
                                } // end for
                                if (objx.ready && typeof (objx.ready) == 'function') {
                                    yaryin.ready(function () {
                                        objx.ready.call(objx);
                                    });
                                }
                            } //end if
                        } //end  if (typeof (objx) == 'string')
                    } //end if(objx)
                } // end extend
            } //end if
        };

        yaryin.isValueType = function (input) {
            return input == null || 'number,boolean,string,undefined'.split(',').indexOf(typeof input) >= 0;
        }

        yaryin.isFunc = function (obj) {
            return typeof obj == 'function';
        }

        yaryin.isObj = function (obj) {
            return typeof obj == 'object';
        }

        yaryin.isArray = function (obj) {
            return obj instanceof Array;
        }

        yaryin.isStr = function (obj) {
            return typeof obj == 'string';
        }

        yaryin.helper = {
            encode: function (input) {
                return $('<div/>').html(input).text();
            }
            , decode: function (input) {
                return $('<div/>').text(input).html();
            }
            , encodeReg: function (input) {
                var keywords = '~!@#$%^&*()/\\|[].'.split('');
                return input.split('').select(function (word) {
                    return keywords.indexOf(word) >= 0 ? ('\\' + word) : word;
                }).join('');
            }
        };

        yaryin.namespace = function (spaceName, obj) {
            ///<summary>
            /// registing method or object to yaryin
            ///</summary>
            ///<param type="string" name="spaceName">
            /// create a namespace
            ///</param>

            if (spaceName && typeof (spaceName) == 'string') {
                ///
                function _creatObject(objName, obj) {
                    if (objName.indexOf('.') > 0) {
                        var first = objName.substring(0, objName.indexOf("."));
                        if (!obj[first]) {
                            obj[first] = new Object();
                            _extendMethod(obj[first]);
                        }
                        _creatObject(objName.substring(objName.indexOf(".") + 1), obj[first]);
                    } else {
                        if (!obj[objName]) {
                            obj[objName] = new Object();
                            _extendMethod(obj[objName]);
                        }
                    }
                }
                _creatObject(spaceName, obj || window);
            }
            else {
                throw " typeof(spaceName) must be string!";
            }
        }

        yaryin.using = function (spaces, func) {
            ///<summary>
            /// registing method or object to yaryin
            ///</summary>
            ///<param type="object" name="spaceName">
            /// create a namespace
            ///</param>
            if (spaces instanceof Array) {
                var conflict = {};
                var count = spaces.length;
                for (var s in spaces) {
                    for (var p in spaces[s]) {
                        if (window[p]) {
                            conflict[p] = spaces[s][p];
                        } else {
                            window[p] = spaces[s][p];
                        }
                    }
                }
                func.apply(this, spaces);
                for (var s in spaces) {
                    for (var p in s) {
                        if (!conflict[p]) {
                            delete window[p];
                        }
                    }
                }
            } else {
                var conflict = {};
                for (var p in spaces) {
                    if (window[p]) {
                        conflict[p] = spaces[p];
                    } else {
                        window[p] = spaces[p];
                    }
                }
                func(conflict);

                for (var p in spaces) {
                    if (!conflict[p]) {
                        delete window[p];
                    }
                }
            }
        }

        yaryin.extend = function (obj1, obj2) {
            ///<summary>
            /// this method can extend fJs
            ///</summary>
            ///<param type="object" name="obj1">
            /// fist object to extend if obj2 is null obj1's attribute will be extended to yaryin
            ///</param>
            ///<param type="object" name="obj2">
            /// extend obj2's attribute to obj1
            ///</param>
            ///<returns type="function">

            var obj1 = arguments[0];
            var obj2 = arguments[1];
            if (obj1) {
                if (obj2) {
                    if (typeof (obj1) == 'string') {
                        yaryin[obj1] = obj2;
                        _extendMethod(yaryin[obj1]);
                    }
                    else if (typeof (obj1) == 'object' || typeof (obj1) == 'function') {
                        for (var p in obj2) {
                            obj1[p] = obj2[p];
                        }
                    }
                }
                else {
                    if (typeof (obj1) == 'object' || typeof (obj1) == 'function') {
                        for (var p in obj1) {
                            yaryin[p] = obj1[p];
                            _extendMethod(yaryin[p]);
                        }
                    }
                }
            }

            return yaryin;
        }

        //------useful method in js----------------------

        ///Class yaryin.object
        var yaryinObject = {
            maxDeep: 5,
            isValueType: function (input) {
                return input == null || 'number,boolean,string,undefined'.split(',').indexOf(typeof input) >= 0;
            },
            getVal: function (obj, pStr) {
                if (pStr.indexOf('.') > 0) {
                    var firstProp = pStr.substring(0, pStr.indexOf("."));

                    var lastProp = pStr.substring(pStr.indexOf('.') + 1);
                    if (firstProp.indexOf('[') >= 0) {
                        var index = firstProp.substring(firstProp.indexOf('[') + 1, firstProp.lastIndexOf(']'));
                        index = parseInt(index);
                        if (firstProp.indexOf('[') == 0) {
                            return this.getVal(obj[index], lastProp);
                        } else if (firstProp.indexOf('[') > 0) {
                            var propertyName = pStr.substring(0, pStr.indexOf('['));
                            if (propertyName.indexOf('"') == 0) {
                                propertyName = propertyName.substring(1, propertyName.length - 2);
                            }
                            return this.getVal(obj[propertyName][index], lastProp);
                        }
                    } else {
                        var pObj = obj[firstProp];
                        return this.getVal(pObj, lastProp);
                    }
                } else {
                    if (pStr.indexOf('[') >= 0) {
                        var index = pStr.substring(pStr.indexOf('[') + 1, pStr.lastIndexOf(']'));
                        index = parseInt(index);
                        if (pStr.indexOf('[') == 0) {
                            return obj[index];
                        } else if (pStr.indexOf('[') > 0) {
                            var propertyName = pStr.substring(0, pStr.indexOf('['));
                            return obj[propertyName][index];
                        }
                    } else {
                        return obj[pStr];
                    }
                }
            },
            setVal: function (obj, pStr, val) {
                if (pStr.indexOf('.') > 0) {
                    var firstProp = pStr.substring(0, pStr.indexOf("."));

                    var lastProp = pStr.substring(pStr.indexOf('.') + 1);

                    if (firstProp.indexOf('[') >= 0) {
                        var index = firstProp.substring(firstProp.indexOf('[') + 1, firstProp.indexOf(']'));
                        index = parseInt(index);

                        if (firstProp.indexOf('[') == 0) {
                            if (!obj[index]) { obj[index] = {}; };
                            this.setVal(obj[index], lastProp, val);
                        } else if (firstProp.indexOf('[') > 0) {
                            var propertyName = pStr.substring(0, pStr.indexOf('['));

                            if (!obj[propertyName]) { obj[propertyName] = []; };

                            if (!obj[propertyName][index]) { obj[propertyName][index] = {}; };

                            this.setVal(obj[propertyName][index], lastProp, val);
                        }
                    } else {
                        if (!obj[firstProp]) {
                            obj[firstProp] = {};
                        }
                        this.setVal(obj[firstProp], lastProp, val);
                    }
                } else {
                    var arrayReg = /\[\d*\]/;
                    if (arrayReg.test(pStr)) {
                        var index = pStr.substring(pStr.indexOf('[') + 1, pStr.lastIndexOf(']'));

                        index = parseInt(index);
                        if (pStr.indexOf('[') == 0) {
                            obj[index] = val;
                        } else if (pStr.indexOf('[') > 0) {
                            var propertyName = pStr.substring(0, pStr.indexOf('['));
                            if (!obj[propertyName]) {
                                obj[propertyName] = [];
                            }
                            obj[propertyName][index] = val;
                        }
                    } else {
                        obj[pStr] = val;
                    }
                }
                return obj;
            },
            beautifyNames: function (obj, deep, changeName) {
                var self = this;
                if (yaryin.isArray(obj)) {
                    var r = [];
                    for (var i = 0; i < obj.length; i++) {
                        var val = obj[i];
                        if (yaryin.isObj(val) || yaryin.isArray(val)) {
                            val = self.beautifyNames(val, deep + 1, changeName);
                        }
                        r.push(val);
                    }
                    return r;
                } else if (yaryin.isObj(obj)) {
                    var result = {};
                    deep = deep == undefined || isNaN(deep) ? 0 : deep;
                    if (deep > this.maxDeep) {
                        return result;
                    }
                    if (changeName == undefined) {
                        changeName = true;
                    }
                    this.each(obj, function (key, value) {
                        if (self.isValueType(value)) {
                            result[key] = value;
                        } else {
                            if (!yaryin.isObj(value)) {
                                if (yaryin.isStr(key) && changeName) {
                                    result[key.lowerChar0()] = value;
                                } else {
                                    result[key] = value;
                                }
                            } else { // value is object
                                if (yaryin.isStr(key) && changeName) {
                                    result[key.lowerChar0()] = yaryin.object.beautifyNames(value, deep + 1, changeName);
                                } else {
                                    result[key] = yaryin.object.beautifyNames(value, deep + 1, changeName);
                                }
                            }
                        }
                    });
                    return result;
                }
            },
            deepClone: function (obj, deep) {
                return this.beautifyNames(obj, deep, false);
            },
            each: function (obj, func) {
                if (!yaryin.isFunc(func)) {
                    return false;
                }
                if (yaryin.isArray(obj)) {
                    for (var i = 0; i < obj.length; i++) {
                        if (func(i, obj[i]) == false) return false;
                    }
                } else {
                    for (var key in obj) {
                        if (func(key, obj[key]) == false) return false;
                    }
                }
            },
            keys: function (obj) {
                var keys = [];
                this.each(obj, function (key, value) { keys.push(key); });
                return keys;
            },
            values: function (obj) {
                var values = [];
                this.each(obj, function (key, value) { values.push(value); });
                return values;
            },
            tryGetVal: function (obj, pStr) {
                var val = undefined;
                try {
                    val = this.getVal(obj, pStr);
                } catch (E) {
                }
                return val;
            },
            instanceOf: function (obj, type) {
                return obj instanceof type;
            },
            keyValues: function (obj) {
                var result = [];
                this.each(obj, function (key, value) {
                    result.push({ key: key, value: value });
                });
                return result;
            },
            toArray: function (obj) {
                var res = [];
                if (obj.length) {
                    for (var i = 0 ; i < obj.length; i++) {
                        res.push(obj[i]);
                    }
                }
                return res;
            }
        };

        yaryin.object = function (obj) {
            var api = {
                getVal: function (pStr) {
                    return yaryin.object.getVal(obj, pStr);
                },
                setVal: function (pStr, val) {
                    return yaryin.object.setVal(obj, pStr, val);
                },
                each: function (func) {
                    yaryin.object.each(obj, func);
                },
                keys: function () { return yaryin.object.keys(obj); },
                values: function () { return yaryin.object.values(obj); },
                beautifyNames: function () {
                    return yaryin.object.beautifyNames(obj);
                },
                deepClone: function (deep) {
                    return yaryin.object.deepClone(obj, deep);
                },
                tryGetVal: function (pStr) {
                    var val = undefined;
                    try {
                        val = yaryin.object.getVal(obj, pStr);
                    } catch (E) {
                    }
                    return val;
                },
                instanceOf: function (type) {
                    return yaryin.object.instanceOf(obj, type);
                },
                keyValues: function () {
                    return yaryin.object.keyValues(obj);
                },
                toArray: function () {
                    return yaryin.object.toArray(obj);
                }
            };
            return api;
        }

        $.extend(yaryin.object, yaryinObject);

        var _tempdata = {};

        yaryin.data = function (name, value) {
            if (name instanceof jQuery) { return name.data(); }

            if (typeof name != 'string') {
                name = yaryin.getHash(name).toLowerCase();
            }

            if (arguments.length == 1) {
                try {
                    var result = yaryin.object.getVal(_tempdata, name);
                    return result;
                }
                catch (E) { }
                return null;
            } else if (arguments.length == 2) {
                yaryin.object.setVal(_tempdata, name, value);
            }
        }

        yaryin.guid = function () {
            return (new Date().getTime()) + '_' + Math.random().toString().replace('.', '_');
        }

        yaryin.alert = function (msg) {
            alert(msg);
        }

        yaryin.confirm = function (msg, callback, title) {
            //Disable confirm if the message is null.
            if (msg == undefined || msg == '') {
                callback(true);
            }
            else
                callback(confirm(msg));
        }

        var objReference = [];
        var __getHash = function (obj) {
            var query = objReference
                .first(function (val) { return val.obj == obj; });
            if (!query) {
                query = {
                    obj: obj,
                    key: yaryin.guid()
                };
                objReference.push(query);
            }

            return query.key;
        }

        //window.name = 'yaryin';

        yaryin.getHash = __getHash;

        var _single_getHashInited = false;

        yaryin._single = function () {
            if (!_single_getHashInited) {
                yaryin.getHash = top.yaryin ? top.yaryin.getHash : __getHash;
            }
            _single_getHashInited = true;
        }

        //-------end us -useful method in js------------

        yaryin.noConflict = function () {
            if (!hasYaryin) {
                window.yaryin = _yaryin;
            }
            return _yaryin;
        }

        window.yaryin = yaryin;
    })(); //end yaryin

    //#endregion

    //#region yaryin.event

    (function ($, yaryin) {
        if (yaryin.event) {
            return true;
        }

        var event = yaryin.event = {};

        var guid = yaryin.guid();

        var index = 0;

        var _beautifyFunName = function () {
            var arr = [];
            if (arguments.length) {
                for (var i = 0; i < arguments.length; i++) {
                    arr.push(arguments[i]);
                }
            } else {
                return '';
            }
            if (arr[0]) {
                arr[0] = arr[0].lowerChar0();
            }
            for (var i = 1; i < arguments.length; i++) {
                arr[i] = arr[i].uperChar0();
            }
            return arr.join('');
        }

        event._event = {
            eventList: {},
            add: function (func, name, data, rtnResult) {
                name = name || "default";

                if (!this.eventList[name]) {
                    this.eventList[name] = [];
                }

                var eve = {
                    func: func,
                    data: data
                };

                this.eventList[name].push(eve);
                if (rtnResult) {
                    return rtnResult;
                }
            },
            execute: function (name, context, data) {
                name = name || 'default';

                this.eventList[name] = this.eventList[name] || [];

                context = context || yaryin.event._event;

                var result = true;

                this.eventList[name].each(function (fnObj) {
                    if (data && data.length >= 0) {
                        var args = [];
                        for (var i = 0; i < data.length; i++) {
                            args.push(data[i]);
                        }
                        if (fnObj.data) {
                            args.push(fnObj.data);
                        }
                        result = result && (!(fnObj.func.apply(context, args) == false));
                    } else {
                        result = result && (!(fnObj.func.call(context, data, fnObj.data) == false));
                    }
                });

                return result;
            },
            clear: function (name) {
                this.eventList[name] = [];
            }
        };

        event.events = event._event.eventList;

        event.register = function (fnName, bindReturnValue, executeContext) {
            if (event._event[fnName]) {
                return event._event[fnName]
            }
            var func = function (func, data) {
                if (typeof (func) == 'function') {
                    yaryin.event._event.add(func, fnName, data);
                    return bindReturnValue || null;
                } else { //func is a param when ajax-submit execute
                    data = data || func;
                    executeContext = executeContext || data;
                    return yaryin.event._event.execute(fnName, executeContext, data);
                }
            }
            func.clear = function () {
                event._event.clear(fnName);
            }
            func.eventList = function () {
                return event._event.eventList[fnName];
            }
            func.execList = function () {
            }
            event._event[fnName] = func;
            return func;
        }

        event.registerOn = function (obj, fnName, bindReturnValue, executeContext) {
            var ns = yaryin.getHash(obj) + '_' + fnName;
            return this.register(ns, bindReturnValue, executeContext);
        }

        event.remove = function (fnName) {
            if (event._event[fnName])
                delete event._event[fnName];
        }

        event.clear = function (fnName) {
            event._event.clear(fnName);
        }

        function registerEvent(eventName, ns) {
            var ns = ns || guid + '[' + index + '].';
            var fullName = ns + eventName;
            if (!event._event[fullName])
                event.register(fullName);
            return event._event[fullName];
        }

        function hook(obj, funName, ns) {
            var before = before || 'before';
            var on = on || 'on';
            var _self = obj;
            var _func = _self[funName]
            , beforeName = _beautifyFunName(before, funName)
            , onName = _beautifyFunName(on, funName);

            if (typeof _self[funName] != 'function'
                || typeof (_self[funName][beforeName]) == 'function'
                || typeof (_self[funName][onName]) == 'function') {
                return _self;
            }

            var beforeFunc = registerEvent(beforeName, ns);
            var onFunc = registerEvent(onName, ns);
            _self[funName] = function () {
                var _self = this;
                if (beforeFunc(_self, arguments)) {
                    var result = _func.apply(_self, arguments);
                    var arr = [];
                    arr.push(result);
                    for (var i = 0; i < arguments.length; i++) {
                        arr.push(arguments[i]);
                    }
                    onFunc(_self, arr);
                    return result;
                }
                return false;
            }
            _self[funName]['_orgFunc'] = _func;
            _self[funName][beforeName] = beforeFunc;
            _self[funName][onName] = onFunc;
            return _self;
        }

        event.hook = function (obj, funNames, ns) {
            ns = ns || yaryin.getHash(obj);
            funNames.split(',').each(function (funName) {
                if (funName)
                    hook(obj, funName, ns);
            });
        };

        event.unhook = function (obj, funName) {
            if (obj[funName] && obj[funName]._orgFunc) {
                obj[funName] = obj[funName]._orgFunc;
            }
        }

        event.get = function (name, $obj) {
            if (!$obj) {
                $obj = $(window);
            }

            if ($obj.jquery) {

                $obj.each(function () {
                    event.registerOn(this, name, this, this);
                });
                return function () {
                    var args = arguments;
                    var result = true;
                    $obj.each(function () {
                        result = result && event.registerOn(this, name, this, this).apply(this, args);
                    });
                    return result;
                }
            }
            var ev = this.registerOn($obj, name, $obj, $obj);
            return ev;
        }

    })(yaryin.$, yaryin);

    //#endregion

    //#region yaryin.createlib & yaryin.extendlib

    (function (yaryin) {
        if (yaryin.createlib) {
            return yaryin.createlib;
        }

        /*
        yaryin.createlib('namespace.helloworld',function(options){
        var config = this.options(options);
        this.sayHello = function(){ alert('hello');}
        this.sayGoodbye = function(){ alert('good bye'); }

        this.hook('sayHello,sayGoodbye'); // hook is a inherited method will add on and before events on methods
        });
        create a Class named 'namespace.helloworld'
        var hw = namespace.helloworld({
        beforeSayHello:function () {  alert('before say hello 0 ;');}
        , onSayHello:function () { alert('on say hello 0 ;');}
        , beforeSayGoodbye:function () {  alert('before say goodbye 0 ;');}
        , onSayGoodbye : function(){  alert('on say goodbye 0 ;');}
        });

        hw.sayHello.beforeSayHello(function () {
        alert('before say hello 1.');
        })
        .onSayHello(function(){
        alert('on say hello 1.');
        });

        hw.sayGoodBye.beforeSayGoodbye(function(){
        alert('say goodbye 1');
        return false ; // this will stop sayGoodbye
        })
        .onSayGoodbye(function(){
        alert('on goodbye 1');// will no show
        });

        hw.sayHello(); // 'before say hello 0 , before say hello 1 , on say hello 0 , on say hello 1'

        hw.sayGoodbye(); // 'before say goodbye 0 , before say goodbye 1 '
        */
        var helper = {
            uperChar0: function (name) {
                var char0 = name.charAt(0);
                var r = char0.toUpperCase();
                return name.replace(new RegExp('^' + char0), r);
            }
            , lowerChar0: function (name) {
                var char0 = name.charAt(0);
                var r = char0.toLowerCase();
                return name.replace(new RegExp('^' + char0), r);
            }
        }

        , index = 0

        , _beautifyFunName = function () {
            var arr = [];
            if (arguments.length) {
                for (var i = 0; i < arguments.length; i++) {
                    arr.push(arguments[i]);
                }
            } else {
                return '';
            }
            if (arr[0]) {
                arr[0] = helper.lowerChar0(arr[0]);
            }
            for (var i = 1; i < arguments.length; i++) {
                arr[i] = helper.uperChar0(arr[i]);
            }
            return arr.join('');
        }

        , configCache = {}

        , _class = function (namespace, constructor, statics, base, obj) {
            ///<summary>
            /// you could do some init job in constructor
            /// statics methods
            ///</summary>
            obj = obj || window;
            if (yaryin.object(obj).tryGetVal(namespace)) {
                return yaryin.object(obj).tryGetVal(namespace);
                throw namespace + ' existed !';
            }

            yaryin.object(obj)
            .setVal(namespace, function (options) {
                index++;
                var fnType = yaryin.object(obj).getVal(namespace);
                if (!(this instanceof fnType)) {
                    return (new fnType(options));
                }

                var _self = this;

                if (base) {
                    if (yaryin.isStr(base)) {
                        base = yaryin.object(obj).getVal(base);
                    }
                    var _base = base(options);

                    yaryin.object(_base).each(function (key, value) {
                        _self[key] = value;
                    });

                    _self._getSuper = function () {
                        return _base;
                    }
                } else {
                    _self._getSuper = function () {
                        return null;
                    }

                    _self.events = {};

                    var guid = yaryin.guid()

                    , config = configCache[guid] = {}

                    , onPropertyChange = yaryin.event.register(namespace + '[' + index + '].onPropertyChange')

                    , beforePropertyChange = yaryin.event.register(namespace + '[' + index + '].beforePropertyChange');

                    bindOptionEvents(options, _self);

                    function registerEvent(eventName, _self) {
                        var events = _self.events;
                        var ns = namespace + '[' + index + '].';
                        if (!events[eventName])
                            events[eventName] = yaryin.event.register(ns + eventName, events);
                    }

                    function setOption(key, newConfig, oldConfig) {
                        var val = newConfig[key]
                        , preVal = oldConfig[key];
                        if (val != preVal) {
                            var res = beforePropertyChange([key, newConfig, oldConfig]);
                            if (res) {
                                oldConfig[key] = newConfig[key];
                                onPropertyChange([key, newConfig, oldConfig]);
                            }
                        }
                    }

                    _self.options = function (options, optionValue) {
                        if (arguments.length > 0) {
                            if (typeof options == 'object') {
                                for (var key in options) {
                                    setOption(key, options, config);
                                }
                            } else if (typeof options == 'string') {
                                var key = options
                                , options = {};
                                options[key] = optionValue;
                                setOption(key, options, config);
                            }
                            bindOptionEvents(options, this);
                            return this;
                        }

                        return config;
                    }

                    _self.events.beforeOptionChange = beforePropertyChange;

                    _self.events.onOptionChange = onPropertyChange;

                    function hook(_self, funName) {
                        yaryin.event.hook(_self, funName, namespace + '[' + index + '].');
                        var before = before || 'before'
                        , on = on || 'on'
                        , beforeName = _beautifyFunName(before, funName)
                        , onName = _beautifyFunName(on, funName);

                        _self.events[beforeName] = _self[funName][beforeName];
                        _self.events[onName] = _self[funName][onName];
                        return _self;
                    }

                    _self.hook = function (str) {
                        var _self = this;
                        if (typeof str == 'string') {
                            if (str.indexOf(',') >= 0) {
                                str.split(',').each(function (funName) {
                                    hook(_self, funName);
                                });
                            } else {
                                hook(_self, str);
                            }
                        }
                        return _self;
                    }

                    _self._prop = function (name, geter, seter) {
                        yaryin.createlib.getset(_self, name, geter, seter);
                    }

                    _self._parseConfig = function (jQContext) {
                        yaryin.createlib.parseConfig(_self, jQContext);
                    }
                }

                function bindOptionEvents(options, _self) {
                    if (!options) { return false; }
                    var events = _self.events;
                    for (var ev in options) {
                        if (events[ev] && typeof options[ev] == 'function') {
                            if (options.clearAllEvents == true) {
                                events[ev].clear();
                            }
                            events[ev](options[ev]);
                        }
                    }
                }

                /* constructor */

                if (typeof constructor == 'function') {
                    constructor.call(this, options);

                    bindOptionEvents(options, this);
                }

                /*end constructor*/
            });

            var type = yaryin.object(obj).getVal(namespace);

            var _instance;

            $.extend(type, statics);

            var __toString = type.toString;

            type.toString = function (org) {
                if (org) {
                    return __toString.call(type);
                }
                return 'type [ ' + namespace + ' ] ';
            }

            type.toJQ = function (name, optionSetter) {
                var fnName = name;
                name = name + "API";
                $.fn[fnName] = function (options) {
                    var args = arguments;
                    var self = this.each(function () {
                        var handle = $(this);
                        if (!handle.data(name)) {
                            var elOption = {};
                            if (typeof (optionSetter) == 'function') {
                                optionSetter.call(handle, elOption)
                            } else if (typeof optionSetter == 'string') {
                                elOption[optionSetter] = handle;
                            }
                            var instance = new type($.extend({}, options, elOption));
                            handle.data(name, instance);
                            if (typeof (instance.init) == 'function') {
                                instance.init();
                            }
                        } else {
                            var instance = handle.data(name);
                        }
                    });
                    if (this.length != 0 && this.data(name)) {
                        var instance = this.data(name);
                        if (args.length == 1) {
                            if (typeof args[0] == 'string') {
                                return instance[args[0]];
                            }
                        } else if (args.length > 1) {
                            if (typeof args[0] == 'string' && instance[args[0]]) {
                                if (typeof instance[args[0]] == 'function') {
                                    var arr = [];
                                    for (var i = 1; i < args.length ; i++) {
                                        arr.push(args[i]);
                                    }
                                    return instance[args[0]].apply(instance, arr);
                                } else {
                                    instance[args[0]];
                                }
                            }
                        }
                    }
                    return this;
                }
            }

            fnName = namespace.replace(new RegExp('\\.', 'gi'), '_');

            if (!$.fn[fnName]) {
                $.fn[fnName] = function (options) {
                    this.each(function () {
                        var handle = $(this)
                        , config = $.extend({ $: handle }, options)
                        , instance = type(config);

                        handle.data(namespace, instance);
                    });
                    return this;
                }
            }

            return type;
        }

        , _extend = function (base, namespace, constructor, statics, obj) {
            var type = yaryin.createlib(namespace, constructor, statics, base, obj);

            return type;
        };

        yaryin.createlib = _class;
        yaryin.createlib.getset = function (ins, name, geter, seter) {
            ins[name] = (function (ins, name, geter, seter) {
                var cahce = { value: undefined };
                return function () {
                    if (arguments.length == 0) {
                        if (yaryin.isFunc(geter)) {
                            return geter.call(cahce, cahce.value);
                        }
                        return cahce.value;
                    } else {
                        if (yaryin.isFunc(seter)) {
                            seter.call(cahce, arguments[0]);
                        } else {
                            cahce.value = arguments[0];
                        }
                        return ins;
                    }
                }
            })(ins, name, geter, seter);
        }
        yaryin.createlib.parseConfig = function (yaryinObj, jQContext) {
            yaryin.object(yaryinObj.options()).each(function (key, value) {
                if (key.indexOf('$') == 0) {
                    if (!yaryinObj[key]) {
                        var cache, oldKey = yaryin.guid();
                        yaryin.createlib.getset(yaryinObj, key, function () {
                            if (oldKey != yaryinObj.options()[key]) {
                                oldKey = yaryinObj.options()[key];
                                cache = (jQContext || $)(yaryinObj.options()[key]);
                            }
                            return cache;
                        }, function (value) {
                            yaryinObj.options(key, value);
                        });
                    }
                }
            });
        }
        yaryin.createlibOn = function (obj, namespace, constructor, statics, base) {
            return yaryin.createlib(namespace, constructor, statics, base, obj);
        }

        yaryin.extendlib = _extend;

        yaryin.createlib.beautifyFunName = _beautifyFunName;

        //overrided yaryin.object.instanceOf
        (function () {
            var __instanceOf = yaryin.object.instanceOf;
            yaryin.object.instanceOf = function (obj, type) {
                var res = obj instanceof type;
                if (res) {
                    return true;
                }
                if (yaryin.isFunc(obj._getSuper)) {
                    var base = obj._getSuper();
                    res = base instanceof type;
                    if (res) {
                        return true;
                    }
                    if (base != null) {
                        return yaryin.object(base).instanceOf(type);
                    }
                }
                return res;
            }
        })();
    })(yaryin);

    //#endregion

    //#region yaryin.request
    (function (yaryin) {
        if (yaryin.request) {
            return false;
        }
        yaryin.request = (function () {
            var apiMap = {};

            function request(queryStr) {
                var api = {};

                if (apiMap[queryStr]) {
                    return apiMap[queryStr];
                }

                api.queryString = (function () {
                    if (queryStr.indexOf('?') <= 0) {
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
                    yaryin.object(api.queryString).each(function (k, v) {
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
                    yaryin.object(api.queryString).each(function (k, v) {
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
                        return getParam(key);
                    }
                    if (arguments.length == 2) {
                        return setParam(key, value);
                    }
                }

                api.getUrl = function () {
                    var url = queryStr.indexOf('?') > 0 ? queryStr.substring(0, queryStr.indexOf('?') + 1) : queryStr;

                    for (var p in api.queryString) {
                        if (url.indexOf('?') < 0) {
                            url = url + '?';
                        }
                        if (api.queryString[p] != null) {
                            url += p + '=' + api.queryString[p] + "&";
                        }
                    }

                    if (url.lastIndexOf('&') == url.length - 1) {
                        return url.substring(0, url.lastIndexOf('&'));
                    }
                    return url;
                }

                apiMap[queryStr] = api;
                return api;
            }

            $.extend(request, request(window.location.href));

            return request;
        })();
    })(yaryin);
    //#endregion

    //
    if (!window.console) {
        window.console = {};
        window.console.log = function () { };
    }
})();