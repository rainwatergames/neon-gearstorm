// v1.2.0: 2-stage game. Boss 2 kill -> ALL STAGES CLEAR ending (results + medals + victory music), legacy stage3/boss3 links, stray stage>2 guard, no stage 3 code left.
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');
const U=process.argv[2]||'http://localhost:8765/';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0;const ok=(c,m,x)=>{console.log((c?'PASS ':'FAIL ')+m+(x!==undefined?' '+JSON.stringify(x):''));if(!c)fails++;};
const killBoss2=()=>{const bo=NG.G.boss;for(const q of bo.parts)q.act=false;bo.invT=0;NG.kill(bo);for(let i=0;i<700&&NG.G.state==='play';i++)NG.step(1);};
(async()=>{
 const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage();await p.setViewport({width:430,height:932,deviceScaleFactor:1});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
 await p.evaluateOnNewDocument(()=>localStorage.setItem('ngs_photo','1'));
 const end=async()=>p.evaluate(()=>({state:NG.G.state,stage:NG.G.stage,h2:document.querySelector('#clear h2').textContent,sub:document.querySelector('#clear h2').nextElementSibling.textContent,res:document.getElementById('cRes').textContent,mode:NG.AU.mode,on:NG.AU.on}));
 // 1. normal boss 2 kill
 await p.goto(U+'?debug=boss2,god',{waitUntil:'load'});await sleep(300);
 await p.evaluate(()=>{if(NG.G.state!=='play')NG.startGame();NG.auInit&&NG.auInit();NG.step(80);NG.G.medals=9;NG.G.bestChain=4;});
 await p.evaluate(killBoss2);await sleep(1200);let r=await end();
 ok(r.state==='clear'&&r.stage===2,'boss 2 kill -> ending (no stage 3)',r);
 ok(r.h2==='ALL STAGES CLEAR!','headline',r.h2);ok(r.sub==='Thanks for testing! More stages coming in later versions.','subtitle',r.sub);
 ok(/RESULTS/.test(r.res)&&/MEDALS/.test(r.res)&&/9 collected/.test(r.res)&&/×4/.test(r.res),'results + medals shown',r.res);
 const mc0=await p.evaluate(()=>NG.AU.mcount[4]);await sleep(2500);const mc1=await p.evaluate(()=>NG.AU.mcount[4]);
 ok(r.mode===4&&mc1>mc0,'victory theme playing on ending (mode 4 notes scheduled)',{mode:r.mode,notes:mc1-mc0});
 // 3. legacy links
 for(const f of ['stage3','boss3']){await p.goto(U+'?debug='+f+',god',{waitUntil:'load'});await sleep(300);
  await p.evaluate(()=>{if(NG.G.state!=='play')NG.startGame();NG.step(60);});
  r=await p.evaluate(()=>({stage:NG.G.stage,boss:!!NG.G.boss}));ok(r.stage===2,'legacy ?debug='+f+' -> stage 2 / boss 2',r);
  await p.evaluate(()=>{for(let i=0;i<4000&&!NG.G.boss;i++)NG.step(1);});await p.evaluate(killBoss2);await sleep(300);r=await end();
  ok(r.state==='clear'&&r.h2==='ALL STAGES CLEAR!','legacy ?debug='+f+' -> ending',r.state);}
 // 4. stray stage>2 (e.g. stale state) -> ending, no crash
 await p.goto(U+'?debug=inv',{waitUntil:'load'});await sleep(300);
 await p.evaluate(()=>{if(NG.G.state!=='play')NG.startGame();NG.G.stage=3;NG.step(5);});r=await end();
 ok(r.state==='clear'&&r.stage===2&&r.h2==='ALL STAGES CLEAR!','G.stage=3 -> ending',r);
 await p.evaluate(()=>document.getElementById('bAgain').click());await sleep(300);
 r=await p.evaluate(()=>({state:NG.G.state,stage:NG.G.stage}));ok(r.state==='play'&&r.stage===1,'PLAY AGAIN from ending restarts at stage 1',r);
 // 5. no stage 3 code
 r=await p.evaluate(()=>({g3:'G3' in NG,ts3:'toStage3' in NG,def:!!(NG.DEF.boss3||NG.DEF.tcar),src:/IRON LOCOMOTIVE|RAIL CHASE/i.test(document.body.innerHTML)}));
 ok(!r.g3&&!r.ts3&&!r.def&&!r.src,'no stage 3 code/text',r);
 const js=await (await fetch(U+'build/game.js?t='+Date.now())).text();ok(!/LOCOMOTIVE|s3Update|s3Draw|G3=|'boss3':|boss3:|tcar:/i.test(js),'bundle has no stage 3');
 ok(!errs.length,'no page errors',errs);
 await b.close();console.log(fails?'SOME FAIL':'ALL PASS');process.exit(fails?1:0);})();
