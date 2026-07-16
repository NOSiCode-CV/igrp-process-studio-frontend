import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Edge-safe auth helpers for the middleware.
 *
 * `@/lib/auth` builds the full @igrp/framework-next-auth config, which does a
 * dynamic `import('next-auth')` — Node-only, and it trips Next's "no dynamic
 * code evaluation" rule when bundled into the Edge middleware. This module
 * mirrors `auth.getTokenFromRequest` / `auth.isTokenExpiredOrFailed` using only
 * `next-auth/jwt` (Edge-safe), so the middleware never imports the Node config.
 *
 * Keep the constants below in sync with framework-next-auth's config.
 */

const TOKEN_EXPIRY_GRACE_MS = 10_000;
const SESSION_COOKIE_BASENAME = "next-auth.session-token";
const SECURE_SESSION_COOKIE_BASENAME = `__Secure-${SESSION_COOKIE_BASENAME}`;

/**
 * Detect whether NextAuth wrote a secure (`__Secure-`) session cookie so
 * `getToken` reads the right one. Returns undefined when no session cookie is
 * present (let getToken use its own default).
 */
function resolveSecureCookie(request: NextRequest): boolean | undefined {
  let hasPlain = false;
  for (const cookie of request.cookies.getAll()) {
    if (cookie.name.startsWith(SECURE_SESSION_COOKIE_BASENAME)) return true;
    if (cookie.name.startsWith(SESSION_COOKIE_BASENAME)) hasPlain = true;
  }
  return hasPlain ? false : undefined;
}

export async function getTokenFromRequest(request: NextRequest) {
  const secureCookie = resolveSecureCookie(request);
  return getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET as string,
    ...(secureCookie !== undefined ? { secureCookie } : {}),
  });
}

export function isTokenExpiredOrFailed(
  token: Record<string, unknown> | null,
): boolean {
  if (!token) return true;
  const expiresAt =
    typeof token.expiresAt === "number" ? token.expiresAt : undefined;
  const isExpired =
    expiresAt !== undefined && expiresAt <= Date.now() + TOKEN_EXPIRY_GRACE_MS;
  return isExpired || token.error === "RefreshAccessTokenError";
}
