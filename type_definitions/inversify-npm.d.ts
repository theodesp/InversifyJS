// Type definitions for inversify 2.0.0-alpha.2
// Project: https://github.com/inversify/InversifyJS
// Definitions by: inversify <https://github.com/inversify>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

interface IMiddleware extends Function {
    (...args: any[]): any;
}

interface IKernelModule extends Function {
    (kernel: IKernel): void;
}

interface IKernelOptions {
    middleware?: IMiddleware[];
    modules?: IKernelModule[];
}

interface IKernelConstructor {
    new(options?: IKernelOptions): IKernel;
}

interface IKernel {
    bind<T>(runtimeIdentifier: string): IBindingToSyntax<T>;
    unbind(runtimeIdentifier: string): void;
    unbindAll(): void;
    get<Service>(runtimeIdentifier: string): Service;
    getAll<Service>(runtimeIdentifier: string): Service[];
}

interface IBindingWhenSyntax<T> {
    when(constraint: Constraint): void;
}

interface IFactoryCreator<T> extends Function {
    (context: IContext): IFactory<T>;
}

interface IProviderCreator<T> extends Function {
    (context: IContext): IProvider<T>;
}

interface IFactory<T> extends Function {
    (): T;
}

interface IProvider<T> extends Function {
    (): Promise<T>;
}

interface INewable<T> {
    new(...args: any[]): T;
}

interface IBindingToSyntax<T> {
    to(constructor: { new(...args: any[]): T; }): IBindingInSyntax<T>;
    toValue(value: T): IBindingWhenSyntax<T>;
    toConstructor<T2>(constructor: INewable<T2>): IBindingWhenSyntax<T>;
    toFactory<T2>(factory: IFactoryCreator<T2>): IBindingWhenSyntax<T>;
    toProvider<T2>(provider: IProviderCreator<T2>): IBindingWhenSyntax<T>;
}

interface IBindingInSyntax<T> {
    inTransientScope(): IBindingWhenSyntax<T>;
    inSingletonScope(): IBindingWhenSyntax<T>;
}

interface IBinding<T> {
  runtimeIdentifier: string;
  implementationType: { new(): T; };
  factory: IFactoryCreator<any>;
  provider: IProviderCreator<any>;
  cache: T;
  scope: number; // BindingScope
  type: number; // BindingType
}

interface IMetadata {
  key: string;
  value: any;
}

interface IContext {

        /// Gets the kernel that is driving the activation.
        kernel: IKernel;

        /// Gets or sets the activation plan.
        plan: IPlan;

        addPlan(plan: IPlan);
}

interface IPlan {
        parentContext: IContext;
        rootRequest: IRequest;
}

interface ITarget {
  service: IQueryableString;
  name: IQueryableString;
  metadata: Array<IMetadata>;
  isArray(): boolean;
  isNamed(): boolean;
  isTagged(): boolean;
  matchesName(name: string): boolean;
  matchesTag(name: IMetadata): boolean;
}

interface IQueryableString {
  startsWith(searchString: string): boolean;
  endsWith(searchString: string): boolean;
  contains(searchString: string): boolean;
  equals(compareString: string): boolean;
  value(): string;
}

interface IRequest {

        /// The service that was requested.
        service: string;

        /// The parent context.
        parentContext: IContext;

        /// The parent request.
        parentRequest: IRequest;

        // The child requests
        childRequests: IRequest[];

        /// Gets the target that will receive the injection, if any.
        target: ITarget;

        /// Gets the stack of bindings which have been activated by this request.
        bindings: IBinding<any>[];

        // Adds a child request to the request
        addChildRequest(
            service: string,
            bindings: (IBinding<any>|IBinding<any>[]),
            target: ITarget): IRequest;
}

declare type Constraint = (request: IRequest) => boolean;

export var Kernel: IKernelConstructor;
export function inject(...typeIdentifiers: string[]): (typeConstructor: any) => void;
