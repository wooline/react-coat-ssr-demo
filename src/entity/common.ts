export interface ErrorType<Code = any, Detail = null> {
  code: Code;
  message: string;
  detail?: Detail;
}
export type Error_NotFound = ErrorType<"404 notFound">;

export interface DefaultResult<Data = any, Error extends ErrorType = ErrorType> {
  data: Data;
  error: Error | null;
}
export type CarefulExtend<T, U> = T extends undefined ? undefined : T & U;

export type PickOptional<T> = Pick<T, {[K in keyof T]-?: {} extends {[P in K]: T[K]} ? K : never}[keyof T]>;

export type PickOptional2<T> = Pick<T, {[K in keyof T]-?: T[K] extends Exclude<T[K], undefined> ? never : K}[keyof T]>;
