// Site-wide stylesheet. Theme: an airmail sorting office.
// Ultramarine field, airmail-stripe envelope, postmarks for verdicts, postage stamps for plans.
export const CSS = `
:root{
--blue:#1D2BA4;--blue-hi:#3346D8;--blue-lo:#141E7C;--ink:#0B1136;--ink-2:#151D4E;
--paper:#E7EDFA;--card:#FFFFFF;--line:#CCD6EE;--soft:#525E8B;--sky:#C7D1FF;
--red:#D4281C;--red-lo:#B31E14;--green:#0C7A53;--amber:#A35F00;
--display:"Archivo","Arial Narrow","Helvetica Neue",Arial,sans-serif;
--body:"Archivo",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
--type:"Courier Prime","Courier New",Courier,monospace;
--code:ui-monospace,"SF Mono","Cascadia Code",Menlo,Consolas,monospace;
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--card);color:var(--ink);font:400 1.0625rem/1.6 var(--body);-webkit-font-smoothing:antialiased;overflow-x:hidden}
img,svg{max-width:100%}
h1,h2,h3,p,ul,ol,dl,dd,figure{margin:0}
ul,ol{padding:0;list-style:none}
a{color:inherit}
button,input{font:inherit;color:inherit}
button{cursor:pointer}
:focus-visible{outline:3px solid var(--blue-hi);outline-offset:3px;border-radius:4px}
.on-blue :focus-visible,.on-ink :focus-visible{outline-color:#fff}
.wrap{width:100%;max-width:1200px;margin:0 auto;padding:0 clamp(1.15rem,4vw,2.5rem)}
.vh{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

/* Type */
.display{font-family:var(--display);font-stretch:66%;font-weight:800;letter-spacing:-.012em;line-height:.93;text-wrap:balance}
h2.display{font-size:clamp(2.5rem,6.4vw,4.75rem)}
h3{font-family:var(--display);font-stretch:82%;font-weight:700;font-size:1.3rem;line-height:1.15;letter-spacing:-.005em}
.lead{font-size:clamp(1.08rem,1.6vw,1.28rem);line-height:1.5;color:var(--soft);max-width:56ch;margin-top:1.5rem}
.on-blue .lead,.on-ink .lead{color:var(--sky)}
code,pre,kbd{font-family:var(--code)}
.field{font-family:var(--code);font-size:.8rem;color:var(--soft);background:var(--paper);padding:.12rem .4rem;border-radius:4px;white-space:nowrap}

/* Buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:3rem;padding:.7rem 1.3rem;border:2px solid transparent;border-radius:8px;font-weight:650;font-size:1rem;line-height:1.1;text-decoration:none;white-space:nowrap;transition:transform .12s ease,background-color .12s ease,border-color .12s ease}
.btn:active{transform:translateY(1px)}
.btn-red{background:var(--red);color:#fff}
.btn-red:hover{background:var(--red-lo)}
.btn-ink{background:var(--ink);color:#fff}
.btn-ink:hover{background:var(--ink-2)}
.btn-blue{background:var(--blue);color:#fff}
.btn-blue:hover{background:var(--blue-lo)}
.btn-white{background:#fff;color:var(--ink)}
.btn-white:hover{background:var(--paper)}
.btn-ghost{border-color:rgba(255,255,255,.45);color:#fff}
.btn-ghost:hover{border-color:#fff;background:rgba(255,255,255,.08)}
.btn-line{border-color:var(--ink);color:var(--ink);background:transparent}
.btn-line:hover{background:var(--ink);color:#fff}
.btn[disabled]{opacity:.6;cursor:progress}

/* Header */
.top{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1.25rem 0}
.brand{display:inline-flex;align-items:center;gap:.6rem;font-family:var(--display);font-stretch:78%;font-weight:800;font-size:1.5rem;letter-spacing:-.01em;text-decoration:none;color:#fff}
.brand svg{width:2rem;height:2rem;flex:none}
.top-links{display:flex;align-items:center;gap:clamp(.9rem,2.2vw,1.9rem)}
.top-links a:not(.btn){color:#fff;text-decoration:none;font-weight:500;font-size:.98rem;opacity:.86}
.top-links a:not(.btn):hover{opacity:1;text-decoration:underline;text-underline-offset:.3em}
.top-links .btn{min-height:2.6rem;padding:.5rem 1rem;font-size:.95rem}
@media(max-width:820px){.top-links a:not(.btn){display:none}}

/* Hero */
.hero{position:relative;isolation:isolate;color:#fff;background:radial-gradient(900px 620px at 88% -8%,var(--blue-hi) 0,rgba(51,70,216,0) 62%),radial-gradient(700px 500px at -10% 110%,var(--blue-lo) 0,rgba(20,30,124,0) 60%),var(--blue);overflow:hidden}
.hero-waves{position:absolute;z-index:-1;right:-6%;top:5.5rem;width:min(62rem,96vw);opacity:.16;pointer-events:none}
.hero-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(2.5rem,6vw,4rem);align-items:center;padding:clamp(1.5rem,5vw,4rem) 0 clamp(4rem,9vw,7rem)}
@media(min-width:1000px){.hero-grid{grid-template-columns:minmax(0,11fr) minmax(0,10fr)}}
.hero-copy{container-type:inline-size;min-width:0}
.hero h1{font-size:clamp(3.1rem,14.5vw,6rem);padding-bottom:.1em}
@supports (font-size:1cqi){.hero h1{font-size:clamp(3.1rem,17cqi,7.2rem)}}
.hero h1 em{font-style:normal;white-space:nowrap;box-shadow:inset 0 -.13em 0 var(--red)}
.hero .lead{max-width:34rem;margin-top:1.4rem}
.cta-row{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:2rem}
.hero-note{margin-top:1.6rem;font-size:.95rem;color:var(--sky);max-width:30rem}
.hero-note b{color:#fff;font-weight:650}

/* Envelope demo */
.desk{position:relative;min-width:0}
.env-back{position:absolute;inset:0;border-radius:12px;background:#B9C5F3;transform:rotate(-3.5deg) translate(-1.2%,3%);opacity:.5}
.env{position:relative;border-radius:12px;padding:13px;background:repeating-linear-gradient(-45deg,var(--red) 0 15px,#fff 15px 30px,#2C45CC 30px 45px,#fff 45px 60px);box-shadow:0 44px 70px -34px rgba(4,8,46,.85),0 10px 24px -12px rgba(4,8,46,.5)}
.env-paper{position:relative;background:#FDFEFF;color:var(--ink);border-radius:3px;padding:clamp(1.15rem,3vw,1.75rem)}
.env-head{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:1.4rem}
.env-from{font-family:var(--type);font-size:.82rem;line-height:1.35;color:var(--soft)}
.pstamp{flex:none;--r:4px;padding:calc(1.5*var(--r));background:var(--red);color:#fff;-webkit-mask:linear-gradient(#000 0 0) no-repeat 50%/calc(100% - 2*var(--r)) calc(100% - 2*var(--r)),radial-gradient(farthest-side,#000 97%,#0000) 0 0/calc(2*var(--r)) calc(2*var(--r)) round;mask:linear-gradient(#000 0 0) no-repeat 50%/calc(100% - 2*var(--r)) calc(100% - 2*var(--r)),radial-gradient(farthest-side,#000 97%,#0000) 0 0/calc(2*var(--r)) calc(2*var(--r)) round}
.pstamp-in{border:1.5px solid rgba(255,255,255,.75);padding:.4rem .55rem;display:grid;justify-items:center;gap:.1rem;font-family:var(--display);font-stretch:70%;font-weight:800;line-height:1}
.pstamp-in svg{width:1.6rem;height:1.6rem}
.pstamp-in span{font-size:.72rem;letter-spacing:.04em}
.env label{display:block;font-size:.9rem;font-weight:600;color:var(--soft);margin-bottom:.35rem}
.addr{display:flex;gap:.7rem;flex-wrap:wrap;align-items:stretch}
.addr input{flex:1 1 14rem;min-width:0;border:0;border-bottom:2.5px solid var(--ink);border-radius:0;background:transparent;padding:.5rem .1rem;font-family:var(--type);font-weight:700;font-size:clamp(1.05rem,2.6vw,1.3rem);color:var(--ink)}
.addr input::placeholder{color:#97A2C4;font-weight:400}
.addr input:focus-visible{outline:0;border-bottom-color:var(--blue-hi);box-shadow:0 2.5px 0 var(--blue-hi)}
.addr .btn{flex:0 0 auto}
@media(max-width:520px){.addr .btn{flex:1 1 100%}}
.chips{display:flex;flex-wrap:wrap;align-items:center;gap:.45rem;margin-top:.95rem;font-size:.88rem;color:var(--soft)}
.chips button{font-family:var(--type);font-size:.84rem;background:var(--paper);border:1px solid transparent;border-radius:999px;padding:.28rem .7rem;color:var(--ink)}
.chips button:hover{border-color:var(--blue)}
.res{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:1rem 1.25rem;align-items:center;margin-top:1.3rem;padding-top:1.2rem;border-top:1.5px dashed var(--line);min-height:11.5rem}
.slip div{display:flex;justify-content:space-between;gap:1rem;padding:.42rem 0;border-bottom:1px solid #E4EAF7;font-size:.98rem}
.slip div:last-child{border-bottom:0}
.slip dt{color:var(--soft)}
.slip dd{font-weight:700;text-align:right}
.slip dd.good{color:var(--green)}
.slip dd.bad{color:var(--red)}
.slip dd.mid{color:var(--amber)}
.res-msg{grid-column:1/-1;align-self:center;color:var(--soft);font-size:1rem}
.res-hint{grid-column:1/-1;font-size:.95rem;color:var(--soft)}
.res-hint button{background:none;border:0;padding:0;font-family:var(--type);font-weight:700;color:var(--blue);text-decoration:underline;text-underline-offset:.2em}
.postmark{width:clamp(7.5rem,24vw,10.2rem);flex:none;transform:rotate(-9deg);mix-blend-mode:multiply}
.postmark svg{display:block;width:100%;height:auto;overflow:visible}
.postmark.is-deliverable{color:var(--green)}
.postmark.is-risky{color:var(--amber)}
.postmark.is-undeliverable{color:var(--red)}
.postmark.thunk{animation:thunk .34s cubic-bezier(.2,1.5,.35,1) both}
@keyframes thunk{0%{transform:rotate(4deg) scale(1.9);opacity:0}60%{opacity:1}100%{transform:rotate(-9deg) scale(1);opacity:1}}
@media(prefers-reduced-motion:reduce){.postmark.thunk{animation:none}}
@media(max-width:420px){.res{grid-template-columns:minmax(0,1fr)}.postmark{justify-self:end;margin-top:-.4rem}}

/* Sections */
.sec{padding:clamp(4.25rem,9.5vw,7.75rem) 0}
.sec-paper{background:var(--paper)}
.sec-ink{background:var(--ink);color:#fff}
.sec-blue{background:var(--blue);color:#fff}
.sec-red{background:var(--red);color:#fff}
.sec-head{max-width:46rem}

/* Anatomy of an address */
.anat-box{container-type:inline-size;margin:clamp(2.5rem,6vw,4.5rem) 0 clamp(2rem,5vw,3.5rem)}
.anat{font-family:var(--type);font-weight:700;font-size:clamp(1.05rem,5.6vw,5rem);line-height:1.5;white-space:nowrap;color:var(--ink)}
@supports (font-size:1cqi){.anat{font-size:clamp(1.05rem,7.1cqi,5.6rem)}}
.anat span{display:inline-block;border-bottom:.11em solid transparent;padding-bottom:.04em}
.anat .s-local{border-color:var(--red)}
.anat .s-tag{border-color:var(--amber)}
.anat .s-dom{border-color:var(--blue-hi)}
.anat .s-at{color:#9AA5C8;padding:0 .04em}
.notes{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,17.5rem),1fr));gap:2.2rem clamp(1.5rem,4vw,3.5rem)}
.note{border-top:4px solid var(--k,var(--blue-hi));padding-top:1rem}
.note.k-local{--k:var(--red)}
.note.k-tag{--k:var(--amber)}
.note p{color:var(--soft);font-size:1rem;margin:.4rem 0 .7rem}
.note .part{display:block;font-family:var(--type);font-size:.85rem;font-weight:700;color:var(--k,var(--blue-hi));margin-bottom:.35rem}

/* Verdict scale */
.scale{margin-top:clamp(2.5rem,6vw,4rem);display:grid;grid-template-columns:minmax(0,1fr);gap:2rem}
.zone{display:grid;grid-template-columns:auto minmax(0,1fr);gap:1.1rem;align-items:center}
.zone .postmark{width:8rem;transform:rotate(-7deg)}
.zone .range{display:block;font-family:var(--type);font-weight:700;font-size:.95rem;margin-bottom:.25rem}
.zone p{color:var(--soft);font-size:1rem;margin-top:.3rem}
.zone.z-bad .range{color:var(--red)}
.zone.z-mid .range{color:var(--amber)}
.zone.z-good .range{color:var(--green)}
.bar{display:none}
@media(min-width:900px){
.scale{grid-template-columns:30fr 40fr 30fr;gap:0;align-items:end}
.zone{grid-template-columns:minmax(0,1fr);justify-items:start;gap:.9rem;padding:0 1.5rem 1.6rem 0}
.zone .postmark{width:10.5rem}
.bar{display:grid;grid-column:1/-1;grid-template-columns:30fr 40fr 30fr;height:14px;border-radius:999px;overflow:hidden}
.bar i:nth-child(1){background:var(--red)}
.bar i:nth-child(2){background:#E0A12B}
.bar i:nth-child(3){background:var(--green)}
.ticks{grid-column:1/-1;display:grid;grid-template-columns:30fr 40fr 30fr;font-family:var(--type);font-size:.9rem;color:var(--soft);margin-top:.5rem}
.ticks span:last-child{display:flex;justify-content:space-between}
}
@media(max-width:899px){.ticks{display:none}}

/* API explorer */
.api{margin-top:clamp(2.2rem,5vw,3.5rem)}
.api-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6rem}
.api-tabs button{display:grid;gap:.3rem;text-align:left;background:var(--ink-2);border:2px solid transparent;border-radius:10px;padding:.9rem 1rem;color:#fff}
.api-tabs button:hover{border-color:#3B4690}
.api-tabs button[aria-pressed="true"]{border-color:#fff;background:#1C2666}
.api-tabs .meth{font-family:var(--code);font-size:.74rem;font-weight:700;letter-spacing:.03em}
.api-tabs .meth.get{color:#7CE0B4}
.api-tabs .meth.post{color:#FFC46B}
.api-tabs .path{font-family:var(--code);font-size:.95rem;overflow-wrap:anywhere}
.api-tabs .what{font-size:.9rem;color:var(--sky)}
@media(max-width:700px){.api-tabs{grid-template-columns:minmax(0,1fr)}.api-tabs button{grid-template-columns:auto minmax(0,1fr);align-items:baseline;column-gap:.7rem}.api-tabs .what{grid-column:1/-1}}
.panes{display:grid;grid-template-columns:minmax(0,1fr);gap:.9rem;margin-top:.9rem}
@media(min-width:960px){.panes{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
.pane{min-width:0;background:#060A26;border:1px solid #232C68;border-radius:12px;overflow:hidden;display:flex;flex-direction:column}
.pane-bar{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.55rem .65rem .55rem 1rem;border-bottom:1px solid #232C68;min-height:3.1rem;font-size:.88rem;color:var(--sky)}
.langs{display:flex;gap:.2rem}
.langs button{background:none;border:0;border-radius:6px;padding:.4rem .7rem;font-size:.88rem;font-weight:600;color:var(--sky)}
.langs button:hover{color:#fff}
.langs button[aria-pressed="true"]{background:#1C2666;color:#fff}
.copy{background:none;border:1px solid #3B4690;border-radius:6px;padding:.36rem .75rem;font-size:.84rem;font-weight:600;color:#fff;min-width:4.6rem}
.copy:hover{border-color:#fff}
.status{font-family:var(--code);font-size:.8rem;color:#7CE0B4;padding-right:.4rem}
.pane pre{margin:0;padding:1.1rem 1.15rem 1.3rem;font-size:.84rem;line-height:1.62;color:#DDE4FF;overflow:auto;max-height:27rem;flex:1;tab-size:2}
.pane pre .k{color:#9DB5FF}
.pane pre .s{color:#FFB4A6}
.pane pre .n{color:#7CE0B4}
.api-foot{margin-top:1.5rem;color:var(--sky);font-size:.98rem;max-width:62ch}
.api-foot code{font-size:.86rem;color:#fff}

/* Plans as postage stamps */
.plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,15.5rem),1fr));gap:1.4rem;margin-top:clamp(2.2rem,5vw,3.5rem);align-items:stretch}
.plan{--r:7px;--bg:#fff;--fg:var(--ink);--sub:var(--soft);--rule:var(--line);filter:drop-shadow(0 16px 18px rgba(11,17,54,.16));display:flex}
.plan-face{flex:1;display:flex;padding:calc(1.5*var(--r));background:var(--bg);color:var(--fg);-webkit-mask:linear-gradient(#000 0 0) no-repeat 50%/calc(100% - 2*var(--r)) calc(100% - 2*var(--r)),radial-gradient(farthest-side,#000 97%,#0000) 0 0/calc(2*var(--r)) calc(2*var(--r)) round;mask:linear-gradient(#000 0 0) no-repeat 50%/calc(100% - 2*var(--r)) calc(100% - 2*var(--r)),radial-gradient(farthest-side,#000 97%,#0000) 0 0/calc(2*var(--r)) calc(2*var(--r)) round}
.plan-in{flex:1;display:flex;flex-direction:column;border:1.5px solid var(--rule);padding:1.3rem 1.15rem 1.2rem}
.plan.p-pro{--bg:var(--red);--fg:#fff;--sub:#FFD9D4;--rule:rgba(255,255,255,.6)}
.plan.p-ultra{--bg:var(--blue);--fg:#fff;--sub:var(--sky);--rule:rgba(255,255,255,.5)}
.plan.p-mega{--bg:var(--ink);--fg:#fff;--sub:var(--sky);--rule:rgba(255,255,255,.4)}
.plan-name{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem;font-family:var(--display);font-stretch:78%;font-weight:800;font-size:1.25rem}
.plan-name small{font-family:var(--body);font-stretch:100%;font-weight:600;font-size:.78rem;border:1.5px solid currentColor;border-radius:999px;padding:.1rem .55rem}
.price{display:flex;flex-wrap:wrap;align-items:baseline;gap:.1rem .5rem;margin:.9rem 0 .2rem}
.price b{font-family:var(--display);font-stretch:64%;font-weight:800;font-size:clamp(4rem,7vw,5rem);line-height:.9;letter-spacing:-.02em}
.price span{font-size:.92rem;color:var(--sub);white-space:nowrap}
.quota{font-weight:650;font-size:1.02rem;padding-bottom:.9rem;border-bottom:1.5px solid var(--rule)}
.plan ul{margin:.9rem 0 1.3rem;display:grid;gap:.45rem;font-size:.96rem;color:var(--sub);flex:1;align-content:start}
.plan .btn{width:100%}
.plans-note{margin-top:1.8rem;color:var(--soft);font-size:.98rem;max-width:62ch}

/* Blocklist lookup */
.lookup{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(2rem,5vw,4rem);align-items:center}
@media(min-width:900px){.lookup{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
.lookup form{display:flex;flex-wrap:wrap;gap:.7rem}
.lookup input{flex:1 1 13rem;min-width:0;min-height:3rem;border:2px solid rgba(255,255,255,.5);border-radius:8px;background:rgba(255,255,255,.08);color:#fff;padding:.6rem .9rem;font-family:var(--type);font-size:1.05rem}
.lookup input::placeholder{color:#AEB9F2}
.lookup input:focus-visible{outline:0;border-color:#fff;background:rgba(255,255,255,.14)}
.lookup-msg{flex:1 1 100%;min-height:1.4em;font-size:.95rem;color:#FFD9D4}
.lookup-more{margin-top:.4rem;font-size:.98rem;color:var(--sky)}
.lookup-more a{color:#fff}

/* FAQ */
.faq-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:clamp(2rem,5vw,3rem)}
@media(min-width:960px){.faq-grid{grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:4rem;align-items:start}.faq-side{position:sticky;top:2rem}}
.faq-side .btn{margin-top:1.8rem}
.faq{border-top:2px solid var(--ink)}
.faq details{border-bottom:1px solid var(--line)}
.faq summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:1.5rem;padding:1.15rem 0;font-family:var(--display);font-stretch:84%;font-weight:700;font-size:clamp(1.12rem,2vw,1.32rem);line-height:1.25;cursor:pointer}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"";flex:none;width:.7rem;height:.7rem;border-right:2.5px solid var(--red);border-bottom:2.5px solid var(--red);transform:translateY(-25%) rotate(45deg);transition:transform .16s ease}
.faq details[open] summary::after{transform:translateY(15%) rotate(-135deg)}
.faq details p{padding:0 0 1.3rem;color:var(--soft);max-width:60ch}
@media(prefers-reduced-motion:reduce){.faq summary::after{transition:none}}

/* Closing band + footer */
.close{display:grid;gap:1.6rem;justify-items:start}
.close h2{font-size:clamp(2.6rem,7.5vw,5.6rem);max-width:13ch}
.close-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:2.5rem;align-items:center}
@media(min-width:860px){.close-grid{grid-template-columns:minmax(0,1fr) auto}}
.close-grid .postmark{width:clamp(10rem,24vw,17rem);color:#fff;mix-blend-mode:normal;transform:rotate(11deg);justify-self:center}
.foot{background:var(--ink);color:var(--sky);padding:2.6rem 0 3rem;font-size:.95rem}
.foot .wrap{display:grid;gap:1.4rem}
.foot nav{display:flex;flex-wrap:wrap;gap:.5rem 1.6rem}
.foot a{color:#fff;text-decoration:none}
.foot a:hover{text-decoration:underline;text-underline-offset:.3em}
.foot p{max-width:64ch}
.sec-ink + .foot{border-top:1px solid #232C68}

/* Inner pages (domain + list) */
.sub-hero{position:relative;isolation:isolate;color:#fff;background:radial-gradient(800px 480px at 92% -20%,var(--blue-hi) 0,rgba(51,70,216,0) 62%),var(--blue);overflow:hidden}
.sub-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:2rem;align-items:center;padding:clamp(1.2rem,4vw,2.6rem) 0 clamp(3.2rem,7vw,5rem)}
@media(min-width:860px){.sub-grid{grid-template-columns:minmax(0,1fr) auto}}
.crumb{font-size:.95rem;color:var(--sky)}
.crumb a{color:#fff;text-underline-offset:.25em}
.sub-q{font-family:var(--body);font-weight:500;font-size:clamp(1.05rem,2vw,1.25rem);color:var(--sky);margin:1.4rem 0 .8rem}
.sub-a{font-size:clamp(2.6rem,7.6vw,5.4rem);overflow-wrap:anywhere}
.sub-a .dom{font-family:var(--type);font-stretch:100%;font-weight:700;font-size:.62em;letter-spacing:-.02em;display:block;margin-bottom:.35em;color:#fff;line-height:1.1}
.sub-hero .postmark{width:clamp(9rem,26vw,13rem);background:#FDFEFF;border-radius:50%;padding:.55rem;mix-blend-mode:normal;box-shadow:0 26px 40px -22px rgba(4,8,46,.8)}
.prose{display:grid;gap:1rem;max-width:62ch;font-size:1.1rem}
.prose p{color:var(--soft)}
.prose p:first-child{color:var(--ink)}
.prose a{color:var(--blue);text-underline-offset:.2em}
.cols{columns:13.5rem;column-gap:2rem;margin-top:1.8rem}
.cols li{break-inside:avoid;padding:.24rem 0}
.cols a{font-family:var(--type);font-size:1rem;color:var(--ink);text-decoration:none;border-bottom:1px solid var(--line)}
.cols a:hover{color:var(--blue);border-color:var(--blue)}
.letters{display:flex;flex-wrap:wrap;gap:.45rem;margin-top:1.8rem}
.letters a{display:grid;place-items:center;min-width:2.9rem;height:2.9rem;border-radius:8px;background:#fff;color:var(--ink);text-decoration:none;font-family:var(--display);font-stretch:80%;font-weight:800;font-size:1.15rem;border:2px solid transparent}
.letters a:hover{border-color:var(--blue)}
.letters a[aria-current="page"]{background:var(--ink);color:#fff}
.solo-code{background:#060A26;border-radius:12px;padding:1.2rem 1.25rem;margin-top:1.8rem;overflow:auto;font-size:.86rem;line-height:1.62;color:#DDE4FF;max-width:48rem}
`;
