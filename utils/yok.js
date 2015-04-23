///<reference path="./_references.d.ts"/>
///<reference path="./_interfaces.d.ts"/>
//--- begin part copied from AngularJS
//The MIT License
//
//Copyright (c) 2010-2012 Google, Inc. http://angularjs.org
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//	The above copyright notice and this permission notice shall be included in
//all copies or substantial portions of the Software.
//
//	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//THE SOFTWARE.
var FN_NAME_AND_ARGS = /^function\s*([^\(]*)\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
function annotate(fn) {
    var $inject, fnText, argDecl;
    if (typeof fn == 'function') {
        if (!($inject = fn.$inject)) {
            $inject = { args: [], name: "" };
            fnText = fn.toString().replace(STRIP_COMMENTS, '');
            argDecl = fnText.match(FN_NAME_AND_ARGS);
            $inject.name = argDecl[1];
            if (fn.length) {
                argDecl[2].split(FN_ARG_SPLIT).forEach(function (arg) {
                    arg.replace(FN_ARG, function (all, underscore, name) { return $inject.args.push(name); });
                });
            }
            fn.$inject = $inject;
        }
    }
    return $inject;
}
//--- end part copied from AngularJS
var util = require("util");
var assert = require("assert");
var Future = require("fibers/future");
var path = require("path");
var indent = "";
function trace(formatStr) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    formatStr = indent + formatStr;
    args.unshift(formatStr);
    // uncomment following line when debugging dependency injection
    //console.log(util.format.apply(null, args));
}
function pushIndent() {
    indent += "  ";
}
function popIndent() {
    indent = indent.slice(0, -2);
}
var _ = require('loadash');
function forEachName(names, action) {
    if (_.isString(names)) {
        action(names);
    }
    else {
        names.forEach(action);
    }
}
var Yok = (function () {
    function Yok() {
        this.COMMANDS_NAMESPACE = "commands";
        this.modules = {};
        this.resolutionProgress = {};
        this.hierarchicalCommands = {};
        this.register("injector", this);
    }
    Yok.prototype.requireCommand = function (names, file) {
        var _this = this;
        forEachName(names, function (commandName) {
            var commands = commandName.split("|");
            if (commands.length > 1) {
                if (_.startsWith(commands[1], '*') && _this.modules[_this.createCommandName(commands[0])]) {
                    throw new Error("Default commands should be required before child commands");
                }
                var parentCommandName = commands[0];
                if (!_this.hierarchicalCommands[parentCommandName]) {
                    _this.hierarchicalCommands[parentCommandName] = [];
                }
                _this.hierarchicalCommands[parentCommandName].push(_.rest(commands).join("|"));
            }
            if (commands.length > 1 && !_this.modules[_this.createCommandName(commands[0])]) {
                _this.require(_this.createCommandName(commands[0]), file);
            }
            else {
                _this.require(_this.createCommandName(commandName), file);
            }
        });
    };
    Yok.prototype.require = function (names, file) {
        var _this = this;
        forEachName(names, function (name) { return _this.requireOne(name, file); });
    };
    Yok.prototype.requireOne = function (name, file) {
        var dependency = {
            require: path.join("../", file),
            shared: true
        };
        if (!this.modules[name]) {
            this.modules[name] = dependency;
        }
        else {
            throw new Error(util.format("module '%s' require'd twice.", name));
        }
    };
    Yok.prototype.registerCommand = function (names, resolver) {
        var _this = this;
        forEachName(names, function (name) {
            var commands = name.split("|");
            _this.register(_this.createCommandName(name), resolver);
            if (commands.length > 1) {
                _this.createHierarchicalCommand(commands[0]);
            }
        });
    };
    Yok.prototype.getDefaultCommand = function (name) {
        var subCommands = this.hierarchicalCommands[name];
        var defaultCommand = _.find(subCommands, function (command) { return _.startsWith(command, "*"); });
        return defaultCommand;
    };
    Yok.prototype.isValidCommand = function (name) {
        var allCommands = this.getRegisteredCommandsNames(true);
        return _.contains(allCommands, name);
    };
    Yok.prototype.buildHierarchicalCommand = function (parentCommandName, commandLineArguments) {
        var _this = this;
        var subCommandName;
        var subCommands = this.hierarchicalCommands[parentCommandName];
        var remainingArguments = commandLineArguments;
        var foundSubCommand = false;
        _.each(commandLineArguments, function (arg) {
            subCommandName = subCommandName ? _this.getHierarchicalCommandName(subCommandName, arg) : arg;
            remainingArguments = _.rest(remainingArguments);
            if (_.any(subCommands, function (sc) { return sc === subCommandName; })) {
                foundSubCommand = true;
                return false;
            }
            else if (_.any(subCommands, function (sc) { return sc === "*" + subCommandName; })) {
                subCommandName = "*" + subCommandName;
                foundSubCommand = true;
                return false;
            }
        });
        if (foundSubCommand) {
            return { commandName: this.getHierarchicalCommandName(parentCommandName, subCommandName), remainingArguments: remainingArguments };
        }
        return undefined;
    };
    Yok.prototype.createHierarchicalCommand = function (name) {
        var _this = this;
        var factory = function () {
            return {
                execute: function (args) {
                    return (function () {
                        var commandsService = $injector.resolve("commandsService");
                        var commandName = null;
                        var defaultCommand = _this.getDefaultCommand(name);
                        var commandArguments = [];
                        var allowedParams;
                        if (args.length > 0) {
                            var hierarchicalCommand = _this.buildHierarchicalCommand(name, args);
                            if (hierarchicalCommand) {
                                commandName = hierarchicalCommand.commandName;
                                commandArguments = hierarchicalCommand.remainingArguments;
                            }
                            else {
                                commandName = defaultCommand ? _this.getHierarchicalCommandName(name, defaultCommand) : "help";
                                // If we'll execute the default command, but it's full name had been written by the user
                                // for example "appbuilder cloud list", we have to remove the "list" option from the arguments that we'll pass to the command.
                                if (_.contains(_this.hierarchicalCommands[name], "*" + args[0])) {
                                    commandArguments = _.rest(args);
                                }
                                else {
                                    commandArguments = args;
                                }
                            }
                        }
                        else {
                            //Execute only default command without arguments
                            if (defaultCommand) {
                                commandName = _this.getHierarchicalCommandName(name, defaultCommand);
                            }
                            else {
                                commandName = "help";
                            }
                        }
                        commandsService.tryExecuteCommand(commandName, commandName === "help" ? [name] : commandArguments).wait();
                    }).future()();
                }
            };
        };
        $injector.registerCommand(name, factory);
    };
    Yok.prototype.getHierarchicalCommandName = function (parentCommandName, subCommandName) {
        return [parentCommandName, subCommandName].join("|");
    };
    Yok.prototype.isValidHierarchicalCommand = function (commandName, commandArguments) {
        if (_.contains(Object.keys(this.hierarchicalCommands), commandName)) {
            if (!commandArguments || commandArguments.length === 0) {
                // Will execute default command as there aren't passed arguments.
                return true;
            }
            var subCommands = this.hierarchicalCommands[commandName];
            if (subCommands) {
                var fullCommandName = this.buildHierarchicalCommand(commandName, commandArguments);
                var hasSubCommand = fullCommandName !== undefined;
                if (!fullCommandName) {
                    // The passed arguments are not one of the subCommands.
                    // Check if the default command accepts arguments - if no, return false;
                    var defaultCommandName = this.getDefaultCommand(commandName);
                    var defaultCommand = this.resolveCommand(util.format("%s|%s", commandName, defaultCommandName));
                    if (defaultCommand && defaultCommand.allowedParameters.length > 0) {
                        return true;
                    }
                    else {
                        var errors = $injector.resolve("errors");
                        errors.fail("The input is not valid sub-command for '%s' command", commandName);
                    }
                }
                return true;
            }
        }
        return false;
    };
    Yok.prototype.isDefaultCommand = function (commandName) {
        return commandName.indexOf("*") > 0 && commandName.indexOf("|") > 0;
    };
    Yok.prototype.register = function (name, resolver, shared) {
        if (shared === void 0) { shared = true; }
        trace("registered '%s'", name);
        var dependency = this.modules[name] || {};
        dependency.shared = shared;
        if (_.isFunction(resolver)) {
            dependency.resolver = resolver;
        }
        else {
            dependency.instance = resolver;
        }
        this.modules[name] = dependency;
    };
    Yok.prototype.resolveCommand = function (name) {
        var command;
        var commandModuleName = this.createCommandName(name);
        if (!this.modules[commandModuleName]) {
            return null;
        }
        command = this.resolve(commandModuleName);
        return command;
    };
    Yok.prototype.resolve = function (param, ctorArguments) {
        if (_.isFunction(param)) {
            return this.resolveConstructor(param, ctorArguments);
        }
        else {
            return this.resolveByName(param, ctorArguments);
        }
    };
    Object.defineProperty(Yok.prototype, "dynamicCallRegex", {
        /* Regex to match dynamic calls in the following format:
         #{moduleName.functionName} or
         #{moduleName.functionName(param1)} or
         #{moduleName.functionName(param1, param2)} - multiple parameters separated with comma are supported
         Check dynamicCall method for sample usage of this regular expression and see how to determine the passed parameters
         */
        get: function () {
            return /#{([^.]+)\.([^}]+?)(\((.+)\))*}/;
        },
        enumerable: true,
        configurable: true
    });
    Yok.prototype.dynamicCall = function (call, args) {
        var _this = this;
        return (function () {
            var parsed = call.match(_this.dynamicCallRegex);
            var module = _this.resolve(parsed[1]);
            if (!args && parsed[3]) {
                args = _.map(parsed[4].split(","), function (arg) { return arg.trim(); });
            }
            var data = module[parsed[2]].apply(module, args);
            if (data && typeof data.wait === "function") {
                return data.wait();
            }
            return data;
        }).future()();
    };
    Yok.prototype.resolveConstructor = function (ctor, ctorArguments) {
        var _this = this;
        annotate(ctor);
        var resolvedArgs = ctor.$inject.args.map(function (paramName) {
            if (ctorArguments && ctorArguments.hasOwnProperty(paramName)) {
                return ctorArguments[paramName];
            }
            else {
                return _this.resolve(paramName);
            }
        });
        var name = ctor.$inject.name;
        if (name && name[0] === name[0].toUpperCase()) {
            function EmptyCtor() {
            }
            EmptyCtor.prototype = ctor.prototype;
            var obj = new EmptyCtor();
            ctor.apply(obj, resolvedArgs);
            return obj;
        }
        else {
            return ctor.apply(null, resolvedArgs);
        }
    };
    Yok.prototype.resolveByName = function (name, ctorArguments) {
        if (name[0] === "$") {
            name = name.substr(1);
        }
        if (this.resolutionProgress[name]) {
            throw new Error(util.format("cyclic dependency detected on dependency '%s'", name));
        }
        this.resolutionProgress[name] = true;
        trace("resolving '%s'", name);
        pushIndent();
        try {
            var dependency = this.resolveDependency(name);
            if (!dependency) {
                throw new Error("unable to resolve " + name);
            }
            if (!dependency.instance || !dependency.shared) {
                if (!dependency.resolver) {
                    throw new Error("no resolver registered for " + name);
                }
                dependency.instance = this.resolveConstructor(dependency.resolver, ctorArguments);
            }
        }
        finally {
            popIndent();
            delete this.resolutionProgress[name];
        }
        return dependency.instance;
    };
    Yok.prototype.resolveDependency = function (name) {
        var module = this.modules[name];
        if (!module) {
            throw new Error("unable to resolve " + name);
        }
        if (module.require) {
            require(module.require);
        }
        return module;
    };
    Yok.prototype.getRegisteredCommandsNames = function (includeDev) {
        var _this = this;
        var modulesNames = _.keys(this.modules);
        var commandsNames = _.filter(modulesNames, function (moduleName) { return _.startsWith(moduleName, util.format("%s.", _this.COMMANDS_NAMESPACE)); });
        var commands = _.map(commandsNames, function (commandName) { return commandName.substr(_this.COMMANDS_NAMESPACE.length + 1); });
        if (!includeDev) {
            commands = _.reject(commands, function (command) { return _.startsWith(command, "dev-"); });
        }
        return commands;
    };
    Yok.prototype.getChildrenCommandsNames = function (commandName) {
        return this.hierarchicalCommands[commandName];
    };
    Yok.prototype.createCommandName = function (name) {
        return util.format("%s.%s", this.COMMANDS_NAMESPACE, name);
    };
    Yok.prototype.dispose = function () {
        var _this = this;
        Object.keys(this.modules).forEach(function (moduleName) {
            var instance = _this.modules[moduleName].instance;
            if (instance && instance.dispose && instance !== _this) {
                instance.dispose();
            }
        });
    };
    return Yok;
})();
exports.Yok = Yok;
exports.injector = new Yok();
//# sourceMappingURL=yok.js.map