// v1.1 STAGE 3 test: transition, hazards, tunnel, switch, boss 3 phases + derail, RUN COMPLETE, music, screenshots. usage: node tools/v11.js <url>
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8765/';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0;const ok=(c,m,x)=>{console.log((c?'PASS ':'FAIL ')+m+(x!==undefined?' '+JSON.stringify(x):''));if(!c)fails++;};
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
 const errs=[];const mk=async q=>{const p=await b.newPage();await p.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});p.on('pageerror',e=>errs.push(String(e)));
  await p.evaluateOnNewDocument(()=>{try{localStorage.setItem('ngs_photo','1');}catch(_){}});await p.goto(U+q,{waitUntil:'load'});await sleep(400);return p;};
 const shot=async(p,n)=>{await sleep(150);await p.screenshot({path:'shots/'+n});};
 // 1. boss-2 kill continues into stage 3 (real death sequence path)
 let p=await mk('?debug=boss2,god');
 let r=await p.evaluate(()=>{NG.META.up={};NG.startGame();NG.step(80);const bo=NG.G.boss;if(!bo)return{err:'noboss2'};for(const q of bo.parts)q.act=false;bo.invT=0;bo.y=140;NG.kill(bo);NG.step(600);
  return{stage:NG.G.stage,state:NG.G.state,mode:NG.AU.mode,spd:NG.G3.spd,s2spd:1.5,d:NG.G3.d};});
 ok(r.stage===3&&r.state==='play','boss-2 kill continues into STAGE 3 (no run end)',r);ok(r.spd/r.s2spd===2,'stage 3 scrolls at 2x stage 2',r.spd);ok(r.mode===4,'stage-3 music track selected',r.mode);
 // 2. hazards hurt (shield first), visual rules
 p=await mk('?debug=stage3');
 r=await p.evaluate(()=>{const G=NG.G,P=NG.P,G3=NG.G3,out={};NG.META.up={};NG.startGame();const H=NG.H;
  const reset=d=>{NG.EN.clear();NG.EB.clear();G3.d=d;G3.ev=999;G3.morts=[];G3.waves=[];G.shield=G.maxSh;G.hull=G.hullM;P.inv=0;P.dead=0;G.ev3Delay=0;G3.spd=0;};
  const hit=(name,setup)=>{reset(setup.d||100);setup.f();const s0=G.shield;NG.step(setup.n||1);out[name]=+(s0-G.shield).toFixed(2);};
  hit('gantry',{d:1200,f:()=>{const g=G3.gans[0];P.x=10;P.y=NG.s3y(g.d)+4;}});
  hit('gantryGap',{d:1200,f:()=>{const g=G3.gans[0];P.x=g.gaps[0][0];P.y=NG.s3y(g.d);}});
  hit('fence',{d:3000,f:()=>{P.y=500;P.x=NG.trX(NG.s3d(500));}});
  hit('mortar',{d:100,f:()=>{P.x=180;P.y=500;G3.morts.push({x:185,y:505,t:68,T:70,n:0});},n:3});
  hit('whistle',{d:100,f:()=>{P.x=180;P.y=500;G3.waves.push({x:180,y:200,R:296,gaps:[0],gw:.3,hit:false});},n:2});
  hit('whistleGap',{d:100,f:()=>{P.x=180;P.y=500;G3.waves.push({x:180,y:200,R:296,gaps:[Math.PI/2],gw:.3,hit:false});},n:2});
  hit('trainCarBody',{d:100,f:()=>{P.x=180;P.y=400;const x=NG.laneX(NG.s3d(402),0);P.x=x-4;NG.spawn('tcar',x,402,{kind:'tur',lane:0,vy:0,cd:999});}});
  hit('gatlingShot',{d:100,f:()=>{P.x=180;P.y=500;NG.eShot(P.x+60,P.y,Math.PI,0,false,true);const b=NG.EB.a.find(b=>b.act);b.x=P.x+8;b.y=P.y;b.vx=b.vy=0;}});
  // tunnel + switch geometry
  reset(4500);P.y=600;NG.step(2);out.tun=G3.inTun;reset(1000);NG.step(2);out.noTun=G3.inTun;out.brk=NG.brK(3100);out.brk0=NG.brK(1000);
  return out;});
 console.log(JSON.stringify(r));
 for(const k of['gantry','fence','mortar','whistle','trainCarBody','gatlingShot'])ok(r[k]>=.99,k+' hurts (shield -1)',r[k]);
 ok(r.gantryGap===0,'flying through a gantry gap is safe',r.gantryGap);ok(r.whistleGap===0,'standing in a whistle-wave gap is safe',r.whistleGap);
 ok(r.tun>.9&&r.noTun===0,'tunnel darkness active only inside tunnels',{tun:r.tun,out:r.noTun});ok(r.brk>.9&&r.brk0===0,'track switch splits into two branches',{in:r.brk,out:r.brk0});
 const src=require('fs').readFileSync(__dirname+'/../src/stage3.js','utf8');
 ok(!/#ff2450|'eb'|rgba\(255,\s*(20|36),/.test(src),'stage-3 decor never uses bullet red');
 ok((src.match(/\.arc\(/g)||[]).length===1,'only round thing drawn by stage 3 is the whistle shockwave (which hurts)',(src.match(/\.arc\(/g)||[]).length);
 // 3. screenshots of the stage (god so the run continues)
 p=await mk('?debug=stage3,god');
 await p.evaluate(()=>{NG.META.up={};NG.startGame();NG.G.ev3Delay=0;NG.step(260);NG.P.x=200;NG.P.y=NG.H-120;NG.PB.clear();NG.step(20);});await sleep(1800);await shot(p,'v11-stage3.png');
 await p.evaluate(()=>{NG.G3.d=2950;NG.G3.ev=0;while(NG.G3.ev<99&&NG.G3.ev<30)break;NG.step(1);NG.P.x=NG.laneX(NG.s3d(NG.H-140),1);NG.P.y=NG.H-140;NG.toStage3&&0;NG.spawn('tcar',NG.laneX(NG.G3.d+NG.H-200,-1),200,{kind:'gat',lane:-1,vy:.3,cd:99});NG.step(40);});await shot(p,'v11-switch.png');
 await p.evaluate(()=>{NG.EN.clear();NG.G3.d=4380;NG.step(1);NG.P.x=180;NG.P.y=NG.H-120;NG.spawn('tcar',NG.laneX(NG.G3.d+NG.H-230,0),230,{kind:'tur',lane:0,vy:.3,cd:99});NG.spawn('swooper',60,NG.H*.25,{x0:120,dir:1,shootAt:-1});NG.step(30);});await shot(p,'v11-tunnel.png');
 // 4. boss 3: parts order, phases, attacks, derail, RUN COMPLETE
 p=await mk('?debug=boss3,god');
 r=await p.evaluate(()=>{const G=NG.G,out={};NG.META.up={};NG.startGame();G.ev3Delay=0;NG.step(400);const bo=G.boss;if(!bo||bo.type!=='boss3')return{err:'noboss3',t:G.boss&&G.boss.type};
  out.parts=bo.parts.length;out.mode=NG.AU.mode;const [c1,c2,c3]=bo.cars;
  const h=(e,d)=>{const x=e.hp;NG.hurtE(e,d);return x-e.hp;};
  out.frontLocked=h(c1,50)===0;out.engineLocked=h(bo,50)===0;out.rearHurt=h(c3,50)>0;
  const killc=c=>{c.invT=0;c.lock=false;c.hp=1;NG.hurtE(c,5);NG.step(60);};
  killc(c3);out.tumble1=NG.G3.tumble.length;out.ph1=bo.phase;out.c2hurt=h(c2,10)>0;killc(c2);killc(c1);out.ph3=bo.phase;NG.step(60);
  out.fbHurt=h(bo.fb,10)>0;out.coreRed=h(bo,100);
  // attack cycle: ram, mortar, whistle
  const seen={};for(let i=0;i<1400&&Object.keys(seen).length<3;i++){NG.step(1);if(bo.ms===2)seen.ram=1;if(NG.G3.morts.length)seen.mortar=1;if(NG.G3.waves.length)seen.whistle=1;}out.attacks=Object.keys(seen);
  bo.ms=0;bo.y=130;killc(bo.fb);killc(bo.stk);out.ph4=bo.phase;out.coreFull=h(bo,100);
  bo.ms=1;bo.mt=0;bo.lx=180;NG.step(20);return out;});
 console.log(JSON.stringify(r));
 ok(r.parts===5&&r.mode===5,'boss 3 has 3 cars + firebox + smokestack, boss-3 music',r);
 ok(r.frontLocked&&r.engineLocked&&r.rearHurt,'cars die one at a time from the rear; engine locked until cars gone',r);
 ok(r.tumble1===1&&r.ph1===1&&r.c2hurt,'destroyed car detaches + tumbles; next car unlocks',r);
 ok(r.ph3===3&&r.fbHurt&&r.coreRed>0&&r.coreRed<20,'engine phase: firebox hurtable, core armored while parts live',r);
 ok(['ram','mortar','whistle'].every(a=>r.attacks.includes(a)),'engine uses cowcatcher ram, mortar barrage, whistle shockwave',r.attacks);
 ok(r.ph4===4&&r.coreFull>=99,'core exposed after firebox + smokestack',r);
 await shot(p,'v11-boss3.png');
 r=await p.evaluate(()=>{const bo=NG.G.boss;bo.ms=0;bo.invT=0;bo.lock=false;bo.hp=1;NG.hurtE(bo,5);NG.step(130);return{dying:bo.dying,rot:bo.rot};});
 ok(r.dying&&Math.abs(r.rot)>.5,'derail death sequence (engine tilts off the rails)',r);await shot(p,'v11-derail.png');
 r=await p.evaluate(()=>{NG.step(500);const h=document.querySelector('#clear h2');return{state:NG.G.state,h2:h&&h.textContent,k:NG.G.boss3Kill};});
 ok(r.state==='clear'&&r.h2==='RUN COMPLETE'&&r.k,'after Stage 3: RUN COMPLETE',r);await shot(p,'v11-complete.png');
 // 5. music (real time): stage-3 and boss-3 tracks produce notes
 for(const q of['?debug=stage3','?debug=boss3']){const pm=await mk(q);await pm.mouse.click(195,600).catch(()=>{});
  const m=await pm.evaluate(async()=>{NG.startGame();for(let i=0;i<60;i++){await new Promise(r=>setTimeout(r,200));if(NG.AU.mcount[NG.AU.mode]>20)break;}return{mode:NG.AU.mode,n:NG.AU.mcount[NG.AU.mode],g:NG.AU.gcount,bpm:NG.AU.bpm};});
  ok(m.n>20&&m.g>0,q+' music plays with guitars',m);}
 ok(errs.length===0,'no page errors',errs.slice(0,3));
 await b.close();console.log(fails?'FAILURES: '+fails:'ALL PASS');process.exit(fails?1:0);})();
