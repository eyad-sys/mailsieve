// HTML for the landing page and the programmatic SEO pages (one per disposable domain).
import { DISPOSABLE_SORTED, DOMAIN_RE, checkDomainStatic } from "./validate.js";
import { CSS } from "./styles.js";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const json = (v) => JSON.stringify(v).replace(/</g, "\\u003c");
const count = () => DISPOSABLE_SORTED.length.toLocaleString("en-US");

const API_HOST = "mailsieve-email-validation.p.rapidapi.com";
const GOOGLE_VERIFICATION = "o_ecma27VUGIYaTq5nJMRQgIqlFT30raHN2LGX-pD60";
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Courier+Prime:wght@400;700&display=swap" rel="stylesheet">`;

/* ---------- small SVG parts ---------- */

const SIEVE = `<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13.5" fill="none" stroke="currentColor" stroke-width="2.6"/><g fill="currentColor"><circle cx="16" cy="16" r="2.1"/><circle cx="9.6" cy="16" r="2.1"/><circle cx="22.4" cy="16" r="2.1"/><circle cx="12.8" cy="10.5" r="2.1"/><circle cx="19.2" cy="10.5" r="2.1"/><circle cx="12.8" cy="21.5" r="2.1"/><circle cx="19.2" cy="21.5" r="2.1"/></g></svg>`;

export const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#1D2BA4"/><circle cx="16" cy="16" r="10.5" fill="none" stroke="#fff" stroke-width="2.4"/><g fill="#fff"><circle cx="16" cy="16" r="1.8"/><circle cx="11" cy="16" r="1.8"/><circle cx="21" cy="16" r="1.8"/><circle cx="13.5" cy="11.7" r="1.8"/><circle cx="18.5" cy="11.7" r="1.8"/><circle cx="13.5" cy="20.3" r="1.8"/><circle cx="18.5" cy="20.3" r="1.8"/></g></svg>`;

// One shared "inked rubber stamp" texture for every postmark on the page.
const INK_FILTER = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><filter id="ink" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G" result="d"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -11 7.5" result="holes"/><feComposite in="d" in2="holes" operator="in"/></filter></svg>`;

const MARKS = {
  deliverable: { cls: "deliverable", label: "Deliverable", lines: [["DELIVERABLE", 21, 107, 104]] },
  risky: { cls: "risky", label: "Risky", lines: [["RISKY", 34, 112, 82]] },
  undeliverable: { cls: "undeliverable", label: "Return to sender", lines: [["RETURN TO", 19, 98, 90], ["SENDER", 24, 121, 90]] },
  listed: { cls: "undeliverable", label: "Disposable", lines: [["DISPOSABLE", 21, 107, 100]] },
  clear: { cls: "deliverable", label: "Not listed", lines: [["NOT LISTED", 21, 107, 96]] },
};

/** A round postmark. `bottom` is the text on the lower arc; `uid` keeps SVG ids unique per page. */
function postmark(kind, bottom, uid) {
  const m = MARKS[kind];
  const text = m.lines
    .map(([t, size, y, len]) => `<text x="100" y="${y}" text-anchor="middle" font-size="${size}" textLength="${len}" lengthAdjust="spacingAndGlyphs">${t}</text>`)
    .join("");
  return `<div class="postmark is-${m.cls}"><svg viewBox="0 0 200 200" role="img" aria-label="${esc(m.label)}. ${esc(bottom.toLowerCase())}"><defs><path id="pt-${uid}" d="M37,100 A63,63 0 0 1 163,100"/><path id="pb-${uid}" d="M21,100 A79,79 0 0 0 179,100"/></defs><g filter="url(#ink)" fill="currentColor" font-family="Archivo,'Arial Narrow',Arial,sans-serif" font-weight="800" style="font-stretch:66%"><circle cx="100" cy="100" r="93" fill="none" stroke="currentColor" stroke-width="3.6"/><circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="100" cy="100" r="56" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="28.5" cy="100" r="2.6"/><circle cx="171.5" cy="100" r="2.6"/><text font-size="12.5" letter-spacing="1.5"><textPath href="#pt-${uid}" startOffset="50%" text-anchor="middle">MAILSIEVE SORTING OFFICE</textPath></text><text font-size="11.5" letter-spacing="1.3"><textPath href="#pb-${uid}" startOffset="50%" text-anchor="middle">${esc(bottom)}</textPath></text>${text}</g></svg></div>`;
}

function waves() {
  const line = (y) => `<path d="M0 ${y} q37.5 -28 75 0${" t75 0".repeat(11)}"/>`;
  return `<svg class="hero-waves" viewBox="0 0 900 270" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" aria-hidden="true" focusable="false">${[34, 84, 134, 184, 234].map(line).join("")}</svg>`;
}

