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

export type ModuleRoute<P extends {} = {}, S extends {} = {}, H extends {} = {}> = {
  pathData: P;
  searchData: S;
  hashData: H;
};
export type DeepPartial<T> = {[P in keyof T]?: DeepPartial<T[P]>};

export type CarefulExtend<T, U> = T extends undefined ? undefined : T & U;

export type PickOptions<T> = Pick<T, {[K in keyof T]-?: {} extends {[P in K]: T[K]} ? K : never}[keyof T]>;

export type PickOptions2<T> = Pick<T, {[K in keyof T]-?: T[K] extends Exclude<T[K], undefined> ? never : K}[keyof T]>;

export declare interface ValidationRule {
  /** validation error message */
  message?: string;
  /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
  type?: string;
  /** indicates whether field is required */
  required?: boolean;
  /** treat required fields that only contain whitespace as errors */
  whitespace?: boolean;
  /** validate the exact length of a field */
  len?: number;
  /** validate the min length of a field */
  min?: number;
  /** validate the max length of a field */
  max?: number;
  /** validate the value from a list of possible values */
  enum?: string | string[];
  /** validate from a regular expression */
  pattern?: RegExp;
  /** transform a value before validation */
  transform?: (value: any) => any;
  /** custom validate function (Note: callback must be called) */
  validator?: (rule: any, value: any, callback: any, source?: any, options?: any) => any;
}

export interface GetFieldDecoratorOptions {
  /** 子节点的值的属性，如 Checkbox 的是 'checked' */
  valuePropName?: string;
  /** 子节点的初始值，类型、可选值均由子节点决定 */
  initialValue?: any;
  /** 收集子节点的值的时机 */
  trigger?: string;
  /** 可以把 onChange 的参数转化为控件的值，例如 DatePicker 可设为：(date, dateString) => dateString */
  getValueFromEvent?: (...args: any[]) => any;
  /** 校验子节点值的时机 */
  validateTrigger?: string | string[];
  /** 校验规则，参见 [async-validator](https://github.com/yiminghe/async-validator) */
  rules?: ValidationRule[];
  /** 是否和其他控件互斥，特别用于 Radio 单选控件 */
  exclusive?: boolean;
  /** Normalize value to form component */
  normalize?: (value: any, prevValue: any, allValues: any) => any;
  /** Whether stop validate on first rule of error for this field.  */
  validateFirst?: boolean;
}
export interface RCForm {
  form: {
    validateFields<V>(callback: (errors: {[field: string]: string}, values: V) => void): void;
    getFieldError(field: string): string[];
    getFieldProps(id: string, options?: GetFieldDecoratorOptions): {[key: string]: any};
  };
}
