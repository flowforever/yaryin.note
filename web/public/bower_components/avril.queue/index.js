/**
 * Created by trump on 14-11-22.
 */
(function() {

    var guid = function(){
            return Date.now() + '_' + parseInt( 10000 * Math.random() )
        }
        , isFunction = function(obj) {
            return typeof obj === 'function';
        }
        , isArray= function (obj) {
            return obj instanceof Array;
        }
        , _counter = 0
        , nameId = function(name){
            return [name ,  guid(), ++_counter].join('-');
        }
        , simpleCounter = function(total,callback){
            if(!(this instanceof  simpleCounter)){
                return new simpleCounter(total,callback);
            }

            var _total = total;
            var _count = 1;
            var _execResult = [];
            this.count = function(){
                _execResult.push(arguments);
                if(_count == _total){
                    callback( _execResult );
                }
                _count++;
            };
        }
        , isAwaitData = function ( $awaitData ) {
            return $awaitData instanceof  $AwaitData;
        }
        , getRootId = function(queue){
            return queue._pids[0] || queue.id;
        };

    function $AwaitData(queue, key) {
        var self = this;
        var error
            , getRealResult = function($awaitObj) {
                if($awaitObj instanceof $AwaitData){
                    var result = $awaitObj.result();
                    for(var k in result){
                        result[k] = getRealResult(result[k]);
                    }
                    return result;
                }
                return $awaitObj;
            };

        this.key = key;
        this.queue = queue;
        this.isDone = false;

        this.error = function(err){
            this.queue.error(err);
            if(arguments.length == 1){
                error = err;
            }else{
                return error;
            }
        };

        this.result = function(value) {
            if(arguments.length == 1){
                this.queue.data(this.key, value);
                this.isDone = true;
            }
            return this.queue.data(this.key);
        };

        this.realResult = function(){
            return getRealResult(this);
        };

        //alias
        this.conver = this.convert = this.cast = function(valueConverFunc) {
            var key = nameId('anonymous-data-');
            var $anonymousData = new $AwaitData(this.queue, key);
            valueConverFunc = valueConverFunc || function($org){ return $org.result(); }
            var counter = 0;
            var orgResultMethod = $anonymousData.result;

            $anonymousData.result = function() {
                if(counter++ == 0){
                    orgResultMethod.call($anonymousData, valueConverFunc(self) )
                }
                return orgResultMethod.apply($anonymousData, arguments);
            }

            return $anonymousData;
        }

        this.onReady = function (cb) {
            var self = this;
            if(this.isDone) { 
                cb( this.result() ) 
            } else {
                this.queue.func(function() {
                    cb( self.result() );
                });
            }
        }

    }

    function Queue(options) {
        if(!(this instanceof  Queue)){
            return new Queue(options);
        }

        options = typeof options !== 'object'? {} : options;

        var self = this
            , name = typeof options === 'object'? options.name : options
            , queue = []
            , parallers = []
            , data = {}
            , getArgArray = function(arg){
                return Array.prototype.slice.call(arg);
            }
            , _currentTask
            , _stop = false
            , needResolve = function($awaitData, currentQueue) {
                return isAwaitData($awaitData)
                    && !$awaitData.isDone
                    && getRootId($awaitData.queue) != getRootId(currentQueue || self);
            }
            ;

        var getLastParalWrapper = function(){
            return parallers[parallers.length - 1];
        };
        var breakParal = function(){
            parallers.push(null);
            parallers = [];
        };
        var pickNext = function(){
            var task = queue[0];
            if(task){
                task.id = nameId('task');
                var fn =task.fn;
                if(!task.status){
                    _currentTask = task;
                    task.status = 'doing';
                    var subQueue = new Queue();
                    subQueue.parent = self;
                    subQueue._pids = self._pids.length? self._pids.join(',').split(',') : [];
                    subQueue._pids.push(self.id);
					subQueue._pid = self.id;
                    var _next = function() {
                        if(task.status === 'done' || task.stop){
                            return false;
                        }
                        task.status = 'done';
                        queue.shift();
                        if(subQueue.length()>0){
                            subQueue.func(pickNext);
                        }else{
                            pickNext();
                        }
                    };
                    if(!task.paralId){
                        !_stop && fn.call(subQueue, _next, task);
                    }else{
                        var counter = simpleCounter(fn.length, _next);
                        for(var i=0; i< fn.length;i++){
                            wrapFn(fn[i]).call(subQueue,function(){ !_stop && !task.stop && counter.count() }, task );
                        }
                    }
                }
            }else{
                _currentTask = null;
            }
        };
        var wrapFn = function(fn){
            if(fn.length >0){
                return fn;
            }
            return function(cb){
                fn.call(this);
                cb();
            }
        };

        this.id = nameId('q');

        this.name = name || this.id;

        this._pids = [];

        this.getCurrentTask = function() {
            return _currentTask;
        };

        this.func = this.next = function(fn) {
            _stop = false;
            var paralWraper = getLastParalWrapper();
            if(paralWraper){
                paralWraper.exec();
            }
            if(arguments.length == 1 && isFunction(fn)){
                queue.push({ fn: wrapFn(fn) } );
            } else if(arguments.length == 1 && isArray(fn)){
                queue.push({ fn: fn, paralId: nameId('paral') });
            } else if( arguments.length > 1){
                // param calls
                queue.push({ fn: arguments, paralId: nameId('paral') })
            }
            pickNext();
            return this;
        };

        this.stop = function() {
            _stop = true;
            queue.forEach(function(task){
               task.stop = true;
            });
            //clear current queue
            queue.splice(0);
        };

        this.error = function(err) {
            if(arguments.length == 0){
                return this._error;
            }
            if(err){
                this._error = err;
                this.onError();
            }
        };

        var _onError = function() {
            this.parent && this.parent.error(this._error);
        };

        this.onError = function(handler){
            if(arguments.length == 1){
                _onError = handler;
            }else{
                 _onError.call(this);
            }
        };

        this.insertFunc = function(currentTask, func) {
            if(arguments.length == 1){
                func = currentTask;
                currentTask = this.getCurrentTask();
            }
            var currentIndex = 0;
            for(; currentIndex < queue.length && queue[currentIndex].id != currentTask.id; currentIndex++);
            if(!queue[currentIndex]) {
                return this.func(func);
            }
            queue[currentIndex].insertCounter = queue[currentIndex].insertCounter || 0;
            queue[currentIndex].insertCounter++;
            queue.splice(currentIndex + queue[currentIndex].insertCounter,0,{ fn: wrapFn(func) });
            return this;
        };

        this.paralFunc = function(fn){
			var q = this;
            var parallerWrapper = getLastParalWrapper();

            if(!parallerWrapper){
                parallerWrapper = {
                    paralFunc: function(fn){
                        if(!fn || arguments.length == 0){
                            return this;
                        }
                        this.fnArr.push(fn);
                        return this;
                    }
                    , fnArr:[]
                    , exec: function() {
                        breakParal();
                        self.func(this.fnArr);
                        return self;
                    }
                    , func: function(){
                        this.exec();
                        return q.func.apply(q,arguments);
                    }
                };
                parallers.push(parallerWrapper);
            }

            return parallerWrapper.paralFunc(fn);
        };

        this.exec = function(){
            return this;
        };

        this.data = function(key, value) {
            switch (arguments.length){
                case 0: return data;
                case 1: return data[key];
                case 2: data[key] = value; break;
            }
            return this;
        };

        this.length = function(){
           return queue.length;
        };

        this.ensure = function(key, value){
            if(this.data(key) === undefined){
                this.data(key, value);
            }
            return this;
        };

        var cbFactory = function(isParal, hasReturn){
            return function ( /* asyncCall ,args..., fn */ ) {
                var self = this
                    , argArr = getArgArray(arguments)
                    , hasCtx = argArr.length >= 3 && isFunction(argArr[1])
                    , ctx = hasCtx && argArr[0]
                    , asyncCall = hasCtx ? argArr[1] : argArr[0]
                    , lastArg = argArr[argArr.length - 1]
                    , hasFn = isFunction(lastArg)
                    , fn = hasFn ? lastArg : function() { return arguments[0]; }
                    , asyncArgs = argArr.splice( hasCtx? 2: 1, argArr.length - ( (hasCtx? 3 : 2) - (hasFn? 0 : 1) ))
                    , $anonymousAwait = hasReturn ? self.$awaitData( nameId('anonymous-data-') + (fn.name||'') ) : null;

                (isParal? this.paralFunc: this.func)(function(next) {
                    var subQueue = this;

                    asyncArgs.forEach(function(arg){
                        if( needResolve(arg, subQueue) ){
                            subQueue.func(function(next){
                                arg.queue.func(function(){
                                    next();
                                });
                            });
                        }
                    });

                    asyncArgs.push(function(){

                        var asyncResArgs = getArgArray(arguments).map(function(arg){
                            if(arg instanceof $AwaitData){
                                return arg.result();
                            }
                            return arg;
                        });

                        var asyncHasCallback = (asyncResArgs.length+1) < fn.length;

                        asyncResArgs.push(asyncArgs);

                        if(asyncHasCallback) {
                            asyncResArgs.push(next);
                        }

                        var result = fn.apply(subQueue, asyncResArgs);

                        hasReturn && $anonymousAwait.result( result === undefined ? arguments : result );

                        !asyncHasCallback && next();

                    });

                    asyncCall.apply(ctx, asyncArgs);
                });

                return $anonymousAwait;

            };
        };

        var eachCbFactory = function(isParal, hasReturn){
            return function(asyncCall , eachArgs, fn) {
                var ctx
                    , standardiseArg = function(arg){
                        if(arg instanceof  Array) {
                            return arg;
                        }
                        if(typeof (arg) != 'string' && arg && arg.length >= 0){
                            return getArgArray( arg );
                        }
                        return [arg];
                    }
                    , $waitList = hasReturn ? self.$awaitData( nameId('anonymous-data')  ) : null;
                if(arguments.length == 4){
                    ctx = arguments[0];
                    asyncCall = arguments[1];
                    eachArgs = arguments[2];
                    fn = arguments[3];
                }

                this.func(function(next) {
                    if( needResolve(eachArgs, this) ){
                        eachArgs.queue.func(function(){
                            next();
                        });
                    }else{
                        next();
                    }
                });
				
				this.func(function(next) {
					
					if(eachArgs instanceof $AwaitData){
						eachArgs = eachArgs.result();
					}

					var subQueue = this;
					
					var $list = isArray(eachArgs) && eachArgs.map(function(arg) {
						var asyncArgs = standardiseArg(arg);
						asyncArgs.splice(0, 0, asyncCall);
						ctx && asyncArgs.splice(0, 0, ctx);
						asyncArgs.push(fn);
						return subQueue[ (hasReturn ? '$' : '') + (isParal? 'paralAwait' : 'await')].apply(subQueue, asyncArgs);
					});

                    hasReturn && $waitList.result($list||[]);

                    isArray(eachArgs) && eachArgs.length && subQueue.func(function(){ next() });

				});

                return hasReturn? $waitList : null;
            };
        };

        var awaitData = {};

        this.$awaitData = function(key, value) {
            this.data.apply(this, arguments);
            if(awaitData[key]) {
                return awaitData[key];
            } else {
                awaitData[key] = new $AwaitData(this, key);
            }
            if(arguments.length == 2){
                awaitData[key].result(value);
            }
			return  awaitData[key];
        };

        var booleanFactory = function(isOrMethod) {
            return function(){
                var q = new Queue();
                var $result = q.$awaitData('boolean-result');
                var result;
                var needToGoFurther = true;
                var args = arguments;
                for(var i=0; i < arguments.length; i++) {
                    needToGoFurther && (function(data, index){
                        var isLast = index == (args.length - 1);
                        if(isAwaitData(data)){
                            q.func(function(next){
                                if(!needToGoFurther){
                                    return next();
                                }
                                data.onReady(function(res){
                                    next();
                                    setValue(res, isLast);
                                });
                            });
                        } else {
                            q.func(function(){
                                setValue(data, isLast);
                            });
                        }
                    })(arguments[i], i);
                }
                if(q.length() == 0) {
                    if(needToGoFurther){
                        appendNext();
                    }
                }

                function setValue(data, isLast){

                    if(isOrMethod){
                        if(data) {
                            result = data;
                            needToGoFurther = false;
                            appendNext();
                        }
                    } else {
                        if(!data) {
                            result = false;
                            needToGoFurther = false;
                            appendNext();
                        } else {
                            result = data;
                        }
                    }

                    if(needToGoFurther && isLast){
                        needToGoFurther = false;
                        appendNext();
                    }
                    
                }
                function appendNext(){
                    q.insertFunc(function(){
                        $result.result(result);
                    })
                }
                return $result;
            }
        };
        this.$or = booleanFactory(true);
        this.$and = booleanFactory(false);

        this.await = cbFactory(false, false);

        this.$await = cbFactory(false, true);

        this.paralAwait = cbFactory(true, false);

        this.$paralAwait = cbFactory(true, true);

        this.each = eachCbFactory(false, false);

        this.$each = eachCbFactory(false, true);

        this.paralEach = eachCbFactory(true, false);

        this.$paralEach = eachCbFactory(true, true);

        var $ifType = function(queue, $awaitData) {
            var trueFn , falseFn , $preAwaitData = [];
            this._setPreAwaitData = function($awaitData){
                $preAwaitData.push($awaitData);
                return this;
            };
            this.$true = function(fn){
                if(trueFn){ throw new Error('$if: could not set trueFn twice') }
                if(fn){ trueFn = fn; }
                return this;
            };
            this.$false = function(fn){
                if(falseFn){ throw new Error('$if: could not set falseFn twice') }
                if(fn) { falseFn = fn; }
                return this;
            };
            this.$else = function(fn) {
                return this.$false(fn);
            };
            this.$elseIf = function($otherAwait, fn) {
                 return self.$if($otherAwait, fn)._setPreAwaitData($awaitData);
            };
            queue.func(function() {
                var preIsFalse = $preAwaitData.filter(function($data){
                    return ($data instanceof $AwaitData) ? $data.result() : $data;
                }).length == 0;

                if(!preIsFalse){
                    return true;
                }

                var res = ($awaitData instanceof $AwaitData) ? $awaitData.result() : $awaitData;
                if(res){
                    trueFn && trueFn.apply(this);
                }else{
                    falseFn && falseFn.apply(this);
                }
            });
        };

        this.$if = function($awaitData, trueFn, falseFn) {
            return new $ifType(this, $awaitData).$true(trueFn).$false(falseFn);
        };

        //await result from standard callback
        var standardAwaitMethod = function(method) {
            return function(){
                var args = getArgArray(arguments);
                args.push(function(err, res){
                    this.error(err);
                    return res;
                });
                return self['$'+method].apply(this, args);
            }
        };

        this.$$await = standardAwaitMethod('await');
        this.$$paralAwait = standardAwaitMethod('paralAwait');
        this.$$each = standardAwaitMethod('each');
        this.$$paralEach = standardAwaitMethod('paralEach');

        var resolveFactory = function(isParal) {
            return function () {
                var args = getArgArray(arguments);
                var lastFn = args[args.length - 1];
                if(isFunction(lastFn)){
                    args.pop();
                }
                args.forEach(function(arg) {
                    if(needResolve(arg, self)){
                        self[isParal? 'paralFunc' : 'func'](function(next){
                            arg.queue.func(function(){
                                next();
                            }).onError(function(error){
                                self.error(error);
                            })
                        });
                    }
                });
                if(isFunction(lastFn)){
                    self.func(function(){
                        lastFn.apply(self, args);
                    });
                }
                return self;
            }
        };
        this.resolve = resolveFactory();
        this.paralResolve = resolveFactory(true);

    }

    Queue.$AwaitData = $AwaitData;

    Queue.simpleCounter = simpleCounter;


    // add browser support
    var globalScope = (typeof global !== 'undefined' && (typeof window === 'undefined' || window === global.window)) ? global : this;
    if((typeof module !== 'undefined' && module && module.exports)){
        module.exports =  Queue;
    } else if(typeof define === 'function' && define.amd){
        define(function(){
            return Queue;
        })
    } else {
        globalScope.avQ = Queue;
    }
}).call(this);