/* ---------- API samples (shown in the explorer and reused by the docs copy) ---------- */

const SAMPLES = {
  check: {
    method: "GET", path: "/v1/check", what: "Check one address",
    query: ["email", "hello@mailinator.com"],
    response: {
      email: "hello@mailinator.com", valid_syntax: true, local: "hello", domain: "mailinator.com",
      disposable: true, role_account: true, free_provider: false, plus_tag: false, did_you_mean: null,
      mx: { status: "found", records: ["mail.mailinator.com", "mail2.mailinator.com"] },
      score: 0, verdict: "undeliverable", reasons: ["disposable_domain", "role_account"],
    },
  },
  domain: {
    method: "GET", path: "/v1/domain", what: "Check a domain on its own",
    query: ["domain", "yopmail.com"],
    response: { domain: "yopmail.com", disposable: true, free_provider: false, did_you_mean: null, mx: { status: "found", records: ["mx.yopmail.com"] } },
  },
  bulk: {
    method: "POST", path: "/v1/bulk", what: "Check up to 50 addresses",
    body: { emails: ["jane@outlok.com", "hello@mailinator.com"] },
    response: {
      total: 2,
      summary: { deliverable: 0, risky: 1, undeliverable: 1 },
      results: [
        {
          email: "jane@outlok.com", valid_syntax: true, local: "jane", domain: "outlok.com",
          disposable: false, role_account: false, free_provider: false, plus_tag: false, did_you_mean: "jane@outlook.com",
          mx: { status: "a_record_only", records: [] },
          score: 40, verdict: "risky", reasons: ["no_mx_record_a_fallback", "possible_typo"],
        },
        {
          email: "hello@mailinator.com", valid_syntax: true, local: "hello", domain: "mailinator.com",
          disposable: true, role_account: true, free_provider: false, plus_tag: false, did_you_mean: null,
          mx: { status: "found", records: ["mail.mailinator.com", "mail2.mailinator.com"] },
          score: 0, verdict: "undeliverable", reasons: ["disposable_domain", "role_account"],
        },
      ],
    },
  },
};

function snippet(lang, ep) {
  const body = ep.body ? JSON.stringify(ep.body) : null;
  if (lang === "curl") {
    return ep.query
      ? `curl --get \\\n  "https://${API_HOST}${ep.path}" \\\n  --data-urlencode "${ep.query[0]}=${ep.query[1]}" \\\n  -H "X-RapidAPI-Key: YOUR_KEY" \\\n  -H "X-RapidAPI-Host: ${API_HOST}"`
      : `curl -X POST \\\n  "https://${API_HOST}${ep.path}" \\\n  -H "Content-Type: application/json" \\\n  -H "X-RapidAPI-Key: YOUR_KEY" \\\n  -H "X-RapidAPI-Host: ${API_HOST}" \\\n  -d '${body}'`;
  }
  if (lang === "js") {
    const head = `const host = "${API_HOST}";\n`;
    return ep.query
      ? `${head}const url = new URL("https://" + host + "${ep.path}");\nurl.searchParams.set("${ep.query[0]}", "${ep.query[1]}");\n\nconst res = await fetch(url, {\n  headers: {\n    "X-RapidAPI-Key": "YOUR_KEY",\n    "X-RapidAPI-Host": host,\n  },\n});\nconst result = await res.json();\n\nif (result.verdict === "undeliverable") {\n  // reject the sign-up\n}`
      : `${head}\nconst res = await fetch("https://" + host + "${ep.path}", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n    "X-RapidAPI-Key": "YOUR_KEY",\n    "X-RapidAPI-Host": host,\n  },\n  body: JSON.stringify(${JSON.stringify(ep.body, null, 2).replace(/\n/g, "\n  ")}),\n});\nconst { summary, results } = await res.json();`;
  }
  const head = `import requests\n\nHOST = "${API_HOST}"\n\n`;
  return ep.query
    ? `${head}res = requests.get(\n    f"https://{HOST}${ep.path}",\n    params={"${ep.query[0]}": "${ep.query[1]}"},\n    headers={\n        "X-RapidAPI-Key": "YOUR_KEY",\n        "X-RapidAPI-Host": HOST,\n    },\n    timeout=10,\n)\nresult = res.json()\n\nif result["verdict"] == "undeliverable":\n    ...  # reject the sign-up`
    : `${head}res = requests.post(\n    f"https://{HOST}${ep.path}",\n    json={"emails": ${JSON.stringify(ep.body.emails).replace(/,/g, ", ")}},\n    headers={\n        "X-RapidAPI-Key": "YOUR_KEY",\n        "X-RapidAPI-Host": HOST,\n    },\n    timeout=20,\n)\ndata = res.json()\nprint(data["summary"])`;
}

