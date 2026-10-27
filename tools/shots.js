// v0.2 screenshots: gameplay, bomb flash, boss, settings
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8765/';
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
const errs=[];const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const mk=async q=>{const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});await p.emulate({viewport:{width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true},userAgent:'Mozilla/5.0 (Linux; Android 13) Mobile'});await p.goto(U+q,{waitUntil:'load'});await sleep(1000);return p;};
let p=await mk('?debug=inv,autostart');
await p.evaluate(()=>{NG.G.weapon=0;NG.G.lvl=3;for(let i=0;i<60*24;i++){NG.P.x=180+Math.sin(NG.G.t*.02)*90;NG.P.y=640;NG.step(1);}});await sleep(120);
await p.screenshot({path:'shots/v02-gameplay.png'});
await p.evaluate(()=>{NG.G.bombs=3;NG.bomb();NG.step(3);});await sleep(40);await p.screenshot({path:'shots/v02-bomb-flash.png'});await p.close();
p=await mk('?debug=boss,autostart');
await p.evaluate(()=>{for(let i=0;i<60*14;i++){NG.P.x=180+Math.sin(NG.G.t*.03)*60;NG.P.y=650;NG.step(1);}});await sleep(120);
await p.screenshot({path:'shots/v02-boss.png'});console.log(await p.evaluate(()=>JSON.stringify(NG.counts())));await p.close();
p=await mk('?debug=x');await p.tap('#bSet1');await sleep(300);await p.screenshot({path:'shots/v02-settings.png'});await p.close();
console.log('ERRORS',errs);await b.close();})();
