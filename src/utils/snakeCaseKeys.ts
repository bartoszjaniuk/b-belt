import { snakeCase } from "change-case";

export const snakeCaseKeys = (
  params?: Record<string, unknown>
): Record<string, unknown> | undefined => {
  if (!params) {
    return;
  }

  const transformValue = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map(transformValue);
    }

    if (value !== null && typeof value === "object") {
      return snakeCaseKeys(value as Record<string, unknown>);
    }

    return value;
  };

  return Object.entries(params).reduce<Record<string, unknown>>((acc, [key, value]) => {
    acc[snakeCase(key)] = transformValue(value);
    return acc;
  }, {});
};
