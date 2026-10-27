// v0.3 verification: hit test for every enemy bullet type, boss parts, hangar buy by touch, persistence, screenshots
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8765/';
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fails=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++;};
const mk=async q=>{const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});await p.emulate({viewport:{width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true},userAgent:'Mozilla/5.0 (Linux; Android 13) Mobile'});await p.goto(U+q,{waitUntil:'load'});await sleep(900);return p;};
// 1) HIT TEST: each bullet type, boss debug (no inv)
let p=await mk('?debug=boss,autostart');
const r1=await p.evaluate(()=>{const out=[];const G=NG.G,P=NG.P;
 for(const big of [false,true]){for(const off of [0,4,big?6:4]){P.inv=0;P.dead=0;G.bombT=0;NG.EB.clear();const s0=G.shield;const bl=NG.EB.get();bl.x=P.x+off;bl.y=P.y-6;bl.vx=0;bl.vy=2;bl.big=big;bl.r=big?6:4;NG.step(3);out.push({big,off,hit:G.shield<s0||P.dead>0});G.shield=G.maxSh;P.inv=0;}}
 return out;});
for(const r of r1)ok(r.hit,'bullet big='+r.big+' offset='+r.off+' registers hit');
// boss-spawned bullets: let the real boss fire for a while with ship parked in its patterns, count bullet hits
const r2=await p.evaluate(()=>{const G=NG.G,P=NG.P;let hits=0,types={};const orig=G.lives;
 for(let i=0;i<60*40&&G.state==='play';i++){P.x=180+Math.sin(G.t*.013)*120;P.y=520;const s=G.shield,d=P.dead;NG.step(1);if(G.shield<s||P.dead>d){hits++;types[G.hitBy]=(types[G.hitBy]||0)+1;G.shield=G.maxSh;G.lives=3;}}
 return {hits,types,boss:!!G.boss};});
console.log('boss-pattern hits',JSON.stringify(r2));ok(r2.hits>0&&r2.types.bullet>0&&r2.types.bigbullet>0,'boss small+big bullets damage the ship');
// HUD hit screenshot
await p.evaluate(()=>{const G=NG.G,P=NG.P;G.shield=G.maxSh;G.lives=3;P.inv=0;P.dead=0;P.x=180;P.y=560;NG.playerHit();NG.step(4);});await sleep(60);await p.screenshot({path:'shots/v03-hud-hit.png'});
const blink=await p.evaluate(()=>({inv:NG.P.inv,sh:NG.G.shield,max:NG.G.maxSh,pop:!!NG.G.pop}));ok(blink.inv>0&&blink.inv<=70&&blink.pop,'short visible invuln after hit '+JSON.stringify(blink));
await p.close();
// 2) boss parts + stage clear (invincible fast-forward)
p=await mk('?debug=boss,inv,autostart');
let k=0,shot=false,log=[];while(k++<60){const r=await p.evaluate(()=>{const G=NG.G;for(let i=0;i<300;i++){NG.P.x=G.boss?G.boss.x+Math.sin(G.t*.05)*70:180;NG.P.y=600;NG.step(1);if(G.state==='clear')return 'clear';}
  const b=G.boss;return b?{ph:b.phase,hp:Math.round(b.hp),L:b.pL.act,R:b.pR.act,M:b.pM.act}:'none';});
 if(r==='clear')break;if(typeof r==='object'&&!shot&&(!r.L||!r.R||!r.M)){shot=true;await p.evaluate(()=>NG.step(20));await sleep(80);await p.screenshot({path:'shots/v03-boss-parts.png'});}
 if(typeof r==='object')log.push(JSON.stringify(r));}
console.log(log.filter((x,i)=>i%3==0).join('\n'));
await sleep(200);const st=await p.evaluate(()=>({s:NG.G.state,salv:NG.G.salv,cogs:NG.META.cogs}));ok(st.s==='clear','boss parts destroyed + stage clear '+JSON.stringify(st));
await p.screenshot({path:'shots/v03-clear.png'});await p.close();
// 3) fresh run end -> hangar by touch -> buy -> reload persists
p=await mk('');await p.evaluate(()=>{localStorage.clear();localStorage.setItem('ngs_photo','1');});await p.reload({waitUntil:'load'});await sleep(900);
await p.tap('#bStart');await sleep(300);
const run=await p.evaluate(()=>{const G=NG.G,P=NG.P;for(let i=0;i<60*60&&G.state==='play';i++){P.x=180+Math.sin(G.t*.02)*120;P.y=600;NG.step(1);}if(G.state==='play'){for(let j=0;j<20&&G.state==='play';j++){P.inv=0;P.dead=0;NG.playerHit();NG.step(100);}}NG.step(120);return {s:G.state,st:G.st/60,salv:G.salv,kills:G.kills,cogs:NG.META.cogs};});
console.log('first run',JSON.stringify(run));await sleep(300);await p.screenshot({path:'shots/v03-run-end.png'});
await p.tap('#bUp1');await sleep(300);await p.screenshot({path:'shots/v03-hangar.png'});
const before=await p.evaluate(()=>({c:NG.META.cogs,up:JSON.stringify(NG.META.up)}));
const can=await p.$$('#hList .up.can');console.log('affordable',can.length);ok(can.length>=1,'first run affords at least one upgrade');
if(can.length){await can[0].tap();await sleep(200);}
const after=await p.evaluate(()=>({c:NG.META.cogs,up:JSON.stringify(NG.META.up)}));ok(after.c<before.c,'touch buy '+JSON.stringify(before)+' -> '+JSON.stringify(after));
await p.screenshot({path:'shots/v03-hangar.png'});
await p.reload({waitUntil:'load'});await sleep(900);const pers=await p.evaluate(()=>({c:NG.META.cogs,up:JSON.stringify(NG.META.up)}));ok(pers.c===after.c&&pers.up===after.up,'persist across reload '+JSON.stringify(pers));
await p.tap('#bHangar');await sleep(200);await p.tap('#bLaunch');await sleep(300);const g=await p.evaluate(()=>({s:NG.G.state,sh:NG.G.maxSh,b:NG.G.bombs}));ok(g.s==='play','launch from hangar '+JSON.stringify(g));
await p.close();
console.log('ERRORS',errs);console.log(fails?'FAILURES '+fails:'ALL PASS');await b.close();})().catch(e=>{console.error('CRASH',e);process.exit(1);});
