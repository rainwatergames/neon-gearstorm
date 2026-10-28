// v1.3.0-dev: bot plays Stage 3 (Xeno Hive) -> Hive Queen -> Stage 4 (Frozen Citadel) -> Crimson Warden -> ALL STAGES CLEAR.
// Reports per-stage times, boss fight times, hits taken (lives padded so the run continues), page errors; screenshots into shots/.
const puppeteer=(()=>{for(const d of ['/workspace/cr-test','/workspace/uf-test']){try{return require(d+'/node_modules/puppeteer-core');}catch(_){}}throw new Error('puppeteer-core not found');})();
const U=process.argv[2]||'http://localhost:8765/';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0;const ok=(c,m,x)=>{console.log((c?'PASS ':'FAIL ')+m+(x!==undefined?' '+JSON.stringify(x):''));if(!c)fails++;};
const BOT=`window.__bot=function(){const G=NG.G,P=NG.P,W=360;NG.auto=function(){if(P.dead>0)return;const H=NG.H,b=G.boss&&G.boss.act&&!G.boss.dying?G.boss:null,G3=NG.G3,G4=NG.G4;let tx=180;
 if(b){const t=b.parts.filter(q=>q.act).sort((a,c)=>a.hp-c.hp)[0]||b;tx=t.x;}else{let bd=1e9;for(const e of NG.EN.a){if(!e.act||e.y<0||e.y>P.y-40)continue;const pr=e.type==='egg'||e.type==='hive'||e.type==='wturret'?0:200;const d=Math.abs(e.x-P.x)+pr+(P.y-e.y)*.3;if(d<bd){bd=d;tx=e.type==='wturret'?(e.side<0?60:300):e.x;}}}
 const base=H-150;let best=[P.x,P.y],bc=1e9;
 for(let x=P.x-48;x<=P.x+48;x+=6){if(x<14||x>W-14)continue;for(let y=P.y-30;y<=P.y+30;y+=10){if(y<H*.5||y>H-50)continue;
  let c=Math.hypot(x-P.x,y-P.y)*.02+Math.abs(x-tx)*(b?.06:.01)+Math.abs(y-base)*.02;
  for(const e of NG.EN.a){if(!e.act||e.type==='part'||e.xb)continue;if(Math.abs(e.y-y)<e.r+24&&Math.abs(e.x-x)<e.r+16)c+=90;}
  for(const q of NG.EB.a){if(!q.act)continue;for(let k=0;k<=24;k+=4){const bx=q.x+q.vx*k,by=q.y+q.vy*k;if(Math.abs(by-y)<14&&Math.abs(bx-x)<(q.r||4)+10)c+=60*(1-k/40);}}
  if(G.stage===3){for(const g of G3.gey)if(g.t<125&&Math.hypot(x-g.x,y-g.y-(80-Math.min(80,g.t))*.35)<54)c+=300;
   for(const T of G3.ten)if(T.t<140&&Math.abs(y-T.y)<28){const x0=T.side<0?0:W-T.len,x1=T.side<0?T.len:W;if(x>x0-12&&x<x1+12)c+=300;}
   if(b&&b.type==='boss3'&&(b.cs===1||b.cs===2)&&(b.side<0?x<W/2+30:x>W/2-30)&&y>b.y-20&&y<b.y+340)c+=600;}
  if(G.stage===4){const ys=d=>H-(d-G4.d);for(const g of G4.gates){const gy=ys(g.d)+G4.spd*12,tt=g.t%200;if(tt>40&&tt<175&&Math.abs(y-gy)<26)c+=300;}
   for(const s of G4.sweeps){const sy=ys(s.d)+G4.spd*10,ox=s.side<0?34:W-34;if(s.t<50)continue;for(const da of[0,.12,.24]){const a=s.side<0?0.15+0.55*(1-Math.cos((s.t+da*50)*.022)):Math.PI-.15-.55*(1-Math.cos((s.t+da*50)*.022));const dx=x-ox,dy=y-sy,u=dx*Math.cos(a)+dy*Math.sin(a),v=Math.abs(-dx*Math.sin(a)+dy*Math.cos(a));if(u>-10&&u<250&&v<24)c+=250;}}
   for(const cr of G4.crush){const cy=ys(cr.d),tt=cr.t%220,fut=tt>60&&tt<205;if(fut&&Math.abs(y-cy)<cr.len/2+40&&Math.abs(x-cr.gx)>cr.gap/2-16)c+=320;}
   const sq=(b&&b.sqs)?72:0;if(x<34+sq+18||x>W-34-sq-18)c+=sq?400:150;
   if(b&&b.type==='boss4'&&b.ls){const lw=(W-68)/5,li=Math.floor((x-34)/lw),lc=34+li*lw+lw/2;if(b.lanes.includes(li))c+=700;else c+=Math.abs(x-lc)*1.5;}}
  if(c<bc){bc=c;best=[x,y];}}}
 P.x+=Math.max(-4.4,Math.min(4.4,best[0]-P.x));P.y+=Math.max(-3.5,Math.min(3.5,best[1]-P.y));};};`;
