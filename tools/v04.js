// v0.4 verification: stage 2 terrain, flames, blocks, branches, boss 2, stage1->2 transition, screenshots
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8765/';const ONLY=process.argv[3]||'';
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const sleep=ms=>new Promise(r=>setTimeout(r,ms));let fails=0;const ok=(c,m,x)=>{console.log((c?'PASS ':'FAIL ')+m+(x!==undefined?' '+JSON.stringify(x):''));if(!c)fails++;};
const mk=async q=>{const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});await p.emulate({viewport:{width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true},userAgent:'Mozilla/5.0 (Linux; Android 13) Mobile'});await p.goto(U+q,{waitUntil:'load'});await sleep(900);return p;};
const BOT=`window.__bot=function(side){const G=NG.G,P=NG.P,G2=NG.G2,W=360;NG.side=side||'R';NG.auto=function(){if(P.dead>0)return;let best=P.x,bc=1e9;
 for(let x=14;x<=W-14;x+=4){let c=Math.abs(x-P.x)*.03+Math.abs(x-180)*.004;for(const la of[0,20,45,75,110]){const y=P.y-la,d=NG.s2d(y),w=1/(1+la*.015);if(NG.s2solid(x,d,12))c+=120*w;const s=NG.s2span(d);if(s.a>=0){if(NG.side==='L'&&x>s.a)c+=60*w;if(NG.side==='R'&&x<s.b)c+=60*w;}
  for(const g of G2.gears){const gy=NG.s2y(g.d);if(Math.abs(gy-y)>g.r+30)continue;const gx=NG.gearX(g);if(Math.hypot(x-gx,y-gy)<g.r+22)c+=90*w;if(g.amp&&Math.abs(y-gy)<g.r+20&&Math.abs(x-g.x0)<g.amp+g.r+10)c+=25*w;}
  for(const f of G2.flames){const fy=NG.s2y(f.d);if(Math.abs(fy-y)>22)continue;const st=NG.flameState(f);if(!st)continue;const[o,dir]=NG.flameOrigin(f);const x0=Math.min(o,o+dir*f.len),x1=Math.max(o,o+dir*f.len);if(x>x0-12&&x<x1+12)c+=(st===2?100:70)*w;}}
  for(const e of NG.EN.a){if(!e.act||e.type!=='block')continue;if(Math.abs(x-e.x)<e.r+8&&e.y<P.y&&e.y>P.y-160)c+=e.hp*1.5;}
  if(c<bc){bc=c;best=x;}}
 P.x+=Math.max(-4.2,Math.min(4.2,best-P.x));
 let wantY=NG.H?0:0;const ty=560;P.y+=Math.max(-3,Math.min(3,ty-P.y));
 // wait under flame rows: hold back if the row just above is about to fire
 for(const f of G2.flames){const fy=NG.s2y(f.d);if(fy<P.y-10&&fy>P.y-40){const st=NG.flameState(f),[o,dir]=NG.flameOrigin(f);const x0=Math.min(o,o+dir*f.len),x1=Math.max(o,o+dir*f.len);if(st&&P.x>x0-12&&P.x<x1+12)P.y=Math.min(P.y+1.6,800);}}};};`;
const runTo=async(p,dT,maxF)=>p.evaluate((dT,maxF)=>{let f=0;while(NG.G2.d<dT&&f<maxF&&NG.G.state==='play'){NG.step(20);f+=20;}return {d:Math.round(NG.G2.d),f};},dT,maxF);
const shot=async(p,n)=>{await sleep(250);await p.screenshot({path:'shots/'+n});};
let p;
if(!ONLY||ONLY==='unit'){
 // 1) unit: wall collision, flames only when active, block breaking
 p=await mk('?debug=stage2,autostart');
 const u=await p.evaluate(()=>{const G=NG.G,P=NG.P,G2=NG.G2,o={};NG.EN.clear();NG.EB.clear();
  G2.spd=0;G.ev2Delay=0;NG.s2reset(1900);G2.spd=0;NG.EN.clear();P.y=560;P.x=18;P.inv=0;G.shield=G.maxSh;const s0=G.shield;NG.step(1);o.wall={hit:G.shield<s0,x:P.x,L:NG.s2span(NG.s2d(P.y)).L};
  P.inv=0;G.shield=G.maxSh;P.x=180;NG.step(1);o.free={hit:G.shield<G.maxSh};
  const f=G2.flames.find(f=>f.d===3650);NG.s2reset(f.d-NG.G.H||0);G2.d=f.d-(NG.s2y(f.d)-560)-0;G2.d=f.d-( (G2.d+0) - G2.d);
  // place the jet row exactly on the ship
  G2.d=f.d-(window.innerHeight?0:0);G2.d=f.d-(NG.s2y(f.d)-G2.d)+0;G2.d=f.d-(NG.s2d(560)-G2.d);G2.spd=0;NG.EN.clear();NG.EB.clear();
  const[ox,dir]=NG.flameOrigin(f);P.x=ox+dir*60;P.y=560;o.row=Math.round(NG.s2y(f.d));
  const res=[];for(const c of[5,40,58,62,90,108,115,150]){P.inv=0;P.dead=0;G.shield=G.maxSh;G.t=1600-f.ph+c-1;NG.step(1);res.push([c,NG.flameState(f),G.shield<G.maxSh]);}o.flame=res;
  return o;});
 ok(u.wall.hit&&u.wall.x>=u.wall.L+6,'terrain wall: loses a pip and is pushed out',u.wall);ok(!u.free.hit,'open space: no hit');
 ok(u.flame.every(r=>r[2]===(r[1]===2)),'flames hit only while active (warn/off are safe)',u.flame);
 await p.close();}
