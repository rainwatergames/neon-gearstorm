// v1.0 SHIELD/HULL + red-bullet test. usage: node tools/v10meters.js <url>
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8765/';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0;const ok=(c,m,x)=>{console.log((c?'PASS ':'FAIL ')+m+(x!==undefined?' '+JSON.stringify(x):''));if(!c)fails++;};
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
 const errs=[];const mk=async q=>{const p=await b.newPage();await p.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});p.on('pageerror',e=>errs.push(String(e)));
  await p.evaluateOnNewDocument(()=>{try{localStorage.setItem('ngs_photo','1');}catch(_){}});await p.goto(U+q,{waitUntil:'load'});await sleep(400);return p;};
 let p=await mk('?debug=stage2');
 const r=await p.evaluate(()=>{const G=NG.G,P=NG.P,out={};NG.META.up={};NG.startGame();NG.G2.spd=0;NG.EN.clear();NG.EB.clear();
  const quiet=()=>{NG.EN.clear();NG.EB.clear();};P.x=180;P.y=500;
  // every enemy projectile in the game is an EB from eShot(): small (r4, red #ff2450 sprite) and big (r6). Hit at the ship's EDGE (8px off-centre), not the centre.
  const kinds={small_bullet:()=>{NG.eShot(P.x+60,P.y,Math.PI,0,false,true);const b=NG.EB.a.find(b=>b.act);b.x=P.x+8;b.y=P.y-4;b.vx=b.vy=0;},
   big_bullet:()=>{NG.eShot(P.x+60,P.y,Math.PI,0,true,true);const b=NG.EB.a.find(b=>b.act);b.x=P.x-10;b.y=P.y+3;b.vx=b.vy=0;},
   boss_bullet:()=>{G.boss={act:true,y:100,x:180,hp:1,maxhp:1};NG.eShot(P.x,P.y-90,Math.PI/2,0,false,true);const b=NG.EB.a.find(b=>b.act);b.x=P.x+6;b.y=P.y+6;b.vx=b.vy=0;G.boss=null;},
   drone_body:()=>{const e=NG.spawn('drone',P.x+6,P.y-4,{vx:0,vy:0,x0:-1,home:true,wob:0,shootAt:-1});},turret_body:()=>{NG.spawn('turret',P.x+8,P.y-6,{vx:0,vy:0});}};
  for(const k in kinds){const row={};
   for(const layer of ['shield','hull']){quiet();G.shield=layer==='shield'?G.maxSh:0;G.hull=G.hullM;P.inv=0;P.dead=0;const s0=G.shield,h0=G.hull;kinds[k]();NG.step(1);row[layer]={ds:+(s0-G.shield).toFixed(2),dh:h0-G.hull,inv:P.inv};}
   out[k]=row;}
  quiet();G.shield=G.maxSh;G.hull=G.hullM;P.inv=0;NG.playerHit();out.invAfterShield=P.inv;const s1=G.shield;NG.step(120);out.shAt2s=G.shield;NG.step(60);out.shAt3s=+G.shield.toFixed(3);NG.step(300);out.shFull=G.shield;out.s1=s1;out.maxSh=G.maxSh;
  quiet();G.shield=0;G.hull=1;P.inv=0;NG.dropRepair(P.x,P.y-5);NG.step(2);out.hullAfterRepair=G.hull;
  // decor check: no red ('eb') particles are spawned by hits
  quiet();G.shield=1;P.inv=0;NG.playerHit();P.inv=0;G.shield=0;NG.playerHit();out.redParts=NG.PT.a.filter(t=>t.act&&(t.c==='eb'||t.col==='eb'||t.d==='eb')).length;out.lives=G.lives;
  return out;});
 console.log(JSON.stringify(r));
 for(const k of ['small_bullet','big_bullet','boss_bullet','drone_body','turret_body']){ok(r[k].shield.ds>=.99&&r[k].shield.dh===0,k+' at ship edge reduces SHIELD first',r[k].shield);ok(r[k].hull.dh===1,k+' with shield empty reduces HULL',r[k].hull);}
 ok(r.invAfterShield<=30,'post-hit invulnerability is short (≤0.5s after shield hit)',r.invAfterShield);
 ok(r.shAt2s===r.s1&&r.shAt3s>r.s1&&r.shFull===r.maxSh,'shield waits ~2.75s unhit, then regenerates to full',{s1:r.s1,at2s:r.shAt2s,at3s:r.shAt3s,full:r.shFull});
 ok(r.hullAfterRepair===2,'REPAIR pickup heals 1 hull plate',r.hullAfterRepair);
 ok(r.redParts===0,'no red bullet-looking particles spawned by hits',r.redParts);
 const src=require('fs').readFileSync(__dirname+'/../build/game.js','utf8');ok(!/(part|boom)\([^)]*'eb'\)/.test(src),"no part()/boom() decor uses the enemy-bullet red ('eb')");
 // screenshots
 await p.evaluate(()=>{const G=NG.G,P=NG.P;NG.EN.clear();NG.EB.clear();NG.G2.spd=1;P.x=180;P.y=560;G.shield=0;G.hull=G.hullM;P.inv=0;NG.playerHit();NG.playerHit();P.inv=0;NG.step(250);});await sleep(300);
 const m=await p.evaluate(()=>({sh:NG.G.shield,hull:NG.G.hull,regen:NG.G.regen}));await p.screenshot({path:'shots/v05-meters.png'});ok(m.regen===1,'meters screenshot shows shield regenerating',m);
 await p.evaluate(()=>{const G=NG.G,P=NG.P;NG.EB.clear();G.shield=0;G.hull=3;P.inv=0;NG.eShot(P.x+50,P.y,Math.PI,0,false,true);const b=NG.EB.a.find(b=>b.act);b.x=P.x+7;b.y=P.y;b.vx=b.vy=0;NG.step(4);});await sleep(60);
 await p.screenshot({path:'shots/v05-hull-hit.png'});
 ok(errs.length===0,'no console errors',errs);await b.close();console.log(fails?'FAILURES '+fails:'ALL PASS');process.exit(fails?1:0);})();
