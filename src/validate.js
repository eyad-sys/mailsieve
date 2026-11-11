// MailSieve core: syntax, disposable, role, free-provider, typo and MX checks.
import DISPOSABLE_LIST from "./data/disposable.json" with { type: "json" };

export const DISPOSABLE = new Set(DISPOSABLE_LIST);
export const DISPOSABLE_SORTED = DISPOSABLE_LIST;

const FREE = new Set([
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.uk", "yahoo.fr", "ymail.com",
  "outlook.com", "hotmail.com", "hotmail.co.uk", "hotmail.fr", "live.com", "msn.com",
  "icloud.com", "me.com", "mac.com", "aol.com", "proton.me", "protonmail.com",
  "gmx.com", "gmx.de", "gmx.net", "web.de", "mail.com", "zoho.com", "yandex.com",
  "yandex.ru", "mail.ru", "qq.com", "163.com", "126.com", "naver.com", "fastmail.com",
  "tutanota.com", "tuta.com", "hey.com", "pm.me",
]);

const ROLES = new Set([
  "admin", "administrator", "info", "contact", "support", "help", "sales", "billing",
  "accounts", "hello", "team", "office", "marketing", "press", "media", "jobs", "careers",
  "hr", "noreply", "no-reply", "donotreply", "postmaster", "webmaster", "hostmaster",
  "abuse", "security", "privacy", "legal", "newsletter", "enquiries", "inquiries",
]);

const TYPO_TARGETS = [
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com",
  "aol.com", "live.com", "protonmail.com", "proton.me", "gmx.com",
];

const SYNTAX = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
export const DOMAIN_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

function distance(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

export function suggestDomain(domain) {
  if (FREE.has(domain) || DISPOSABLE.has(domain)) return null;
  let best = null, bestD = 3;
  for (const t of TYPO_TARGETS) {
    const d = distance(domain, t);
    if (d > 0 && d < bestD) { best = t; bestD = d; }
  }
  return best;
}

export function isDisposable(domain) {
  // Match the domain itself or any parent (inbox.mailinator.com -> mailinator.com).
  const parts = domain.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    if (DISPOSABLE.has(parts.slice(i).join("."))) return true;
  }
  return false;
}

async function doh(name, type) {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`;
  const res = await fetch(url, {
    headers: { accept: "application/dns-json" },
    signal: AbortSignal.timeout(2500),
    cf: { cacheTtl: 3600, cacheEverything: true },
  });
  if (!res.ok) throw new Error(`dns ${res.status}`);
  return res.json();
}

/** Returns { status: "found" | "a_record_only" | "none" | "unknown", records: string[] } */
export async function lookupMx(domain) {
  try {
    const mx = await doh(domain, "MX");
    if (mx.Status === 3) return { status: "none", records: [] }; // NXDOMAIN
    const records = (mx.Answer || [])
      .filter((a) => a.type === 15)
      .map((a) => {
        const [prio, host] = a.data.split(" ");
        return { prio: Number(prio), host: (host || "").replace(/\.$/, "").toLowerCase() };
      })
      .filter((r) => r.host) // drops the RFC 7505 "null MX" (host ".")
      .sort((a, b) => a.prio - b.prio)
      .map((r) => r.host);
    if (records.length) return { status: "found", records: records.slice(0, 5) };
    if ((mx.Answer || []).some((a) => a.type === 15)) return { status: "none", records: [] }; // null MX
    const a = await doh(domain, "A");
    if ((a.Answer || []).some((r) => r.type === 1)) return { status: "a_record_only", records: [] };
    return { status: "none", records: [] };
  } catch {
    return { status: "unknown", records: [] };
  }
}

export function checkDomainStatic(domain) {
  return {
    domain,
    disposable: isDisposable(domain),
    free_provider: FREE.has(domain),
    did_you_mean: suggestDomain(domain),
  };
}

/** Full check. Pass a shared `mxCache` Map to dedupe lookups in bulk calls; `skipMx` to avoid DNS. */
export async function checkEmail(raw, { mxCache, skipMx = false } = {}) {
  const email = String(raw ?? "").trim().toLowerCase();
  const out = {
    email,
    valid_syntax: false,
    local: null,
    domain: null,
    disposable: false,
    role_account: false,
    free_provider: false,
    plus_tag: false,
    did_you_mean: null,
    mx: { status: "unknown", records: [] },
    score: 0,
    verdict: "undeliverable",
    reasons: [],
  };
  if (email.length > 254 || !SYNTAX.test(email) || email.indexOf("@") > 64) {
    out.reasons.push("invalid_syntax");
    return out;
  }
  const at = email.lastIndexOf("@");
  const local = email.slice(0, at), domain = email.slice(at + 1);
  const s = checkDomainStatic(domain);
  Object.assign(out, {
    valid_syntax: true, local, domain,
    disposable: s.disposable,
    free_provider: s.free_provider,
    role_account: ROLES.has(local.split("+")[0]),
    plus_tag: local.includes("+"),
    did_you_mean: s.did_you_mean ? `${local}@${s.did_you_mean}` : null,
  });

  if (!skipMx) {
    if (mxCache?.has(domain)) out.mx = await mxCache.get(domain);
    else {
      const p = lookupMx(domain);
      mxCache?.set(domain, p);
      out.mx = await p;
    }
  }

  let score = 100;
  if (out.mx.status === "none") { score = 0; out.reasons.push("domain_cannot_receive_mail"); }
  if (out.mx.status === "unknown") { score -= 30; out.reasons.push("mx_lookup_unavailable"); }
  if (out.mx.status === "a_record_only") { score -= 25; out.reasons.push("no_mx_record_a_fallback"); }
  if (out.disposable) { score = Math.min(score, 5); out.reasons.push("disposable_domain"); }
  if (out.role_account) { score -= 20; out.reasons.push("role_account"); }
  if (out.did_you_mean) { score -= 35; out.reasons.push("possible_typo"); }
  out.score = Math.max(0, score);
  out.verdict = out.score >= 70 ? "deliverable" : out.score >= 30 ? "risky" : "undeliverable";
  return out;
}
