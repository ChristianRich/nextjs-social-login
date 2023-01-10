import axios, { type AxiosError } from "axios";
import createError from "http-errors";
import { HttpError } from "http-errors";
import { NODE_ENV } from "../../constants";

/**
 * Transform a variety of Error constructs to a well-formatted HttpError
 * @param { Error | AxiosError | HttpError | string | unknown} error
 * @param { boolean=} expose
 * @returns { HttpError }
 */
export const toHttpError = (
  error: Error | AxiosError | HttpError | string | unknown,
  expose: boolean = process.env.NODE_ENV !== NODE_ENV.PRD
): HttpError => {
  // Pass through
  if (error instanceof HttpError) {
    return error;
  }

  const e: HttpError = createError();

  if (axios.isAxiosError(error)) {
    const { name, message, stack, response } = error;

    e.name = name;
    e.message = message;

    if (expose) {
      e.stack = stack;
    }

    if (response) {
      const { status, statusText, data = {} } = response;
      e.status = e.statusCode = status;
      e.message = data?.message ? data.message : `${statusText}: ${message}`;
      return e;
    }
  }

  if (error instanceof Error) {
    const { name, message, stack } = error;

    e.name = name;
    e.message = message;
    e.status = e.statusCode = 500;

    if (expose) {
      e.stack = stack;
    }

    return e;
  }

  // Fallback
  e.status = e.statusCode = 500;
  e.name = "Error";
  e.message = typeof error === "string" ? error : "Internal Server Error";

  return e;
};
