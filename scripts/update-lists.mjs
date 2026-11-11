// Refreshes src/data/disposable.json from the open-source (CC0) blocklist.
// Run weekly by .github/workflows/update.yml. Never shrinks the list on a bad fetch.
import { readFileSync, writeFileSync } from "node:fs";

const FILE = new URL("../src/data/disposable.json", import.meta.url);
const BASE = "https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains";
const SOURCES = [`${BASE}/main/disposable_email_blocklist.conf`, `${BASE}/master/disposable_email_blocklist.conf`];
const DOMAIN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

const current = JSON.parse(readFileSync(FILE, "utf8"));
let text = null;
for (const url of SOURCES) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    if (res.ok) { text = await res.text(); console.log(`fetched ${url}`); break; }
    console.warn(`${url} -> ${res.status}`);
  } catch (e) { console.warn(`${url} -> ${e.message}`); }
}
if (!text) { console.error("No source reachable; keeping current list."); process.exit(0); }

const fetched = text.split("\n").map((l) => l.trim().toLowerCase()).filter((l) => DOMAIN.test(l));
if (fetched.length < 1000) { console.error(`Only ${fetched.length} domains fetched; refusing to update.`); process.exit(0); }

const merged = [...new Set([...current, ...fetched])].sort();
writeFileSync(FILE, JSON.stringify(merged) + "\n");
console.log(`disposable domains: ${current.length} -> ${merged.length}`);
