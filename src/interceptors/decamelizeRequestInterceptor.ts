import { decamelizeKeys } from "../utils/decamelizeKeys";
import { type AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

const isFormDataRequest = (headers?: AxiosHeaders) =>
	headers?.["Content-Type"] === "application/x-www-form-urlencoded";

export const decamelizeRequestInterceptor = (
	request: InternalAxiosRequestConfig,
) => {
	if (!request.data || isFormDataRequest(request.headers)) {
		return request;
	}

	const convertedRequest = { ...request };
	convertedRequest.data = decamelizeKeys(request.data);
	return convertedRequest;
};
