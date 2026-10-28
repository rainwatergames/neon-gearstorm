// v0.5 stale-client test: serve the OLD build (v0.4) over https with Cache-Control: max-age=600, let a client install its SW
// and warm the HTTP cache, then swap the server to the NEW build and open the link once. The first open must end on the new version.
// usage: node tools/v05cache.js <newDir>   (server: /tmp/ngsc/srv.py serving /tmp/ngsc/live symlink on https://localhost:8771)
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const fs=require('fs'),cp=require('child_process');
const NEW=process.argv[2];const U='https://localhost:8771/';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{cp.execSync('ln -sfn old /tmp/ngsc/live');const dir='/tmp/ngsc/prof'+Date.now();
 const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',userDataDir:dir,args:['--no-sandbox','--ignore-certificate-errors','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 let p=await b.newPage();await p.evaluateOnNewDocument(()=>{try{localStorage.setItem('ngs_photo','1');}catch(_){}});
 await p.goto(U,{waitUntil:'load'});await p.waitForFunction(()=>navigator.serviceWorker&&navigator.serviceWorker.controller,{timeout:15000}).catch(()=>{});
 await p.reload({waitUntil:'load'});await p.reload({waitUntil:'load'});await sleep(800);
 const v1=await p.evaluate(()=>({ver:document.getElementById('ver').textContent,ctrl:!!navigator.serviceWorker.controller}));console.log('old client',JSON.stringify(v1));await p.close();
 cp.execSync('ln -sfn '+NEW+' /tmp/ngsc/live');
 // first open after the deploy (same as tapping the link again)
 p=await b.newPage();const navs=[];p.on('framenavigated',f=>{if(f===p.mainFrame())navs.push(f.url());});
 const t0=Date.now();await p.goto(U,{waitUntil:'load'});const first=await p.evaluate(()=>document.getElementById('ver').textContent);
 let v2=null;for(let i=0;i<40;i++){await sleep(250);try{v2=await p.evaluate(()=>({ver:document.getElementById('ver').textContent,code:window.NG&&NG.UPG.some(u=>u.k==='core')?'v1.0':'old',script:[...document.scripts].map(s=>s.getAttribute('src')).filter(s=>s&&/game\.js/.test(s))[0]}));if(v2.ver==='v1.0'&&v2.code==='v1.0')break;}catch(_){}}
 const ms=Date.now()-t0;console.log('first open: initially',first,'-> settled',JSON.stringify(v2),'after',ms,'ms; navigations',navs.length);
 const pass=v1.ver==='v0.4'&&v1.ctrl&&v2&&v2.ver==='v1.3.1-dev'&&v2.code==='v1.0'&&/game\.js\?v=1\.3\.0-dev/.test(v2.script);console.log((pass?'PASS':'FAIL')+' stale v0.4 client (SW + max-age=600 HTTP cache) upgrades to v1.3.1-dev on the first open');
 await b.close();cp.execSync('rm -rf '+dir);cp.execSync('ln -sfn old /tmp/ngsc/live');process.exit(pass?0:1);})();
