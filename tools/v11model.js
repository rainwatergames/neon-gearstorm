// v1.1 difficulty model: one continuous run Stage 2 -> boss 2 -> Stage 3 -> boss 3 with a dodge bot, real damage rules (no god).
// usage: node tools/v11model.js <url> <configName|all>   env TRIALS (default 3)
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8765/';const ONLY=process.argv[3]||'all';
const fs=require('fs');const v05=fs.readFileSync(__dirname+'/v05.js','utf8');const BOT2=v05.match(/const BOT=`([\s\S]*?)`;/)[1];
const BOT3=`window.__bot3=function(){const G=NG.G,P=NG.P,G3=NG.G3,W=360;return function(){if(P.dead>0)return;const bo=G.boss&&G.boss.act&&G.boss.type==='boss3'?G.boss:null;let tx=180;
 if(bo&&!bo.dying){const t=bo.parts.filter(q=>q.act&&!q.lock&&!q.gone).sort((a,b)=>a.hp-b.hp)[0]||bo;tx=t.x;}
 else{const e=NG.EN.a.filter(e=>e.act&&e.y>0&&e.y<P.y-60).sort((a,b)=>b.y-a.y)[0];if(e)tx=e.x;}
 let best=P.x,bc=1e9;for(let x=14;x<=W-14;x+=4){if(Math.abs(x-P.x)>60)continue;let c=Math.abs(x-P.x)*.02+Math.abs(x-tx)*.03;
  for(const la of[0,20,45,75,110]){const y=P.y-la,d=NG.s3d(y),w=1/(1+la*.015);if(NG.brK(d)>.5&&Math.abs(x-NG.trX(d))<30)c+=120*w;
   for(const g of G3.gans){const gy=NG.s3y(g.d);if(Math.abs(gy-y)>16)continue;let okk=false;for(const gp of g.gaps)if(Math.abs(x-gp[0])<gp[1]/2-12)okk=true;if(!okk)c+=150*w;}}
  for(const m of G3.morts){if(m.t>-5&&Math.abs(x-m.x)<44&&Math.abs(P.y-m.y)<44)c+=120;}
  for(const wv of G3.waves){const dd=Math.hypot(x-wv.x,P.y-wv.y);if(dd-wv.R>-10&&dd-wv.R<70){const a=Math.atan2(P.y-wv.y,x-wv.x);let gap=false;for(const g of wv.gaps){if(Math.abs(((a-g+Math.PI*3)%(2*Math.PI))-Math.PI)<wv.gw*.7)gap=true;}if(!gap)c+=100;else c-=30;}}
  for(const e of NG.EN.a){if(!e.act||e.type==='part'||e.type==='boss3')continue;if(Math.abs(e.y-P.y)<70&&Math.abs(e.x-x)<e.r+16)c+=80;}
  for(const q of NG.EB.a){if(!q.act)continue;for(let k=0;k<=24;k+=4){const bx=q.x+q.vx*k,by=q.y+q.vy*k;if(Math.abs(by-P.y)<16&&Math.abs(bx-x)<(q.r+9))c+=60*(1-k/40);}}
  if(bo&&bo.ms>=1&&bo.ms<=3&&Math.abs(x-bo.lx)<56)c+=400;
  if(c<bc){bc=c;best=x;}}
 P.x+=Math.max(-4.2,Math.min(4.2,best-P.x));P.y+=Math.max(-3,Math.min(3,600-P.y));};};`;
const UPS={'after ~3 runs (+pods)':{dmg:2,fire:2,shield:2,core:1,pods:1},
 '~2,200 spent':{dmg:3,fire:3,shield:2,core:1,pods:1,regen:1,hull:1},
 '~2,500 spent':{dmg:3,fire:3,shield:2,core:1,pods:1,regen:1,hull:1,missile:1},
 'heavily upgraded':{dmg:3,fire:3,shield:3,core:2,pods:1,missile:1}};
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
 const TR=+(process.env.TRIALS||3);const out={};
 for(const name in UPS){if(ONLY!=='all'&&ONLY!==name)continue;out[name]=[];
  for(let t=0;t<TR;t++){const p=await b.newPage();await p.setViewport({width:390,height:844});await p.evaluateOnNewDocument(()=>{try{localStorage.setItem('ngs_photo','1');}catch(_){}});await p.goto(U+'?debug=stage2',{waitUntil:'load'});
   await p.evaluate(BOT2);await p.evaluate(BOT3);
   const r=await p.evaluate((up)=>{const M=NG.META;M.up=Object.assign({},up);M.bombs=0;NG.startGame();const G=NG.G,P=NG.P;G.lvl=3+(up.core||0);__bot();const a2=NG.auto,a3=__bot3();NG.auto=()=>{if(G.stage===3)a3();else a2();};
    const spent=NG.UPG.reduce((s,u)=>{for(let i=0;i<(up[u.k]||0);i++)s+=u.c[i];return s;},0);
    let f=0;while(!G.boss2Kill&&f<60*400&&G.lives>0){NG.step(1);f++;}const s2=G.boss2Kill;const livesAt3=G.lives;
    f=0;while(G.stage!==3&&f<1200&&G.lives>0){NG.step(1);f++;}
    f=0;while(!G.boss&&f<60*120&&G.lives>0&&G.stage===3){NG.step(1);f++;}const reached=!!(G.boss&&G.boss.type==='boss3');const livesAtB3=G.lives;
    f=0;while(!G.boss3Kill&&f<60*300&&G.lives>0){NG.step(1);f++;}
    return{spent,s2,livesAt3,reached,livesAtB3,b3T:G.boss3Kill?Math.round(f/6)/10:null,clear:!!G.boss3Kill&&G.lives>0,livesLeft:G.lives,hits:{gan:NG.G3.ganHits,fence:NG.G3.fenceHits,mort:NG.G3.mortHits,wave:NG.G3.waveHits,ram:NG.G3.ramHits},carsLeft:G.boss&&G.boss.cars?G.boss.cars.filter(c=>c.act).length:null,ph:G.boss&&G.boss.phase};},UPS[name]);
   console.log(name,JSON.stringify(r));out[name].push(r);await p.close();}}
 fs.writeFileSync(__dirname+'/../shots/v11-model-'+(ONLY==='all'?'all':ONLY.replace(/\W+/g,'_'))+'.json',JSON.stringify(out,null,1));await b.close();})();
