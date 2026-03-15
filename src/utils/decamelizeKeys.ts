import { type ConvertableObject, _processKeys, _processor } from "./keyTransformations";

interface Options {
  separator?: string;
  split?: RegExp;
}

const separateWords = (string: string, options?: Options): string => {
  const { separator = "_", split = /(?=[A-Z])/ } = options ?? {};

  return string.split(split).join(separator);
};

const decamelize = (input: string, options?: Options): string => {
  return separateWords(input, options).toLowerCase();
};

export const decamelizeKeys = (object: ConvertableObject, options?: Options) => {
  return _processKeys(_processor(decamelize, options), object, options);
};
