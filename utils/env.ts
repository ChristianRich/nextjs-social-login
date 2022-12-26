import { omitBy } from "lodash";
import createError from "http-errors";
import type { Config } from "../constants";

// Centralised and safe point of accessing `process.env` variables
export const getConfig = (
  key: Config | string,
  isRequired = true,
  fallbackValue?: string
): string | undefined => {
  const value: string | undefined = process.env[String(key)];

  if (!value?.length) {
    const message = `Configuration error: '${key}' is required`;

    if (isRequired) {
      throw createError(500, message);
    }
    // eslint-disable-next-line no-console
    console.warn(
      `Configuration warning: Optional key '${key}' accessed, but not present in runtime config. Fallback value: ${fallbackValue}`
    );
    return fallbackValue || undefined;
  }
  return value;
};

// *** SECURITY WARNING ***
export const getEnvVars = (
  env: NodeJS.ProcessEnv = process.env
): Record<string, string> =>
  omitBy(env, (_v, k) => k.startsWith("npm") || k.startsWith("_"));
