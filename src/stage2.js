// ===================== STAGE 2: THE IRON FOUNDRY (v0.4) =====================
// World distance d grows as the stage scrolls; a row at distance d is drawn at screen y = H-(d-G2.d).
const G2={d:0,spd:1.5,gears:[],flames:[],items:[],ev:0,wallHits:0,flameHits:0,blocksBroken:0};
const s2y=d=>H-(d-G2.d), s2d=y=>G2.d+(H-y);
const SP={L:0,R:0,a:-1,b:-1};
const BR0=4600,BR1=5800,BOSS2D=6050;
function s2span(d){let L=14,R=W-14,a=-1,b=-1;
 if(d<500){L=14;R=W-14;}
 else if(d<1700){L=24+8*Math.sin(d/90);R=W-24-8*Math.sin(d/110);}
 else if(d<2300){L=30;R=W-30;}
 else if(d<3500){const k=clamp(Math.min(d-2300,3500-d)/150,0,1),c=W/2+95*k*Math.sin((d-2300)/140),w=300-160*k;L=c-w/2;R=c+w/2;}
 else if(d<4500){L=40;R=W-40;}
 else if(d<5900){L=18;R=W-18;if(d>BR0&&d<BR1){const k=clamp(Math.min(d-BR0,BR1-d)/120,0,1);if(k>0){const a0=125+10*Math.sin((d-BR0)/60),b0=212,m=(a0+b0)/2;a=m-(m-a0)*k;b=m+(b0-m)*k;}}}
 SP.L=L;SP.R=R;SP.a=a;SP.b=b;return SP;}
function s2solid(x,d,r){const s=s2span(d);r=r||0;return x-r<s.L||x+r>s.R||(s.a>=0&&x+r>s.a&&x-r<s.b);}
function gearX(g){return g.x0+g.amp*Math.sin(G.t*g.f);}
const GEARS=[[700,180,52,0,0,.02],[980,95,40,55,.02,-.03],[1180,265,40,55,.025,.03],[1400,80,38,0,0,.025],[1400,280,38,0,0,-.025],[1600,180,46,110,.018,.03]];
const FLAMES=[[3650,'L',170,0],[3800,'R',170,40],[3950,'L',150,0],[3950,'R',150,80],[4120,'L',170,60],[4270,'R',170,20],[4420,'L',150,0],[4420,'R',150,80],
 [4850,'IL',62,0],[5000,'L',62,50],[5150,'IL',62,100],[5300,'L',62,30],[5450,'IL',62,80],[5600,'L',62,10]];
function flameState(f){const c=(G.t+f.ph)%160;return c<60?1:c<110?2:0;} // 1 warn, 2 fire, 0 off
function flameOrigin(f){const s=s2span(f.d);if(f.side==='L')return[s.L,1];if(f.side==='R')return[s.R,-1];if(f.side==='IL')return[s.a,-1];return[s.b,1];}
function blockRow(d,kinds){const n=8,w=(W-60)/n;for(let i=0;i<n;i++){const k=kinds[i%kinds.length];spawn('block',30+w*(i+.5),s2y(d),{d,r:w/2-1,hp0:k==='g'?5:14,glass:k==='g',seed:Math.random()*99});}}
function warning2(){strobe(90);G.banner={t:0,a:'⚠ WARNING ⚠',b:'INFERNO DRILL ENGINE APPROACHING',warn:true};sfx.warn();}
const EV2=[[0,()=>{G.banner={t:0,a:'STAGE 2',b:'THE IRON FOUNDRY'};}],[150,()=>droneV(W/2)],[420,()=>swoop(-1)],[520,()=>{G.banner={t:100,a:'⚙ ROUTE AROUND THE GEARS',b:'',small:true,c:COL.am};}],[760,()=>droneCol(70,4)],[1050,()=>swoop(1)],[1300,()=>droneCol(290,4)],
 [1700,()=>{G.banner={t:100,a:'SHOOT THROUGH THE BLOCKS',b:'',small:true,c:COL.cy};}],
 [2300,()=>{G.banner={t:100,a:'TUNNEL — STAY CENTRED',b:'',small:true,c:COL.cy};}],[2700,()=>popcorn(5)],
 [3420,()=>{G.banner={t:110,a:'🔥 FLAME JETS — TIME IT',b:'',small:true,c:COL.am};}],
 [4300,()=>{G.banner={t:0,a:'◀ RISK  ·  SAFE ▶',b:'LEFT: MEDALS + FLAMES   RIGHT: SALVAGE'};}],[4700,()=>droneCol(280,3)],[5150,()=>droneCol(280,3)],
 [5850,()=>warning2()],[BOSS2D,()=>spawnBoss2()]];
