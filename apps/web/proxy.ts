import { authMiddleware } from "@repo/auth/proxy";
import { internationalizationMiddleware } from "@repo/internationalization/proxy";
import { parseError } from "@repo/observability/error";
import { secure } from "@repo/security";
import {
  noseconeOptions,
  noseconeOptionsWithToolbar,
  securityMiddleware,
} from "@repo/security/proxy";
import { createNEMO } from "@rescale/nemo";
import { type NextProxy, type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|ingest|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

const securityHeaders = env.FLAGS_SECRET
  ? securityMiddleware(noseconeOptionsWithToolbar)
  : securityMiddleware(noseconeOptions);

// --- CORRECTION : Protection contre les locales invalides ---
const safeI18nMiddleware = async (request: NextRequest, event: any) => {
  const acceptLanguage = request.headers.get("accept-language");
  
  // Si le header est vide ou bizarre (cas fréquent avec les bots), 
  // on injecte une valeur par défaut pour éviter le crash de Intl.getCanonicalLocales
  if (!acceptLanguage || acceptLanguage.includes("*")) {
    request.headers.set("accept-language", "fr-FR,fr;q=0.9,en;q=0.8");
  }

  try {
    return await internationalizationMiddleware(request, event);
  } catch (e) {
    console.error("I18n Fallback triggered:", e);
    return NextResponse.next(); // On laisse passer la requête même si l'i18n crash
  }
};

const arcjetMiddleware = async (request: NextRequest) => {
  if (!env.ARCJET_KEY) return;

  try {
    await secure(
      [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:PREVIEW",
        "CATEGORY:MONITOR",
      ],
      request
    );
  } catch (error) {
    const message = parseError(error);
    return NextResponse.json({ error: message }, { status: 403 });
  }
};

// On utilise safeI18nMiddleware à la place de internationalizationMiddleware
const composedMiddleware = createNEMO(
  {},
  {
    before: [safeI18nMiddleware, arcjetMiddleware],
  }
);

export default authMiddleware(async (_auth, request, event) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/webhooks')) {
    return NextResponse.next();
  }

  const headersResponse = securityHeaders();

  const middlewareResponse = await composedMiddleware(
    request as unknown as NextRequest,
    event
  );

  return middlewareResponse || headersResponse;
}) as unknown as NextProxy;