// middleware.ts (or middleware/index.ts)
import { authMiddleware } from "@repo/auth/proxy";
import { internationalizationMiddleware } from "@repo/internationalization/proxy"; // ← we'll assume this is fixed or replaced
import { parseError } from "@repo/observability/error";
import { secure } from "@repo/security";
import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from "@repo/security/proxy";
import { createNEMO } from "@rescale/nemo";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

// ───────────────────────────────────────────────
//  CONFIG
// ───────────────────────────────────────────────
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|ingest|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

// ───────────────────────────────────────────────
//  SECURITY HEADERS
// ───────────────────────────────────────────────
const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

// ───────────────────────────────────────────────
//  ARCJET BOT PROTECTION
// ───────────────────────────────────────────────
const arcjetMiddleware = async (request: NextRequest) => {
  if (!env.ARCJET_KEY) return NextResponse.next();

  try {
    await secure(
      [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
        "CATEGORY:MONITOR",
      ],
      request
    );
    return NextResponse.next();
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 403 });
  }
};

// ───────────────────────────────────────────────
//  SAFE INTERNATIONALIZATION MIDDLEWARE
// ───────────────────────────────────────────────
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher"; // or use your own matcher

// Define your supported locales and default
const locales = ["en", "fr", "es", "de"]; // ← CHANGE THIS to your actual supported locales
const defaultLocale = "en";

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");

  if (!acceptLanguage || acceptLanguage === "*") {
    return defaultLocale;
  }

  const negotiatorHeaders: Record<string, string> = {
    "accept-language": acceptLanguage,
  };

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // Handle wildcard or empty case
  if (languages.length === 0 || (languages.length === 1 && languages[0] === "*")) {
    return defaultLocale;
  }

  // Match against supported locales
  try {
    const bestMatch = match(languages, locales, defaultLocale);
    return bestMatch;
  } catch (err) {
    console.error("Locale matching failed:", err);
    return defaultLocale;
  }
}

// Replacement / fixed version of internationalizationMiddleware
const safeI18nMiddleware = async (request: NextRequest) => {
  const locale = getLocale(request);

  // You can store locale in headers, cookies, rewrite URL, etc.
  // Most common patterns:

  // Option 1: Add to request headers (popular with next-intl)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-detected-locale", locale);

  // Option 2: Rewrite to /en/... or /fr/... etc (if using sub-path routing)
  // if (request.nextUrl.pathname === "/" || !request.nextUrl.pathname.startsWith(`/${locale}`)) {
  //   return NextResponse.rewrite(
  //     new URL(`/${locale}${request.nextUrl.pathname}`, request.url)
  //   );
  // }

  // For most setups — just pass through with header
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
};

// ───────────────────────────────────────────────
//  COMPOSE MIDDLEWARE WITH NEMO
// ───────────────────────────────────────────────
const composedMiddleware = createNEMO(
  {},
  {
    before: [safeI18nMiddleware, arcjetMiddleware],
  }
);

// ───────────────────────────────────────────────
//  FINAL MIDDLEWARE (with Clerk)
// ───────────────────────────────────────────────
export default authMiddleware(async (_auth, request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // 1. Bypass for webhooks
  if (pathname.startsWith("/api/webhooks")) {
    return NextResponse.next();
  }

  // 2. Apply security headers
  const headersResponse = securityHeaders();

  // 3. Run composed middleware (i18n + arcjet)
  const middlewareResponse = await composedMiddleware(request, {});

  // Return the most specific response
  return middlewareResponse || headersResponse;
}) as any; // Type assertion — common with Clerk + custom middleware