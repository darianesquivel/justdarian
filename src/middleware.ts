import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://unpkg.com",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "require-trusted-types-for 'script'",
    "trusted-types default",
    "upgrade-insecure-requests",
  ].join("; ");

  const response = await next();

  // Configurar headers de caché según el tipo de recurso
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Recursos estáticos: caché larga (1 año)
  const staticExtensions = [
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".ico",
    ".ttf",
    ".woff",
    ".woff2",
    ".eot",
    ".otf",
    ".css",
    ".js",
  ];

  const isStaticResource = staticExtensions.some((ext) =>
    pathname.toLowerCase().endsWith(ext)
  );

  if (isStaticResource) {
    // Caché de 1 año para recursos estáticos
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  } else if (pathname.endsWith(".html") || !pathname.includes(".")) {
    // HTML: sin caché o caché muy corta
    response.headers.set(
      "Cache-Control",
      "public, max-age=0, must-revalidate"
    );
  } else {
    // Otros recursos: caché moderada (1 semana)
    response.headers.set("Cache-Control", "public, max-age=604800");
  }

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  return response;
};
