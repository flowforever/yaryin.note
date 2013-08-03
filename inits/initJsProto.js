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
        return str && str.indexOf && str.indexOf('=>') > 0;
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
            } else {
                return eval('(' + funcStr + ')');
            }



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
            return typeof (func) === 'function';
        }

        function parseFuncLambda(func) {
            return isFunc(func) ?
                func :
                (isLambda(func) ? func.lambda() : undefined);
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
            if (isFunc(func)) {
                return this.where(func).first();
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
            func = parseFuncLambda(func);
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