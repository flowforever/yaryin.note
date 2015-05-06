//#region avril.array
;(function(){

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
            console[action] && console[action].apply(console, arguments);
        }
    });



})(this);

/// <reference path="../_references.js" />

; (function ($, avril) {

    avril.namespace('avril.tools');

    //#region avril.request
    (function (avril) {
        if (avril.request) {
            return false;
        }
        avril.request = (function () {
            function request(queryStr) {
                var api = {
                };

                api.queryString = (function () {
                    if (queryStr.indexOf('?') < 0) {
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
                    avril.object(api.queryString).each(function (k, v) {
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
                    avril.object(api.queryString).each(function (k, v) {
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
                        if (typeof key == 'string') {
                            return getParam(key);
                        } else if (typeof key == 'object') {
                            for (var k in key) {
                                setParam(k,key[k]);
                            }
                        }
                        return this;
                    }
                    if (arguments.length == 2) {
                        return setParam(key, value);
                    }
                }

                api.getUrl = function () {
                    var url = queryStr.split('?')[0];

                    if (url.indexOf('?') < 0) {
                        url = url + '?';
                    }

                    for (var p in api.queryString) {
                        if (api.queryString[p] != null) {
                            url += p + '=' + encodeURI(api.queryString[p]) + "&";
                        }
                    }

                    if (url.lastIndexOf('&') == url.length - 1) {
                        return url.substring(0, url.lastIndexOf('&'));
                    }

                    if (url.lastIndexOf('?') == url.length - 1) {
                        return url.substring(0, url.lastIndexOf('?'));
                    }

                    return url;
                }

                api.toString = function () {
                    return this.getUrl();
                }

                return api;
            }

            $.extend(request, request(window.location.href));

            return request;
        })();
    })(avril);
    //#endregion

    //#region avril.tools.loader
    avril.namespace('avril.tools.loader');
    avril.tools.loader.extend({
        jsonp: function (options) {
            options.success = options.success || function () { };
            options.error = options.error || function () { };
            var jsonpcallback = 'avril_' + avril.guid();
            window[jsonpcallback] = function () {
                script.jsonp = true;
                if (options.success) {
                    var obj = arguments[0];
                    if (typeof obj == 'string') {
                        obj = eval('(' + obj + ')')
                    }
                    options.success(obj);
                }
            };
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.language = "javascript";
            script.charset = "utf-8";
            script.async = true;
            var head = document.getElementsByTagName('head');

            function removeScript() {
                if (typeof script.jsonp === "undefined") {
                    options.error();
                }
                function clear() {
                    try {
                        (head ? head[0] : document).removeChild(script);
                    } catch (E) { }
                    try {
                        delete window[jsonpcallback];
                    } catch (E) { }
                }
                setTimeout(function () {
                    clear();
                }, 5000);
            }

            head[0].appendChild(script);

            script.onload = script.onreadystatechange = function () {
                if (-[1, ] || /loaded|complete/i.test(this.readyState)) {
                    removeScript();
                }
            }

            script.onerror = function () {
                removeScript();
            }

            var request = avril.request(options.url);
            if (options.data) {
                avril.object(options.data).each(function (key, value) {
                    if (typeof value != 'function' && typeof value != 'object') {
                        request.param(key, encodeURIComponent(value));
                    }
                });
            }
            request.param(options.jsonp || 'jsonpcallback', jsonpcallback);
            script.src = request.getUrl();
        }
        , json: function (options) {
            if (options.url
                && options.url.indexOf('http') == 0
                && options.url.indexOf('http://' + document.location.host) < 0
                && options.url.indexOf('https://' + document.location.host) < 0
                ) {
                this.jsonp(options);
            } else {
                $.ajax(options);
            }
        }
        , loadScript: function (url, callback) {
            if (!callbackCache.hasOwnProperty(url)) {
                loadingList.push(url);
                callbackCache[url] = callback || function () { };
                if (loadingList.length == 1) {
                    this._loadScript();
                }
            } else {
                callback();
            }
        }
        , loadStyle: function (url) {
            var head = document.getElementsByTagName('head') || document.getElementById('body');
            var style = document.createElement('link');
            style.rel = 'Stylesheet';
            style.type = 'text/css';
            (head ? head[0] : document).appendChild(style);
            style.href = url;
        }
        , template: function (url, callback) {
            var tmpl = avril.tools.cache(url);
            if (tmpl) {
                callback(cache);
            } else {
                $.get(url, function (tmpl) {
                    callback(tmpl);
                    avril.tools.cache(url, tmpl);
                });
            }
        }
    });
    //#endregion

    //#region avril.tools.cache
    avril.tools.cache = (function () {
        var cache = window.localStorage || {};

        var handler = function (key, value) {
            switch (arguments.length) {
                case 0: {
                    return cache;
                }
                case 1: {
                    return cache[key];
                }
                case 2: {
                    return cache[key] = value;
                }
            }
        };

        handler.del = function (key) {
            delete cache[key];
        }

        handler.delByPre = function (pre) {
            for (var k in cache) {
                if (k.indexOf(pre) == 0) {
                    handler.del(k);
                }
            }
        }

        handler.list = function (key, list) {
            function init(list) {
                list.save = function () {
                    handler.list(key, list);
                }
                return list;
            }
            switch (arguments.length) {
                case 1: {
                    var arr = [];
                    if (handler(key)) {
                        var list = $.parseJSON(handler(key)).data;
                        init(list);
                        return list;
                    }
                    return init(arr);
                }
                case 2: {
                    if (list instanceof Array) {
                        handler(key, $.toJSON({ data: list }));
                        return init(list);
                    } else {
                        var arr = [list];
                        handler(key, $.toJSON({ data: arr }));
                        return init(arr);
                    }
                }
            }
        }

        handler.object = function (key, obj) {
            function init(obj) {
                obj = obj || {};
                obj.save = function () {
                    handler.object(key, obj);
                    return obj;
                }
                return obj;
            }
            switch (arguments.length) {
                case 1: {
                    obj = handler(key);
                    if (!obj) {
                        return init();
                    }
                    return init($.parseJSON(obj).data);
                }
                case 2: {
                    handler(key, $.toJSON({ data: obj }));
                    return init(obj);
                }
            }
        }

        handler.localStorage = !!window.localStorage;

        return handler;
    })();
    //#endregion


    //avril.tools.queue
    avril.tools.queue = (function(){
        var queues = {};
        function Queue(name){
            this.name = name;
            var queue = [];
            var pickNext = function(){
                var task = queue[0];
                if(task ){
                    var fn =task.fn;
                    if(!task.status){
                        task.status = 'doing';
                        fn( function(){
                            task.status = 'done';
                            queue.shift();
                            pickNext();
                        });
                    }
                }
            };
            this.func = function(fn){
                queue.push({fn: wrapFn(fn) } );
                pickNext();
            };
            var wrapFn = function(fn){
                if(fn.length >0){
                    return fn;
                }
                return function(cb){
                    fn();
                    cb();
                }
            }
        }

        return function(name){
            name = name || new Date().getTime();
            return queues[name] || (queues[name] = new Queue(name));
        };

    })();
})($, avril);

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
/**
 * Created by trump.wang on 2014/6/26.
 */
;
(function ($, _evalExpression, _compiledExpression) {
    var Mvvm = avril.createlib('avril.Mvvm', function (options) {

        var config = $.extend(this.options(), options, {
                guid: avril.guid()
            })
            , self = this
            , getHash = function (key) {
                if (key) {
                    if (key instanceof  jQuery) {
                        key = key[0];
                    }
                    return 'hs_' + avril.getHash(key);
                }
                return key + '';
            }
            , guid = function () {
                return getHash({});
            }
            , binders = this.binders = {}
            , getCacheProvider = function () {
                var _c = {};
                return function (name) {
                    return function (key, value) {
                        key = getHash(key);
                        if (arguments.length == 1) {
                            return _c[name + '_' + key];
                        } else if (arguments.length == 2) {
                            return _c[name + '_' + key] = value;
                        }
                    }
                }
            }()
            , expressionCacheProvider = getCacheProvider('expression_cache')
            , binderCacheProvider = getCacheProvider('expression_cache')
            , initedElementCacheProvider = getCacheProvider('inited_element_cache')
            , htmlCacheProvider = getCacheProvider('html_template_cache')
            , expressionParsers = []
            , magics = this.magics = {
                global: {}, binders: {}
            }
            , getBinders = function ($el) {
                var binder = binderCacheProvider($el);
                if (binder) {
                    return binder;
                }
                var eachGroupId = $el.attr(binderName('each-item-group-id'));
                if (eachGroupId) {
                    binder = binderCacheProvider('group_' + eachGroupId);
                    if (binder) {
                        return binder;
                    }
                }
                binder = {};

                var el = $el[0]
                    , selectors = self.selector.split(',')
                    , attrs = avril.object.toArray(el.attributes);

                if(attrs.length == 0) {
                    binderCacheProvider('group_' + eachGroupId, binder);
                    return binder;
                }

                avril.array(attrs).each(parseNode);

                binderCacheProvider('group_' + eachGroupId, binder);

                return binder;

                function parseNode(node) {
                    if(node){
                        var selector = node.nodeName;
                        if(selectors.indexOf('['+selector+']') >= 0) {
                            var binderName = selector.replace(/\[|\]/g, '').replace(Mvvm.defaults.attr_pre + '-', '');
                            binder[binderName] = binders[binderName];
                        }
                    }
                }
            }
            , _rootScopes = {
                $root: {}
                , guid: avril.guid()
            }
            , _basicValueTypeReg = /^(true|false|null|undefined)$/
            , _expressionReg = /(\$data|\$scope|\$root)(\[\".+?\"\]|\[\'.+?\'\]|\[\d+\]|\.(\w+\d*)+)+/g
            , getSimpleReg = function () {
                return /^((\[(\d+|\".+?\"|\'.+?\')\]|\w+\d*|\$)+(\.\w+\d*)*)+$/g;
            }
            , resolveAbsNs = function (ns, relativeNs) {
                relativeNs = relativeNs || '';
                if (relativeNs.indexOf('$root') == 0) {
                    return relativeNs;
                }
                relativeNs = relativeNs.replace('$scope.', '');

                if (!getSimpleReg().test(relativeNs)) {
                    relativeNs = '';
                }

                if (relativeNs === _optName('indexChange')) {
                    ns = ns.replace(/\[\d+\]$/, '');
                }

                if (relativeNs.indexOf('$parent') < 0) {
                    return ns + '.' + relativeNs;
                }
                var nsPaths = ns.split('.');
                while (relativeNs.indexOf('$parent') == 0) {
                    nsPaths.pop();
                    relativeNs = relativeNs.replace('$parent.', '');
                }
                var pre = nsPaths.join('.');
                return pre + (/\]$/.test(pre) ? '' : '.') + relativeNs;
            }
            , findExpressionDependency = function () {
                var cache = {};
                return function (expression, onFind) {
                    expression = expression.replace(/^\s+|\s+$/g, '');
                    if (cache[expression]) {
                        return onFind ? avril.array(cache[expression]).each(onFind) : cache[expression];
                    }
                    var watchers = [], watcher;
                    var hasIndexReg = /\$index\(\s*\)/g;
                    if (hasIndexReg.test(expression)) {
                        watchers.push(watcher = _optName('indexChange'));
                    }
                    while (watcher = _expressionReg.exec(expression)) {
                        watchers.push(watcher[0]);
                        onFind && onFind(watcher[0]);
                    }
                    return cache[expression] = watchers;
                };
            }()
            , binderName = Mvvm.bindingName.bind(Mvvm)
            , binderDataName = function (bName) {
                return binderName(bName) + '-data';
            }
            , getScope = function (ns, $el, binder) {
                var data = avril.object(_rootScopes).tryGetVal(ns);
                var res = {};
                if (data && avril.isObj(data)) {
                    if (avril.isArray(data)) {
                        avril.array(data).each(function (item, index) {
                            res[index] = item;
                        });
                        res.length = data.length;
                    } else {
                        for (var k in data) {
                            res[k] = data[k];
                        }
                    }
                }

                $.extend(true, res, magics.global);

                binder && $.extend(true, res, magics.binders[binder]);

                res.$root = _rootScopes.$root
                res.$ns = ns;
                res.$el = $el;
                res.$scope = data;

                return res;
            }
            , getElScope = function ($el) {
                $el = $($el);
                return getScope(getNs($el), $el);
            }
            , parseExpression = function (expression, binder) {
                if(!expression){
                    return "";
                }
                var cacheKey = expression = expression.trim();
                if (_basicValueTypeReg.test(expression)) {
                    return expression;
                }
                if (!isNaN(expression)) {
                    return expression;
                }
                if (expressionCacheProvider(cacheKey)) {
                    return expressionCacheProvider(cacheKey);
                }
                if (binder && binders[binder] && binders[binder].expressionParser) {
                    expression = binders[binder].expressionParser(expression);
                }
                binder && expressionParsers.binders
                && expressionParsers.binders[binder]
                && avril.array(expressionParsers.binders[binder]).each(function (parser) {
                    expression = parser(expression);
                });
                avril.array(expressionParsers).each(function (parser) {
                    expression = parser(expression);
                });
                expressionCacheProvider(cacheKey, expression);
                return expression;
            }
            , executeExpression = function (expression, $el, binder) {
                expression = parseExpression(expression, binder);
                var ns = getNs($el);
                var ctx = $el.attr(binderName('each')) ? getScope(getNs($el.parent()), $el, binder) : getScope(ns, $el, binder);

                return Mvvm.executeExpression(expression, ctx);
            }
            , valueAccessor = function ($el, expression, binder) {
                return function () {
                    return executeExpression(expression, $el, binder);
                };
            }
            , _generateSelector = function () {
                return '[av],'+ avril.array(avril.object(binders).keys()).select(function (key) {
                    return '[' + Mvvm.defaults.attr_pre + '-' + key + ']'
                }).value().join(',')+',[' + Mvvm.defaults.attr_pre + '-stop]';
            }
            , binderSelector = function (name) {
                return '[' + binderName(name) + ']'
            }
            , initElement = function (el, force) {
                var $el = $(el);
                if (!Mvvm.elementExists($el)) {
                    return true;
                }
                var stopAttrSelector = '[' + binderName('stop') + ']';
                if ($el.is(stopAttrSelector) || $el.parents(stopAttrSelector).length) {
                    return true;
                }
                if (initedElementCacheProvider($el) && !force) {
                    initTextNodes($el);
                    return true;
                }

                initedElementCacheProvider($el, true);

                if (Mvvm.defaults.force_delay === false || $el.attr(binderName('delay')) === 'false') {
                    initElementBinderDependency($el);
                } else {
                    nextTick(function () {
                        Mvvm.elementExists($el) && initElementBinderDependency($el);
                    });
                }
            }
            , initElementBinderDependency = function () {
                var nsCache = {}
                    , getOldNs = function ($el) {
                        return nsCache[getHash($el)];
                    }
                    , cacheNs = function ($el, ns) {
                        nsCache[$el] = ns;
                    }
                    , removeOldSubscribe = function (subscribeChanel, $el, oldNs) {
                        avril.array(getEventChannel(subscribeChanel)).remove(function (eventObj) {
                            if (eventObj && eventObj.data && eventObj.data.$el && eventObj.data.ns) {
                                return eventObj.data.$el.is($el) && eventObj.data.ns == oldNs;
                            }
                            return false;
                        });
                    };
                return function ($el) {
                    var binders = getBinders($el);
                    var ns = getNs($el);
                    for (var bName in binders) {
                        (function (bName) {
                            var expression = $el.attr(binderName(bName));
                            var dependencies = initDependency(expression, $el, bName, ns, getOldNs($el), removeOldSubscribe);
                            binders[bName] && binders[bName].init($el, valueAccessor($el, expression, bName), {
                                expression: expression
                                , ns: ns
                                , dependencies: dependencies
                            });
                        })(bName);
                    }
                    cacheNs($el, ns);
                    initAttrNodes($el);
                    initTextNodes($el);
                }
            }()
            , initDependency = function (expression, $el, binder, ns, oldNs, removeOldSubscribe) {
                var parsedExpressionStr = parseExpression(expression);
                var counter = 0;
                var subscribeDependency = function (absNs, dependenPath) {
                    self.subscribe(absNs, function (newValue, oldValue, options) {
                        if (!Mvvm.elementExists($el)) {
                            if ($el.is(binderDataName('each-item'))) {

                            }
                            return 'removeThis';
                        }
                        if (dependenPath || (newValue != oldValue)) {
                            updateElement($el, $.extend(options, {
                                dependencies: dependenPath,
                                oldValue: oldValue,
                                newValue: newValue
                            }), binder);
                        }
                    }, {
                        binder: binder, $el: $el, ns: ns
                    });
                    Mvvm.devInfo($el, 'watch-' + binder + '-' + (counter++), absNs);
                };
                subscribeDependency(ns);
                var propArr = getPropArr(ns);
                propArr.pop();
                while(propArr.length > 1){
                    subscribeDependency( propArr.join('') );
                    propArr.pop();
                }
                var watchers = findExpressionDependency(parsedExpressionStr, function (watchPath) {
                    if (watchPath) {
                        var absNs = resolveAbsNs(binder !== 'scope' ? ns : getNs($el.parent()), watchPath);
                        subscribeDependency(absNs, watchPath);
                        if (oldNs) {
                            removeOldSubscribe(resolveAbsNs(oldNs, watchPath), $el, oldNs);
                        }
                    }
                });
                return watchers;
            }
            , updateElement = function (el, updateOptions, binder) {
                var $el = $(el);
                var binders = getBinders($el);
                var expression = $el.attr(binderName(binder));
                binders[binder].update($el, valueAccessor($el, expression, binder), $.extend(true, {}, updateOptions, {
                    expression: expression, binder: binder, ns: getNs($el)
                }));
            }
            , getExpressionNodeReg = function() { return /{{((?:.|\n)+?)}}/g; }
            , expressionNodeReg = getExpressionNodeReg()
            , getAllTextNodes = self.getAllTextNodes = function ($el) {
                var textNodes = [];
                var filterTextNode = function() {
                    var expressionNodeReg = getExpressionNodeReg();
                    if( this.nodeType == 3
                        && expressionNodeReg.test(this.nodeValue)  ) {
                        $(this).parentsUntil($el).filter(self.selector).length === 0 && textNodes.push(this);
                    }
                };

                $el.contents().each(filterTextNode);

                //the belowing might cause bad performance
                $el.find(':not('+self.selector+')').contents().each(filterTextNode);

                return textNodes;
            }
            , initTextNodes = function($el) {
                var textNodes = getAllTextNodes($el);
                avril.array(textNodes).each(function(textNode) {
                    initNode($el, textNode, textNode.nodeValue);
                });
            }
            , initNode = function($el, node, nodeValue) {
                node.nodeValue = getNodeValue(true);
                function getNodeValue(isFirstTime){
                    return nodeValue.replace(expressionNodeReg, function (expressionDefine, expression) {
                        isFirstTime && findExpressionDependency(expression, function(dependency) {
                            self.subscribe(self.resolveAbsNs(getNs($el), dependency), function() {

                                node.nodeValue = getNodeValue();
                            });
                        });
                        return valueAccessor($el, expression)();
                    });
                }
            }
            , initAttrNodes = function ($el) {
                var el = $el[0]
                    , attrs = avril.object.toArray(el.attributes)
                    , binders = getBinders($el)
                    , ignores = [
                        Mvvm.defaults.attr_pre+'-stop',
                        Mvvm.defaults.attr_pre+'-each-item',
                        Mvvm.defaults.attr_pre+'-each-item-group-id'
                    ];

                avril.array(attrs).each(function (node) {
                    var attrName = node.nodeName.replace(Mvvm.defaults.attr_pre+'-','');
                    if(node.nodeName.indexOf(Mvvm.defaults.attr_pre) === 0 && !binders[attrName] && ignores.indexOf(node.nodeName) < 0 ) {
                        initAttrNode($el, attrName, node.nodeValue);
                    }
                });
            }
            , initAttrNode = function($el, attrName, expression) {
                $el.attr( attrName, getNodeValue(true) );
                function getNodeValue(isFirstTime){
                    return expression.replace(expressionNodeReg, function (expressionDefine, expression) {
                        isFirstTime && findExpressionDependency(expression, function(dependency) {
                            self.subscribe(self.resolveAbsNs(getNs($el), dependency), function() {
                                if(!Mvvm.elementExists($el)){
                                    return 'removeThis';
                                }
                                $el.attr( attrName, getNodeValue() );
                            });
                        });
                        return valueAccessor($el, expression)();
                    });
                }
            }
            , _eventPre = 'ave_'
            , getSubscribeEvents = function () {
                var results = [];
                for (var k in avril.event.events) {
                    k.indexOf(_eventPre) === 0 && results.push(k.replace(_eventPre + '_', ''))
                }
                return results;
            }
            , getEventChannel = function (subscribePath) {
                subscribePath = _standardiseNs(subscribePath);
                return avril.event.get(subscribePath, _eventPre);
            }
            , _optName = function (opt) {
                return '__$$__' + config.guid + '__$$__' + opt;
            }
            , optEventName = function (ns, opt) {
                return ns + '.' + _optName(opt);
            }
            , getOptEventChannel = function (ns, opt) {
                return getEventChannel(optEventName(ns, opt));
            }
            , addBinderClass = function ($el, binder) {
                var css = binderName(binder) + '-css';
                $el.addClass(css);
            }
            , nextTick = function (func) {
                setTimeout(func, 1);
            }
            , bindGlobal = function () {
                var binded = false;
                return function () {
                    if (binded) {
                        return true;
                    }
                    binded = true;
                    var attrPre = Mvvm.defaults.attr_pre;
                    var mvvm = avril.mvvm;
                    $(document).on(Mvvm.defaults.trigger_events, mvvm.selector, function () {
                        var $el = $(this);
                        if ($el.is(mvvm.selector) && $el.is('input,textarea,select') && $el.attr(binderName('bind')) && getSimpleReg().test($el.attr(binderName('bind')))) {
                            var absPath = mvvm.getAbsNs($el);
                            mvvm.setVal(absPath, $el.val(), $el);
                        }
                    });
                    $('html').attr(attrPre + '-scope', '$root').addClass('av-mvvm');
                }
            }()
            , _standardiseNs = function (ns) {
                return getPropArr(ns).join('');
            }
            , getPropArr = function(ns) {
                var avObjExecPropArr = avril.object._getExecPropArr(ns);
                return avril.array(avObjExecPropArr).select(function (execArr, index) {
                    var prop = avril.object._getPropFromExecArr(execArr);
                    if (execArr[1]) {
                        return '[' + prop + ']';
                    } else if (execArr[2]) {
                        return '[\'' + prop + '\']'
                    }

                    return '[\'' + prop + '\']'
                }).value();
            }
            , _modules = {}
            ;

        this.selector = _generateSelector();

        this.addBinder = function (name, binder, expressionParser) {
            if (typeof binder == 'function') {
                binder = {
                    init: binder, update: binder
                }
            }
            if (!binder.update) {
                binder.update = function () {
                };
            }
            if (!binder.init) {
                binder.init = function () {
                };
            }
            expressionParser = expressionParser || binder.expressionParser;
            if (avril.isFunc(expressionParser)) {
                expressionParser = expressionParser.bind(binder);
            }
            binders[name] = {
                init: binder.init.bind(binder), update: binder.update.bind(binder), expressionParser: expressionParser
                , fn: binder
            };

            this.selector = _generateSelector();
        };

        this.addExpressionParser = function (parser, binder) {
            if (!binder) {
                expressionParsers.push(parser);
            } else {
                expressionParsers.binders = expressionParsers.binders || {};
                expressionParsers.binders[binder] = expressionParsers.binders[binder] || [];
                expressionParsers.binders[binder].push(parser);
            }
        };

        this.addMagic = function (name, func, binder) {
            if (!name || name.indexOf('$') != 0) {
                throw "Magic method's name should start with '$'";
            }
            if (!binder) {
                magics.global[name] = func;
            } else {
                if (!magics.binders[binder]) {
                    magics.binders[binder] = {};
                }
                magics.binders[binder][name] = func;
            }
        };

        this.module = function (ns, module, base) {
            if (arguments.length == 0) {
                return _modules;
            }
            if (arguments.length == 1) {
                var moduleDefine = avril.object(_modules).getVal(ns);
                return moduleDefine;
            }
            avril.createlibOn(_modules, ns, module, null, base);
            return this;
        };

        var _bindDom = function ($el) {

            !$el.is('html') && initElement($el);

            $el.find(self.selector).each(function (i) {
                initElement(this);
            });

        }.bind(this);

        this.bindDom = function (el, forceDelay) {
            bindGlobal();
            var $el = !el || el === document ? $('html') : $(el);

            if (forceDelay === true) {
                return nextTick(function () {
                    _bindDom($el)
                })
            } else if (forceDelay === false) {
                return _bindDom($el);
            }

            //optimise the speed
            Mvvm.defaults.force_delay === false || $el.attr(binderName('delay')) === 'false' ?
                _bindDom($el) : nextTick(function () {
                _bindDom($el)
            });
        };

        this.setVal = function (ns, value, $sourceElement, silent) {
            ns = resolveAbsNs('$root', ns);
            var oldValue = avril.object(_rootScopes).tryGetVal(ns);
            if (oldValue != value) {
                if (value) {
                    if (typeof(value) === 'string' && !isNaN(value)) {
                        value = Number(value);
                    }
                }
                avril.object(_rootScopes).setVal(ns, value);
                !silent && getEventChannel(ns)([value, oldValue, {sourceElement: $sourceElement, channel: ns}]);
            }
        };

        this.array = function (ns, $el) {
            ns = resolveAbsNs('$root', ns);
            var array = this.getVal(ns);
            if (!(array instanceof  Array)) {
                array = [];
                this.setVal(ns, array, $el);
            }
            var options = {
                    sourceElement: $el
                }
                , triggerLengthChange = function (newLength, oldLength) {
                    getEventChannel(ns + '.length')([newLength, oldLength, {sourceElement: $el, channel: ns}]);
                }
                , triggerIndexChange = function () {
                    events.indexChange([]);
                }
                , api = {
                    add: function (item) {
                        array.push(item);
                        getOptEventChannel(ns, 'add')([item, {guid: guid()}]);
                        triggerLengthChange(array.length, array.length - 1);
                    }
                    , remove: function (item) {
                        this.removeAt(array.indexOf(item));
                    }
                    , removeAt: function (index) {
                        var item = array[index];
                        avril.array(array).removeAt(index);
                        getOptEventChannel(ns, 'remove')([item, index, {guid: guid()}]);
                        triggerLengthChange(array.length, array.length - 1);
                        triggerIndexChange();
                    }
                    , concat: function (items) {
                        for (var i = 0; i++; i < items.length) {
                            array.push(items[i]);
                        }
                        getOptEventChannel(ns, 'concat')([items, {guid: guid()}]);
                        triggerLengthChange(array.length, array.length - items.length);
                    }
                }
                , events = function () {
                    var e = {}
                        , addEvent = function (opt) {
                            e[opt] = function () {
                                if (typeof arguments[0] === 'function') {
                                    getOptEventChannel(ns, opt)(arguments[0], {$el: $el, ns: ns});
                                } else {
                                    getOptEventChannel(ns, opt)(arguments[0]);
                                }
                            };
                        };
                    addEvent('indexChange');
                    for (var k in api) {
                        addEvent(k);
                    }
                    return e;
                }();

            api.events = events;

            return api;
        };

        this.getVal = function (ns) {
            ns = resolveAbsNs('$root', ns);
            return avril.object(_rootScopes).tryGetVal(ns);
        };

        this.subscribe = function (ns, func, options) {
            var nsArr = ns.split(',');
            avril.array(nsArr).each(function (scope) {
                var ctx = {
                    subscribes: nsArr
                    , subscribeStr: ns
                    , current: scope
                    , values: function (func) {
                        var values = avril.array(this.subscribes).select(function (ns) {
                            return self.getVal(ns);
                        }).value();
                        func && func.apply(this, values);
                        return values
                    }
                };
                getEventChannel(scope)(func, options, ctx);
            });
        };

        var getEachScope = function ($el) {
            $el = $($el);
            var eachScopeName = 'each-scope'
                , eachScopeBinderDataName = binderDataName(eachScopeName)
                , eachScopeBinder = $el.attr(binderName('each'));

            if (eachScopeBinder && getSimpleReg().test(eachScopeBinder)) {
                return eachScopeBinder.replace(/^\$scope(\.)?/, '');
            }

            return $el.data(eachScopeBinderDataName);
        };

        this.getNs = function ($el) {
            var fullNs = ''
                , scopeBinderName = binderName('scope')
                , scopeBinderDataName = binderDataName('scope')
                , $parents = $el.parents('[' + scopeBinderName + '],[' + binderName('each') + ']')
                , eachScope = getEachScope($el)
                , isPropVisit = function (ns) {
                    return ns.indexOf('[') === 0;
                };

            if ($el.attr(scopeBinderName)) {
                fullNs = $el.data(scopeBinderDataName) || $el.attr(scopeBinderName);
            }

            if (eachScope) {
                fullNs = eachScope;
            }

            if (fullNs.indexOf('$root.') == 0) {
                return fullNs;
            }

            $parents.each(function () {
                var $parent = $(this)
                    , eachScope = getEachScope($parent)
                    , parentNs;
                if ($parent.attr(scopeBinderName)) {
                    parentNs = ($parent.data(scopeBinderDataName) || $parent.attr(scopeBinderName));
                }

                if (eachScope) {
                    parentNs = eachScope;
                }

                if (parentNs) {
                    fullNs = parentNs + ( !isPropVisit(fullNs) && fullNs ? '.' : '' ) + fullNs;
                }


                if (fullNs.indexOf('$root') >= 0) {
                    return false;
                }
            });

            fullNs = fullNs.replace(/\.$/g, '');

            Mvvm.devInfo($el, 'scope', fullNs);

            $el.data(binderName('ns'), fullNs);

            return fullNs;
        };

        this.getElScope = getElScope;

        var getNs = this.getNs.bind(this);

        this.getAbsNs = function ($el, binder) {
            var ns = this.getNs($el);
            var relativeNs = $el.attr(binderName(binder || 'bind'));
            return resolveAbsNs(ns, relativeNs);
        };

        this.resolveAbsNs = resolveAbsNs;

        this.getRootScope = function () {
            return $.extend(true, {}, _rootScopes.$root);
        };

        var addBinder = this.addBinder.bind(this)
            , addExpressionParser = this.addExpressionParser.bind(this)
            , addMagic = this.addMagic.bind(this);

        addBinder('scope', function ($el, value, options) {
            var expression = options.expression;
            if (!getSimpleReg().test(expression)) {
                expression = parseExpression(expression);
                var executeResult = executeExpression(expression, $el.parent());
                if (typeof  executeResult !== 'string') {
                    avril.log('element', $el);
                    avril.log('expression', options.expression);
                    throw new Error('invalid scope value.', $el.selector + ':' + $el[0].outerHTML);
                }
                var dependencies = findExpressionDependency(expression);
                var scopeDataName = binderDataName('scope');
                if (dependencies && dependencies.length || !$el.data(scopeDataName)) {
                    if (executeResult !== $el.data(scopeDataName)) {
                        $el.data(scopeDataName, executeResult);
                        getNs($el, true);
                        initElement($el, true);
                        return false;
                    }
                }
            }
        });

        addBinder('module',  function($el, value, options) {
            var expression = options.expression;
            var isDynamicReg = /^\s*[\[|\{](.|\n)*?[\]|\}]\s*$/;
            var isDynamic = isDynamicReg.test(expression)
            if( isDynamic ){
                expression = value();
            } else {
                expression = expression.split(',')
            }

            if(expression.length == 0){
                return;
            }

            var ns = self.getNs($el);

            if(!isDynamic) {
                (function(){
                    var moduleNs = expression[0].trim()
                        , moduleAlia = expression[1] || 'module';

                    self.setVal(resolveAbsNs( ns ,  moduleAlia.trim() ), getModuleDefine(moduleNs));
                })();
            } else {
                (function(){
                    if(avril.isArray(expression)){
                        var moduleNs = expression[0].trim()
                            , moduleAlia = expression[1] || 'module';
                        self.setVal( resolveAbsNs( ns , moduleAlia.trim() ), getModuleDefine(moduleNs) );
                    } else if(avril.isObj(expression)){
                        for(var moduleAlia  in expression){
                            self.setVal( resolveAbsNs( ns , moduleAlia.trim() ), getModuleDefine(expression[moduleAlia]));
                        }
                    }
                })();
            }

            function getModuleDefine(moduleNs) {
                var moduleDefine = self.module(moduleNs);
                if(!moduleDefine) {
                    avril.log('binding element', $el);
                    avril.log('binding expression', options.expression);
                    throw 'Module [' + moduleNs + '] is not define';
                }
                return moduleDefine();
            }
        });

        addBinder('if', {
            init: function ($el, value) {
                value = value();
                var html = $el.html();
                htmlCacheProvider($el, html);
                if (!value) {
                    $el.html('');
                }
            }, update: function ($el, value) {
                var html = htmlCacheProvider($el);
                if (value()) {
                    $el.html(html);
                    self.bindDom($el);
                } else {
                    $el.html('');
                }
            }
        });

        addBinder('visibleIf', {
            init: function ($el, value) {
                addBinderClass($el, 'visible-if');
                binders['if'].init($el, value);
                binders.visible.init($el, value);
            }, update: function ($el, value) {
                binders['if'].update($el, value);
                binders.visible.update($el, value);
            }
        });

        addBinder('bind', function ($el, value, options) {
            if (options.sourceElement && $el.is(options.sourceElement)) {
                if ($el.is('input,select,textarea')) {
                    return false;
                }
            }
            var val = value();
            if ($el.is('input')) {
                if ($el.is(':checkbox') || $el.is(':radio')) {
                    $el.attr('checked', $el.val() === val);
                } else {
                    $el.val(val);
                }
            } else if ($el.is('textarea') || $el.is('select')) {
                $el.val(val);
            } else if (!$el.attr(binderName('text')) && !$el.attr(binderName('html'))) {
                $el.text(val);
            }
        });

        addBinder('each', {
            init: function ($el, value, options) {
                if (!htmlCacheProvider($el)) {
                    this.getTemplateSource($el).attr(binderName('stop'), 'true');
                    htmlCacheProvider($el, $el.html());
                    $el.html('')
                }
                var isSimpleExpression = getSimpleReg().test(options.expression);
                if (!isSimpleExpression) {
                    var vScope = '$root.av_' + guid();
                    var eachScope = getEachScope($el);
                    if (!eachScope) {
                        $el.data(binderDataName('each-scope'), vScope);
                        initElement($el, true);
                        return false;
                    }
                }
                this.renderItems($el, value);

                if (isSimpleExpression)
                    this.subscribeArrayEvent($el, options);
            }
            , update: function ($el, value, options) {
                if (options.sourceElement && $el.is(options.sourceElement)) {
                    return false;
                }
                $el.html(htmlCacheProvider($el));
                this.renderItems($el, value);
            }
            , subscribeArrayEvent: function ($el) {
                var binder = this;
                var ns = getNs($el);
                var arrayEvents = self.array(ns, $el).events;
                arrayEvents.add(function () {
                    binder.addItem($el, self.getVal(ns));
                });
                arrayEvents.remove(function (data, index, args) {
                    binder.removeItem($el, data, index, args);
                });
                arrayEvents.concat(function () {

                });
                arrayEvents.indexChange(function () {

                });
            }
            , renderItems: function ($el, value) {
                var items = value();
                if (!items || !(items instanceof Array)) {
                    items = [];
                }
                self.setVal(getNs($el), items, $el);
                $el.html(htmlCacheProvider($el));
                $el.data(binderName(this.itemTemplateDataName), null);
                var binder = this;
                var guid = 'guid_' + avril.guid();
                var replaceMement = '<i>' + guid + '</i>';
                var $start = this.getStart(this.getTemplateSource($el));

                var itemTemplateHtml = avril.array(
                    binder.generateItem($el).attr(binderName('scope'), '[{scope}]').toArray()
                ).select(function (o) {
                        return o.outerHTML;
                    }).value().join('');

                var itemsHtml = avril.array(items).select(function (item, index) {
                    return itemTemplateHtml.replace(/\[\{scope\}\]/g, '[' + index + ']');
                }).value().join('');

                $start.after(replaceMement);


                var currentElHtml = $el[0].innerHTML;

                $el[0].innerHTML = currentElHtml.replace(replaceMement, itemsHtml);

                self.bindDom($el, $el.attr(binderName('delay')) !== 'false');

            }
            , getStart: function ($el) {
                if ($el.length == 1) {
                    return $el;
                }
                else {
                    return $el.last();
                }
            }
            , eachItemAttrName: binderName('each-item')
            , itemTemplateDataName: 'av-each-item-template'
            , getOrgSourceEl: function ($el) {
                var itemAttrName = this.eachItemAttrName;
                var $itemTemplate = $el.children('[' + itemAttrName + '=true]');
                if ($itemTemplate.length == 0) {
                    $itemTemplate = $el.children().attr(itemAttrName, 'true');
                }
                return $itemTemplate;
            }
            , getTemplateSource: function ($el) {
                if ($el.data(binderName(this.itemTemplateDataName))) {
                    return $el.data(binderName(this.itemTemplateDataName));
                }

                var $itemTemplate = this.getOrgSourceEl($el);

                function addGroupId() {
                    $(this).attr(binderName('each-item-group-id'), getHash(this));
                }

                $itemTemplate.find(self.selector).each(addGroupId);
                addGroupId.call($itemTemplate[0]);
                $itemTemplate.filter(self.selector).each(addGroupId);

                $el.data(binderName(this.itemTemplateDataName), $itemTemplate);
                return $itemTemplate.hide();
            }
            , getLastEl: function ($el) {
                var itemAttrName = this.eachItemAttrName;
                var $itemEl = $el.children('[' + itemAttrName + '="generated"]');
                if ($itemEl.length == 0) {
                    return this.getOrgSourceEl($el);
                }
                return $itemEl.length == 1 ? $itemEl : $itemEl.last();
            }
            , getItemByDataIndex: function ($el, index) {
                return $el.children('[' + this.eachItemAttrName + '="generated"][av-scope="[' + index + ']"]');
            }
            , addItem: function ($el, array) {
                var $lastEl = this.getLastEl($el);
                var $newItem = this.generateItem($el);
                $newItem.attr(binderName('scope'), '[' + (array.length - 1) + ']');
                $lastEl.after($newItem);
                self.bindDom($newItem);
            }
            , removeItem: function ($el, data, index, args) {
                var $elToRemove = this.getItemByDataIndex($el, index)
                    , $siblings = $elToRemove.nextAll('[' + this.eachItemAttrName + '="generated"][av-scope!="[' + index + ']"]')
                    , ns = _standardiseNs(getNs($el))
                    , changeSubscribeEvents = function () {
                        var allEvents = getSubscribeEvents();
                        avril.array(allEvents).each(function (currentEventPath) {
                            if (currentEventPath.indexOf(ns) === 0) {
                                var eventPathName = currentEventPath.replace(ns, '');
                                var exec = /^\[(\d+)\]/.exec(eventPathName)
                                    , i = exec && exec[1];
                                if (exec && i !== undefined) {
                                    i = parseInt(i);
                                    if (i >= index) {
                                        var nextEventPath = eventPathName.replace('[' + i + ']', '[' + (i + 1) + ']')
                                            , nextEventName = _eventPre + '_' + ns + nextEventPath
                                            , currentEventName = _eventPre + '_' + currentEventPath
                                            , nextEvents = avril.event.events[nextEventName];
                                        if (nextEvents) {
                                            avril.event.events[currentEventName] = nextEvents;
                                        } else {
                                            delete  avril.event.events[currentEventName];
                                        }
                                    }
                                }
                            }
                        });
                    }
                    , adjustSiblingsOrder = function () {
                        $siblings.each(function () {
                            var $s = $(this);
                            var sIndex = /\[(\d+)\]/.exec($s.attr(binderName('scope')))[1] - 1;
                            $s.attr(binderName('scope'), '[' + sIndex + ']');
                        });
                    };
                $elToRemove.remove();
                !args._eventAdjusted && changeSubscribeEvents();
                args._eventAdjusted = true;
                adjustSiblingsOrder();
            }
            , generateItem: function ($el) {
                return this.getTemplateSource($el).clone()
                    .removeAttr(binderName('stop')).attr(this.eachItemAttrName, "generated")
                    .show();
            }
        });

        addBinder('text', function ($el, value) {
            $el.text(value());
        });

        addBinder('html', function ($el, value) {
            $el.html(value());
        });

        addBinder('visible', function ($el, value) {
            addBinderClass($el, 'visible');
            value() ? $el.show() : $el.hide();
        });

        addBinder('template', {
            init: function ($el, value) {
                this.render.apply(this, arguments);
            }
            , update: function ($el, value) {
                this.render.apply(this, arguments);
            }
            , render: function ($el, value, options) {
                var url = this.getTemplateUrl.apply(this, arguments);
                this.getTemplate(url, function (tmplStr) {
                    $el.html(tmplStr);
                    self.bindDom($el);
                });
            }
            , isUrl: function (url) {
                return this.urlReg.test('http://test.com' + (url.indexOf('/') === 0 ? '' : '/') + url) || this.urlReg.test(url);
            }
            , getTemplateUrl: function ($el, value, options) {
                return value() || options.expression;
            }
            , getTemplate: function (url, callback) {
                var binder = this;
                if (url.indexOf('#') === 0) {
                    return callback($(url).html());
                }
                if (this.isUrl(url)) {
                    if (this.cache[url]) {
                        return callback(this.cache[url]);
                    } else {
                        $.ajax({
                            url: url, success: function (html) {
                                binder.cache[url] = html;
                                callback(binder.cache[url])
                            }
                        });
                    }
                }
            }
            , cache: {}
            // come from https://gist.github.com/dperini/729294
            , urlReg: new RegExp(
                "^" +
                    // protocol identifier
                "(?:(?:https?|ftp)://)" +
                    // user:pass authentication
                "(?:\\S+(?::\\S*)?@)?" +
                "(?:" +
                    // IP address exclusion
                    // private & local networks
                "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
                "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
                "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
                    // IP address dotted notation octets
                    // excludes loopback network 0.0.0.0
                    // excludes reserved space >= 224.0.0.0
                    // excludes network & broacast addresses
                    // (first & last IP address of each class)
                "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                "|" +
                    // host name
                "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                    // domain name
                "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                    // TLD identifier
                "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                ")" +
                    // port number
                "(?::\\d{2,5})?" +
                    // resource path
                "(?:/\\S*)?" +
                "$", "i"
            )
        });

        addBinder('attr', function ($el, value) {
            value = value();
            $el.attr(value || {});
        });

        addBinder('style', function ($el, value) {
            $el.css(value() || {});
        });

        addBinder('css', function ($el, value) {
            value = value() || {};
            for (var k in value) {
                $el[value[k] ? 'addClass' : 'removeClass'](k);
            }
        });

        addBinder('css-str', function ($el, value) {
            $el.attr('class', value());
        });

        addBinder('func', function ($el, value) {
            var func = value();
            if (avril.isFunc(func)) {
                func($el);
            }
        }, function (expression) {
            return expression + '.bind(this)';
        });

        addBinder('event', {
            init: function ($el, value) {
                var events = value();
                if (events) {
                    for (var e in events) {
                        $el.on(e, events[e]);
                    }
                }
            }
        });

        addBinder('link', function ($el, value) {
            if ($el.is('img,iframe,script')) {
                $el.attr('src', value());
            } else if ($el.is('form')) {
                $el.attr('action', value())
            } else {
                $el.attr('href', value())
            }
        });

        avril.array('click,dblclick,mousein,mouseout,change,blur,focus,keyup,keydown,submit'.split(','))
            .each(function (eventName) {
                addBinder(eventName, {
                    init: function ($el, value) {
                        var eventFunc = value();
                        if (eventFunc) {
                            $el.on(eventName, function (e) {
                                return eventFunc(e, $el);
                            });
                        }
                    }
                });
            });

        //add try expresion parser
        addExpressionParser(function (expression) {
            var _tryReg = /\$(tryGet)\s*\(\s*([\$|\w|\'|\.|\"]+)\s*(\,\s*[\$|\w|\'|\"]+)*\s*\)/g;
            if (_tryReg.test(expression)) {
                expression = expression.replace(_tryReg, function (match, method, arg0, otherArg) {
                    otherArg = otherArg === undefined ? '' : otherArg;
                    if (arg0.indexOf('"') >= 0 || arg0.indexOf("'") >= 0) {
                        return match;
                    } else {
                        return '$' + method + '("' + arg0 + '"' + otherArg + ')';
                    }
                });
            }
            return expression;
        });

        addMagic('$tryGet', function (val, defaultValue) {
            var $scope = this;
            defaultValue = defaultValue === undefined ? '' : defaultValue;
            return avril.object($scope).tryGetVal(val) || avril.object($scope.$root).tryGetVal(val) || defaultValue;
        });

        //add $scope or $root to simple expresion
        addExpressionParser(function (expression) {
            if (getSimpleReg().test(expression) && !/^\d+/.test(expression)) {
                if (expression.indexOf('$root') == 0) {
                    return expression;
                }
                if (expression.indexOf('$scope') < 0) {
                    expression = '$scope.' + expression;
                }
            }
            return expression;
        });

        addMagic('$guid', function () {
            return 'av_guid' + avril.guid().replace(/_/g, '');
        });

        addMagic('$randomScope', function () {
            return '$root.rdm' + avril.guid().replace(/_/g, '');
        });

        addMagic('$parent', function (selector) {
            var $parent = selector ? this.$el.parents(selector).first()
                : this.$el.parents(binderSelector('scope')).first();

            return getElScope($parent);
        });

        addMagic('$setVal', function (relativePath, val) {
            self.setVal(resolveAbsNs(this.$ns, relativePath), val);
            return val;
        });

        addMagic('$avArray', function (ns) {
            if (arguments.length === 0) {
                ns = this.$ns;
            } else {
                ns = resolveAbsNs(this.$ns, ns);
            }
            return self.array(ns, this.$el);
        });

        addMagic('$index', function () {
            var $el = this.$el;

            while (!$el.is('[' + binderName('each-item') + ']') && $el.length && !$el.is('body')) {
                $el = $el.parent();
            }

            if ($el.length) {
                var scopeIndex = $el.attr(binderName('scope'));
                var groupItems = $el.parent().children('[' + binderName('scope') + '="' + scopeIndex + '"]');
                var allSiblings = $el.parent().children('[' + binderName('each-item') + '="generated"]');
                if (groupItems.length == 1) {
                    return allSiblings.index($el);
                } else if (groupItems.length > 1) {
                    return allSiblings.index(groupItems.first()) / groupItems.length;
                }
            }

            return 0;
        });

        addMagic('$clone', function (obj) {
            return $.extend(true, {}, obj);
        });

        addMagic('$remoteScope', function (remoteAddress, scopeNs) {

            var scopeNs = scopeNs || 'remote' + avril.guid()
                , status = {
                    loading: 'loading'
                    , success: 'success'
                    , failed: 'failed'
                };

            scopeNs = self.resolveAbsNs(this.$ns, scopeNs);

            var setStatus = function (status) {
                self.setVal(scopeNs + '.status', status);
            };

            var setData = function (data) {
                self.setVal(scopeNs + '.res', data);
            };

            var loadData = function () {
                setStatus(status.loading);
                $.ajax({
                    url: remoteAddress
                    , success: function (res) {
                        setStatus(status.success);
                        setData(res);
                    }
                    , error: function () {
                        setStatus(status.failed);
                    }
                });
            };

            loadData();

            self.setVal(scopeNs + '.reload', loadData);

            return scopeNs;
        });

    });

    Mvvm.defaults = {
        attr_pre: 'av',
        show_error: false,
        trigger_events: 'change keyup',
        show_dev_info: false,
        use_text_expression: false,
        force_delay: true
    };

    Mvvm.bindingName = function (name) {
        return this.defaults.attr_pre + '-' + name;
    };

    Mvvm.devInfo = function ($el, name, info) {
        this.defaults.show_dev_info && $el.attr(this.bindingName(name) + '-dev', info);
    };

    Mvvm.elementExists = function ($el) {
        return $el.parents('html').length > 0 || $el.is('html');
    };

    Mvvm.executeExpression = function (expression, ctx) {
        //return _evalExpression.call(ctx,expression);
        return _compiledExpression(expression).call(ctx);
    };

    avril.mvvm = avril.Mvvm();

})(window.jQuery
    , function (expression) {
        with (this) {
            try {
                return eval('(' + expression + ')');
            } catch (E) {
                if (avril.Mvvm.defaults.show_error === true) {
                    throw E;
                }
                if (avril.Mvvm.defaults.errorHandler) {
                    avril.Mvvm.defaults.errorHandler(E);
                }
            }
        }
        return '';
    }
    , function () {
        var cache = {};
        return function (expression) {
            if (cache[expression]) {
                return cache[expression];
            }
            try {
                return cache[expression] = new Function(
                    'with (this){\n\
        try{\n\
            return ' + expression + ';\n\
    } catch (E){\n\
        if(avril.Mvvm.defaults.show_error === true){\n\
            throw E;\n\
        }\n\
        if(avril.Mvvm.defaults.errorHandler){\n\
            avril.Mvvm.defaults.errorHandler(E);\n\
        }\n\
        return \'\';\n\
    \n}\
\n}'
                );
            } catch (E) {
                return cache[expression] = function () {
                };
            }
        }
    }());
