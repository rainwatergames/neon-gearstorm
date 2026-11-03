// v2.0.0 headless test at 412x915: stages 5-11 + bosses, cutscenes, loop/diff, combo, leaderboard, text-fit, errors
const puppeteer=require('/workspace/hmtest/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8792/';const ONLY=process.argv[3]||'';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--autoplay-policy=no-user-gesture-required']});
console.log('CHROME_PID',b.process().pid);
const errs=[],fit=[];const R={};
const mk=async q=>{const p=await b.newPage();p.on('pageerror',e=>errs.push(q+' :: '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(q+' :: '+m.text())});
 await p.evaluateOnNewDocument(()=>{try{localStorage.setItem('ngs_photo','1');}catch(_){}window.__fit=[];const of=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(s,x,y,mw){try{let w=this.measureText(s).width;if(mw!=null&&w>mw)w=mw;const al=this.textAlign;const l=al==='center'?x-w/2:al==='right'||al==='end'?x-w:x;const m=this.getTransform();const L=m.a*l+m.e,Rr=m.a*(l+w)+m.e;if((L<-2||Rr>this.canvas.width+2)&&this.canvas.id==='c'&&String(s).trim())window.__fit.push(String(s).slice(0,40)+' ['+Math.round(L)+','+Math.round(Rr)+'/'+this.canvas.width+']');}catch(_){}return of.apply(this,arguments);};});
 await p.emulate({viewport:{width:412,height:915,deviceScaleFactor:1,isMobile:true,hasTouch:true},userAgent:'Mozilla/5.0 (Linux; Android 13) Mobile'});await p.goto(U+q,{waitUntil:'load'});await sleep(700);return p;};
const done=async(p,q)=>{const f=await p.evaluate(()=>window.__fit.slice(0,8));if(f.length)fit.push(q+' :: '+[...new Set(f)].join(' | '));await p.close();};
const shot=(p,n)=>p.screenshot({path:'shots/v200/'+n+'.png'});
const play=(p,n,boss)=>p.evaluate((n,boss)=>{const G=NG.G,P=NG.P;let f=0;for(;f<n;f++){const bo=G.boss;if(G.state!=='play')break;P.x=bo&&bo.act&&boss?Math.max(20,Math.min(340,bo.x+Math.sin(G.t*.05)*20)):180+Math.sin(G.t*.02)*100;P.y=NG.H-110;NG.step(1);}return f;},n,boss);
for(let n=5;n<=11;n++){if(ONLY&&ONLY!=='s'+n)continue;
 let q='?stage='+n+'&debug=inv';let p=await mk(q);await p.evaluate(()=>NG.startGame());await play(p,1500);await shot(p,'stage'+n);
 R['s'+n]=await p.evaluate(()=>({stage:NG.G.stage,en:NG.counts().en,eb:NG.counts().eb,state:NG.G.state}));await done(p,q);
 q='?stage='+n+'boss&debug=inv';p=await mk(q);await p.evaluate(()=>NG.startGame());
 if(n===11){await p.evaluate(()=>{for(let i=0;i<80;i++)NG.step(1);});await shot(p,'cut-twist-a');await p.evaluate(()=>{for(let i=0;i<300;i++)NG.step(1);});await shot(p,'cut-twist-b');await p.evaluate(()=>{for(let i=0;i<2000&&NG.G.state==='cut';i++)NG.step(1);});}
 await play(p,420,true);await shot(p,'boss'+n);
 const ff=await play(p,60*150,true);const r=await p.evaluate(()=>({boss:!!(NG.G.boss&&NG.G.boss.act),hp:NG.G.boss?Math.round(NG.G.boss.hp):0,state:NG.G.state,cut:NG2.CS.id,score:NG.G.score}));r.killFrames=ff+420;R['b'+n]=r;
 if(r.state==='cut'){await p.evaluate(()=>{for(let i=0;i<90;i++)NG.step(1);});await shot(p,n<11?'cut-'+(n+1):'cut-ending');}await done(p,q);}
if(!ONLY||ONLY==='cut'){for(const c of['intro','1','5','8','10','11','ending']){const q='?cutscene='+c;const p=await mk(q);await p.evaluate(()=>{for(let i=0;i<330;i++)NG.step(1);});await shot(p,'cut-'+c+'-link');
  R['cut'+c]=await p.evaluate(()=>{let i=0;for(;i<60*40&&NG.G.state==='cut';i++)NG.step(1);return {frames:i,state:NG.G.state};});await done(p,q);}}
if(!ONLY||ONLY==='loop'){const q='?test=loop&debug=inv';const p=await mk(q);await p.evaluate(()=>NG.startGame());await p.evaluate(()=>{for(let i=0;i<60*40&&NG.G.state!=='diff';i++)NG.step(1);for(let i=0;i<160;i++)NG.step(1);});await sleep(300);await shot(p,'diff-screen');
 R.loop=await p.evaluate(()=>{const s0=NG.G.score;NG2.nextLoop();let i=0;for(;i<60*80&&NG.G.state==='cut';i++)NG.step(1);for(let k=0;k<200;k++)NG.step(1);return {loop:NG.G.loop,stage:NG.G.stage,state:NG.G.state,score:NG.G.score,s0,frames:i};});await shot(p,'loop2-stage1');await done(p,q);}
if(!ONLY||ONLY==='lv'){const q='?loop=3&stage=6&debug=inv';const p=await mk(q);await p.evaluate(()=>NG.startGame());await play(p,900);await shot(p,'loop3-stage6-watermark');R.lv=await p.evaluate(()=>({loop:NG.G.loop,ebS:NG2.DF.ebS(),ps:NG2.DF.ps(),bhp:NG2.DF.bhp()}));await done(p,q);}
if(!ONLY||ONLY==='combo'){const q='?test=combo&debug=inv';const p=await mk(q);await p.evaluate(()=>NG.startGame());
 const cs=await p.evaluate(async()=>{const G=NG.G,P=NG.P;let seen={};for(let f=0;f<60*14;f++){P.y=NG.H-110;let t=null,d=1e9;for(const e of NG.EN.a)if(e.act&&e.y>0){const dd=Math.abs(e.x-P.x)+(NG.H-e.y)*.2;if(dd<d){d=dd;t=e;}}if(t)P.x+=(t.x-P.x)*.3;NG.step(1);if(NG2.V2.call&&!seen[NG2.V2.call.k]){seen[NG2.V2.call.k]=f;if(NG2.V2.call.k===10||NG2.V2.call.k===25)break;}}return {seen,combo:NG2.V2.combo,mult:NG2.V2.mult,graze:NG2.V2.graze};});
 await p.evaluate(()=>{for(let i=0;i<8;i++)NG.step(1);});await shot(p,'combo-callout');R.combo=cs;
 R.comboBreak=await p.evaluate(()=>{NG.P.inv=0;const d=NG.G;const c0=NG2.V2.combo;NG.P.dead=0;window.__inv=1;return c0;});await done(p,q);}
if(!ONLY||ONLY==='lb'){const q='?debug=autostart';const p=await mk(q);await p.evaluate(()=>{for(let i=0;i<5;i++)NG2.lbAdd(['ACE','JEF','SPK','GLD','RNW'][i],(5-i)*100000);NG.G.score=777777;NG.G.state='play';});
 await p.evaluate(()=>{NG.G.lives=0;});await p.evaluate(()=>{const f=[...document.querySelectorAll('#bRetry')];});await p.evaluate(()=>{NG.G.state='play';});await p.evaluate(()=>{ /* trigger game over */ NG.G.timers=[];});
 await p.evaluate(()=>{NG.G.state='play';});await p.evaluate(()=>{const go=NG.G;});await p.evaluate(()=>{window.__go&&window.__go();});
 await p.evaluate(()=>{NG.G.state='play';NG.P.inv=0;NG.P.dead=0;NG.G.shield=0;NG.G.hull=1;NG.G.lives=1;NG.playerHit();for(let i=0;i<120;i++)NG.step(1);});await sleep(200);await shot(p,'leaderboard-entry');
 await p.evaluate(()=>{const i=document.getElementById('lbIn');if(i)i.value='RGW';const b=document.getElementById('lbOk');if(b)b.click();});await sleep(200);await shot(p,'leaderboard-top20');R.lb=await p.evaluate(()=>NG2.lbGet().slice(0,3));await done(p,q);}
if(!ONLY||ONLY==='title'){const q='';const p=await mk(q);await shot(p,'title');await done(p,'title');}
console.log(JSON.stringify(R,null,1));console.log('ERRORS',errs.length,JSON.stringify(errs.slice(0,20),null,1));console.log('TEXTFIT',fit.length,JSON.stringify(fit.slice(0,30),null,1));await b.close();})();