for(const r of[[1800,'g'],[1900,'bgbbgbbg'],[2020,'gbgbbgbg'],[2140,'b'],[2176,'bbbggbbb']]){const rd=r[0],k=r[1].split('');EV2.push([rd-860,()=>blockRow(rd,k)]);}
function s2reset(d){Object.assign(G2,{d:d||0,spd:1.5,ev:0,wallHits:0,flameHits:0,blocksBroken:0});
 G2.gears=GEARS.map(g=>({d:g[0],x0:g[1],r:g[2],amp:g[3],f:g[4],spin:g[5],rot:0}));G2.flames=FLAMES.map(f=>({d:f[0],side:f[1],len:f[2],ph:f[3]}));G2.items=[];
 for(let dd=BR0+120;dd<BR1-120;dd+=60){const s=s2span(dd);G2.items.push({d:dd,x:(s.L+s.a)/2,k:'m'});if(dd%120===0)G2.items.push({d:dd,x:(s.b+s.R)/2,k:'c'});}
 EV2.sort((p,q)=>p[0]-q[0]);if(G2.d>0)while(G2.ev<EV2.length&&EV2[G2.ev][0]<G2.d)G2.ev++;}
function toStage2(){if(G.state!=='play')return;G.stage=2;s2reset(0);G.hold=false;G.boss=null;EB.clear();G.shield=Math.min(G.maxSh,G.shield+1);G.score+=G.lives*10000;
 G.banner={t:0,a:'STAGE 1 CLEAR',b:'+'+(G.lives*10000).toLocaleString()+' · SHIELD +1'};musicStart(2);G.ev2Delay=150;}
function s2push(nx){P.x=clamp(nx,10,W-10);}
function s2Update(){if(G.ev2Delay>0){G.ev2Delay--;return;}
 G2.d+=G2.spd;while(G2.ev<EV2.length&&EV2[G2.ev][0]<=G2.d){EV2[G2.ev][1]();G2.ev++;}
 for(const g of G2.gears)g.rot+=g.spin;
 if(window.NG&&NG.auto)NG.auto();
 const alive=P.dead<=0&&G.lives>0;
 // flames: hiss on warning, roar on fire
 for(const f of G2.flames){const y=s2y(f.d);if(y<-20||y>H+20)continue;const c=(G.t+f.ph)%160;if(c===0)sfx.hiss();if(c===60)sfx.flame();
  if(c>=60&&c<110&&G.t%3===0){const[o,dir]=flameOrigin(f);part(0,o+dir*rnd(10,f.len),y+rnd(-5,5),dir*rnd(.5,2),rnd(-1,1),rnd(8,14),.7,'am');}
  if(alive&&flameState(f)===2){const[o,dir]=flameOrigin(f),x0=Math.min(o,o+dir*f.len),x1=Math.max(o,o+dir*f.len);if(P.x>x0-4&&P.x<x1+4&&Math.abs(P.y-y)<13){G.hitBy='flame';if(playerHit())G2.flameHits++;}}}
 if(!alive)return;
 // terrain walls: push out + lose a pip (never instant death)
 const pd=s2d(P.y),s=s2span(pd),r=6;let push=null;
 if(P.x-r<s.L)push=s.L+r+8;else if(P.x+r>s.R)push=s.R-r-8;else if(s.a>=0&&P.x+r>s.a&&P.x-r<s.b)push=(P.x-s.a<s.b-P.x)?s.a-r-8:s.b+r+8;
 if(push!==null){s2push(push);G.hitBy='wall';if(playerHit())G2.wallHits++;part(1,P.x,P.y,0,0,12,10,'cy');}
 for(const g of G2.gears){const gy=s2y(g.d);if(gy<-80||gy>H+80)continue;const gx=gearX(g),dx=P.x-gx,dy=P.y-gy,dd=Math.hypot(dx,dy)||1,rr=g.r*.9+6;
  if(dd<rr){P.x=clamp(gx+dx/dd*(rr+8),10,W-10);P.y=clamp(gy+dy/dd*(rr+8),20,H-16);G.hitBy='gear';if(playerHit())G2.wallHits++;}}
 for(const e of EN.a){if(!e.act||e.type!=='block')continue;const hw=e.r+6;if(Math.abs(P.x-e.x)<hw&&Math.abs(P.y-e.y)<hw){P.y=e.y+hw+2;if(P.y>H-16){P.y=H-16;e.hp=0;kill(e);}G.hitBy='block';if(playerHit())G2.wallHits++;}}
 for(let i=G2.items.length-1;i>=0;i--){const it=G2.items[i],y=s2y(it.d);if(y>H+20){G2.items.splice(i,1);if(it.k==='m')G.chain=0;continue;}if(y<-10)continue;
  if(Math.abs(P.x-it.x)<16&&Math.abs(P.y-y)<16){G2.items.splice(i,1);if(it.k==='m'){const v=CHAIN[Math.min(G.chain,CHAIN.length-1)];G.chain++;G.score+=v;G.pop2={t:0,x:it.x,y,s:'+'+v};sfx.medal(G.chain);}else{G.salv+=3;sfx.cog();}}}}