function highlight(obj) {
  return esc(JSON.stringify(obj, null, 2)).replace(
    /(&quot;(?:(?!&quot;).)*&quot;)(\s*:)?|\b(true|false|null|-?\d+(?:\.\d+)?)\b/g,
    (m, str, colon, lit) => (str ? `<span class="${colon ? "k" : "s"}">${str}</span>${colon || ""}` : `<span class="n">${lit}</span>`),
  );
}

/* ---------- client scripts (plain ES5, no template literals inside) ---------- */

const LOOKUP_JS = String.raw`
(function(){
  var forms=document.querySelectorAll('form[data-lookup]');
  for(var i=0;i<forms.length;i++)(function(f){
    var input=f.querySelector('input'),msg=f.querySelector('.lookup-msg');
    f.addEventListener('submit',function(ev){
      ev.preventDefault();
      var d=input.value.trim().toLowerCase().replace(/^[a-z]+:\/\//,'').replace(/^.*@/,'').replace(/[\/?#].*$/,'').replace(/\.$/,'');
      if(!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(d)){
        if(msg)msg.textContent='Type a domain such as mailinator.com.';
        input.focus();return;
      }
      window.location.assign('/disposable/'+d);
    });
    input.addEventListener('input',function(){if(msg)msg.textContent='';});
  })(forms[i]);
})();`;

const LANDING_JS = String.raw`
(function(){
  var D=JSON.parse(document.getElementById('ms-data').textContent);
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return '&#'+c.charCodeAt(0)+';';});}

  /* live demo */
  var form=document.getElementById('demo'),input=document.getElementById('email'),out=document.getElementById('result');
  var btn=form.querySelector('button[type="submit"]'),seq=0;
  function row(k,v,c){return '<div><dt>'+k+'</dt><dd class="'+c+'">'+v+'</dd></div>';}
  function stamp(v,b){return D.stamps[v].replace('@@B@@',esc(b)).replace('class="postmark','class="postmark thunk');}
  function show(d){
    if(!d||d.error){out.innerHTML='<p class="res-msg">'+esc(d&&d.error?d.error.message:'The check did not go through. Try again in a moment.')+'</p>';return;}
    if(!d.valid_syntax){out.innerHTML='<dl class="slip">'+row('Valid format','No','bad')+'</dl>'+stamp('undeliverable','NOT AN EMAIL ADDRESS');return;}
    var mx={found:['Yes','good'],a_record_only:['Probably','mid'],none:['No','bad'],unknown:['Could not check','mid']}[d.mx&&d.mx.status]||['Could not check','mid'];
    var vc={deliverable:'good',risky:'mid',undeliverable:'bad'}[d.verdict]||'mid';
    var h='<dl class="slip">'
      +row('Throwaway inbox',d.disposable?'Yes':'No',d.disposable?'bad':'good')
      +row('Can receive mail',mx[0],mx[1])
      +row('Shared mailbox',d.role_account?'Yes':'No',d.role_account?'mid':'good')
      +row('Score',esc(d.score)+' / 100',vc)+'</dl>'
      +stamp(D.stamps[d.verdict]?d.verdict:'risky','SCORE '+d.score+' OF 100');
    if(d.did_you_mean)h+='<p class="res-hint">Did you mean <button type="button" data-fix="'+esc(d.did_you_mean)+'">'+esc(d.did_you_mean)+'</button>?</p>';
    out.innerHTML=h;
  }
  function run(){
    var v=input.value.trim();
    if(!v){input.focus();return;}
    var id=++seq;
    btn.disabled=true;btn.textContent='Checking';
    fetch('/demo/check?email='+encodeURIComponent(v),{headers:{accept:'application/json'}})
      .then(function(r){return r.json();})
      .then(function(d){if(id===seq)show(d);})
      .catch(function(){if(id===seq)show(null);})
      .then(function(){if(id===seq){btn.disabled=false;btn.textContent='Check address';}});
  }
  form.addEventListener('submit',function(ev){ev.preventDefault();run();});
  form.addEventListener('click',function(ev){
    var t=ev.target.closest?ev.target.closest('[data-v],[data-fix]'):null;
    if(!t)return;
    input.value=t.getAttribute('data-v')||t.getAttribute('data-fix');
    run();
  });

  /* API explorer */
  var ep='check',lang='curl',snip=document.getElementById('snippet'),resp=document.getElementById('response');
  function press(group,attr,val){
    var b=document.querySelectorAll('['+attr+']');
    for(var i=0;i<b.length;i++)b[i].setAttribute('aria-pressed',b[i].getAttribute(attr)===val?'true':'false');
  }
  function paint(){snip.textContent=D.snippets[ep][lang];resp.innerHTML=D.responses[ep];snip.parentNode.scrollTop=0;resp.parentNode.scrollTop=0;}
  document.addEventListener('click',function(ev){
    var t=ev.target.closest?ev.target.closest('[data-ep],[data-lang]'):null;
    if(!t)return;
    if(t.hasAttribute('data-ep')){ep=t.getAttribute('data-ep');press(0,'data-ep',ep);}
    else{lang=t.getAttribute('data-lang');press(0,'data-lang',lang);}
    paint();
  });
  var copy=document.getElementById('copy'),timer;
  function copied(ok){copy.textContent=ok?'Copied':'Press Ctrl+C';clearTimeout(timer);timer=setTimeout(function(){copy.textContent='Copy';},1600);}
  copy.addEventListener('click',function(){
    var text=snip.textContent;
    function fallback(){
      var r=document.createRange();r.selectNodeContents(snip);
      var s=window.getSelection();s.removeAllRanges();s.addRange(r);
      var ok=false;try{ok=document.execCommand('copy');}catch(e){}
      copied(ok);
    }
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){copied(true);},fallback);}
    else fallback();
  });
})();`;