(async()=>{
 const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
 const p=await br.newPage();await p.setViewport({width:430,height:932,deviceScaleFactor:1});const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text());});
 await p.evaluateOnNewDocument(()=>localStorage.setItem('ngs_photo','1'));
 const shot=async n=>{await sleep(120);await p.screenshot({path:'shots/'+n+'.png'});};
 const st=()=>p.evaluate(()=>({state:NG.G.state,stage:NG.G.stage,boss:!!(NG.G.boss&&NG.G.boss.act),bt:NG.G.boss&&NG.G.boss.type,ph:NG.G.boss&&NG.G.boss.phase,hits:NG.G.hits,lives:NG.G.lives,k3:NG.G.boss3Kill,k4:NG.G.boss4Kill}));
 const run=async(n,cond)=>{let f=0;for(;f<n;f+=60){const r=await p.evaluate((c)=>{window.__hb=window.__hb||{};for(let i=0;i<60;i++){const h=NG.G.hits;NG.step(1);window.__bf=window.__bf||{};const bo=NG.G.boss;if(bo&&bo.act&&!bo.dying&&bo.invT<=0)__bf[bo.type]=(__bf[bo.type]||0)+1;if(NG.G.hits>h){const k=NG.G.stage+':'+(NG.G.hitBy||'bullet');__hb[k]=(__hb[k]||0)+1;NG.G.hitBy='';}if(NG.G.lives<5)NG.G.lives=50;if(eval(c))return true;}return false;},cond);if(r)return f+60;}return -1;};
 // links
 for(const[q,s,boss]of[['3',3,false],['3boss',3,true],['4',4,false],['4boss',4,true]]){await p.goto(U+'?stage='+q,{waitUntil:'load'});await sleep(300);await p.evaluate(()=>{if(NG.G.state!=='play')NG.startGame();});
  await p.evaluate(()=>NG.step(260));const r=await st();const m=await p.evaluate(()=>NG.AU.mode);ok(r.state==='play'&&r.stage===s&&(boss?r.boss:!r.boss),'?stage='+q+' -> stage '+s+(boss?' boss':''),{...r,mode:m});}
 // full bot run from ?stage=3
 await p.goto(U+'?stage=3',{waitUntil:'load'});await sleep(300);await p.evaluate(BOT);
 await p.evaluate(()=>{if(NG.G.state!=='play')NG.startGame();__bot();NG.G.lives=50;});
 const res={};
 let f=await run(400,'NG.G3.d>=420');await shot('v130-s3-eggs');
 f=await run(1200,'NG.G3.ten.length&&NG.G3.ten[0].t>40');await shot('v130-s3-tentacle');
 f=await run(1000,'NG.G3.d>=1700');await shot('v130-s3-hive');
 let h0=(await st()).hits;let fs=await run(4000,'NG.G.boss&&NG.G.boss.type==="boss3"&&NG.G.boss.y>=150');res.s3hits=(await st()).hits;res.s3stage=((await p.evaluate(()=>NG.G3.d))/60).toFixed(0)+'s';
 await shot('v130-b3-start');h0=(await st()).hits;
 const tb3=await run(9000,'NG.G.boss&&NG.G.boss.type==="boss3"&&NG.G.boss.cs===1&&NG.G.boss.ct>30||NG.G.boss3Kill');await shot('v130-b3-claw');
 const tb3b=await run(9000,'NG.G.boss&&NG.G.boss.type==="boss3"&&NG.G.boss.phase===3||NG.G.boss3Kill');await shot('v130-b3-core');
 const tb3c=await run(9000,'NG.G.boss3Kill');res.boss3=tb3<0||tb3c<0?'TIMEOUT':((tb3+tb3b+tb3c)/60).toFixed(1)+'s';res.b3hits=(await st()).hits-h0;
 ok(tb3c>0,'bot killed Hive Queen',res);
 f=await run(800,'NG.G.stage===4');ok(f>0,'boss 3 -> stage 4 transition');const m4=await p.evaluate(()=>NG.AU.mode);ok(m4===7,'stage 4 music mode 7',m4);
 h0=(await st()).hits;f=await run(900,'NG.G4.d>=1000');await shot('v130-s4-gate');
 f=await run(900,'NG.G4.crush.some(c=>c.t%220>145&&c.t%220<175&&Math.abs((NG.H-(c.d-NG.G4.d)))<NG.H*.8)');await shot('v130-s4-crusher');
 f=await run(1200,'NG.G4.sweeps.some(s=>s.t>90)');await shot('v130-s4-sweep');
 f=await run(4000,'NG.G.boss&&NG.G.boss.type==="boss4"&&NG.G.boss.y>=130');res.s4hits=(await st()).hits-h0;await shot('v130-b4-start');h0=(await st()).hits;
 const tb4=await run(9000,'NG.G.boss&&NG.G.boss.type==="boss4"&&NG.G.boss.ls===1&&NG.G.boss.lt>30||NG.G.boss4Kill');await shot('v130-b4-lanes');
 const tb4b=await run(9000,'NG.G.boss&&NG.G.boss.type==="boss4"&&NG.G.boss.sqs&&NG.G.boss.sqt>120||NG.G.boss4Kill');await shot('v130-b4-squeeze');
 const tb4c=await run(12000,'NG.G.boss4Kill');res.boss4=tb4<0||tb4b<0||tb4c<0?'TIMEOUT':((tb4+tb4b+tb4c)/60).toFixed(1)+'s';res.b4hits=(await st()).hits-h0;
 ok(tb4c>0,'bot killed Crimson Warden',res);
 f=await run(900,'NG.G.state==="clear"');await sleep(400);
 const e=await p.evaluate(()=>({state:NG.G.state,h2:document.querySelector('#clear h2').textContent,sub:document.querySelector('#clear h2').nextElementSibling.textContent,res:document.getElementById('cRes').textContent,mode:NG.AU.mode}));
 ok(e.state==='clear'&&e.h2==='ALL STAGES CLEAR!'&&/More stages coming/.test(e.sub)&&e.mode===4,'ending after stage 4',e);await shot('v130-ending');
 ok(!errs.length,'no page/console errors',errs.slice(0,5));
 res.hitsBy=await p.evaluate(()=>window.__hb);res.bossFightSec=await p.evaluate(()=>Object.fromEntries(Object.entries(window.__bf).map(([k,v])=>[k,+(v/60).toFixed(1)])));console.log('RESULT '+JSON.stringify(res));await br.close();console.log(fails?'SOME FAIL':'ALL PASS');process.exit(fails?1:0);})();
