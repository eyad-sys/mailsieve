// MailSieve — Cloudflare Worker entry. Routes: paid API (/v1/*, via Rapid),
// public demo (/demo/check), landing page and programmatic SEO pages.
import { checkEmail, checkDomainStatic, lookupMx, DOMAIN_RE, DISPOSABLE_SORTED } from "./validate.js";
import { landingPage, domainPage, listPage, notFoundPage, sitemap, robots } from "./pages.js";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "cache-control": "no-store",
};
const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body, null, 2), { status, headers: { ...JSON_HEADERS, ...extra } });
const html = (body, status = 200, maxAge = 86400) =>
  new Response(body, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": `public, max-age=${maxAge}`,
      "x-content-type-options": "nosniff",
    },
  });
const fail = (status, code, message) => json({ error: { code, message } }, status);

// Best-effort per-isolate limiter for the free public demo (10 checks / minute / IP).
const hits = new Map();
function demoAllowed(ip) {
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
  const h = hits.get(ip);
  if (!h || now > h.reset) { hits.set(ip, { n: 1, reset: now + 60_000 }); return true; }
  return ++h.n <= 10;
}

// Only requests that came through Rapid's gateway carry the proxy secret.
function authorize(request, env) {
  if (!env.RAPIDAPI_PROXY_SECRET) return fail(503, "not_configured", "API is not configured yet.");
  const got = request.headers.get("x-rapidapi-proxy-secret") || "";
  const want = env.RAPIDAPI_PROXY_SECRET;
  let diff = got.length ^ want.length;
  for (let i = 0; i < want.length; i++) diff |= (got.charCodeAt(i) || 0) ^ want.charCodeAt(i);
  return diff === 0 ? null : fail(401, "unauthorized", "Subscribe and call this API through the Rapid marketplace.");
}

async function api(request, env, url) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { ...JSON_HEADERS, "access-control-allow-headers": "*", "access-control-allow-methods": "GET,POST,OPTIONS" } });
  }
  const denied = authorize(request, env);
  if (denied) return denied;

  if (url.pathname === "/v1/check" && request.method === "GET") {
    const email = url.searchParams.get("email");
    if (!email) return fail(400, "missing_email", "Add ?email=someone@example.com");
    return json(await checkEmail(email));
  }

  if (url.pathname === "/v1/domain" && request.method === "GET") {
    const domain = (url.searchParams.get("domain") || "").trim().toLowerCase();
    if (!DOMAIN_RE.test(domain)) return fail(400, "invalid_domain", "Add ?domain=example.com");
    return json({ ...checkDomainStatic(domain), mx: await lookupMx(domain) });
  }

  if (url.pathname === "/v1/bulk" && request.method === "POST") {
    const plan = (request.headers.get("x-rapidapi-subscription") || "").toUpperCase();
    if (plan === "BASIC") return fail(402, "plan_required", "Bulk checks need the Pro plan or higher.");
    let body;
    try { body = await request.json(); } catch { return fail(400, "invalid_json", "Send JSON: {\"emails\": [\"a@b.com\"]}"); }
    const emails = Array.isArray(body?.emails) ? body.emails : null;
    if (!emails || !emails.length) return fail(400, "missing_emails", "Send JSON: {\"emails\": [\"a@b.com\"]}");
    if (emails.length > 50) return fail(413, "too_many", "Send at most 50 emails per request.");
    // Free Workers allow 50 subrequests; each new domain can cost 2 DNS lookups.
    const mxCache = new Map();
    const results = [];
    for (const e of emails) {
      const domain = String(e ?? "").trim().toLowerCase().split("@").pop();
      const skipMx = !mxCache.has(domain) && mxCache.size >= 22;
      results.push(await checkEmail(e, { mxCache, skipMx }));
    }
    const count = (v) => results.filter((r) => r.verdict === v).length;
    return json({
      total: results.length,
      summary: { deliverable: count("deliverable"), risky: count("risky"), undeliverable: count("undeliverable") },
      results,
    });
  }

  return fail(404, "not_found", "Endpoints: GET /v1/check, GET /v1/domain, POST /v1/bulk");
}

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const path = url.pathname.replace(/\/+$/, "") || "/";
      const ctx = { origin: url.origin, rapidUrl: env.RAPIDAPI_URL || "" };

      if (path.startsWith("/v1")) return api(request, env, url);

      if (path === "/demo/check") {
        const ip = request.headers.get("cf-connecting-ip") || "local";
        if (!demoAllowed(ip)) return fail(429, "slow_down", "The demo allows 10 checks a minute. Get an API key for more.");
        const email = url.searchParams.get("email");
        if (!email) return fail(400, "missing_email", "Type an email address to check.");
        return json(await checkEmail(email));
      }

      if (request.method !== "GET" && request.method !== "HEAD") return fail(405, "method_not_allowed", "Use GET.");
      if (path === "/") return html(landingPage(ctx), 200, 3600);
      if (path === "/robots.txt") return new Response(robots(ctx), { headers: { "content-type": "text/plain" } });
      if (path === "/sitemap.xml") return new Response(sitemap(ctx), { headers: { "content-type": "application/xml", "cache-control": "public, max-age=86400" } });
      if (path === "/health") return json({ ok: true, disposable_domains: DISPOSABLE_SORTED.length });

      if (path === "/disposable") return html(listPage(ctx, null));
      const list = path.match(/^\/disposable\/starting-with\/([a-z0-9])$/);
      if (list) return html(listPage(ctx, list[1]));
      const dom = path.match(/^\/disposable\/([^/]+)$/);
      if (dom) {
        const domain = decodeURIComponent(dom[1]).toLowerCase();
        if (!DOMAIN_RE.test(domain)) return html(notFoundPage(ctx), 404, 300);
        return html(domainPage(ctx, domain));
      }
      return html(notFoundPage(ctx), 404, 300);
    } catch (err) {
      return fail(500, "internal_error", "Something went wrong on our side. Try again.");
    }
  },
};
