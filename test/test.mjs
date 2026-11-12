// Offline smoke test: mocks DNS, then exercises every route. Run: node test/test.mjs
import assert from "node:assert/strict";

const MX = { "mailinator.com": ["10 mail.mailinator.com."], "gmail.com": ["5 gmail-smtp-in.l.google.com."], "github.com": ["1 aspmx.l.google.com."], "outlok.com": ["10 mx.example.net."], "gmaill.com": ["10 mx.example.net."], "yahooo.com": ["10 mx.example.net."], "gmail.co": ["10 mx.example.net."] };
globalThis.fetch = async (url) => {
  const u = new URL(url);
  const name = u.searchParams.get("name"), type = u.searchParams.get("type");
  if (name === "nxdomain-example.dev") return Response.json({ Status: 3 });
  const Answer = type === "MX" ? (MX[name] || []).map((data) => ({ type: 15, data })) : [];
  return Response.json({ Status: 0, Answer });
};

const { default: worker } = await import("../src/index.js");
const env = { RAPIDAPI_PROXY_SECRET: "s3cret", RAPIDAPI_URL: "" };
const call = (path, init = {}) => worker.fetch(new Request("https://mailsieve.test" + path, init), env);
const auth = { headers: { "x-rapidapi-proxy-secret": "s3cret" } };

let r = await call("/v1/check?email=a@gmail.com");
assert.equal(r.status, 401, "API rejects calls without the proxy secret");

r = await (await call("/v1/check?email=Hello@Mailinator.com", auth)).json();
assert.equal(r.disposable, true); assert.equal(r.verdict, "undeliverable"); assert.equal(r.role_account, true);

r = await (await call("/v1/check?email=jane.doe@gmail.com", auth)).json();
assert.equal(r.verdict, "deliverable"); assert.equal(r.score, 100); assert.equal(r.free_provider, true);

// The blocklist changes weekly and sometimes lists typo domains, so pick one that is not on it.
const { DISPOSABLE } = await import("../src/validate.js");
const typo = [["outlok.com", "outlook.com"], ["gmaill.com", "gmail.com"], ["yahooo.com", "yahoo.com"], ["gmail.co", "gmail.com"]].find(([d]) => !DISPOSABLE.has(d));
if (typo) {
  r = await (await call(`/v1/check?email=jane@${typo[0]}`, auth)).json();
  assert.equal(r.did_you_mean, `jane@${typo[1]}`); assert.equal(r.verdict, "risky");
}

r = await (await call("/v1/check?email=x@inbox.mailinator.com", auth)).json();
assert.equal(r.disposable, true, "subdomains of disposable domains match");

r = await (await call("/v1/check?email=bob@nxdomain-example.dev", auth)).json();
assert.equal(r.mx.status, "none"); assert.equal(r.score, 0);

r = await (await call("/v1/check?email=not-an-email", auth)).json();
assert.equal(r.valid_syntax, false);

r = await (await call("/v1/domain?domain=yopmail.com", auth)).json();
assert.equal(r.disposable, true);

const post = (plan, emails) => call("/v1/bulk", { method: "POST", headers: { ...auth.headers, "x-rapidapi-subscription": plan, "content-type": "application/json" }, body: JSON.stringify({ emails }) });
assert.equal((await post("BASIC", ["a@gmail.com"])).status, 402);
r = await (await post("PRO", ["a@gmail.com", "b@mailinator.com", "bad"])).json();
assert.equal(r.total, 3); assert.equal(r.summary.deliverable, 1); assert.equal(r.summary.undeliverable, 2);
assert.equal((await post("PRO", Array(51).fill("a@gmail.com"))).status, 413);

for (const p of ["/", "/disposable", "/disposable/starting-with/m", "/disposable/mailinator.com", "/disposable/gmail.com", "/sitemap.xml", "/robots.txt", "/health"]) {
  const res = await call(p);
  assert.equal(res.status, 200, p);
}
let page = await (await call("/disposable/mailinator.com")).text();
assert.match(page, /Yes, it is disposable\./); assert.match(page, /Is mailinator\.com a disposable email domain\?/); assert.doesNotMatch(page, /noindex/);
page = await (await call("/disposable/gmail.com")).text();
assert.match(page, /noindex/);
assert.equal((await call("/disposable/%3Cscript%3E")).status, 404);
assert.equal((await call("/nope")).status, 404);
assert.equal((await call("/disposable/%E0%A4%A")).status, 404, "malformed percent-encoding is a 404, not a crash");
for (const p of ["/favicon.svg", "/favicon.ico"]) assert.equal((await call(p)).headers.get("content-type"), "image/svg+xml");
let red = await call("/disposable?domain=https://Mailinator.com/inbox");
assert.equal(red.status, 302); assert.equal(red.headers.get("location"), "https://mailsieve.test/disposable/mailinator.com");
red = await call("/disposable?domain=not a domain");
assert.equal(red.status, 200); assert.match(await red.text(), /Type a domain such as mailinator\.com/);

// Landing page: embedded data parses and every in-page link has a target.
page = await (await call("/")).text();
const data = JSON.parse(page.match(/<script type="application\/json" id="ms-data">([\s\S]*?)<\/script>/)[1]);
assert.deepEqual(Object.keys(data.snippets), ["check", "domain", "bulk"]);
for (const k of Object.keys(data.snippets)) { assert.ok(data.snippets[k].curl && data.snippets[k].js && data.snippets[k].python); assert.ok(data.responses[k]); }
for (const v of ["deliverable", "risky", "undeliverable"]) assert.match(data.stamps[v], /@@B@@/);
for (const [, id] of page.matchAll(/href="\/?#([a-z-]+)"/g)) assert.ok(page.includes(`id="${id}"`), `missing anchor #${id}`);
for (const ld of page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(ld[1]);
const withKey = await (await worker.fetch(new Request("https://mailsieve.test/"), { RAPIDAPI_URL: "https://rapidapi.com/x/api/y" })).text();
assert.match(withKey, /href="https:\/\/rapidapi\.com\/x\/api\/y"/); assert.match(withKey, /href="https:\/\/rapidapi\.com\/x\/api\/y\/pricing"/);
assert.match(await (await call("/sitemap.xml")).text(), /\/disposable\/yopmail\.com/);

let last;
for (let i = 0; i < 11; i++) last = await call("/demo/check?email=a@gmail.com");
assert.equal(last.status, 429, "demo is rate limited");

console.log("All tests passed.");
