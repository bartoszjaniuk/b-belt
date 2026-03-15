// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CamelizedProperty<T> = T extends any
  ? T extends (infer U)[]
    ? U extends object
      ? Camelized<U>[]
      : T
    : T extends object
      ? Camelized<T>
      : T
  : never;

type SnakeToCamelCase<S extends string> = S extends `${infer P1}_${infer P2}${infer P3}`
  ? `${P1}${Uppercase<P2>}${SnakeToCamelCase<P3>}`
  : S;

export type Camelized<T> = {
  [K in keyof T as SnakeToCamelCase<string & K>]: CamelizedProperty<T[K]>;
};

export type ConvertableObject = Record<
  string,
  string | number | boolean | null | undefined | object
>;

interface Options {
  separator?: string | undefined;
  split?: RegExp | undefined;
  process?: Processor | undefined;
}
type Processor = (key: string, convert: ProcessorParameter, options?: Options) => string;

type ProcessorFn = (convert: ProcessorParameter, options?: OptionOrProcessor) => ProcessorParameter;

type ProcessorParameter = (key: string, options?: Options) => string;

export type OptionOrProcessor = Options | Processor;

const toString = Object.prototype.toString;

export const _isNumerical = (obj: string | number): obj is number => {
  obj = Number(obj) - 0;
  return obj === obj;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _isFunction = (obj: unknown): obj is () => any => {
  return typeof obj === "function";
};

const _isObject = (obj: unknown): boolean => {
  return obj === Object(obj);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _isArray = (obj: unknown): obj is any[] => {
  return toString.call(obj) == "[object Array]";
};

const _isDate = (obj: unknown): obj is Date => {
  return toString.call(obj) == "[object Date]";
};

const _isRegExp = (obj: unknown): obj is RegExp => {
  return toString.call(obj) == "[object RegExp]";
};

const _isBoolean = (obj: unknown): obj is boolean => {
  return toString.call(obj) == "[object Boolean]";
};

export const _processor: ProcessorFn = (convert, options) => {
  const callback = options && "process" in options ? options.process : options;

  if (typeof callback !== "function") {
    return convert;
  }

  return (string, callbackOptions) => {
    return callback(string, convert, callbackOptions);
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProcessedKeys = any[] | ConvertableObject;

export const _processKeys = (
  convert: ProcessorParameter,
  obj: ConvertableObject,
  options?: OptionOrProcessor
): ProcessedKeys => {
  if (!_isObject(obj) || _isDate(obj) || _isRegExp(obj) || _isBoolean(obj) || _isFunction(obj)) {
    return obj;
  }

  let output,
    i = 0,
    l = 0;

  if (_isArray(obj)) {
    output = [];
    for (l = obj.length; i < l; i++) {
      output.push(_processKeys(convert, obj[i], options));
    }
  } else {
    output = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        output[convert(key, options)] = _processKeys(
          convert,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          obj[key],
          options
        );
      }
    }
  }
  return output;
};
