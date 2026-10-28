// v1.3.2: text-fit audit. Injects every banner/popup string found in src/ and every DOM overlay, at several phone/desktop sizes,
// and reports any canvas text drawn outside the 360-wide play field (or DOM text outside the viewport). Screenshots into shots/v132/.
const puppeteer=(()=>{for(const d of ['/workspace/cr-test','/workspace/uf-test']){try{return require(d+'/node_modules/puppeteer-core');}catch(_){}}throw new Error('puppeteer-core not found');})();
const fs=require('fs'),path=require('path');
const U=process.argv[2]||'http://localhost:8791/';const TAG=process.argv[3]||'after';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const src=['main.js','stage2.js','stage3.js','stage4.js'].map(f=>fs.readFileSync(path.join(__dirname,'../src',f),'utf8')).join('\n');
const lits=[];const re=/banner=\{t:\d+,a:'([^']*)',b:'([^']*)'([^}]*)\}/g;let m;while((m=re.exec(src)))lits.push({a:m[1],b:m[2],small:/small:true/.test(m[3]),warn:/warn:true/.test(m[3])});
lits.push({a:'IRONCLAD GUNSHIP DESTROYED',b:'',small:true},{a:'PHASE 3',b:'PRESSURE CRITICAL'},{a:'STAGE 3 CLEAR',b:'+50,000 · SHIELD +1'},{a:'SPREAD LV5',b:'',small:true});
const pops=['-SHIELD','HULL BREACH','SHIELD FULL','⚠ DRILL LUNGE','⚠ CLAW SWIPE','⚠ SWEEP'];
let fails=0;
(async()=>{const br=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
 console.log('chrome pid',br.process().pid);
 for(const [vw,vh] of [[360,800],[412,915],[1600,900]]){
  const p=await br.newPage();await p.setViewport({width:vw,height:vh,deviceScaleFactor:1});const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',x=>{if(x.type()==='error')errs.push(x.text());});
  await p.evaluateOnNewDocument(()=>{localStorage.setItem('ngs_photo','1');window.__ov=[];const f=CanvasRenderingContext2D.prototype.fillText;
   CanvasRenderingContext2D.prototype.fillText=function(s,x,y,mw){if(this.canvas.id==='c'){let w=this.measureText(s).width;if(mw!==undefined)w=Math.min(w,mw);const al=this.textAlign;const l=al==='center'?x-w/2:al==='right'||al==='end'?x-w:x;const t=this.getTransform();const L=t.a*l+t.e,R=t.a*(l+w)+t.e;if(L<-0.5||R>this.canvas.width+0.5)window.__ov.push({s:String(s),L:Math.round(L/t.a),R:Math.round(R/t.a),cw:Math.round(this.canvas.width/t.a)});}return f.apply(this,arguments);};});
  await p.goto(U+'?stage=3',{waitUntil:'load'});await p.waitForFunction(()=>window.NG,{timeout:15000}).catch(e=>console.log('noNG',errs));await sleep(500);
  await p.evaluate(()=>{NG.startGame&&NG.startGame();});await sleep(300);
  const shot=async n=>{await p.screenshot({path:'shots/v132/'+TAG+'-'+vw+'-'+n+'.png'});};
  const res=[];let i=0;
  for(const b of lits){await p.evaluate(b=>{NG.G.state='play';NG.G.banner=Object.assign({t:60,c:'#2ef9ff'},b);window.__ov=[];NG.togglePause&&0;},b);await sleep(120);
   const ov=await p.evaluate(()=>window.__ov.filter(o=>!/^\d+$/.test(o.s)));const bad=[...new Map(ov.map(o=>[o.s,o])).values()];if(bad.length)res.push(...bad);
   if(/BREAK|RISK|WALLS|INFERNO|STAGE 4|STAGE 3$/.test(b.a+' '+b.b)||/INFERNO|RISK/.test(b.b+b.a))await shot('banner'+(i++));}
  for(const s of pops){for(const x of [12,180,348]){await p.evaluate((s,x)=>{NG.G.banner=null;NG.G.pop={t:5,x,y:400,s,c:'#ff2450'};window.__ov=[];},s,x);await sleep(80);const ov=await p.evaluate(()=>window.__ov);if(ov.length)res.push(...ov.slice(0,1));}}
  await p.evaluate(()=>{NG.G.pop={t:5,x:14,y:400,s:'HULL BREACH',c:'#ff5a2a'};});await sleep(80);await shot('pop-edge');
  console.log(`== ${vw}x${vh} canvas overflow: ${res.length}`);for(const o of res)console.log('  OVER',JSON.stringify(o));fails+=res.length;
  // DOM overlays
  const dom=[];
  for(const id of ['title','photo','settings','pause','over','hangar','clear-fin','clear']){
   const r=await p.evaluate(id=>{const fin=id==='clear-fin';if(id.startsWith('clear')){NG.G.state='play';NG.G.stage=fin?4:1;NG.G.banked=false;NG.stageClear();id='clear';}
    else if(id==='hangar'){NG.openHangar();}
    document.querySelectorAll('.ov').forEach(e=>e.classList.add('hide'));const el=document.getElementById(id);if(!el)return['missing '+id];el.classList.remove('hide');
    const out=[];const vw=innerWidth;for(const e of el.querySelectorAll('*')){if(!e.childNodes.length||![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))continue;const rg=document.createRange();rg.selectNodeContents(e);const rs=rg.getBoundingClientRect();
     if(rs.width&&(rs.left<-0.5||rs.right>vw+0.5))out.push(e.tagName+'#'+(e.id||e.className)+' "'+e.textContent.trim().slice(0,40)+'" '+Math.round(rs.left)+'..'+Math.round(rs.right)+' vw'+vw);
     if(e.scrollWidth>e.clientWidth+1&&getComputedStyle(e).overflowX!=='visible')out.push('scroll '+e.tagName+'#'+e.id);}
    return out;},id);
   await sleep(150);await shot('dom-'+id);if(r.length)dom.push(id+': '+r.join(' | '));}
  console.log(`   DOM overflow: ${dom.length}`);for(const d of dom)console.log('  DOM',d);fails+=dom.length;
  console.log('   errors',errs.length,errs.slice(0,3));fails+=errs.length;await p.close();}
 await br.close();console.log(fails?'FAIL '+fails:'PASS all text fits');process.exit(fails?1:0);})();
