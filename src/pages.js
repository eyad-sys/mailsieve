// HTML for the landing page and the programmatic SEO pages (one per disposable domain).
import { DISPOSABLE_SORTED, checkDomainStatic } from "./validate.js";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const CSS = `
:root{--paper:#EDF0F5;--card:#FBFCFE;--ink:#14213D;--soft:#51607F;--line:#CBD3E1;--red:#C4302B;--blue:#2A56A5;--ok:#1C7A4B;--warn:#9A6200}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font:400 1.0625rem/1.6 "Atkinson Hyperlegible","Segoe UI",system-ui,sans-serif}
h1,h2,h3{font-family:"Bricolage Grotesque","Atkinson Hyperlegible",system-ui,sans-serif;font-weight:700;line-height:1.08;letter-spacing:-.02em;margin:0}
h1{font-size:clamp(2.4rem,6.2vw,4.5rem);max-width:15ch}
h2{font-size:clamp(1.6rem,3.2vw,2.35rem);margin-bottom:.9rem}
h3{font-size:1.2rem;letter-spacing:-.01em;margin-bottom:.3rem}
p{margin:0 0 1rem;max-width:62ch}
a{color:var(--blue);text-underline-offset:.18em}
a:focus-visible,button:focus-visible,input:focus-visible,summary:focus-visible{outline:3px solid var(--blue);outline-offset:3px}
code,pre{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:.86rem}
.wrap{max-width:1080px;margin:0 auto;padding:0 1.5rem}
.top{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:.5rem 1rem;padding:1.4rem 0}
.brand{font-family:"Bricolage Grotesque",system-ui,sans-serif;font-weight:800;font-size:1.3rem;color:var(--ink);text-decoration:none;letter-spacing:-.02em;white-space:nowrap}
.brand i{display:inline-block;width:.62em;height:.62em;margin-right:.4em;border-radius:50%;border:.16em solid var(--red)}
.top nav a{margin-right:1.2rem;white-space:nowrap;color:var(--ink);text-decoration:none;font-size:.98rem}
.top nav a:last-child{margin-right:0}.top nav a:hover{text-decoration:underline}
.hero{padding:2.5rem 0 4.5rem;display:grid;gap:3rem;grid-template-columns:minmax(0,1fr)}.hero>*,.two>*{min-width:0}
.lede{font-size:1.2rem;color:var(--soft);margin-top:1.3rem;max-width:46ch}
@media(min-width:900px){.hero{grid-template-columns:5fr 6fr;align-items:center;padding-top:4rem}}
.envelope{padding:14px;border-radius:6px;background:repeating-linear-gradient(-45deg,var(--red) 0 18px,var(--card) 18px 36px,var(--blue) 36px 54px,var(--card) 54px 72px);box-shadow:0 22px 44px -26px rgba(20,33,61,.55)}
.sheet{position:relative;background:var(--card);border-radius:2px;padding:1.8rem 1.6rem 1.5rem;min-height:21rem;overflow:hidden}
.sheet label{display:block;font-size:.95rem;color:var(--soft);margin-bottom:.4rem}
.row{display:flex;gap:.6rem;flex-wrap:wrap}
.row input{flex:1 1 15rem;min-width:0;font:inherit;font-size:1.15rem;padding:.6rem .1rem;border:0;border-bottom:2px solid var(--ink);background:transparent;color:var(--ink);border-radius:0}
.row input::placeholder{color:#8E9AB3}
.btn{font:inherit;font-weight:700;cursor:pointer;border:0;border-radius:4px;padding:.72rem 1.15rem;background:var(--ink);color:#fff;text-decoration:none;display:inline-block}
.btn:hover{background:#22325A}
.btn.alt{background:var(--red)}.btn.alt:hover{background:#A82723}
.tries{margin-top:.8rem;font-size:.92rem;color:var(--soft)}
.tries button{font:inherit;color:var(--blue);background:none;border:0;padding:0;margin-right:.9rem;cursor:pointer;text-decoration:underline;text-underline-offset:.18em}
.result{margin-top:1.5rem;min-height:7.5rem}
.result ul{list-style:none;margin:0;padding:0;max-width:60%}
.result li{padding:.32rem 0;border-bottom:1px dashed var(--line);font-size:.98rem;display:flex;justify-content:space-between;gap:1rem}
.result li b{font-weight:700}
.msg{color:var(--soft)}
.stamp{position:absolute;right:1.1rem;bottom:1.5rem;width:9.2rem;height:9.2rem;border-radius:50%;border:4px double currentColor;display:grid;place-content:center;text-align:center;padding:1.1rem;transform:rotate(-11deg);font-family:"Bricolage Grotesque",system-ui,sans-serif;font-weight:800;line-height:1.05;font-size:1.02rem;opacity:.9}
.stamp small{display:block;font:400 .78rem/1.3 "Atkinson Hyperlegible",system-ui,sans-serif;margin-top:.3rem}
.stamp.deliverable{color:var(--ok)}.stamp.risky{color:var(--warn)}.stamp.undeliverable{color:var(--red)}
.stamp.in{animation:thunk .28s cubic-bezier(.2,1.4,.4,1)}
@keyframes thunk{from{transform:rotate(-2deg) scale(1.7);opacity:0}to{transform:rotate(-11deg) scale(1);opacity:.9}}
@media(prefers-reduced-motion:reduce){.stamp.in{animation:none}}
@media(max-width:560px){.result ul{max-width:100%}.stamp{position:static;margin:1.2rem 0 0 auto}}
section{padding:4rem 0;border-top:1px solid var(--line)}
.checks{display:grid;gap:1.6rem 3rem;grid-template-columns:repeat(auto-fit,minmax(15.5rem,1fr));margin-top:2rem}
.checks p{color:var(--soft);font-size:1rem;margin:0}
pre{background:var(--ink);color:#DCE4F5;padding:1.2rem 1.3rem;border-radius:6px;overflow-x:auto;line-height:1.55;margin:1.2rem 0 0}
pre .k{color:#8FB4FF}pre .s{color:#F2B8A2}
.two{display:grid;gap:2rem;grid-template-columns:minmax(0,1fr)}
@media(min-width:900px){.two{grid-template-columns:1fr 1fr}}
table{width:100%;border-collapse:collapse;margin-top:1.5rem;font-size:1rem}
th,td{text-align:left;padding:.85rem .8rem .85rem 0;border-bottom:1px solid var(--line);vertical-align:top}
th{font-weight:700}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
.scroll{overflow-x:auto}
.verdict{font-family:"Bricolage Grotesque",system-ui,sans-serif;font-weight:800;font-size:clamp(2rem,5vw,3.4rem);line-height:1.05;letter-spacing:-.02em;margin:.4rem 0 1.2rem;max-width:18ch}
.verdict.yes{color:var(--red)}.verdict.no{color:var(--ok)}
.cols{columns:14rem;column-gap:2rem;margin-top:1.4rem;padding:0;list-style:none}
.cols li{padding:.16rem 0;break-inside:avoid}
.letters a{display:inline-block;min-width:2.1rem;text-align:center;padding:.3rem .2rem;margin:0 .25rem .4rem 0;border:1px solid var(--line);border-radius:4px;background:var(--card);text-decoration:none;font-weight:700}
footer{padding:2.5rem 0 3.5rem;border-top:1px solid var(--line);color:var(--soft);font-size:.95rem}
footer a{color:var(--soft);margin-right:1.2rem}
`;

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&display=swap" rel="stylesheet">`;

