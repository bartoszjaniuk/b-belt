import { isScreamingCase } from "./isScreamingCase";
import {
  type Camelized,
  type OptionOrProcessor,
  _isNumerical,
  _processKeys,
  _processor,
} from "./keyTransformations";

const camelize = (string: string) => {
  if (_isNumerical(string) || isScreamingCase(string)) {
    return string;
  }
  string = string.replaceAll(/[-_\s]+(.)?/g, (_match, chr?: string) => {
    return chr ? chr.toUpperCase() : "";
  });
  // Ensure 1st char is always lowercase
  return string.substr(0, 1).toLowerCase() + string.substr(1);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const camelizeKeys = <T extends Record<string, any>>(
  object: T,
  options?: OptionOrProcessor
): Camelized<T> => {
  return _processKeys(_processor(camelize, options), object, options) as Camelized<T>;
};
