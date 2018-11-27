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
