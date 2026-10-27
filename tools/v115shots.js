// v1.1.5 visual check: bomb button ready (pulsing) / empty (grey) / ping, stage 3 intro card, tips, switch + gantry arrows, boss 3 weak-point glow
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8765/';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const errs=[];let all=true;const ok=(c,m,d)=>{all=all&&!!c;console.log((c?'PASS ':'FAIL ')+m+(d!==undefined?' '+JSON.stringify(d):''));};
 const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));await p.setViewport({width:412,height:915,deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await p.goto(U,{waitUntil:'load'});await p.evaluate(()=>{localStorage.clear();localStorage.setItem('ngs_photo','1');});await p.goto(U+'?debug=autostart,god',{waitUntil:'load'});await sleep(400);
 const st=()=>p.evaluate(()=>{const e=document.getElementById('bBomb'),cs=getComputedStyle(e);return {cls:e.className,anim:cs.animationName,dur:cs.animationDuration,filter:cs.filter,op:cs.opacity};});
 await p.evaluate(()=>{if(NG.G.state!=='play')NG.startGame();NG.G.bombs=2;NG.updHud();});await sleep(900);let r=await st();ok(r.cls.includes('ready')&&r.anim==='bombPulse'&&r.dur==='1.2s','bomb ready pulses 1.2s',r);await p.screenshot({path:'shots/v115-bomb-ready.png',clip:{x:0,y:0,width:412,height:260}});
 await p.evaluate(()=>{NG.G.bombs=3;NG.updHud();NG.bombPing();});await sleep(120);r=await st();ok(r.cls.includes('ping'),'bomb ping on pickup',r);await p.screenshot({path:'shots/v115-bomb-ping.png',clip:{x:0,y:0,width:412,height:260}});
 await p.evaluate(()=>{NG.G.bombs=0;NG.updHud();});await sleep(800);r=await st();ok(r.cls.includes('empty')&&r.anim==='none'&&/grayscale/.test(r.filter),'bomb empty grey no pulse',r);await p.screenshot({path:'shots/v115-bomb-empty.png',clip:{x:0,y:0,width:412,height:260}});
 await p.evaluate(()=>{NG.SET.rf=true;NG.G.bombs=1;NG.updHud();});await sleep(300);r=await st();ok(r.anim==='bombPulseSoft','reduce-flashing -> gentle slow pulse',r);await p.evaluate(()=>{NG.SET.rf=false;NG.updHud();});
 // stage 3 intro card via the real transition
 await p.evaluate(()=>{const G=NG.G;G.stage=2;NG.EN.clear();NG.EB.clear();NG.toStage3();NG.step(60);});await sleep(300);r=await p.evaluate(()=>({card:NG.G3.card,d:NG.G.ev3Delay,ban:NG.G.banner}));ok(r.card===1&&r.d>300,'stage 3 intro card shown',r);await p.screenshot({path:'shots/v115-s3-card.png'});
 await p.evaluate(()=>{NG.step(400);});r=await p.evaluate(()=>({card:NG.G3.card,d:NG.G.ev3Delay}));ok(!r.card&&r.d===0,'card closes, stage runs',r);
 await p.evaluate(()=>{NG.step(260);});r=await p.evaluate(()=>NG.G3.tip&&NG.G3.tip.a);ok(/TRAIN CARS/.test(r||''),'first tip popup',r);await p.screenshot({path:'shots/v115-s3-tip.png'});
 // first gantry
 await p.evaluate(()=>{const G3=NG.G3;while(G3.d<1180)NG.step(1);NG.EN.clear();NG.EB.clear();while(G3.d<1250)NG.step(1);});await sleep(200);await p.screenshot({path:'shots/v115-s3-gantry.png'});
 // first switch
 await p.evaluate(()=>{const G3=NG.G3;while(G3.d<2100)NG.step(1);NG.EN.clear();NG.EB.clear();while(G3.d<2160)NG.step(1);NG.EN.clear();NG.EB.clear();});await sleep(200);r=await p.evaluate(()=>NG.G3.tip&&NG.G3.tip.a);ok(/SWITCH/.test(r||''),'switch tip',r);await p.screenshot({path:'shots/v115-s3-switch.png'});
 // boss 3 weak point
 await p.goto(U+'?debug=boss3,god',{waitUntil:'load'});await sleep(300);await p.evaluate(()=>{if(NG.G.state!=='play')NG.startGame();NG.G.ev3Delay=0;NG.step(420);NG.EB.clear();});await sleep(200);
 r=await p.evaluate(()=>{const b=NG.G.boss;return b?{t:b.type,wk:b.wkId,inv:b.invT,hp:Math.round(b.hp),parts:b.parts.map(q=>q.label+':'+Math.round(q.hp)+(q.lock?'L':''))}:null;});ok(r&&r.t==='boss3'&&r.wk,'boss 3 weak point glow + arrow',r);await p.screenshot({path:'shots/v115-b3-weak.png'});
 ok(!errs.length,'no page errors',errs);console.log(all?'ALL PASS':'SOME FAIL');await b.close();process.exit(all?0:1);})();
