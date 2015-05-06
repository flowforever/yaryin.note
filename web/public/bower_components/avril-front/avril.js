//#region avril.array
;(function(){

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(searchElement, fromIndex) {
            var k;
            // 1. Let O be the result of calling ToObject passing
            //    the this value as the argument.
            if (null === this || undefined === this) {
                throw new TypeError('"this" is null or not defined');
            }
            var O = Object(this);
            // 2. Let lenValue be the result of calling the Get
            //    internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0;
            // 4. If len is 0, return -1.
            if (len === 0) {
                return -1;
            }
            // 5. If argument fromIndex was passed let n be
            //    ToInteger(fromIndex); else let n be 0.
            var n = +fromIndex || 0;
            if (Math.abs(n) === Infinity) {
                n = 0;
            }
            // 6. If n >= len, return -1.
            if (n >= len) {
                return -1;
            }
            // 7. If n >= 0, then Let k be n.
            // 8. Else, n<0, Let k be len - abs(n).
            //    If k is less than 0, then let k be 0.
            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
            // 9. Repeat, while k < len
            while (k < len) {
                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the
                //    HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                //    i.  Let elementK be the result of calling the Get
                //        internal method of O with the argument ToString(k).
                //   ii.  Let same be the result of applying the
                //        Strict Equality Comparison Algorithm to
                //        searchElement and elementK.
                //  iii.  If same is true, return k.
                if (k in O && O[k] === searchElement) {
                    return k;
                }
                k++;
            }
            return -1;
        };
    }


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

    !String.prototype.trim &&( String.prototype.trim = function () {
        var reg = /(^\s*)|(\s*$)/g;
        return this.replace(reg, "");
    });

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

    String.prototype.lambda = function (ctx) {
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

            if (ctx) {
                with (ctx) {
                    return eval('(' + funcStr + ')');
                }
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

    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () {},
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis
                            ? this
                            : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

})();
//#endregion
; (function (window) {
    if (window.avril && avril.avril) {
        return avril;
    }

    //#endregion

    //#region avril

    (function () {
        var _avril = window.avril;

        ///<summary>
        /// avril js framework
        /// by avril.namespace("adminJs.global"); adminJs.global is avaliable
        /// adminJs.global.extend({ sayHello: function(){ alert('hello ') }});
        /// adminJs.global.extend({ sayHi: function(){ alert('hi ') }});
        /// adminJs.global.extend({ ready: function(){ alert('i am going here! ') }});//ready method will execute immediately
        /// avril.namespace("adminJs.fileJs");
        /// adminJs.fileJs.extend({ sayHello: function(){ alert('hello ') }});
        /// avril.using(adminJs.global,function(global){
        ///     sayHello();
        ///     global.sayHello();
        /// });
        /// avril.using([adminJs.global,adminJs.fileJs],function(global,fileJs){
        ///     fileJs.sayHello();
        ///     global.sayHello();
        ///     sayHi();
        /// });
        ///</summary>

        var avril = {};

        avril.avril = 'avril';

        avril.$ = jQuery;

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
                                    avril.ready(function () {
                                        objx.ready.call(objx);
                                    });
                                }
                            } //end if
                        } //end  if (typeof (objx) == 'string')
                    } //end if(objx)
                } // end extend
            } //end if
        };

        avril.isValueType = function (input) {
            return input == null || 'number,boolean,string,undefined'.split(',').indexOf(typeof input) >= 0;
        }

        avril.isFunc = function (obj) {
            return typeof obj == 'function';
        }

        avril.isObj = function (obj) {
            return typeof obj == 'object';
        }

        avril.isArray = function (obj) {
            return obj instanceof Array;
        }

        avril.isStr = function (obj) {
            return typeof obj == 'string';
        }

        avril.helper = {
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

        avril.namespace = function (spaceName, obj) {
            ///<summary>
            /// registing method or object to avril
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
                        return _creatObject(objName.substring(objName.indexOf(".") + 1), obj[first]);
                    } else {
                        if (!obj[objName]) {
                            obj[objName] = new Object();
                            _extendMethod(obj[objName]);
                            return obj[objName];
                        }
                    }
                }
                return _creatObject(spaceName, obj || window);
            }
            else {
                throw " typeof(spaceName) must be string!";
            }
        }

        avril.module = function (namespace, dependences, func) {
            ///<summary>
            /// registing method or object to avril
            ///</summary>
            ///<param type="object" name="spaceName">
            /// create a namespace
            ///</param>
            arguments.length == 2 && (func = dependences, dependences = []);
            if (typeof dependences === 'string') {
                dependences = dependences.trimAll().split(',');
            }
            var getEvent = avril.module.getModuleEvent
            , waitModules = avril.array(dependences).where(function (ns) {
                return !avril.object(window).getVal(ns);
            }).value()
            , executeCount = 0
            , execute = function (times) {
                printDependences();
                if (times == waitModules.length) {
                    avril.namespace(namespace);
                    var module = avril.object(window).getVal(namespace);
                    var dependenceModules = dependences.select(function (ns) {
                        return avril.object(window).getVal(ns);
                    });
                    func.apply(module, dependenceModules);
                    getEvent(namespace)([name]);
                }
            }
            , printDependences = function () {
                var _waits = avril.array(waitModules).where(function (module) {
                    return !avril.object(window).getVal(module);
                }).value();
                var _finished = avril.array(dependences).where(function (module) {
                    return !!avril.object(window).getVal(module);
                }).value();
                if (_waits.length == 0) {
                    console.log(namespace + ' dependences loaded complete.');
                } else {
                    console.log(namespace + ' dependences loaded ' + _finished.join(',') + ', waiting: ' + _waits.join(','));
                }
            };

            if (waitModules.length > 0) {
                avril.array(waitModules).each(function (ns) {
                    getEvent(ns)(function () {
                        execute(++executeCount);
                    });
                });
            }

            execute(0);
        }

        avril.module.getModuleEvent = function (ns) {
            return avril.event.get('module.events.' + ns);
        }

        avril.module.notify = function (ns, data) {
            avril.module.getModuleEvent(ns)([ns, data])
        }

        avril.module.subscribe = function (ns, func) {
            avril.module.getModuleEvent(ns)(func);
        }

        avril.extend = function (obj1, obj2) {
            ///<summary>
            /// this method can extend fJs
            ///</summary>
            ///<param type="object" name="obj1">
            /// fist object to extend if obj2 is null obj1's attribute will be extended to avril
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
                        avril[obj1] = obj2;
                        _extendMethod(avril[obj1]);
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
                            avril[p] = obj1[p];
                            _extendMethod(avril[p]);
                        }
                    }
                }
            }

            return avril;
        }

        //------useful method in js----------------------

        ///Class avril.object
        var avrilObject = {
            maxDeep: 5,
            isValueType: function (input) {
                return input == null || 'number,boolean,string,undefined'.split(',').indexOf(typeof input) >= 0;
            },
            getVal: function (obj, pStr) {
                var propArr = this._getExecPropArr(pStr)
                    , getProp = this._getPropFromExecArr
                    , prevObj = obj
                    ;
                avril.array(propArr).each(function(execArr, index){
                    var prop = getProp(execArr);
                    prevObj = prevObj[prop];
                    if(!prevObj){
                        return false;
                    }
                });
                return prevObj;
            },
            setVal: function (obj, pStr, val) {
                
                var propArr = this._getExecPropArr(pStr)
                    , getProp = this._getPropFromExecArr
                    , prevObj = obj;
                
                avril.array(propArr).each(function(execArr, index){
                    var prop = getProp(execArr);
                    if(index === propArr.length - 1){
                        prevObj[prop] = val;
                        return false;
                    }else{
                        if(!avril.isObj( prevObj[prop] ) ){
                            var nextExecArr = propArr[ index +1 ];
                            // is array visitor
                            if(nextExecArr[1]){
                                prevObj[prop] = [];
                            }else{
                                prevObj[prop] = {};
                            }
                        }
                        prevObj = prevObj[prop];
                    }
                });

                return obj;
            },
            _getPropFromExecArr : function(execArr){
                return avril.array(execArr).first(function(val,index){
                    return index >0 && val;
                });
            },
            _getExecPropArr: function(pStr){
                var reg = /\[\s*(\d+)\s*\]|\[\s*\'(.+)?\'\s*\]|\[\s*\"(.+)?\"\s*\]|\.?((\w|\$)+)/g
                    , propArr = []
                    , execStr;

                while(execStr = reg.exec(pStr)){
                    propArr.push(execStr);
                };
                return propArr;
            },
            beautifyNames: function (obj, deep, changeName) {
                var self = this;
                if (avril.isArray(obj)) {
                    var r = [];
                    for (var i = 0; i < obj.length; i++) {
                        var val = obj[i];
                        if (avril.isObj(val) || avril.isArray(val)) {
                            val = self.beautifyNames(val, deep + 1, changeName);
                        }
                        r.push(val);
                    }
                    return r;
                } else if (avril.isObj(obj)) {
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
                            if (!avril.isObj(value)) {
                                if (avril.isStr(key) && changeName) {
                                    result[key.lowerChar0()] = value;
                                } else {
                                    result[key] = value;
                                }
                            } else { // value is object
                                if (avril.isStr(key) && changeName) {
                                    result[key.lowerChar0()] = avril.object.beautifyNames(value, deep + 1, changeName);
                                } else {
                                    result[key] = avril.object.beautifyNames(value, deep + 1, changeName);
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
                if (!avril.isFunc(func)) {
                    return false;
                }
                if (avril.isArray(obj)) {
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
                if(!obj){
                    return [];
                }
                if(obj instanceof  Array){
                    return obj;
                }
                var res = [];
                if (obj.length) {
                    for (var i = 0 ; i < obj.length; i++) {
                        res.push(obj[i]);
                    }
                }
                return res;
            }
        };

        avril.object = function (obj) {
            var api = {
                getVal: function (pStr) {
                    return avril.object.getVal(obj, pStr);
                },
                setVal: function (pStr, val) {
                    return avril.object.setVal(obj, pStr, val);
                },
                each: function (func) {
                    avril.object.each(obj, func);
                },
                keys: function () { return avril.object.keys(obj); },
                values: function () { return avril.object.values(obj); },
                beautifyNames: function () {
                    return avril.object.beautifyNames(obj);
                },
                deepClone: function (deep) {
                    return avril.object.deepClone(obj, deep);
                },
                tryGetVal: function (pStr) {
                    var val = undefined;
                    try {
                        val = avril.object.getVal(obj, pStr);
                    } catch (E) {
                    }
                    return val;
                },
                instanceOf: function (type) {
                    return avril.object.instanceOf(obj, type);
                },
                keyValues: function () {
                    return avril.object.keyValues(obj);
                },
                toArray: function () {
                    return avril.object.toArray(obj);
                }
            };
            return api;
        }

        $.extend(avril.object, avrilObject);

        var _tempdata = {};

        avril.data = function (name, value) {
            if (typeof name != 'string') {
                name = avril.getHash(name).toLowerCase();
            }

            if (arguments.length == 1) {
                try {
                    var result = avril.object.getVal(_tempdata, name);
                    return result;
                }
                catch (E) { }
                return null;
            } else if (arguments.length == 2) {
                avril.object.setVal(_tempdata, name, value);
            } else if (arguments.length == 0) {
                return _tempdata;
            }
        }

        avril.guid = function () {
            return  Math.random().toString(32).replace('.', '_') +  (new Date().getTime().toString(32));
        }

        var __getHash = (function(){
            var counter = 0;
            return function (obj) {
                if(obj === null){
                    return 'null';
                }

                if(typeof obj === 'string'){
                    return obj;
                }

                var objType = typeof obj;
                if(objType !== 'object'){
                    return objType;
                }

                return obj['___hash___'] || (obj['___hash___'] = avril.guid()+'__'+(counter++));
            }
        })();

        avril.getHash = __getHash;

        var _single_getHashInited = false;

        avril._single = function () {
            if (!_single_getHashInited) {
                avril.getHash = top.avril ? top.avril.getHash : __getHash;
            }
            _single_getHashInited = true;
        }

        //-------end us -useful method in js------------

        window.avril = avril;
    })(); //end avril

    //#endregion

    //#region avril.event

    (function ($, avril) {

        if (avril.event) {
            return true;
        }

        var event = avril.event = {};

        var guid = avril.guid();

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
        };

        event._event = {
            eventList: {},
            add: function (func, name, data, ctx) {
                name = name || "default";
                if (!this.eventList[name]) {
                    this.eventList[name] = [];
                }
                var eve = {
                    func: func,
                    data: data,
                    ctx: ctx
                };
                this.eventList[name].push(eve);
            },
            execute: function (name, context, data) {
                var self = this;

                name = name || 'default';

                this.eventList[name] = this.eventList[name] || [];

                context = context || avril.event._event;

                var result = true;

                var toRemove = [];

                avril.array( this.eventList[name] ).each(function (fnObj) {
                    var execResult , ctx = fnObj.ctx || context;
                    if (data && data.length >= 0) {
                        var args = [];
                        for (var i = 0; i < data.length; i++) {
                            args.push(data[i]);
                        }
                        if (fnObj.data) {
                            args.push(fnObj.data);
                        }
                        result = result && (!( (execResult = fnObj.func.apply(ctx, args)) == false));
                    } else {
                        result = result && (!( (execResult = fnObj.func.call(ctx, data, fnObj.data) ) == false));
                    }
                    if(execResult === 'removeThis'){
                        toRemove.push(fnObj);
                    }
                });

                avril.array( toRemove ).each(function(fnObj){
                    avril.array( self.eventList[name] ).removeElement(fnObj);
                });

                return result;
            },
            clear: function (name) {
                this.eventList[name] = [];
            }
        };

        event.events = event._event.eventList;

        event.register = function (fnName, registerCtx) {
            if (event._event[fnName]) {
                return event._event[fnName]
            }
            var func = function (func, data, ctx) {
                if (typeof (func) == 'function') {
                    avril.event._event.add(func, fnName, data, ctx || registerCtx);
                } else { //func is a param when ajax-submit execute
                    data = data || func;
                    registerCtx = registerCtx || data;
                    return avril.event._event.execute(fnName, registerCtx, data);
                }
            };
            func.remove = function(filterFunc){
                return this.eventList().remove(filterFunc);
            };
            func.clear = function () {
                event._event.clear(fnName);
            };
            func.eventList = function () {
                return event._event.eventList[fnName];
            };
            func.execList = function () {
            };
            event._event[fnName] = func;
            return func;
        };

        event.registerOn = function (obj, fnName, executeContext) {
            var ns = avril.getHash(obj) + '_' + fnName;
            return this.register(ns, executeContext);
        };

        event.remove = function (fnName) {
            if (event._event[fnName])
                delete event._event[fnName];
        };

        event.clear = function (fnName) {
            event._event.clear(fnName);
        };

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
            for (var k in _func) {
                _self[funName][k] = avril.isFunc(_func[k]) ? _func[k].bind(_func) : _func[k];
            }
            return _self;
        }

        event.hook = function (obj, funNames, ns) {
            ns = ns || avril.getHash(obj);
            funNames.split(',').each(function (funName) {
                if (funName)
                    hook(obj, funName, ns);
            });
        };

        event.unhook = function (obj, funName) {
            if (obj[funName] && obj[funName]._orgFunc) {
                obj[funName] = obj[funName]._orgFunc;
            }
        };

        event.get = function (name, $obj) {
            if (!$obj) {
                $obj = window;
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

    })(avril.$, avril);

    //#endregion

    //#region avril.array
    (function (){
        var isFunc = function (obj) {
            return typeof obj == 'function';
        };

        var isLambda = function(str) {
            return str && typeof (str) == 'string' && str.indexOf('=>') > 0;
        };

        var parseFuncLambda = function (func) {
            return isFunc(func) ?
                func :
                (isLambda(func) ? toLambdaFunc(func) : function () {

                });
        };

        var toLambdaFunc = function(str, ctx){
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

                if (ctx) {
                    with (ctx) {
                        return eval('(' + funcStr + ')');
                    }
                }

                return eval('(' + funcStr + ')');
            }
        }

        var sort = function(instance, field, direction) {
            direction = direction || 1;
            return instance.sort(function (x, y) {
                if (field) {
                    if (x[field] > y[field]) {
                        return direction;
                    } else {
                        return -1 * direction;
                    }
                } else {
                    if (x > y) {
                        return direction;
                    } else {
                        return -1 * direction;
                    }
                }
            });
        };

        var avArray = function(arr) {

            var self = this;

            self.asc = function (field) {
                return sort(this, field, 1);
            }

            self.desc = function (field) {
                return sort(this, field, -1);
            }

            self.each = function (func) {
                func = parseFuncLambda(func);
                for (var i = 0; i < arr.length; i++) {
                    if (func(arr[i], i) === false) {
                        break;
                    }
                }
                return this;
            }

            self.where = function (func) {
                func = parseFuncLambda(func);
                var results = [];
                this.each(function (value, index) {
                    if (func(value, index)) {
                        results.push(value);
                    }
                });
                arr = results;
                return this;
            }

            self.first = function (func) {
                func = parseFuncLambda(func);
                if (arr.length == 0) {
                    return null;
                }
                if (func) {
                    return this.where(func).value()[0];
                } else {
                    return arr[0];
                }
            }

            self.last = function (func) {
                func = parseFuncLambda(func);
                if (arr.length == 0) {
                    return null;
                }
                if (isFunc(func)) {
                    return this.where(func).value()[0];
                } else {
                    return arr[this.length - 1];
                }
            }

            self.groupBy = function (func) {
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

            self.take = function (num) {
                var result = [];
                for (var i = 0; i < num; i++) {
                    result.push(arr[i]);
                }
                arr = result;
                return this;
            }

            self.skip = function (num) {
                var result = [];
                for (var i = num; i < arr.length; i++) {
                    result.push(this[i]);
                }
                arr = result;
                return this;
            }

            self.select = function (func) {
                func = parseFuncLambda(func);
                var results = [];
                this.each(function (value, index) {
                    results.push(func.call(value, value, index));
                });
                arr = results;
                return this;
            }

            self.remove = function (func) {
                func = parseFuncLambda(func);
                var toRemove = [];
                this.each(function (val, index) {
                    if (func(val, index)) { toRemove.push(index); }
                });

                toRemove = toRemove.reverse();

                for(var i = 0; i < toRemove.length;i++){
                    arr.splice( toRemove[i] , 1)
                }

                return this;
            }

            self.removeElement = function (elment) {
                return this.remove(function (value) { return value == elment; });
            }

            self.removeAt = function (i) {
                return this.remove(function (value, index) { return index == i; });
            }

            self.indexOf = function (element) {
                var i = -1;
                this.each(function (value, index) {
                    if (value == element) {
                        i = index;
                        return false;
                    }
                });
                return i;
            }

            self.contain = function (element, elementIsFunction) {
                if (true != elementIsFunction && typeof element == 'function') {
                    return this.where(element).length > 0;
                }
                return this.indexOf(element) >= 0;
            }

            self.distinc = function (compareFunc) {
                arr = [];
                this.each(function (value, index) {
                    if (isFunc(compareFunc)
                        && compareFunc(value, index) != false) {
                        arr.push(value);
                    } else if (!isFunc(compareFunc)
                        && !arr.contain(value)) {
                        arr.push(value);
                    }
                });
                return this;
            }

            self.clone = function () {
                var results = [];
                for (var i = 0; i < this.length; i++) {
                    results.push(this[i]);
                }
                arr = results;
                return this;
            }

            self.value = function(){
                return arr;
            }
        }

        avril.array = function(arr){
            return new avArray(arr);
        }
    })();
    //#endregion

    //#region avril.createlib & avril.extendlib

    (function (avril) {
        if (avril.createlib) {
            return avril.createlib;
        }

        /*
        avril.createlib('namespace.helloworld',function(options){
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
            if (avril.object(obj).tryGetVal(namespace)) {
                return avril.object(obj).tryGetVal(namespace);
                throw namespace + ' existed !';
            }

            avril.object(obj)
            .setVal(namespace, function (options) {
                index++;
                var fnType = avril.object(obj).getVal(namespace);
                if (!(this instanceof fnType)) {
                    return (new fnType(options));
                }

                var _self = this;

                if (base) {
                    if (avril.isStr(base)) {
                        base = avril.object(obj).getVal(base);
                    }
                    var _base = base(options);

                    avril.object(_base).each(function (key, value) {
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

                    var guid = avril.guid()

                    , config = configCache[guid] = {}

                    , onPropertyChange = avril.event.register(namespace + '[' + index + '].onPropertyChange')

                    , beforePropertyChange = avril.event.register(namespace + '[' + index + '].beforePropertyChange');

                    bindOptionEvents(options, _self);

                    function registerEvent(eventName, _self) {
                        var events = _self.events;
                        var ns = namespace + '[' + index + '].';
                        if (!events[eventName])
                            events[eventName] = avril.event.register(ns + eventName, events);
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
                        avril.event.hook(_self, funName, namespace + '[' + index + '].');
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
                                avril.array(str.split(',')).each(function (funName) {
                                    hook(_self, funName);
                                });
                            } else {
                                hook(_self, str);
                            }
                        }
                        return _self;
                    }

                    _self._prop = function (name, geter, seter) {
                        avril.createlib.getset(_self, name, geter, seter);
                    }

                    _self._parseConfig = function (jQContext) {
                        avril.createlib.parseConfig(_self, jQContext);
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

            var type = avril.object(obj).getVal(namespace);

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

            var fnName = namespace.replace(new RegExp('\\.', 'gi'), '_');

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
            var type = avril.createlib(namespace, constructor, statics, base, obj);

            return type;
        };

        avril.createlib = _class;
        avril.createlib.getset = function (ins, name, geter, seter) {
            ins[name] = (function (ins, name, geter, seter) {
                var cahce = { value: undefined };
                return function () {
                    if (arguments.length == 0) {
                        if (avril.isFunc(geter)) {
                            return geter.call(cahce, cahce.value);
                        }
                        return cahce.value;
                    } else {
                        if (avril.isFunc(seter)) {
                            seter.call(cahce, arguments[0]);
                        } else {
                            cahce.value = arguments[0];
                        }
                        return ins;
                    }
                }
            })(ins, name, geter, seter);
        }
        avril.createlib.parseConfig = function (avrilObj, jQContext) {
            avril.object(avrilObj.options()).each(function (key, value) {
                if (key.indexOf('$') == 0) {
                    if (!avrilObj[key]) {
                        var cache, oldKey = avril.guid();
                        avril.createlib.getset(avrilObj, key, function () {
                            if (oldKey != avrilObj.options()[key]) {
                                oldKey = avrilObj.options()[key];
                                cache = (jQContext || $)(avrilObj.options()[key]);
                            }
                            return cache;
                        }, function (value) {
                            avrilObj.options(key, value);
                        });
                    }
                }
            });
        }
        avril.createlibOn = function (obj, namespace, constructor, statics, base) {
            return avril.createlib(namespace, constructor, statics, base, obj);
        }

        avril.extendlib = _extend;

        avril.createlib.beautifyFunName = _beautifyFunName;

        //overrided avril.object.instanceOf
        (function () {
            var __instanceOf = avril.object.instanceOf;
            avril.object.instanceOf = function (obj, type) {
                var res = obj instanceof type;
                if (res) {
                    return true;
                }
                if (avril.isFunc(obj._getSuper)) {
                    var base = obj._getSuper();
                    res = base instanceof type;
                    if (res) {
                        return true;
                    }
                    if (base != null) {
                        return avril.object(base).instanceOf(type);
                    }
                }
                return res;
            }
        })();
    })(avril);

    //#endregion

    avril.execTime = function(func,name){
        var t0 = new Date().getTime();
        func && func();
        var t1 = new Date().getTime() - t0;
        avril.execTime.funcTimes.push(t1);
        name && (avril.execTime.funcTimeMap[name] = t1);
        return t1;
    };
    avril.execTime.funcTimes = [];
    avril.execTime.funcTimeMap = {};

    //
    if (!window.console) {
        window.console = {};
        window.console.log = function () { };
    }

    avril.array('log,warn,error'.split(',')).each(function(action){
        avril[action] = function(){
            console[action] && avril.isFunc(console[action]) && console[action].apply(console, arguments);
        }
    });



})(this);
