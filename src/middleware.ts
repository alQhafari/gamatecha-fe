import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export default auth((req) => {
  const currentPathname = req.nextUrl.pathname;
  const authorizedFallbackUrl = process.env.FALLBACK_AUTHORIZED_URL_PATH;
  const unauthorizedFallbackUrl = process.env.FALLBACK_UNAUTHORIZED_URL_PATH;

  const pathsRequiringAuth = [authorizedFallbackUrl].filter(
    (path): path is string => typeof path === "string"
  );
  const pathsRequiringNoAuth = [unauthorizedFallbackUrl].filter(
    (path): path is string => typeof path === "string"
  );

  if (
    pathsRequiringAuth.some((path) => currentPathname.startsWith(path)) &&
    !req.auth
  ) {
    if (!unauthorizedFallbackUrl) {
      throw new Error("FALLBACK_UNAUTHORIZED_URL_PATH is not defined");
    }
    return NextResponse.redirect(new URL(unauthorizedFallbackUrl, req.url));
  }

  if (
    pathsRequiringNoAuth.some((path) => currentPathname.startsWith(path)) &&
    req.auth
  ) {
    if (!authorizedFallbackUrl) {
      throw new Error("FALLBACK_AUTHORIZED_URL_PATH is not defined");
    }
    return NextResponse.redirect(new URL(authorizedFallbackUrl, req.url));
  }

  return NextResponse.next();
});

/**
 * The config object is optional and can be exported as seen below.
 * It allows you to configure the middleware.
 * In this case, middleware will be executed for every request that does not match the following paths:
 * - /api/*
 * - /_next/static/*
 * - /_next/image/*
 * - /favicon.ico
 * Reference: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
