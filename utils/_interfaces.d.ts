///<reference path="./_references.d.ts"/>
interface IDisposable {
	dispose(): void;
}

interface IDictionary<T> {
	[key: string]: T
}

interface ICommandOptions {
	disableAnalytics?: boolean;
	enableHooks?: boolean;
}

interface ICommandParameter {
	mandatory: boolean;
	validate(value: string, errorMessage?: string): IFuture<boolean>;
}

interface Function {
	future<T>(...args: any[]): IFutureFactory<T>;
}


interface ICommandArgument { }

interface IFuture<T> {
	detach(): void;
	get(): T;
	isResolved (): boolean;
	proxy<U>(future: IFuture<U>): void;
	proxyErrors(future: IFuture<any>): IFuture<T>;
	proxyErrors(futureList: IFuture<any>[]): IFuture<T>;
	resolver(): Function;
	resolve(fn: (err: any, result?: T) => void): void;
	resolveSuccess(fn: (result: T) => void): void;
	return(result?: T): void;
	throw(error: any): void;
	wait(): T;
}

interface IFutureFactory<T> {
	(): IFuture<T>;
}


interface ICommand extends ICommandOptions {
	execute(args: string[]): IFuture<void>;
	allowedParameters: ICommandParameter[];

	// Implement this method in cases when you want to have your own logic for validation. In case you do not implement it,
	// the command will be evaluated from CommandsService's canExecuteCommand method.
	// One possible case where you can use this method is when you have two commandParameters, neither of them is mandatory,
	// but at least one of them is required. Used in prop|add, prop|set, etc. commands as their logic is complicated and
	// default validation in CommandsService is not applicable.
	canExecute?(args: string[]): IFuture<boolean>;
	completionData?: string[];
}

interface IInjector extends IDisposable {
	require(name: string, file: string): void;
	require(names: string[], file: string): void;
	requireCommand(name: string, file: string): void;
	requireCommand(names: string[], file: string): void;
	/**
	 * Resolves an implementation by constructor function.
	 * The injector will create new instances for every call.
	 */
	resolve(ctor: Function, ctorArguments?: { [key: string]: any }): any;
	/**
	 * Resolves an implementation by name.
	 * The injector will create only one instance per name and return the same instance on subsequent calls.
	 */
	resolve(name: string, ctorArguments?: IDictionary<any>): any;
	resolveCommand(name: string): ICommand;
	register(name: string, resolver: any, shared?: boolean): void;
	registerCommand(name: string, resolver: any): void;
	registerCommand(names: string[], resolver: any): void;
	getRegisteredCommandsNames(includeDev: boolean): string[];
	dynamicCallRegex: RegExp;
	dynamicCall(call: string, args?: any[]): IFuture<any>;
	isDefaultCommand(commandName: string): boolean;
	isValidHierarchicalCommand(commandName: string, commandArguments: string[]): boolean;
	getChildrenCommandsNames(commandName: string): string[];
	buildHierarchicalCommand(parentCommandName: string, commandLineArguments: string[]): any;
}

declare var $injector: IInjector;