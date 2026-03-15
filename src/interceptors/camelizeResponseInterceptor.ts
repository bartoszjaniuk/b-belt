import type { AxiosHeaders, AxiosResponse } from "axios";

import { camelizeKeys } from "../utils/camelizeKeys";

const regex = /application\/[^+]*[+]?(json);?.*/;

const isJSONContentType = (headers: AxiosHeaders) => regex.test(headers["content-type"]);

export const camelizeResponseInterceptor = (response: AxiosResponse) => {
  console.log("Hell from camelizeResponseInterceptor");

  if (!response.data || !isJSONContentType((response.headers as AxiosHeaders) ?? {})) {
    return response;
  }

  const convertedResponse = { ...response };
  convertedResponse.data = camelizeKeys(response.data);
  return convertedResponse;
};
