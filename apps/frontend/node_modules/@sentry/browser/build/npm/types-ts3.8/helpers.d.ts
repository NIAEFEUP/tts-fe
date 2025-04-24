import { Mechanism, WrappedFunction } from '@sentry/core';
export declare const WINDOW: import("@sentry/core").InternalGlobal & Window;
/**
 * @hidden
 */
export declare function shouldIgnoreOnError(): boolean;
/**
 * @hidden
 */
export declare function ignoreNextOnError(): void;
type WrappableFunction = Function;
export declare function wrap<T extends WrappableFunction>(fn: T, options?: {
    mechanism?: Mechanism;
}): WrappedFunction<T>;
export declare function wrap<NonFunction>(fn: NonFunction, options?: {
    mechanism?: Mechanism;
}): NonFunction;
export {};
//# sourceMappingURL=helpers.d.ts.map