/* ---------- shared layout ---------- */

function topNav(ctx) {
  return `<nav class="top" aria-label="Main">
<a class="brand" href="/">${SIEVE}<span>MailSieve</span></a>
<div class="top-links"><a href="/#checks">Checks</a><a href="/#api">API</a><a href="/#pricing">Pricing</a><a href="/disposable">Domain list</a><a class="btn btn-white" href="${esc(ctx.keyUrl)}"${ctx.ext}>Get a free API key</a></div>
</nav>`;
}

function lookupForm(id, error) {
  return `<form action="/disposable" method="get" data-lookup>
<label class="vh" for="${id}">Domain to look up</label>
<input id="${id}" name="domain" type="text" inputmode="url" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="mailinator.com" required>
<button class="btn btn-white" type="submit">Look up domain</button>
<p class="lookup-msg" role="status">${error ? esc(error) : ""}</p>
</form>`;
}

function footer(ctx) {
  return `<footer class="foot on-ink"><div class="wrap">
<a class="brand" href="/">${SIEVE}<span>MailSieve</span></a>
<nav aria-label="Footer"><a href="/#checks">Checks</a><a href="/#api">API</a><a href="/#pricing">Pricing</a><a href="/#faq">Questions</a><a href="/disposable">Disposable domain list</a><a href="${esc(ctx.keyUrl)}"${ctx.ext}>Get a free API key</a></nav>
<p>MailSieve reads public DNS records and an open-source blocklist that is refreshed every Monday. It never sends mail to the addresses you check.</p>
</div></footer>`;
}

