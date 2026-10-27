// v0.5 verification: difficulty/upgrade model, music (stage-2 + guitar), screenshots. Cache test is tools/v05cache.js
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8765/';const ONLY=process.argv[3]||'';
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
const errs=[];const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fails=0;const ok=(c,m,x)=>{console.log((c?'PASS ':'FAIL ')+m+(x!==undefined?' '+JSON.stringify(x):''));if(!c)fails++;};
const mk=async q=>{const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});await p.emulate({viewport:{width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true},userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148'});
 await p.evaluateOnNewDocument(()=>{try{localStorage.setItem('ngs_photo','1');}catch(_){}});await p.goto(U+q,{waitUntil:'load'});await sleep(500);return p;};
// dodge bot: horizontal cost planner over terrain + predicted enemy bullets + boss lunge column
const BOT=`window.__bot=function(){const G=NG.G,P=NG.P,G2=NG.G2,W=360;NG.auto=function(){if(P.dead>0)return;const bo=G.boss&&G.boss.act&&G.boss.type==='boss2'?G.boss:null;let tx=180;
 if(bo&&!bo.dying){const t=bo.parts.filter(q=>q.act).sort((a,b)=>a.hp-b.hp)[0]||bo;tx=t.x;}
 let best=P.x,bc=1e9;for(let x=14;x<=W-14;x+=4){if(Math.abs(x-P.x)>60)continue;let c=Math.abs(x-P.x)*.02+Math.abs(x-tx)*(bo?.05:.004);
  for(const la of[0,20,45,75,110]){const y=P.y-la,d=NG.s2d(y),w=1/(1+la*.015);if(NG.s2solid(x,d,12))c+=120*w;
   for(const g of G2.gears){const gy=NG.s2y(g.d);if(Math.abs(gy-y)>g.r+30)continue;if(Math.hypot(x-NG.gearX(g),y-gy)<g.r+22)c+=90*w;}
   for(const f of G2.flames){const fy=NG.s2y(f.d);if(Math.abs(fy-y)>22)continue;const st=NG.flameState(f);if(!st)continue;const[o,dir]=NG.flameOrigin(f);const x0=Math.min(o,o+dir*f.len),x1=Math.max(o,o+dir*f.len);if(x>x0-12&&x<x1+12)c+=(st===2?100:70)*w;}}
  for(const e of NG.EN.a){if(!e.act)continue;if(e.type==='block'){if(Math.abs(x-e.x)<e.r+8&&e.y<P.y&&e.y>P.y-160)c+=e.hp*1.5;continue;}if(Math.abs(e.y-P.y)<60&&Math.abs(e.x-x)<e.r+14)c+=80;}
  for(const q of NG.EB.a){if(!q.act)continue;for(let k=0;k<=24;k+=4){const bx=q.x+q.vx*k,by=q.y+q.vy*k;if(Math.abs(by-P.y)<16&&Math.abs(bx-x)<(q.r+9))c+=60*(1-k/40);}}
  if(bo&&bo.ls>=1&&Math.abs(x-bo.lx)<50)c+=400;
  if(c<bc){bc=c;best=x;}}
 P.x+=Math.max(-4.2,Math.min(4.2,best-P.x));P.y+=Math.max(-3,Math.min(3,600-P.y));};};`;
const UPS={
 'fresh (no upgrades)':{},
 'after ~2 runs':{dmg:2,fire:2,shield:1,core:1},
 'after ~3 runs (+pods)':{dmg:2,fire:2,shield:2,core:1,pods:1},
 'heavily upgraded':{dmg:3,fire:3,shield:3,core:2,pods:1,missile:1}};
const cost=u=>{let s=0;for(const k in u){const c=(MODEL_UPG.find(x=>x.k===k)||{c:[]}).c;for(let i=0;i<u[k];i++)s+=c[i];}return s;};let MODEL_UPG=[];
let p;
if(!ONLY||ONLY==='model'){
 const rows=[];
 const TR=+(process.env.TRIALS||3);for(const name in UPS){const tr=[];for(let t=0;t<TR;t++){p=await mk('?debug=stage2');if(!MODEL_UPG.length)MODEL_UPG=await p.evaluate(()=>NG.UPG.map(u=>({k:u.k,c:u.c})));await p.evaluate(BOT);
  const r=await p.evaluate(async(up)=>{const M=NG.META;M.up=Object.assign({},up);M.bombs=0;NG.startGame();const G=NG.G,P=NG.P,G2=NG.G2;G.lvl=Math.min(3+(up.core||0),3+(up.core||0));__bot();
   // raw DPS vs a big static target (boss-body sized)
   const st0={x:P.x,y:P.y};G2.spd=0;NG.EN.clear();NG.EB.clear();P.x=180;P.y=600;const sp=G2.spd;
   const lx=NG.auto;NG.auto=()=>{P.x=180;P.y=600;};
   window.__tg=null;const d0=G2.d;// spawn a target via kill-proof block
   NG.step(1);
   let tg=null;NG.EN.clear();const s=NG.spawnTarget();NG.step(120);const h0=s.hp;NG.step(600);const dps=(h0-s.hp)/10;s.act=false;NG.EN.clear();NG.PB.clear();
   NG.auto=lx;G2.spd=1.5;G.hits=0;G.lives=2+(up.life||0);G.shield=G.maxSh;G.hull=G.hullM;P.inv=0;
   let f=0;while(G2.d<6080&&f<60*240&&G.lives>0){NG.step(1);f++;}const s2hits=G.hits;const bf0=f;
   let s2lost=2+(up.life||0)-G.lives;G.hits=0;let bf=0;while(!G.boss2Kill&&bf<60*300&&G.lives>0){NG.step(1);bf++;}
   return {dps:Math.round(dps),s2hits,bossT:G.boss2Kill?Math.round(bf/6)/10:null,bossHits:G.hits,maxSh:G.maxSh,hullM:G.hullM,livesLeft:G.lives,s2lost,reachedBoss:G2.d>=6080,lives0:2+(up.life||0),lvl:G.lvl};},UPS[name]);
  r.budget=r.lives0+'×('+r.maxSh+' shield+'+r.hullM+' hull)';r.total=r.s2hits+r.bossHits;r.clr=!!(r.bossT!==null&&r.livesLeft>0);tr.push(r);console.log(name,JSON.stringify(r));await p.close();}
  const av=k=>Math.round(tr.reduce((a,x)=>a+(x[k]===null?300:x[k]),0)/tr.length*10)/10;const r=Object.assign({},tr[0],{dps:av('dps'),s2hits:av('s2hits'),bossT:av('bossT'),livesLeft:av('livesLeft'),bossHits:av('bossHits'),total:av('total')});
  r.name=name;r.cost=cost(UPS[name]);r.clears=tr.filter(x=>x.clr).length;r.trials=TR;r.verdict=r.clears*2>TR?'CLEARS':'DIES';rows.push(r);}
 console.log('\n| ship | ⚙ spent | weapon LV | raw DPS | stage-2 hits | boss-2 kill time | boss hits | lives × (shield+hull) | lives left | bot clears | result |');
 for(const r of rows)console.log(`| ${r.name} | ${r.cost} | ${r.lvl} | ${r.dps} | ${r.s2hits} | ${r.bossT===null?'>300s':r.bossT+'s'} | ${r.bossHits} | ${r.budget} | ${r.livesLeft} | ${r.clears}/${r.trials} | ${r.verdict} |`);
 require('fs').writeFileSync('shots/v05-model.json',JSON.stringify(rows,null,1));
 ok(rows[0].verdict==='DIES','fresh ship cannot clear stage 2',rows[0].total+'/'+rows[0].budget);
 ok(rows.slice(1).some(r=>r.verdict==='CLEARS')&&rows[3].verdict==='CLEARS','2-3-run / strong upgraded ships clear stage 2');}
if(!ONLY||ONLY==='salv'){
 // salvage per typical run: bot (god, counts hits) plays stage 1 from the start; bank = what a run that dies early in stage 2 earns
 p=await mk('?debug=god');await p.evaluate(BOT);
 const sv=await p.evaluate(()=>{NG.META.up={};NG.startGame();NG.G.lives=99;let f=0;while(NG.G.stage===1&&f<60*200&&NG.G.state==='play'){const bo=NG.G.boss;if(bo&&bo.act&&!bo.dying){NG.P.x+=Math.max(-4,Math.min(4,bo.x-NG.P.x));}NG.step(1);f++;}
  const s1=NG.G.salv,k1=NG.G.kills,st1=NG.G.st,h1=NG.G.hits;f=0;__bot();while(NG.G2.d<3500&&f<60*120){NG.step(1);f++;}return {s1,k1,t1:Math.round(st1/60),h1,stage:NG.G.stage,salvAt2mid:NG.G.salv,kills:NG.G.kills,st:Math.round(NG.G.st/60)};});
 sv.bankDieMidS2=Math.round(sv.salvAt2mid+sv.st/3+sv.kills/5+150);sv.bankDieS1Boss=Math.round(sv.s1*.85+sv.t1/3+sv.k1/5);console.log('salvage model',JSON.stringify(sv));await p.close();}
if(!ONLY||ONLY==='music'){
 p=await mk('?debug=boss,inv,autostart');
 const m=await p.evaluate(async()=>{const A=NG.AU;const an=A.c.createAnalyser();an.fftSize=2048;A.mus.connect(an);const buf=new Float32Array(2048);const rms=()=>{an.getFloatTimeDomainData(buf);let s=0;for(const v of buf)s+=v*v;return Math.sqrt(s/buf.length);};
  const o={ctx0:A.c.state,mode0:A.mode};const bo=NG.G.boss;let f=0;while(!(NG.G.boss&&NG.G.boss.y>=150)&&f<2000){NG.step(10);f+=10;}const b=NG.G.boss;for(const q of b.parts)if(q.act)NG.kill(q);b.invT=0;NG.hurt(b,99999);
  let g=0;while(NG.G.stage!==2&&g<3000){NG.step(5);g+=5;}NG.step(30);o.stage=NG.G.stage;o.mode=A.mode;o.on=A.on;o.ctx=A.c.state;o.musGain=A.mus.gain.value;o.master=A.m.gain.value;o.muted=A.muted;
  const c0=A.mcount[2],g0=A.gcount;const tq=performance.now();while(A.mcount[2]-c0<=20&&performance.now()-tq<12000)await new Promise(r=>setTimeout(r,250));o.waitMs=Math.round(performance.now()-tq);o.steps=A.mcount[2]-c0;o.gtrNotes=A.gcount-g0;let mx=0;for(let i=0;i<10;i++){mx=Math.max(mx,rms());await new Promise(r=>setTimeout(r,100));}o.rms=+mx.toFixed(4);
  NG.spawnBoss2();await new Promise(r=>setTimeout(r,800));o.bossMode=A.mode;const gb=A.gcount;await new Promise(r=>setTimeout(r,2500));o.bossGtr=A.gcount-gb;return o;});
 console.log('music',JSON.stringify(m));
 ok(m.stage===2&&m.mode===2&&m.on&&m.ctx==='running'&&m.steps>20&&m.rms>.005&&m.musGain>0,'stage-2 music actually starts on the stage transition (ctx running, steps scheduled, audible RMS)',m);
 ok(m.gtrNotes>10&&m.bossMode===3&&m.bossGtr>10,'guitar notes scheduled in stage-2 + boss-2 tracks');await p.close();}
if(!ONLY||ONLY==='shots'){
 // hangar with some upgrades bought
 p=await mk('');await p.evaluate(()=>{NG.META.cogs=1340;NG.META.up={dmg:2,fire:1,shield:2,core:1,pods:1};NG.openHangar('title');});await sleep(300);await p.screenshot({path:'shots/v05-hangar.png'});await p.close();
 p=await mk('?debug=stage2,inv');await p.evaluate(()=>{NG.META.up={dmg:4,fire:4,shield:4,core:2,pods:2,missile:2};NG.startGame();NG.G.lvl=5;NG.G2.spd=0;});
 await p.evaluate(()=>{NG.s2reset(2350);NG.G2.spd=1.2;NG.P.x=180;NG.P.y=600;NG.step(140);NG.P.x=180;});await sleep(100);await p.screenshot({path:'shots/v05-weapon-max.png'});await p.close();
 p=await mk('?debug=boss2,inv,autostart');const ls=await p.evaluate(()=>{let f=0;while(f<6000){NG.step(1);f++;const bo=NG.G.boss;NG.P.x=120;NG.P.y=640;if(bo&&bo.act&&bo.ls===1&&bo.lt>25)break;}return {f,ls:NG.G.boss.ls};});
 await sleep(60);await p.screenshot({path:'shots/v05-lunge.png'});ok(ls.ls===1,'lunge telegraph captured',ls);await p.close();}
ok(errs.length===0,'no console errors',errs.slice(0,5));
console.log(fails?'FAILURES '+fails:'ALL PASS');await b.close();})();
