const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8765/';
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.emulate({viewport:{width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true},userAgent:'Mozilla/5.0 (Linux; Android 13) Mobile'});
const r=await p.goto(U,{waitUntil:'load'});console.log('status',r.status());await new Promise(r=>setTimeout(r,1000));
await p.tap('#bStart');await new Promise(r=>setTimeout(r,300));await p.tap('#bPause');console.log('after pause',await p.evaluate(()=>NG.G.state));
await p.tap('#bResume');console.log('after resume',await p.evaluate(()=>NG.G.state));
await p.tap('#bBomb');console.log('bombs',await p.evaluate(()=>NG.G.bombs));
for(let k=0;k<30;k++){const s=await p.evaluate(()=>{for(let i=0;i<600;i++){NG.P.x=180;NG.P.y=300;NG.step(1);if(NG.G.state!=='play')break;}return NG.G.state;});if(s!=='play')break;}
console.log('end',await p.evaluate(()=>NG.G.state+' lives '+NG.G.lives+' st '+(NG.G.st/60).toFixed(1)));await p.screenshot({path:'shots/gameover.png'});
console.log('ERRORS',errs);await b.close();})();
