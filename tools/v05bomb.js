// v0.5 bomb-button check: old saved RIGHT setting is migrated to LEFT once; button sits left:14px, ~104px up, clear of the canvas HUD. 390x844.
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8765/';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const p=await b.newPage();await p.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});
 await p.goto(U,{waitUntil:'load'});await p.evaluate(()=>{localStorage.clear();localStorage.setItem('ngs_photo','1');localStorage.setItem('ngs_bside','R');localStorage.setItem('ngs_bombside','R');});
 await p.goto(U+'?debug=autostart',{waitUntil:'load'});await sleep(500);await p.evaluate(()=>{if(NG.G.state!=='play')NG.startGame();NG.G.bombs=3;});await sleep(2500);
 const r=await p.evaluate(()=>{const e=document.getElementById('bBomb'),c=document.querySelector('canvas'),q=e.getBoundingClientRect(),cr=c.getBoundingClientRect(),cs=getComputedStyle(e);
  const sc=cr.height/NG.H;return {left:q.left,right:innerWidth-q.right,bottomGap:innerHeight-q.bottom,top:q.top,w:q.width,cssLeft:cs.left,saved:localStorage.getItem('ngs_bside'),rside:e.classList.contains('rside'),
   hudTextTop:cr.top+(NG.H-58)*sc,state:NG.G.state};});
 console.log(JSON.stringify(r));await p.screenshot({path:'shots/v05-bomb-left.png'});
 const ok=r.cssLeft==='14px'&&!r.rside&&r.saved==='L'&&r.bottomGap>=90&&r.bottomGap<=125&&r.bottomGap>innerHeightGapNeeded(r);
 function innerHeightGapNeeded(r){return 0;}
 const noOverlap=r.top+r.w<=r.hudTextTop+1e-6||r.top+r.w<r.hudTextTop+1;console.log((ok?'PASS':'FAIL')+' bomb button LEFT 14px, '+Math.round(r.bottomGap)+'px above bottom, old RIGHT setting migrated');
 console.log((noOverlap?'PASS':'FAIL')+' no overlap with bottom-left canvas HUD (button bottom '+Math.round(r.top+r.w)+' < HUD text top '+Math.round(r.hudTextTop)+')');
 await b.close();process.exit(ok&&noOverlap?0:1);})();
