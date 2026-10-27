const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');
const URL0=process.argv[2]||'http://localhost:8765/';
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
const errs=[];const mk=async(q)=>{const p=await b.newPage();await p.emulate({viewport:{width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true},userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36'});
 p.on('console',m=>{if(m.type()==='error')errs.push(q+': '+m.text());});p.on('pageerror',e=>errs.push(q+': '+e.message));await p.goto(URL0+q,{waitUntil:'load'});await new Promise(r=>setTimeout(r,1200));return p;};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
// title
let p=await mk('');await p.screenshot({path:'shots/title.png'});
await p.tap('#bStart');await sleep(500);
const before=await p.evaluate(()=>({x:NG.P.x,y:NG.P.y,st:NG.G.state}));
// drag with touch via CDP
const c=await p.target().createCDPSession();
const touch=async(type,x,y)=>c.send('Input.dispatchTouchEvent',{type,touchPoints:type==='touchEnd'?[]:[{x,y,id:1}]});
await touch('touchStart',200,700);for(let i=1;i<=10;i++){await touch('touchMove',200-i*8,700-i*10);await sleep(16);}await touch('touchEnd');
const after=await p.evaluate(()=>({x:NG.P.x,y:NG.P.y}));
console.log('drag',JSON.stringify(before),'->',JSON.stringify(after),(after.x<before.x-40&&after.y<before.y-50)?'MOVED_OK':'DRAG_FAIL');
// playthrough with invincibility: fast-forward stage to boss
await p.close();
p=await mk('?debug=inv,autostart');
await p.evaluate(()=>{NG.G.lvl=2;});
for(let s=0;s<8;s++){await p.evaluate(()=>{const P=NG.P;for(let i=0;i<600;i++){NG.P.x=180+Math.sin(NG.G.t*.02)*120;NG.step(1);}});}
const mid=await p.evaluate(()=>({st:NG.G.st/60,hold:NG.G.hold,mid:!!NG.G.mid,score:NG.G.score,state:NG.G.state,c:NG.counts()}));console.log('after 80s sim',JSON.stringify(mid));
// gameplay shot: step to a busy moment
await p.evaluate(()=>{NG.G.weapon=2;NG.G.lvl=3;});
for(let i=0;i<10;i++){await p.evaluate(()=>{for(let i=0;i<20;i++){NG.P.x=180+Math.sin(NG.G.t*.02)*100;NG.step(1);}});await sleep(30);}
let k=0;while(k++<60){const r=await p.evaluate(()=>{if(NG.G.boss)return 'boss';for(let i=0;i<600;i++){NG.P.x=180+Math.sin(NG.G.t*.02)*120;NG.step(1);if(NG.G.boss)return 'boss';}return NG.G.st/60;});if(r==='boss')break;}
const bs=await p.evaluate(()=>({boss:!!NG.G.boss,st:NG.G.st/60,score:NG.G.score,state:NG.G.state}));console.log('reached boss',JSON.stringify(bs));
// kill boss through phases
k=0;while(k++<40){const r=await p.evaluate(()=>{for(let i=0;i<600;i++){NG.P.x=NG.G.boss?NG.G.boss.x+Math.sin(NG.G.t*.05)*30:180;NG.step(1);if(NG.G.state==='clear')return 'clear';}return NG.G.boss?Math.round(NG.G.boss.hp)+' ph'+NG.G.boss.phase:'none';});if(r==='clear')break;if(k%5==0)console.log(' boss',r);}
console.log('final state',await p.evaluate(()=>NG.G.state+' score '+NG.G.score));
await p.screenshot({path:'shots/clear.png'});
await p.close();
// fps sample in gameplay (real time)
p=await mk('?debug=inv,autostart');await sleep(9000);console.log('fps',await p.evaluate(()=>window.__fps),JSON.stringify(await p.evaluate(()=>NG.counts())));await p.screenshot({path:'shots/gameplay_rt.png'});await p.close();
console.log('ERRORS',errs.length,errs.slice(0,10).join('\n'));await b.close();})().catch(e=>{console.error('FAIL',e);process.exit(1);});
