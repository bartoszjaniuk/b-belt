import { type InternalAxiosRequestConfig } from "axios";
import { snakeCaseKeys } from "../utils/snakeCaseKeys";

export const snakeCaseQueryParamsInterceptor = (request: InternalAxiosRequestConfig) => {
  const requestParams = request.params;

  if (!requestParams) return request;

  request.params = snakeCaseKeys(requestParams);
  return request;
};
