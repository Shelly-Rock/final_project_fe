// Note: DeepPartial is already exported from shared/utils (array.uitls.ts).
// These prefixed aliases avoid TS2308 re-export errors.
export type TDeepPartial<T> = T extends object
  ? { [K in keyof T]?: TDeepPartial<T[K]> }
  : T;

export type TDeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: TDeepReadonly<T[K]> }
  : T;

export type TDeepRequired<T> = T extends object
  ? { [K in keyof T]-?: TDeepRequired<T[K]> }
  : T;

export type TDeepNonNullable<T> = T extends object
  ? { [K in keyof T]-?: TDeepNonNullable<NonNullable<T[K]>> }
  : NonNullable<T>;

// ---------- Merge / Override ----------
export type Override<T, U> = Omit<T, keyof U> & U;
export type Merge<T, U> = Override<T, { [K in keyof T & keyof U]: U[K] }>;

// ---------- Index / Key manipulation ----------
export type OmitIndex<T> = Omit<T, keyof T[]>;
export type RequireOnly<T, K extends keyof T> = Required<Pick<T, K>> &
  Omit<T, K>;

// ---------- Async ----------
export type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;
export type AsyncReturnType<
  T extends (...args: unknown[]) => Promise<unknown>,
> = T extends (...args: unknown[]) => Promise<infer R> ? R : never;

// ---------- Function ----------
export type Parameters<T extends (...args: unknown[]) => unknown> = T extends (
  ...args: infer P
) => unknown
  ? P
  : never;

export type ReturnType<T extends (...args: unknown[]) => unknown> = T extends (
  ...args: unknown[]
) => infer R
  ? R
  : never;

// ---------- Conditional ----------
export type IsAny<T> = 0 extends 1 & T ? true : false;
export type IsNever<T> = [T] extends [never] ? true : false;
export type IsUnknown<T> =
  IsAny<T> extends false ? (unknown extends T ? true : false) : false;

// ---------- Value-of keys ----------
export type ValueOf<T> = T[keyof T];

// ---------- String helpers ----------
export type UppercaseFirst<T extends string> = T extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : T;

export type CamelToSnake<T extends string> = T extends `${infer F}${infer R}`
  ? `${F extends Capitalize<F> ? "_" : ""}${Lowercase<F>}${CamelToSnake<R>}`
  : T;

// ---------- Array ----------
export type UnwrapArray<T> = T extends Array<infer U> ? U : T;
export type IsTuple<T extends unknown[]> = number extends T["length"]
  ? false
  : true;

// ---------- Safe object access ----------
export type PathValue<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : unknown
  : P extends keyof T
    ? T[P]
    : unknown;