function shell(ctx, { title, description, path, body, jsonLd, noindex, scripts = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${ctx.origin}${path}">
${noindex ? '<meta name="robots" content="noindex">' : ""}
<meta name="theme-color" content="#1D2BA4">
<meta property="og:type" content="website">
<meta property="og:site_name" content="MailSieve">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${ctx.origin}${path}">
<meta name="twitter:card" content="summary">
<meta name="google-site-verification" content="${GOOGLE_VERIFICATION}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
${FONTS}
<style>${CSS}</style>
${jsonLd ? `<script type="application/ld+json">${json(jsonLd)}</script>` : ""}
</head>
<body>
${INK_FILTER}
${body}
${footer(ctx)}
${scripts}
</body>
</html>`;
}

function context(ctx) {
  // Marketplace links open in a new tab so the visitor keeps the site open while they sign up.
  return { ...ctx, keyUrl: ctx.rapidUrl || "/#pricing", pricingUrl: ctx.rapidUrl ? `${ctx.rapidUrl}/pricing` : "/#pricing", ext: ctx.rapidUrl ? ' target="_blank" rel="noopener"' : "" };
}

/* ---------- landing page ---------- */

const FAQ = (n) => [
  ["Does MailSieve send email to the addresses I check?", "No. It reads the domain's public DNS records and compares the domain with a blocklist. Nothing is ever sent to the address."],
  ["Can it tell me whether one specific mailbox exists?", "No. MailSieve confirms that the domain can receive mail, but it does not connect to mail servers, so a made-up name at a real domain can still pass. It is built to stop throwaway inboxes, typos and dead domains at sign-up."],
  ["Where does the blocklist come from?", `From the open-source disposable-email-domains project, merged into MailSieve every Monday. It holds ${n} domains today, and subdomains of a listed domain are caught too.`],
  ["Do you keep the addresses I check?", "MailSieve does not store them. Requests reach MailSieve through the Rapid gateway, which keeps its own usage logs for billing."],
  ["What happens when I use up my monthly checks?", "Every plan has a hard limit. When the checks run out, calls are refused until the next billing cycle or until you move to a bigger plan. There are no per-check overage charges."],
  ["Which endpoints are on the free plan?", "Single address checks and domain checks, with every signal and the score. Bulk checks start on Pro."],
];

export function landingPage(rawCtx) {
  const ctx = context(rawCtx);
  const n = count();
  const faq = FAQ(n);

  const data = {
    stamps: { deliverable: postmark("deliverable", "@@B@@", "d"), risky: postmark("risky", "@@B@@", "d"), undeliverable: postmark("undeliverable", "@@B@@", "d") },
    snippets: Object.fromEntries(Object.entries(SAMPLES).map(([k, ep]) => [k, { curl: snippet("curl", ep), js: snippet("js", ep), python: snippet("python", ep) }])),
    responses: Object.fromEntries(Object.entries(SAMPLES).map(([k, ep]) => [k, highlight(ep.response)])),
  };

  const plan = (cls, name, price, quota, items, cta, tag) => `<article class="plan ${cls}"><div class="plan-face"><div class="plan-in">
<h3 class="plan-name"><span>${name}</span>${tag ? `<small>${tag}</small>` : ""}</h3>
<p class="price"><b>${price}</b><span>per month</span></p>
<p class="quota">${quota} checks a month</p>
<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>
<a class="btn ${cls === "p-basic" ? "btn-ink" : "btn-white"}" href="${esc(ctx.pricingUrl)}"${ctx.ext}>${cta}</a>
</div></div></article>`;

  const body = `
<header class="hero on-blue">
${waves()}
<div class="wrap">
${topNav(ctx)}
<div class="hero-grid">
<div class="hero-copy">
<h1 class="display">Return fake emails <em>to sender.</em></h1>
<p class="lead">MailSieve checks an address in one API call. It tells you if the inbox is a throwaway, if the domain can receive mail, and if the address is a typo.</p>
<div class="cta-row"><a class="btn btn-red" href="${esc(ctx.keyUrl)}"${ctx.ext}>Get a free API key</a><a class="btn btn-ghost" href="#api">See the API</a></div>
<p class="hero-note"><b>${n} throwaway domains</b> on the blocklist, refreshed every Monday. The free plan covers 500 checks a month.</p>
</div>
<div class="desk">
<div class="env-back" aria-hidden="true"></div>
<form class="env" id="demo" autocomplete="off" novalidate>
<div class="env-paper">
<div class="env-head">
<p class="env-from">MailSieve sorting office<br>Live demo, real checks</p>
<div class="pstamp" aria-hidden="true"><div class="pstamp-in">${SIEVE}<span>1 CHECK</span></div></div>
</div>
<label for="email">Address to check</label>
<div class="addr"><input id="email" name="email" type="text" inputmode="email" autocapitalize="none" spellcheck="false" placeholder="someone@example.com" value="hello@mailinator.com"><button class="btn btn-ink" type="submit">Check address</button></div>
<div class="chips"><span>Try</span><button type="button" data-v="hello@mailinator.com">hello@mailinator.com</button><button type="button" data-v="jane@outlok.com">jane@outlok.com</button><button type="button" data-v="sales@github.com">sales@github.com</button><button type="button" data-v="you@gmail.com">you@gmail.com</button></div>
<div class="res" id="result" aria-live="polite">
<dl class="slip"><div><dt>Throwaway inbox</dt><dd class="bad">Yes</dd></div><div><dt>Can receive mail</dt><dd class="good">Yes</dd></div><div><dt>Shared mailbox</dt><dd class="mid">Yes</dd></div><div><dt>Score</dt><dd class="bad">0 / 100</dd></div></dl>
${postmark("undeliverable", "SCORE 0 OF 100", "d")}
</div>
</div>
</form>
</div>
</div>
</div>
</header>

<main>
<section class="sec" id="checks">
<div class="wrap">
<div class="sec-head"><h2 class="display">Every part of the address gets read.</h2>
<p class="lead">One response carries six signals. Each one is a plain field you can branch on.</p></div>
<p class="vh">Example address: sales+promo@outlok.com</p>
<div class="anat-box"><div class="anat" aria-hidden="true"><span class="s-local">sales</span><span class="s-tag">+promo</span><span class="s-at">@</span><span class="s-dom">outlok.com</span></div></div>
<div class="notes">
<div class="note k-local"><span class="part">sales</span><h3>Shared mailbox</h3><p>Flags names like sales, info and support that no single person reads.</p><code class="field">role_account</code></div>
<div class="note k-tag"><span class="part">+promo</span><h3>Plus tag</h3><p>Spots the tag people add to sign up twice with one inbox.</p><code class="field">plus_tag</code></div>
<div class="note"><span class="part">outlok.com</span><h3>Likely typo</h3><p>Returns the address the person probably meant, here jane@outlook.com.</p><code class="field">did_you_mean</code></div>
<div class="note"><span class="part">domain</span><h3>Throwaway inbox</h3><p>Compares the domain and its parent domains with ${n} disposable providers.</p><code class="field">disposable</code></div>
<div class="note"><span class="part">domain</span><h3>Can receive mail</h3><p>Looks up the domain's mail servers live and lists them.</p><code class="field">mx.status</code></div>
<div class="note"><span class="part">domain</span><h3>Free provider</h3><p>Tells Gmail and Outlook addresses apart from company domains.</p><code class="field">free_provider</code></div>
</div>
</div>
</section>

<section class="sec sec-paper" id="verdicts">
<div class="wrap">
<div class="sec-head"><h2 class="display">Every address leaves with a stamp.</h2>
<p class="lead">The six signals add up to a score from 0 to 100 and one of three verdicts, so your sign-up form needs a single if statement.</p></div>
<div class="scale">
<div class="zone z-bad">${postmark("undeliverable", "SCORE 0 TO 29", "z1")}<div><span class="range">0 to 29</span><h3>Return to sender</h3><p>Throwaway inbox, dead domain or not an address. Reject it.</p></div></div>
<div class="zone z-mid">${postmark("risky", "SCORE 30 TO 69", "z2")}<div><span class="range">30 to 69</span><h3>Risky</h3><p>A likely typo or a domain with no mail servers listed. Ask the person to confirm.</p></div></div>
<div class="zone z-good">${postmark("deliverable", "SCORE 70 TO 100", "z3")}<div><span class="range">70 to 100</span><h3>Deliverable</h3><p>Real domain, real mail servers, nothing suspicious. Accept it.</p></div></div>
<div class="bar" aria-hidden="true"><i></i><i></i><i></i></div>
<div class="ticks" aria-hidden="true"><span>0</span><span>30</span><span><span>70</span><span>100</span></span></div>
</div>
</div>
</section>

<section class="sec sec-ink on-ink" id="api">
<div class="wrap">
<div class="sec-head"><h2 class="display">One request, one answer.</h2>
<p class="lead">Three endpoints, JSON in and out. Pick an endpoint to see the request and what comes back.</p></div>
<div class="api">
<div class="api-tabs">
${Object.entries(SAMPLES).map(([k, ep], i) => `<button type="button" data-ep="${k}" aria-pressed="${i === 0}"><span class="meth ${ep.method.toLowerCase()}">${ep.method}</span><span class="path">${ep.path}</span><span class="what">${ep.what}</span></button>`).join("\n")}
</div>
<div class="panes">
<div class="pane">
<div class="pane-bar"><div class="langs"><button type="button" data-lang="curl" aria-pressed="true">cURL</button><button type="button" data-lang="js" aria-pressed="false">JavaScript</button><button type="button" data-lang="python" aria-pressed="false">Python</button></div><button type="button" class="copy" id="copy">Copy</button></div>
<pre tabindex="0" aria-label="Request example"><code id="snippet">${esc(data.snippets.check.curl)}</code></pre>
</div>
<div class="pane">
<div class="pane-bar"><span>Response</span><span class="status">200 OK</span></div>
<pre tabindex="0" aria-label="Response example"><code id="response">${data.responses.check}</code></pre>
</div>
</div>
<p class="api-foot">Replace <code>YOUR_KEY</code> with the key Rapid gives you when you subscribe. The free plan is enough to try every field.</p>
</div>
</div>
</section>

<section class="sec sec-paper" id="pricing">
<div class="wrap">
<div class="sec-head"><h2 class="display">Pay the postage you need.</h2>
<p class="lead">Start free and move up when your sign-ups do. Keys, billing and invoices run through the Rapid marketplace, and you can cancel there at any time.</p></div>
<div class="plans">
${plan("p-basic", "Basic", "$0", "500", ["Address and domain checks", "All six signals and the score", "Blocklist refreshed weekly"], "Start free")}
${plan("p-pro", "Pro", "$9", "25,000", ["Everything in Basic", "Bulk checks, 50 addresses a call", "For a live sign-up form"], "Choose Pro", "Most picked")}
${plan("p-ultra", "Ultra", "$29", "150,000", ["Everything in Pro", "Six times the volume of Pro", "For busy products"], "Choose Ultra")}
${plan("p-mega", "Mega", "$79", "1,000,000", ["Everything in Pro", "The lowest price per check", "For cleaning whole lists"], "Choose Mega")}
</div>
<p class="plans-note">Every plan has a hard monthly limit, so there are no surprise charges for extra checks.</p>
</div>
</section>

<section class="sec sec-blue on-blue" id="lookup">
<div class="wrap lookup">
<div><h2 class="display">Is a domain on the blocklist?</h2>
<p class="lead">Look up any domain for free. Each of the ${n} listed domains has its own page.</p></div>
<div>${lookupForm("lookup-home")}
<p class="lookup-more">Or <a href="/disposable">browse the whole list</a>.</p></div>
</div>
</section>

<section class="sec" id="faq">
<div class="wrap faq-grid">
<div class="faq-side"><h2 class="display">Questions people ask first.</h2>
<p class="lead">Short answers about what MailSieve does, and what it does not do.</p>
<a class="btn btn-line" href="#api">See the API</a></div>
<div class="faq">
${faq.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("\n")}
</div>
</div>
</section>

<section class="sec sec-red on-blue">
<div class="wrap close-grid">
<div class="close">
<h2 class="display">Stop the fakes at the front door.</h2>
<a class="btn btn-white" href="${esc(ctx.keyUrl)}"${ctx.ext}>Get a free API key</a>
</div>
${postmark("undeliverable", "FAKES STOP HERE", "c")}
</div>
</section>
</main>`;

  return shell(ctx, {
    title: "MailSieve: email validation and disposable email detection API",
    description: `Check any email address in one API call: disposable domain detection across ${n} domains, live MX lookup, typo suggestions and a 0 to 100 score. Free plan available.`,
    path: "/",
    body,
    scripts: `<script type="application/json" id="ms-data">${json(data)}</script>\n<script>${LANDING_JS}</script>\n<script>${LOOKUP_JS}</script>`,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebAPI", name: "MailSieve", url: ctx.origin + "/", documentation: ctx.origin + "/#api",
          description: "Email validation and disposable email detection API.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        { "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
      ],
    },
  });
}

/* ---------- one page per domain ---------- */

export function domainPage(rawCtx, domain) {
  const ctx = context(rawCtx);
  const info = checkDomainStatic(domain);
  const d = esc(domain);
  const i = DISPOSABLE_SORTED.indexOf(domain);
  const near = i >= 0
    ? [...DISPOSABLE_SORTED.slice(Math.max(0, i - 9), i), ...DISPOSABLE_SORTED.slice(i + 1, i + 10)]
    : DISPOSABLE_SORTED.slice(0, 18);
  const q = `Is ${domain} a disposable email domain?`;
  const a = info.disposable
    ? `Yes. ${domain} is on the MailSieve blocklist of disposable email providers. Addresses at this domain are temporary inboxes that anyone can open without signing up, so they are often used for fake sign-ups and free-trial abuse.`
    : `No. ${domain} is not on the MailSieve blocklist of disposable email providers.${info.free_provider ? " It is a free consumer email provider." : ""}`;
  const typo = info.did_you_mean && DOMAIN_RE.test(info.did_you_mean) ? info.did_you_mean : null;

  const body = `
<header class="sub-hero on-blue">
<div class="wrap">
${topNav(ctx)}
<div class="sub-grid">
<div>
<p class="crumb"><a href="/disposable">Disposable domain list</a></p>
<h1 class="sub-q">${esc(q)}</h1>
<p class="display sub-a"><span class="dom">${d}</span>${info.disposable ? "Yes, it is disposable." : "No, it is not listed."}</p>
</div>
${postmark(info.disposable ? "listed" : "clear", info.disposable ? "ON THE BLOCKLIST" : "NOT ON THE BLOCKLIST", "h")}
</div>
</div>
</header>

<main>
<section class="sec">
<div class="wrap">
<div class="prose">
<p>${esc(a)}</p>
${info.disposable ? `<p>If you run a sign-up form, a newsletter or a free trial, turning away addresses at ${d} keeps fake accounts off your list and protects your sender reputation.</p>` : `<p>A domain that is not listed can still be a typo or have no mail servers. The MailSieve API checks those as well.</p>`}
${typo ? `<p>This domain looks like a misspelling of <a href="/disposable/${esc(typo)}">${esc(typo)}</a>.</p>` : ""}
</div>
</div>
</section>

<section class="sec sec-ink on-ink">
<div class="wrap">
<div class="sec-head"><h2 class="display">Check ${d} addresses in your own app.</h2>
<p class="lead">The MailSieve API runs this blocklist check, a live mail-server lookup and typo detection on any address in one request.</p></div>
<pre class="solo-code" tabindex="0" aria-label="Request example"><code>${esc(`curl --get "https://${API_HOST}/v1/check" \\\n  --data-urlencode "email=someone@${domain}" \\\n  -H "X-RapidAPI-Key: YOUR_KEY" \\\n  -H "X-RapidAPI-Host: ${API_HOST}"`)}</code></pre>
<div class="cta-row"><a class="btn btn-red" href="${esc(ctx.keyUrl)}"${ctx.ext}>Get a free API key</a><a class="btn btn-ghost" href="/#api">See the API</a></div>
</div>
</section>

<section class="sec sec-paper">
<div class="wrap">
<h2 class="display">${info.disposable ? "Neighbours on the list." : "Domains on the list."}</h2>
<ul class="cols">${near.map((x) => `<li><a href="/disposable/${esc(x)}">${esc(x)}</a></li>`).join("")}</ul>
</div>
</section>

<section class="sec sec-blue on-blue">
<div class="wrap lookup">
<div><h2 class="display">Look up another domain.</h2></div>
<div>${lookupForm("lookup-domain")}
<p class="lookup-more">Or <a href="/disposable">browse the whole list</a>.</p></div>
</div>
</section>
</main>`;

  return shell(ctx, {
    title: `${q} ${info.disposable ? "Yes" : "No"} | MailSieve`,
    description: a.length > 158 ? a.slice(0, 155).replace(/\s+\S*$/, "") + "..." : a,
    path: `/disposable/${domain}`,
    body,
    noindex: !info.disposable,
    scripts: `<script>${LOOKUP_JS}</script>`,
    jsonLd: {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: [{ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }],
    },
  });
}

/* ---------- list pages ---------- */

export function listPage(rawCtx, letter, error) {
  const ctx = context(rawCtx);
  const letters = [...new Set(DISPOSABLE_SORTED.map((x) => x[0]))].sort();
  const items = letter ? DISPOSABLE_SORTED.filter((x) => x[0] === letter) : [];
  const n = count();
  const L = letter ? letter.toUpperCase() : "";
  const body = `
<header class="sub-hero on-blue">
<div class="wrap">
${topNav(ctx)}
<div class="sub-grid">
<div>
${letter ? `<p class="crumb"><a href="/disposable">Disposable domain list</a></p>` : ""}
<h1 class="display sub-a" style="margin-top:${letter ? "1.2rem" : "0"}">${letter ? `Disposable email domains starting with ${esc(L)}` : "Disposable email domain list"}</h1>
<p class="lead">${letter ? `${items.length.toLocaleString("en-US")} of the ${n} domains on the MailSieve blocklist start with ${esc(L)}.` : `${n} domains that hand out temporary inboxes, refreshed every Monday.`}</p>
</div>
</div>
</div>
</header>

<main>
<section class="sec sec-blue on-blue" style="padding-top:0">
<div class="wrap lookup">
<div><h2 class="display">Is a domain on the blocklist?</h2></div>
<div>${lookupForm("lookup-list", error)}</div>
</div>
</section>

<section class="sec sec-paper">
<div class="wrap">
<h2 class="display">${letter ? `Domains starting with ${esc(L)}` : "Browse by first character."}</h2>
<nav class="letters" aria-label="First character">${letters.map((l) => `<a href="/disposable/starting-with/${l}"${l === letter ? ' aria-current="page"' : ""}>${l.toUpperCase()}</a>`).join("")}</nav>
${letter ? `<ul class="cols">${items.map((x) => `<li><a href="/disposable/${esc(x)}">${esc(x)}</a></li>`).join("")}</ul>` : ""}
</div>
</section>

<section class="sec sec-ink on-ink">
<div class="wrap close">
<h2 class="display">Check addresses against this list automatically.</h2>
<div class="cta-row" style="margin-top:0"><a class="btn btn-red" href="${esc(ctx.keyUrl)}"${ctx.ext}>Get a free API key</a><a class="btn btn-ghost" href="/#api">See the API</a></div>
</div>
</section>
</main>`;
  return shell(ctx, {
    title: letter ? `Disposable email domains starting with ${L} | MailSieve` : "Disposable email domain list | MailSieve",
    description: letter
      ? `${items.length.toLocaleString("en-US")} disposable and temporary email domains starting with ${L}, from a blocklist of ${n} refreshed weekly.`
      : `Browse ${n} disposable and temporary email domains, refreshed weekly, or look up any domain. Check addresses automatically with the MailSieve API.`,
    path: letter ? `/disposable/starting-with/${letter}` : "/disposable",
    body,
    noindex: Boolean(error),
    scripts: `<script>${LOOKUP_JS}</script>`,
  });
}

export function notFoundPage(rawCtx) {
  const ctx = context(rawCtx);
  return shell(ctx, {
    title: "Page not found | MailSieve", description: "This page does not exist.", path: "/404", noindex: true,
    body: `
<header class="sub-hero on-blue">
<div class="wrap">
${topNav(ctx)}
<div class="sub-grid">
<div>
<h1 class="display sub-a">This page was returned to sender.</h1>
<p class="lead">The address you followed does not exist on MailSieve.</p>
<div class="cta-row"><a class="btn btn-white" href="/">Go to the home page</a><a class="btn btn-ghost" href="/disposable">Browse the domain list</a></div>
</div>
${postmark("undeliverable", "ERROR 404", "h")}
</div>
</div>
</header>`,
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
