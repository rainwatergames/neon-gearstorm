// v1.1.1 bomb-button check: mid-left (~50% height), safe margins, clear of SHIELD/HULL HUD + bottom HUD + ship, portrait & landscape; old saved RIGHT setting overridden.
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8765/';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const VPS=[[412,915,'portrait-412x915'],[390,844,'portrait-390x844'],[360,640,'portrait-360x640'],[915,412,'landscape-915x412'],[1024,768,'tablet-1024x768']];
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});let all=true;const errs=[];
 for(const [w,h,name] of VPS){const p=await b.newPage();p.on('pageerror',e=>errs.push(e.message));await p.setViewport({width:w,height:h,deviceScaleFactor:2,isMobile:true,hasTouch:true});
  await p.goto(U,{waitUntil:'load'});await p.evaluate(()=>{localStorage.clear();localStorage.setItem('ngs_photo','1');localStorage.setItem('ngs_bside','R');localStorage.setItem('ngs_bside_mig','1');});
  await p.goto(U+'?debug=autostart',{waitUntil:'load'});await sleep(500);await p.evaluate(()=>{if(NG.G.state!=='play')NG.startGame();NG.G.bombs=3;});await sleep(2200);
  const r=await p.evaluate(()=>{const e=document.getElementById('bBomb'),c=document.querySelector('canvas'),q=e.getBoundingClientRect(),cr=c.getBoundingClientRect();const sc=cr.height/NG.H;
   return {top:Math.round(q.top),bot:Math.round(q.bottom),left:Math.round(q.left),size:Math.round(q.width),mid:+((q.top+q.height/2)/innerHeight).toFixed(3),saved:localStorage.getItem('ngs_bside'),rside:e.classList.contains('rside'),
    hudBarsBottom:Math.round(cr.top+72*sc),hudTextTop:Math.round(cr.top+(NG.H-58)*sc),shipTop:Math.round(cr.top+(NG.P.y-30)*sc),ver:document.getElementById('ver').textContent,ih:innerHeight,iw:innerWidth};});
  const ok=!r.rside&&r.saved==='L'&&r.left>=10&&r.left<=30&&Math.abs(r.mid-.5)<=.06&&r.top>=r.hudBarsBottom&&r.bot<=r.hudTextTop&&r.bot<=r.shipTop&&r.bot<=r.ih-10&&r.size>=56;
  all=all&&ok;console.log((ok?'PASS':'FAIL')+' '+name+' bomb mid-left '+JSON.stringify(r));
  await p.screenshot({path:'shots/v111-bomb-'+name+'.png'});await p.close();}
 console.log((errs.length?'FAIL':'PASS')+' no page errors '+JSON.stringify(errs));all=all&&!errs.length;console.log(all?'ALL PASS':'SOME FAIL');await b.close();process.exit(all?0:1);})();
