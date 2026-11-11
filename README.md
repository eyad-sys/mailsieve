# MailSieve

Email validation and disposable-email detection API. Runs on one free Cloudflare Worker, sells through the Rapid (RapidAPI) marketplace, refreshes its own data weekly.

## 1. Product and money

| | |
|---|---|
| Problem | Sign-up forms and free trials get flooded with throwaway and mistyped emails |
| Buyer | Indie developers and small SaaS teams who want one API call instead of building this |
| What they get | Disposable check, live MX lookup, typo suggestion, role and free-provider flags, 0-100 score |
| Revenue | Freemium subscriptions on Rapid. Rapid issues keys, meters usage, charges cards, pays you by PayPal |

Plans to create on Rapid:

| Plan | Price / month | Checks / month | Bulk endpoint |
|---|---|---|---|
| Basic | $0 | 500 (hard limit) | No |
| Pro | $9 | 25,000 | Yes |
| Ultra | $29 | 150,000 | Yes |
| Mega | $79 | 1,000,000 | Yes |

The $100 target: Rapid keeps 25%, so you need about $135 of subscriptions. That is 15 Pro, or 5 Ultra, or 2 Mega.

## 2. Architecture

```
 open-source blocklist (GitHub, CC0)
        |  weekly GitHub Action: fetch, merge, test, commit
        v
 your GitHub repo  --push-->  Cloudflare Git integration  --deploy-->  Worker (free plan)
                                                                         |
   PAID PATH                                                             |
   developer --> Rapid gateway (key, quota, billing) --proxy secret-->  /v1/check  /v1/domain  /v1/bulk
                      |                                                  |
                      v                                                  +--> Cloudflare DNS-over-HTTPS (MX lookup, free)
               card charged --> Rapid (25% fee) --> your PayPal

   TRAFFIC PATH
   Google --> /disposable/{domain}  (one page per blocklisted domain, in sitemap.xml)
          --> landing page with live demo --> "Get a free API key" --> Rapid listing
   Rapid search --> your listing (second discovery channel)
```

## 3. Files

| File | Job |
|---|---|
| `src/index.js` | Router, Rapid auth, API endpoints, demo rate limit |
| `src/validate.js` | All checks and scoring |
| `src/pages.js` | Landing page, per-domain SEO pages, sitemap, robots |
| `src/data/disposable.json` | Blocklist (seed of 59; the Action expands it to thousands) |
| `scripts/update-lists.mjs` | Pulls the latest blocklist, never shrinks it |
| `.github/workflows/update.yml` | Runs the update every Monday and commits |
| `openapi.json` | Import into Rapid to create all endpoints at once |
| `test/test.mjs` | Offline test of every route: `node test/test.mjs` |

## 4. Launch (about 40 minutes)

**A. GitHub (5 min)**
1. Create a new repo named `mailsieve` and upload every file in this folder (keep the folder structure, including `.github`).
2. Repo > Settings > Actions > General > Workflow permissions > select "Read and write permissions" > Save.

**B. Cloudflare (10 min)**
1. Cloudflare dashboard > Workers & Pages > Create > Import a repository > pick `mailsieve` > Deploy.
2. Open the Worker > Settings > Variables and Secrets > Add > type **Secret**, name `RAPIDAPI_PROXY_SECRET`, value: any placeholder for now.
3. Open `https://mailsieve.<your-subdomain>.workers.dev`. The demo on the page should work.

**C. Fill the blocklist (2 min)**
1. GitHub repo > Actions > "Refresh disposable domain list" > Run workflow.
2. It commits the full list; Cloudflare redeploys by itself. Check `/health`: `disposable_domains` should be in the thousands.

**D. Rapid listing (15 min)**
1. Sign up at rapidapi.com > My APIs > Add API Project > name "MailSieve Email Validation", category Email.
2. Definition > import `openapi.json`. Set the base URL to your workers.dev URL.
3. Gateway (or Settings > Security): copy the **X-RapidAPI-Proxy-Secret** value. Paste it into the Cloudflare secret from step B2 and save.
4. Monetize > create the four plans from the table above. Set Basic to a hard limit. Restrict `/v1/bulk` to paid plans.
5. Add your PayPal email under Personal Payouts.
6. Test an endpoint in Rapid's console, then set visibility to Public.

**E. Connect the two (5 min)**
1. In `wrangler.toml` set `RAPIDAPI_URL` to your public Rapid listing URL. Commit.
2. In `src/pages.js` replace `mailsieve.p.rapidapi.com` with the host Rapid shows for your API. Commit.
3. Google Search Console > add your workers.dev URL > submit `/sitemap.xml`.

After this nothing needs you: the list refreshes weekly, Rapid handles users and payments, Cloudflare free plan covers 100,000 requests a day.

## 5. Limits to know

- Free Workers plan: 100,000 requests/day and 10 ms CPU per request. A check uses well under 1 ms CPU.
- The demo rate limit is per Worker instance, so it is approximate. If the demo gets abused, add a free Cloudflare rate-limiting rule on `/demo/*`.
- The API does not connect to mail servers (no SMTP probe), so it cannot confirm that a specific mailbox exists. Do not claim that in the listing.