// bullets: player shots stop on walls/gears (sparks, small score on gears); enemy shots stop on walls
function s2BlockPB(b){const d=s2d(b.y);if(s2solid(b.x,d,0)){if(Math.random()<.3)part(0,b.x,b.y,rnd(-1,1),rnd(0,1),8,.5,'cy');return true;}
 for(const g of G2.gears){const gy=s2y(g.d);if(Math.abs(gy-b.y)>g.r)continue;const gx=gearX(g);if((b.x-gx)**2+(b.y-gy)**2<g.r*g.r){G.score+=5;if(Math.random()<.4)part(0,b.x,b.y,rnd(-1.5,1.5),rnd(0,1.5),8,.6,'am');return true;}}return false;}
function s2BlockEB(b){return s2solid(b.x,s2d(b.y),0);}
// ---------- boss 2: INFERNO DRILL ENGINE
function spawnBoss2(){const b=spawn('boss2',W/2,-130,{invT:150,phase:0,hA:0,ls:0,lt:0,lcd:200,big:true});G.boss=b;
 b.parts=[b.pL=mkPart(b,-76,-8,28,260,'LEFT FURNACE','debris'),b.pR=mkPart(b,76,-8,28,260,'RIGHT FURNACE','debris'),b.pM=mkPart(b,0,78,28,300,'DRILL HEAD','debris')];musicStart(3);G2.spd=.5;}
