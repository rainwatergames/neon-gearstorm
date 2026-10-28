// v1.2.0 -> updated for v1.3.0-dev: 4-stage game. Boss 2 -> Stage 3, Boss 3 -> Stage 4, Boss 4 kill -> ALL STAGES CLEAR ending
// (results + medals + victory music), legacy debug links, stray stage>4 guard, archived rail chase not shipped.
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');
const U=process.argv[2]||'http://localhost:8765/';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0;const ok=(c,m,x)=>{console.log((c?'PASS ':'FAIL ')+m+(x!==undefined?' '+JSON.stringify(x):''));if(!c)fails++;};
const killBoss=()=>{const bo=NG.G.boss;for(const q of bo.parts)q.act=false;bo.invT=0;NG.kill(bo);for(let i=0;i<900&&NG.G.state==='play'&&NG.G.boss===bo||i<400;i++){NG.step(1);if(NG.G.lives<5)NG.G.lives=50;}};
(async()=>{
 const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage();await p.setViewport({width:430,height:932,deviceScaleFactor:1});const errs=[];p.on('pageerror',e=>errs.push(String(e)));
 await p.evaluateOnNewDocument(()=>localStorage.setItem('ngs_photo','1'));
 const end=async()=>p.evaluate(()=>({state:NG.G.state,stage:NG.G.stage,boss:!!NG.G.boss,h2:document.querySelector('#clear h2').textContent,sub:document.querySelector('#clear h2').nextElementSibling.textContent,res:document.getElementById('cRes').textContent,mode:NG.AU.mode,on:NG.AU.on}));
 const go=async q=>{await p.goto(U+q,{waitUntil:'load'});await sleep(300);await p.evaluate(()=>{if(NG.G.state!=='play')NG.startGame();NG.auInit&&NG.auInit();NG.step(80);});};
 // 1. boss 4 kill -> ending
 await go('?stage=4boss');await p.evaluate(()=>{NG.G.medals=9;NG.G.bestChain=4;});
 await p.evaluate(killBoss);await sleep(1200);let r=await end();
 ok(r.state==='clear'&&r.stage===4,'boss 4 kill -> ending',r);
 ok(r.h2==='ALL STAGES CLEAR!','headline',r.h2);ok(r.sub==='Thanks for testing! More stages coming in later versions.','subtitle',r.sub);
 ok(/RESULTS/.test(r.res)&&/MEDALS/.test(r.res)&&/9 collected/.test(r.res)&&/×4/.test(r.res)&&/Crimson Warden/.test(r.res),'results + medals shown',r.res);
 const mc0=await p.evaluate(()=>NG.AU.mcount[4]);await sleep(2500);const mc1=await p.evaluate(()=>NG.AU.mcount[4]);
 ok(r.mode===4&&mc1>mc0,'victory theme playing on ending (mode 4 notes scheduled)',{mode:r.mode,notes:mc1-mc0});
 // 2. boss 2 kill -> stage 3 (not the ending); boss 3 kill -> stage 4
 await go('?debug=boss2,god');await p.evaluate(()=>{for(let i=0;i<600&&!NG.G.boss;i++)NG.step(1);});await p.evaluate(killBoss);r=await end();
 ok(r.state==='play'&&r.stage===3,'boss 2 kill -> stage 3',r);
 await go('?stage=3boss');await p.evaluate(killBoss);r=await end();
 ok(r.state==='play'&&r.stage===4,'boss 3 kill -> stage 4',r);
 // 3. legacy debug links now map to the new stages
 for(const [f,s,bo] of [['stage3',3,false],['boss3',3,true],['stage4',4,false],['boss4',4,true]]){await go('?debug='+f+',god');
  r=await p.evaluate(()=>({stage:NG.G.stage,boss:!!NG.G.boss}));ok(r.stage===s&&(!bo||r.boss),'legacy ?debug='+f+' -> stage '+s+(bo?' boss':''),r);}
 // 4. stray stage>4 (e.g. stale state) -> ending, no crash
 await go('?debug=inv');await p.evaluate(()=>{NG.G.stage=5;NG.step(5);});r=await end();
 ok(r.state==='clear'&&r.stage===4&&r.h2==='ALL STAGES CLEAR!','G.stage=5 -> ending',r);
 await p.evaluate(()=>document.getElementById('bAgain').click());await sleep(300);
 r=await p.evaluate(()=>({state:NG.G.state,stage:NG.G.stage}));ok(r.state==='play'&&r.stage===1,'PLAY AGAIN from ending restarts at stage 1',r);
 // 5. archived rail chase not shipped
 r=await p.evaluate(()=>({def:!!NG.DEF.tcar,src:/IRON LOCOMOTIVE|RAIL CHASE/i.test(document.body.innerHTML)}));ok(!r.def&&!r.src,'no rail chase code/text',r);
 const js=await (await fetch(U+'build/game.js?t='+Date.now())).text();ok(!/LOCOMOTIVE|RAIL CHASE|tcar:/i.test(js),'bundle has no rail chase');
 ok(!errs.length,'no page errors',errs);
 await b.close();console.log(fails?'SOME FAIL':'ALL PASS');process.exit(fails?1:0);})();
