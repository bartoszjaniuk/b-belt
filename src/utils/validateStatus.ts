export const validateStatus = (status: number) =>
	(status >= 200 && status < 300) || status === 304;