function updBoss2(e){const t=e.t;
 if(e.dying){e.dT++;if(e.dT===1){strobe(200);sfx.bossDie();}if(e.dT%4===0)boom(e.x+rnd(-100,100),e.y+rnd(-60,90),rnd(1,2.4),['am','eb','am','cy'][e.dT%4]);if(e.dT%30===0){part(1,e.x,e.y,0,0,30,60,'am');sfx.phase();}e.y+=.35;G.shake=Math.max(G.shake,7);
  if(e.dT===220){boom(e.x,e.y,5,'am');boom(e.x,e.y+60,4.5,'eb');boom(e.x,e.y,4,'cy');part(1,e.x,e.y,0,0,50,140,'w');flash(1,'255,200,120');sfx.bossDie();for(let i=0;i<10;i++)G.fall.push({x:e.x+rnd(-90,90),y:e.y+rnd(-40,60),vx:rnd(-3,3),vy:rnd(-5,-1),rot:0,vr:rnd(-.1,.1),spr:i%3?'debris':'bGear',t:0});e.act=false;G.boss=null;later(150,stageClear);}return;}
 if(e.y<140){e.y+=1;e.invT=Math.max(e.invT,2);return;}
 const ph=e.phase,L=e.pL.act,R=e.pR.act,D=e.pM.act;e.r=ph<3?22:40;
 if(t%5===0){steam(e.x-50,e.y-70);steam(e.x+50,e.y-70);}
 if(e.invT>0)return;
 // telegraphed drill lunge: 0 idle,1 telegraph,2 dive,3 impact,4 rise
 const canL=D||ph===3;
 if(e.ls===0){e.x=W/2+Math.sin(t*(.011+ph*.003))*(50+ph*15);if(canL&&--e.lcd<=0){e.ls=1;e.lt=0;e.lx=clamp(P.x,80,W-80);sfx.hiss();}}
 else{e.lt++;if(e.ls===1){e.x+=(e.lx-e.x)*.1;if(e.lt>(ph===3?50:70)){e.ls=2;e.lt=0;sfx.flame();}}
  else if(e.ls===2){e.y+=9;if(e.y>=H-200){e.ls=3;e.lt=0;G.shake=14;boom(e.x,e.y+100,2.5,'am');ring(e.x,e.y+100,ph===3?16:10,t*.1,2.1);for(let i=0;i<8;i++)part(2,e.x+rnd(-30,30),e.y+100,rnd(-3,3),rnd(-5,-2),40,rnd(1,2));}}
  else if(e.ls===3){if(e.lt>24){e.ls=4;}}
  else if(e.ls===4){e.y-=3.2;if(e.y<=140){e.y=140;e.ls=0;e.lcd=ph===3?150:250;}}}
 // drill contact during lunge
 if(e.ls>=2&&e.ls<=3&&P.dead<=0&&Math.abs(P.x-e.x)<(D?26:40)&&P.y>e.y+30&&P.y<e.y+(D?118:70)){G.hitBy='drill';playerHit();}
 if(e.ls>=1&&e.ls<=3)return; // focus: no other fire during the telegraph/lunge (readable)
 const sp=1+ph*.1;
 if(L&&t%70===0)fan(e.x-76,e.y,aim(e.x-76,e.y),5,.7,2.5*sp);
 if(R&&t%70===35)fan(e.x+76,e.y,aim(e.x+76,e.y),5,.7,2.5*sp);
 if(ph>=1&&t%140===70){if(L)fan(e.x-76,e.y,Math.PI/2,3,.6,1.8,true);if(R)fan(e.x+76,e.y,Math.PI/2,3,.6,1.8,true);}
 if(D&&t%120===60)ring(e.x,e.y+100,8,t*.02,1.7);
 if(ph<3){if(t%110===0)fan(e.x,e.y+20,aim(e.x,e.y+20),3,.35,2.6,true);if(ph>=2&&t%6===0){e.hA+=.14;eShot(e.x,e.y,e.hA,2.4);eShot(e.x,e.y,e.hA+Math.PI,2.4);}}
 else{e.hA+=.05;if(t%5===0)for(let k=0;k<4;k++)eShot(e.x,e.y,e.hA+k*Math.PI/2,2.6);if(t%60===0)ring(e.x,e.y,18,(t/60)%2?TAU/36:0,2,true);}}
