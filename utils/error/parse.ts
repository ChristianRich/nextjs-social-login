import axios, { AxiosError, AxiosResponse } from "axios";
import createError from "http-errors";
import type { HttpError } from "http-errors";

export const axiosToHttpError = (
  e: Error | AxiosError | unknown,
  requestName: string // e.g 'getUser'
): HttpError => {
  if (axios.isAxiosError(e)) {
    const axiosError: AxiosError = e;
    const { message, code } = axiosError;
    const response: AxiosResponse | undefined = axiosError?.response;

    if (response) {
      const { status, statusText, data = {} } = response;

      console.error(
        `Axios request ${requestName} failed ${combine(
          statusText || message || code,
          data?.message
        )}`
      );

      return createError(status, combine(statusText, data?.message));
    } else {
      console.error(
        `Axios request ${requestName} failed: ${combine(code, message)}`
      );
      return createError(500, combine(code, message));
    }
  }

  if (e instanceof Error) {
    return createError(500, e.message);
  }

  return createError(500, "Internal Server Error");
};

export const combine = (
  a?: string,
  b?: string,
  delimiter: string = ": "
): string => {
  if (a && b) {
    return `${a}${delimiter}${b}`;
  }

  if (a) {
    return a;
  }

  if (b) {
    return b;
  }

  return "";
};