function shell({ origin, rapidUrl }, { title, description, path, body, jsonLd, noindex }) {
  const key = rapidUrl || `${origin}/#pricing`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${origin}${path}">
${noindex ? '<meta name="robots" content="noindex">' : ""}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${origin}${path}">
<meta name="twitter:card" content="summary">
${FONTS}
<style>${CSS}</style>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>` : ""}
</head>
<body>
<div class="wrap">
<header class="top">
<a class="brand" href="/"><i></i>MailSieve</a>
<nav><a href="/#api">API</a><a href="/#pricing">Pricing</a><a href="/disposable">Domain list</a></nav>
</header>
${body}
<footer>
<a href="/">MailSieve</a><a href="/disposable">Disposable domain list</a><a href="${esc(key)}">Get an API key</a>
<p style="margin-top:1rem">Checks use public DNS and an open-source blocklist that is refreshed every week. MailSieve never sends mail to the addresses you check and does not store them.</p>
</footer>
</div>
</body>
</html>`;
}

export function landingPage(ctx) {
  const key = ctx.rapidUrl || "#pricing";
  const n = DISPOSABLE_SORTED.length.toLocaleString("en-US");
  const body = `
<main>
<div class="hero">
<div>
<h1>Find the fake email addresses before they sign up.</h1>
<p class="lede">MailSieve is an email validation API. One request tells you whether an address can receive mail, and whether it is a throwaway inbox.</p>
<p style="margin-top:1.6rem"><a class="btn alt" href="${esc(key)}">Get a free API key</a></p>
</div>
<div class="envelope">
<form class="sheet" id="f" autocomplete="off">
<label for="e">Try it with any address</label>
<div class="row"><input id="e" name="email" type="text" inputmode="email" placeholder="someone@example.com" spellcheck="false" required><button class="btn" type="submit">Check address</button></div>
<div class="tries"><button type="button" data-v="hello@mailinator.com">A throwaway inbox</button><button type="button" data-v="jane@outlok.com">A typo</button><button type="button" data-v="sales@github.com">A shared mailbox</button></div>
<div class="result" id="r" aria-live="polite"><p class="msg">The verdict is stamped here.</p></div>
</form>
</div>
</div>

<section>
<h2>What each check tells you</h2>
<p>Every response carries these six answers, a 0 to 100 score, and a plain verdict you can branch on.</p>
<div class="checks">
<div><h3>Throwaway inbox</h3><p>Matched against ${n} known disposable email domains, including subdomains.</p></div>
<div><h3>Can receive mail</h3><p>A live DNS lookup confirms the domain has mail servers and lists them.</p></div>
<div><h3>Likely typo</h3><p>outlok.com comes back with the address you can suggest instead.</p></div>
<div><h3>Shared mailbox</h3><p>Flags addresses like info@, sales@ and support@ that no single person reads.</p></div>
<div><h3>Free provider</h3><p>Tells Gmail and Outlook addresses apart from company domains.</p></div>
<div><h3>Valid format</h3><p>Rejects addresses that no mail server would accept.</p></div>
</div>
</section>

<section id="api">
<h2>One request, one answer</h2>
<div class="two">
<div>
<p>Call <code>GET /v1/check</code> with an email. Use <code>GET /v1/domain</code> when you only have a domain, and <code>POST /v1/bulk</code> to clean up to 50 addresses at once.</p>
<pre>curl "https://mailsieve-email-validation.p.rapidapi.com/v1/check?email=hello@mailinator.com" \\
  -H "X-RapidAPI-Key: YOUR_KEY" \\
  -H "X-RapidAPI-Host: mailsieve-email-validation.p.rapidapi.com"</pre>
</div>
<pre>{
  <span class="k">"email"</span>: <span class="s">"hello@mailinator.com"</span>,
  <span class="k">"valid_syntax"</span>: true,
  <span class="k">"disposable"</span>: true,
  <span class="k">"role_account"</span>: true,
  <span class="k">"free_provider"</span>: false,
  <span class="k">"did_you_mean"</span>: null,
  <span class="k">"mx"</span>: { <span class="k">"status"</span>: <span class="s">"found"</span> },
  <span class="k">"score"</span>: 0,
  <span class="k">"verdict"</span>: <span class="s">"undeliverable"</span>,
  <span class="k">"reasons"</span>: [<span class="s">"disposable_domain"</span>, <span class="s">"role_account"</span>]
}</pre>
</div>
</section>

<section id="pricing">
<h2>Pricing</h2>
<p>Start free. Keys, billing and invoices are handled by the Rapid marketplace, so you can cancel there at any time.</p>
<div class="scroll"><table>
<thead><tr><th>Plan</th><th class="num">Price per month</th><th class="num">Checks per month</th><th>Bulk endpoint</th></tr></thead>
<tbody>
<tr><td>Basic</td><td class="num">$0</td><td class="num">500</td><td>Not included</td></tr>
<tr><td>Pro</td><td class="num">$9</td><td class="num">25,000</td><td>Included</td></tr>
<tr><td>Ultra</td><td class="num">$29</td><td class="num">150,000</td><td>Included</td></tr>
<tr><td>Mega</td><td class="num">$79</td><td class="num">1,000,000</td><td>Included</td></tr>
</tbody></table></div>
<p style="margin-top:1.8rem"><a class="btn alt" href="${esc(key)}">Get a free API key</a></p>
</section>
</main>
<script>
(function(){
var f=document.getElementById('f'),e=document.getElementById('e'),r=document.getElementById('r');
var words={deliverable:['Deliverable','Safe to accept'],risky:['Risky','Ask to confirm'],undeliverable:['Return to sender','Do not accept']};
function yn(v){return v?'Yes':'No'}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return '&#'+c.charCodeAt(0)+';'})}
function show(d){
 if(d.error){r.innerHTML='<p class="msg">'+esc(d.error.message)+'</p>';return}
 if(!d.valid_syntax){r.innerHTML='<ul><li>Valid format <b>No</b></li></ul><div class="stamp in undeliverable">Return to sender<small>Not an email address</small></div>';return}
 var mx={found:'Yes',a_record_only:'Probably',none:'No',unknown:'Could not check'}[d.mx.status];
 var w=words[d.verdict];
 r.innerHTML='<ul><li>Throwaway inbox <b>'+yn(d.disposable)+'</b></li><li>Can receive mail <b>'+mx+'</b></li><li>Shared mailbox <b>'+yn(d.role_account)+'</b></li><li>Score <b>'+d.score+' / 100</b></li>'+(d.did_you_mean?'<li>Did you mean <b>'+esc(d.did_you_mean)+'</b></li>':'')+'</ul><div class="stamp in '+d.verdict+'">'+w[0]+'<small>'+w[1]+'</small></div>';
}
function run(){
 var v=e.value.trim();if(!v)return;
 r.innerHTML='<p class="msg">Checking…</p>';
 fetch('/demo/check?email='+encodeURIComponent(v)).then(function(x){return x.json()}).then(show).catch(function(){r.innerHTML='<p class="msg">The check did not go through. Try again in a moment.</p>'});
}
f.addEventListener('submit',function(ev){ev.preventDefault();run()});
f.querySelectorAll('[data-v]').forEach(function(b){b.addEventListener('click',function(){e.value=b.dataset.v;run()})});
})();
</script>`;
  return shell(ctx, {
    title: "MailSieve: email validation and disposable email detection API",
    description: `Check any email address in one API call: disposable domain detection across ${n} domains, live MX lookup, typo suggestions and a 0-100 score. Free plan available.`,
    path: "/",
    body,
    jsonLd: {
      "@context": "https://schema.org", "@type": "WebAPI", name: "MailSieve",
      description: "Email validation and disposable email detection API.",
      url: ctx.origin + "/", documentation: ctx.origin + "/#api",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  });
}

export function domainPage(ctx, domain) {
  const info = checkDomainStatic(domain);
  const d = esc(domain);
  const key = ctx.rapidUrl || "/#pricing";
  const i = DISPOSABLE_SORTED.indexOf(domain);
  const near = i >= 0
    ? [...DISPOSABLE_SORTED.slice(Math.max(0, i - 6), i), ...DISPOSABLE_SORTED.slice(i + 1, i + 7)]
    : DISPOSABLE_SORTED.slice(0, 12);
  const q = `Is ${domain} a disposable email domain?`;
  const a = info.disposable
    ? `Yes. ${domain} is on the MailSieve blocklist of disposable email providers. Addresses at this domain are temporary inboxes that anyone can create without signing up, so they are commonly used for fake sign-ups and trial abuse.`
    : `No. ${domain} is not on the MailSieve blocklist of disposable email providers.${info.free_provider ? " It is a free consumer email provider." : ""}`;
  const body = `
<main>
<section style="border-top:0;padding-top:2.5rem">
<p><a href="/disposable">Disposable domain list</a></p>
<h1 style="font-size:clamp(1.5rem,3vw,2rem);max-width:none;font-weight:700">${esc(q)}</h1>
<p class="verdict ${info.disposable ? "yes" : "no"}">${info.disposable ? "Yes, " + d + " is disposable." : "No, " + d + " is not listed."}</p>
<p>${esc(a)}</p>
${info.disposable ? `<p>If you run a sign-up form, a newsletter or a free trial, rejecting addresses at ${d} keeps fake accounts out of your list and protects your sender reputation.</p>` : ""}
${info.did_you_mean ? `<p>This domain looks like a misspelling of <a href="/disposable/${esc(info.did_you_mean)}">${esc(info.did_you_mean)}</a>.</p>` : ""}
</section>
<section>
<h2>Check ${d} addresses automatically</h2>
<p>The MailSieve API runs this check, plus a live mail-server lookup and typo detection, on any address in one request.</p>
<pre>curl "https://mailsieve-email-validation.p.rapidapi.com/v1/check?email=someone@${d}" \\
  -H "X-RapidAPI-Key: YOUR_KEY" \\
  -H "X-RapidAPI-Host: mailsieve-email-validation.p.rapidapi.com"</pre>
<p style="margin-top:1.6rem"><a class="btn alt" href="${esc(key)}">Get a free API key</a></p>
</section>
<section>
<h2>Other disposable domains</h2>
<ul class="cols">${near.map((x) => `<li><a href="/disposable/${esc(x)}">${esc(x)}</a></li>`).join("")}</ul>
</section>
</main>`;
  return shell(ctx, {
    title: `${q} ${info.disposable ? "Yes" : "No"} | MailSieve`,
    description: a.slice(0, 155),
    path: `/disposable/${domain}`,
    body,
    noindex: !info.disposable,
    jsonLd: {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }],
    },
  });
}