// ---------- drawing
function gearPath(x,y,r,n,rot){ctx.beginPath();for(let i=0;i<n*2;i++){const a0=rot+i/(n*2)*TAU,a1=rot+(i+1)/(n*2)*TAU,rr=i%2?r*.82:r;ctx.lineTo(x+Math.cos(a0)*rr,y+Math.sin(a0)*rr);ctx.lineTo(x+Math.cos(a1)*rr,y+Math.sin(a1)*rr);}ctx.closePath();}
function neonStroke(c,w){ctx.strokeStyle=c;ctx.globalAlpha=.22;ctx.lineWidth=w*3.2;ctx.stroke();ctx.globalAlpha=1;ctx.lineWidth=w;ctx.stroke();}
function s2DrawBack(){ctx.fillStyle='rgba(40,14,6,.38)';ctx.fillRect(0,0,W,H);
 // dim background girders (parallax, never bullet-like: long, wide, dark)
 ctx.fillStyle='rgba(90,50,30,.18)';const o=(G2.d*.5)%160;for(let y=-160+o;y<H;y+=160)ctx.fillRect(0,y,W,10);for(const x of[70,180,290])ctx.fillRect(x-4,0,8,H);
 const st=6,n=Math.ceil(H/st)+2,Ls=[],Rs=[],As=[],Bs=[],Ys=[];for(let i=0;i<n;i++){const y=-st+i*st,s=s2span(s2d(y));Ys.push(y);Ls.push(s.L);Rs.push(s.R);As.push(s.a);Bs.push(s.b);}
 const fill='#160c12';
 // left wall
 ctx.beginPath();ctx.moveTo(-5,Ys[0]);for(let i=0;i<n;i++)ctx.lineTo(Ls[i],Ys[i]);ctx.lineTo(-5,Ys[n-1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();
 ctx.beginPath();ctx.moveTo(W+5,Ys[0]);for(let i=0;i<n;i++)ctx.lineTo(Rs[i],Ys[i]);ctx.lineTo(W+5,Ys[n-1]);ctx.closePath();ctx.fill();
 // rivet bands on walls
 ctx.fillStyle='rgba(255,140,60,.18)';for(let i=0;i<n;i++){const d=Math.floor(s2d(Ys[i]));if(d%48<6){ctx.fillRect(0,Ys[i],Ls[i]-4,3);ctx.fillRect(Rs[i]+4,Ys[i],W,3);}}
 ctx.beginPath();for(let i=0;i<n;i++)i?ctx.lineTo(Ls[i],Ys[i]):ctx.moveTo(Ls[i],Ys[i]);neonStroke(COL.cy,2.5);
 ctx.beginPath();for(let i=0;i<n;i++)i?ctx.lineTo(Rs[i],Ys[i]):ctx.moveTo(Rs[i],Ys[i]);neonStroke(COL.cy,2.5);
 // island (branch divider)
 let i=0;while(i<n){if(As[i]<0){i++;continue;}let j=i;while(j<n&&As[j]>=0)j++;ctx.beginPath();ctx.moveTo(As[i],Ys[i]);for(let k=i;k<j;k++)ctx.lineTo(As[k],Ys[k]);for(let k=j-1;k>=i;k--)ctx.lineTo(Bs[k],Ys[k]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();neonStroke(COL.cy,2.5);i=j;}
 // gear tracks + gears (indestructible)
 for(const g of G2.gears){const y=s2y(g.d);if(y<-70||y>H+70)continue;const x=gearX(g);
  if(g.amp){ctx.fillStyle='rgba(255,181,46,.25)';ctx.fillRect(g.x0-g.amp-g.r*.4,y-3,g.amp*2+g.r*.8,6);}
  gearPath(x,y,g.r,10,g.rot);ctx.fillStyle='#24150c';ctx.fill();neonStroke(COL.am,2.5);
  ctx.beginPath();ctx.arc(x,y,g.r*.45,0,TAU);ctx.strokeStyle='rgba(255,181,46,.7)';ctx.lineWidth=2;ctx.stroke();
  ctx.save();ctx.translate(x,y);ctx.rotate(g.rot);ctx.fillStyle='rgba(255,181,46,.55)';for(let k=0;k<4;k++){ctx.rotate(Math.PI/2);ctx.fillRect(-2,g.r*.15,4,g.r*.5);}ctx.restore();
  ctx.fillStyle=COL.am;ctx.beginPath();ctx.arc(x,y,5,0,TAU);ctx.fill();}
 // flame nozzles + warning flicker
 for(const f of G2.flames){const y=s2y(f.d);if(y<-20||y>H+20)continue;const[o,dir]=flameOrigin(f),stt=flameState(f);
  ctx.fillStyle='#3a2410';ctx.fillRect(dir>0?o-2:o-10,y-9,12,18);ctx.strokeStyle=stt?COL.am:'#7a5a3a';ctx.lineWidth=1.5;ctx.strokeRect(dir>0?o-2:o-10,y-9,12,18);
  if(stt===1){const fl=(G.t>>2)%2;ctx.globalAlpha=fl?.75:.3;ctx.setLineDash([6,6]);ctx.strokeStyle='#ffd27a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(o,y-11);ctx.lineTo(o+dir*f.len,y-11);ctx.moveTo(o,y+11);ctx.lineTo(o+dir*f.len,y+11);ctx.stroke();ctx.setLineDash([]);
   ctx.globalAlpha=1;if(fl)txt('!',o+dir*18,y-8,'#ffd27a',14,'center');}}
 // branch items
 for(const it of G2.items){const y=s2y(it.d);if(y<-10||y>H+10)continue;if(it.k==='m'){ctx.save();ctx.translate(it.x,y);ctx.rotate(Math.PI/4);ctx.fillStyle=COL.li;ctx.fillRect(-4,-4,8,8);ctx.fillStyle='#fff';ctx.fillRect(-1.6,-1.6,3.2,3.2);ctx.restore();}
  else{ctx.fillStyle=COL.am;ctx.beginPath();ctx.arc(it.x,y,5,0,TAU);ctx.fill();ctx.fillStyle='#3a2410';ctx.beginPath();ctx.arc(it.x,y,2,0,TAU);ctx.fill();}}}
function s2DrawFront(){ctx.globalCompositeOperation='lighter';
 for(const f of G2.flames){if(flameState(f)!==2)continue;const y=s2y(f.d);if(y<-20||y>H+20)continue;const[o,dir]=flameOrigin(f),len=f.len*(.92+.08*Math.sin(G.t*.9)),x1=o+dir*len;
  const gr=ctx.createLinearGradient(o,0,x1,0);gr.addColorStop(0,'rgba(255,255,220,.95)');gr.addColorStop(.35,'rgba(255,170,40,.85)');gr.addColorStop(1,'rgba(255,60,10,0)');ctx.fillStyle=gr;
  ctx.beginPath();ctx.moveTo(o,y-6);ctx.quadraticCurveTo(o+dir*len*.5,y-13-Math.sin(G.t*.7)*3,x1,y);ctx.quadraticCurveTo(o+dir*len*.5,y+13+Math.sin(G.t*.6)*3,o,y+6);ctx.closePath();ctx.fill();}
 const b=G.boss;if(b&&b.act&&b.type==='boss2'&&b.ls===1&&(G.t>>2)%2){ctx.fillStyle='rgba(255,36,80,.16)';ctx.fillRect(b.lx-30,b.y+40,60,H);ctx.globalAlpha=.9;for(let y=b.y+120;y<H;y+=46)txt('▼',b.lx,y,COL.eb,18,'center');ctx.globalAlpha=1;}
 ctx.globalCompositeOperation='source-over';}
function drawBlock(e){const s=e.r,fl=e.fl>0&&e.fl%2;ctx.fillStyle=e.glass?'rgba(120,220,255,.22)':'#4a2f14';ctx.fillRect(e.x-s,e.y-s,s*2,s*2);ctx.strokeStyle=e.glass?'#bff4ff':COL.am;ctx.lineWidth=2;ctx.strokeRect(e.x-s+1,e.y-s+1,s*2-2,s*2-2);
 if(!e.glass){ctx.fillStyle='rgba(255,200,120,.35)';for(const[a,b2]of[[-1,-1],[1,-1],[-1,1],[1,1]])ctx.fillRect(e.x+a*(s-6)-1.5,e.y+b2*(s-6)-1.5,3,3);}
 const f=e.hp/e.maxhp,nc=f<.25?6:f<.5?4:f<.8?2:0;ctx.strokeStyle=e.glass?'#ffffff':'#1a0c04';ctx.lineWidth=1.3;ctx.beginPath();
 for(let k=0;k<nc;k++){const a=e.seed+k*2.4;let x=e.x,y=e.y;ctx.moveTo(x,y);for(let j=0;j<3;j++){x+=Math.cos(a+j*.5)*s*.33;y+=Math.sin(a+j*.5)*s*.33;ctx.lineTo(x,y);}}ctx.stroke();
 if(fl){ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(e.x-s,e.y-s,s*2,s*2);}}
function drawPart2(e){const x=e.x,y=e.y;if(e.fl>0&&e.fl%2){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.7;ds(S.dot.w||S.dot.am,x,y,0,2.2);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
 if(e.hitT>0){const f=Math.max(0,e.hp/e.maxhp),bw=e.r*1.5;ctx.globalAlpha=Math.min(1,e.hitT/30);ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(x-bw/2,y+e.r+6,bw,4);ctx.fillStyle=f>.5?COL.li:f>.25?COL.am:COL.eb;ctx.fillRect(x-bw/2,y+e.r+6,bw*f,4);ctx.globalAlpha=1;}}
function drawBoss2(e){const sh=e.dying?rnd(-4,4):0,x=e.x+sh,y=e.y,fl=e.fl>0&&e.fl%2,glow=.55+.3*Math.sin(G.t*.3);
 ctx.globalCompositeOperation='lighter';ds(S.dot.am,x,y,0,7);ctx.globalCompositeOperation='source-over';
 // chimneys
 ctx.fillStyle='#24150c';ctx.strokeStyle=COL.cu||COL.am;ctx.lineWidth=1.5;for(const sx of[-58,42]){ctx.fillRect(x+sx,y-78,16,40);ctx.strokeRect(x+sx,y-78,16,40);}
 // body
 ctx.beginPath();ctx.moveTo(x-108,y-40);ctx.lineTo(x+108,y-40);ctx.lineTo(x+86,y+42);ctx.lineTo(x-86,y+42);ctx.closePath();ctx.fillStyle='#1c110c';ctx.fill();neonStroke('#ff8a2a',2.5);
 ctx.fillStyle='rgba(255,120,30,'+(glow*.55).toFixed(2)+')';ctx.fillRect(x-44,y+12,88,22);ctx.fillStyle='#1c110c';for(let k=0;k<6;k++)ctx.fillRect(x-40+k*15,y+12,4,22);
 // furnaces
 for(const[pp,sx]of[[e.pL,-76],[e.pR,76]]){if(pp&&pp.act){ctx.beginPath();ctx.arc(x+sx,y-8,28,0,TAU);ctx.fillStyle='#2a160c';ctx.fill();neonStroke('#ff8a2a',2);ctx.beginPath();ctx.arc(x+sx,y-8,17,0,TAU);ctx.fillStyle='rgba(255,'+(110+Math.floor(60*glow))+',30,'+glow.toFixed(2)+')';ctx.fill();ctx.fillStyle='#2a160c';for(let k=-1;k<=1;k++)ctx.fillRect(x+sx+k*8-1.5,y-25,3,34);drawPart2(pp);}
  else{ctx.beginPath();ctx.arc(x+sx,y-8,16,0,TAU);ctx.fillStyle='#0d0705';ctx.fill();ctx.strokeStyle=COL.eb;ctx.lineWidth=1;ctx.stroke();if(G.t%5===0)part(3,x+sx+rnd(-6,6),y-12,rnd(-.3,.3),rnd(-1.2,-.6),rnd(30,45),rnd(.6,1));}}
 // drill
 if(e.pM&&e.pM.act){const dy=y+42,tip=y+122;ctx.beginPath();ctx.moveTo(x-30,dy);ctx.lineTo(x+30,dy);ctx.lineTo(x,tip);ctx.closePath();ctx.fillStyle='#3a3040';ctx.fill();ctx.save();ctx.clip();ctx.strokeStyle='rgba(200,210,255,.55)';ctx.lineWidth=4;const o=(e.t*(e.ls===2||e.ls===3?3:1))%18;for(let k=-6;k<8;k++){ctx.beginPath();ctx.moveTo(x-40,dy+k*18+o);ctx.lineTo(x+40,dy+k*18+o+16);ctx.stroke();}ctx.restore();
  ctx.beginPath();ctx.moveTo(x-30,dy);ctx.lineTo(x+30,dy);ctx.lineTo(x,tip);ctx.closePath();neonStroke('#c9d2ff',2);drawPart2(e.pM);}
 else{ctx.beginPath();ctx.moveTo(x-22,y+42);ctx.lineTo(x+22,y+42);ctx.lineTo(x+8,y+62);ctx.lineTo(x-10,y+56);ctx.closePath();ctx.fillStyle='#0d0705';ctx.fill();ctx.strokeStyle=COL.eb;ctx.lineWidth=1;ctx.stroke();}
 // core eye
 const arm=partsAlive(e)>0;ctx.beginPath();ctx.arc(x,y-6,22,0,TAU);ctx.fillStyle='#120808';ctx.fill();neonStroke(arm?'#8a8aa0':COL.eb,arm?2:3);
 ctx.globalCompositeOperation='lighter';ctx.globalAlpha=arm?.5:.6+.4*Math.sin(G.t*.4);ds(arm?S.dot.am:S.dot.eb||S.dot.mg,x,y-6,0,arm?1.6:3);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 if(fl){ctx.fillStyle='rgba(255,255,255,.35)';ctx.beginPath();ctx.arc(x,y-6,24,0,TAU);ctx.fill();}}
