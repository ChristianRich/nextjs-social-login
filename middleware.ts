import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// https://stackoverflow.com/questions/71036865/how-to-modify-request-headers-in-next-js
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    //pathname.startsWith("/_next") || // exclude Next.js internals
    !pathname.startsWith("/api") || // include all API routes
    pathname.startsWith("/api/auth")
    //pathname.startsWith("/static") // exclude static files
  ) {
    return NextResponse.next();
  }

  const apiKey = getApiKey(pathname);

  if (!apiKey) {
    return NextResponse.next();
  }

  // Clone the request headers and set a new header
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-api-key", apiKey);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;

  // Tip! Set a new response header `x-hello-from-middleware2`
  // response.headers.set("x-hello-from-middleware2", "hello");
}

const getApiKey = (pathname: string): string => {
  let apiKey;

  if (pathname.startsWith("/api/user-api") && process.env.USER_API_KEY) {
    apiKey = process.env.USER_API_KEY;
  }

  // TODO Implement e-commerce
  if (
    pathname.startsWith("/api/e-commerce-api") &&
    process.env.E_COMMERCE_API_KEY
  ) {
    apiKey = process.env.E_COMMERCE_API_KEY;
  }

  return apiKey;
};