if(!ONLY||ONLY==='bot'){
 // 2) bot run through the whole terrain stage, no invulnerability, extra lives so it keeps going
 p=await mk('?debug=stage2,autostart');await p.evaluate(BOT);
 await p.evaluate(()=>{NG.G.lives=99;__bot('R');});
 const shots=[[1020,'v04-gears.png'],[2950,'v04-tunnel.png']];for(const[d,n]of shots){await runTo(p,d,9000);await shot(p,n);}
 await runTo(p,3880,9000);await p.evaluate(()=>{let f=0;while(f<200&&!NG.G2.flames.some(x=>NG.flameState(x)===2&&NG.s2y(x.d)>200&&NG.s2y(x.d)<600)){NG.step(1);f++;}});await shot(p,'v04-flames.png');
 const mid=await p.evaluate(()=>({blocks:NG.G2.blocksBroken,wall:NG.G2.wallHits,flame:NG.G2.flameHits,hits:NG.G.hits}));
 ok(mid.blocks>=8,'breakable blocks break under fire (bot shot its way through)',mid);
 await runTo(p,5000,9000);await shot(p,'v04-branch.png');
 const r=await runTo(p,6100,9000);const st=await p.evaluate(()=>({d:Math.round(NG.G2.d),state:NG.G.state,boss:!!(NG.G.boss&&NG.G.boss.type==='boss2'),wall:NG.G2.wallHits,flame:NG.G2.flameHits,hits:NG.G.hits,hitBy:NG.G.hitBy,lives:NG.G.lives}));
 ok(st.boss&&st.state==='play','bot reaches the stage-2 boss',st);ok(st.wall<=3,'bot terrain wall/gear hits low (fair routing)',st.wall);
 await p.close();
 for(const side of['L','R']){p=await mk('?debug=stage2,autostart');await p.evaluate(BOT);
  const br=await p.evaluate((side)=>{NG.G.lives=99;NG.s2reset(4350);NG.EN.clear();__bot(side);let f=0,inL=0,inR=0;while(NG.G2.d<5850&&f<6000){NG.step(1);f++;const s=NG.s2span(NG.s2d(NG.P.y));if(s.a>=0){if(NG.P.x<s.a)inL++;else if(NG.P.x>s.b)inR++;}}
   const wid=[];for(let d=4600;d<5800;d+=10){const s=NG.s2span(d);if(s.a>=0)wid.push([s.a-s.L,s.R-s.b]);}return {wall:NG.G2.wallHits,flame:NG.G2.flameHits,inL,inR,minL:Math.min(...wid.map(w=>w[0])),minR:Math.min(...wid.map(w=>w[1])),medals:NG.G.chain,salv:NG.G.salv};},side);
  ok(br.wall===0&&(side==='L'?br.inL>br.inR:br.inR>br.inL),'branch '+side+' passable with no wall hits',br);await p.close();}}
if(!ONLY||ONLY==='boss'){
 // 3) stage1 boss -> stage 2 transition (fast-forward kill)
 p=await mk('?debug=boss,inv,autostart');
 const tr=await p.evaluate(()=>{let f=0;while(!(NG.G.boss&&NG.G.boss.y>=150)&&f<2000){NG.step(10);f+=10;}const bo=NG.G.boss;for(const q of bo.parts)if(q.act)NG.kill(q);bo.invT=0;NG.hurt(bo,9999);NG.step(500);return {stage:NG.G.stage,state:NG.G.state,banner:NG.G.banner&&NG.G.banner.a,d:NG.G2.d};});
 ok(tr.stage===2&&tr.state==='play','stage-1 boss kill continues the run into STAGE 2',tr);await p.close();
 // 4) boss 2: real shots, ship parked under each part in turn
 p=await mk('?debug=boss2,inv,autostart');
 const bs=await p.evaluate(()=>{const ph=[];let f=0,bo=null;while(f<20000&&NG.G.state==='play'){NG.step(5);f+=5;bo=NG.G.boss;if(!bo||!bo.act||bo.dying)continue;if(ph[ph.length-1]!==bo.phase)ph.push(bo.phase);
   const tgt=bo.parts.filter(q=>q.act).sort((a,b)=>a.hp-b.hp)[0]||bo;NG.P.x=tgt.x;NG.P.y=Math.min(NG.H||800,640);NG.G.weapon=1;if(bo.phase>=1&&bo.ls===1&&bo.lt>30){break;}}
  return {ph,f,state:NG.G.state};});
 console.log('boss2 pre-shot',JSON.stringify(bs));await shot(p,'v04-boss2.png');
 const bs2=await p.evaluate(()=>{const ph=[];let f=0,bo=null,lunges=0,last=0;while(f<30000&&NG.G.state==='play'){NG.step(5);f+=5;bo=NG.G.boss;if(!bo||!bo.act||bo.dying)continue;if(ph[ph.length-1]!==bo.phase)ph.push(bo.phase);if(bo.ls===2&&last!==2)lunges++;last=bo.ls;
   const tgt=bo.parts.filter(q=>q.act).sort((a,b)=>a.hp-b.hp)[0]||bo;NG.P.x=tgt.x;NG.P.y=640;NG.G.weapon=1;}
  return {ph,f,lunges,state:NG.G.state,h2:document.querySelector('#clear h2').textContent,salv:document.getElementById('cSalv').textContent,b2:NG.G.boss2Kill};});
 ok(bs2.state==='clear'&&bs2.b2&&bs2.ph.includes(3),'boss 2 parts destroyed -> berserk core -> FOUNDRY CLEARED',bs2);
 await shot(p,'v04-clear.png');await p.close();}
ok(errs.length===0,'no console errors',errs.slice(0,5));
console.log(fails?'FAILURES '+fails:'ALL PASS');await b.close();})();
