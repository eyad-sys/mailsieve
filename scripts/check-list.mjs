// Runs after the weekly refresh: fails the workflow (so nothing is committed) if the list looks wrong.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const list = JSON.parse(readFileSync(new URL("../src/data/disposable.json", import.meta.url), "utf8"));
const set = new Set(list);
assert.ok(Array.isArray(list) && list.length >= 59, "list must not shrink below the seed");
assert.equal(set.size, list.length, "no duplicates");
assert.ok(list.every((d) => /^[a-z0-9.-]+\.[a-z]{2,63}$/.test(d)), "every entry is a domain");
for (const d of ["mailinator.com", "yopmail.com"]) assert.ok(set.has(d), `${d} must be listed`);
for (const d of ["gmail.com", "outlook.com", "yahoo.com", "github.com"]) assert.ok(!set.has(d), `${d} must not be listed`);

const { default: worker } = await import("../src/index.js");
const res = await worker.fetch(new Request("https://check.test/disposable/mailinator.com"), {});
assert.equal(res.status, 200);
console.log(`List OK: ${list.length} domains.`);