export function listPage(ctx, letter) {
  const letters = [...new Set(DISPOSABLE_SORTED.map((x) => x[0]))].sort();
  const items = letter ? DISPOSABLE_SORTED.filter((x) => x[0] === letter) : [];
  const n = DISPOSABLE_SORTED.length.toLocaleString("en-US");
  const body = `
<main>
<section style="border-top:0;padding-top:2.5rem">
<h1 style="font-size:clamp(2rem,4.6vw,3.2rem);max-width:20ch">${letter ? `Disposable email domains starting with ${esc(letter.toUpperCase())}` : "Disposable email domain list"}</h1>
<p class="lede">${n} domains that hand out temporary inboxes, refreshed every week. Pick a domain to see its status, or check addresses in bulk with the API.</p>
<p class="letters" style="margin-top:1.6rem;max-width:none">${letters.map((l) => `<a href="/disposable/starting-with/${l}">${l.toUpperCase()}</a>`).join("")}</p>
${letter ? `<ul class="cols">${items.map((x) => `<li><a href="/disposable/${esc(x)}">${esc(x)}</a></li>`).join("")}</ul>` : ""}
</section>
</main>`;
  return shell(ctx, {
    title: letter ? `Disposable email domains starting with ${letter.toUpperCase()} | MailSieve` : "Disposable email domain list | MailSieve",
    description: `Browse ${n} disposable and temporary email domains, refreshed weekly. Check any address with the MailSieve API.`,
    path: letter ? `/disposable/starting-with/${letter}` : "/disposable",
    body,
  });
}

export function notFoundPage(ctx) {
  return shell(ctx, {
    title: "Page not found | MailSieve", description: "This page does not exist.", path: "/404", noindex: true,
    body: `<main><section style="border-top:0"><h1>This page does not exist.</h1><p class="lede">Go to the <a href="/">home page</a> or browse the <a href="/disposable">disposable domain list</a>.</p></section></main>`,
  });
}

export function sitemap({ origin }) {
  const letters = [...new Set(DISPOSABLE_SORTED.map((x) => x[0]))];
  const urls = [
    "/", "/disposable",
    ...letters.map((l) => `/disposable/starting-with/${l}`),
    ...DISPOSABLE_SORTED.slice(0, 45000).map((d) => `/disposable/${d}`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${origin}${u}</loc></url>`).join("\n")}\n</urlset>`;
}

export function robots({ origin }) {
  return `User-agent: *\nAllow: /\nDisallow: /v1/\nDisallow: /demo/\nSitemap: ${origin}/sitemap.xml\n`;
}
