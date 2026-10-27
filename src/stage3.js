// ---------- v1.1 STAGE 3: SPEED RUN RAIL CHASE (© Rainwater Games)
const G3={d:0,spd:3,ev:0,lines:[],tumble:[],morts:[],waves:[],sparks:[],fenceHits:0,ganHits:0,mortHits:0,waveHits:0,ramHits:0,inTun:0};
const s3y=d=>H-(d-G3.d), s3d=y=>G3.d+(H-y);
const S3D={hp:3.3,spd:1.35,extra:.45};
const TUN=[[3950,5350]],BRS=[[2450,3700],[6900,7850]],BOSS3D=8650;
const GANS=[[1450,[[110,74]]],[1720,[[250,74]]],[1990,[[180,80]]],[6050,[[90,72],[270,72]]],[6300,[[180,76]]],[6550,[[80,72],[280,72]]]];
function trX(d){return W/2+52*Math.sin(d/520)+24*Math.sin(d/190+1);}
function brK(d){for(const b of BRS){if(d>b[0]&&d<b[1])return Math.min(1,(d-b[0])/260,(b[1]-d)/260);}return 0;}
function laneX(d,l){const k=brK(d);return clamp(trX(d)+(l||0)*96*k,34,W-34);}
function tunK(d){for(const t of TUN){if(d>t[0]-150&&d<t[1]+150)return Math.min(1,(d-t[0]+150)/150,(t[1]+150-d)/150);}return 0;}
function warning3(){strobe(90);G.banner={t:0,a:'⚠ WARNING ⚠',b:'IRON LOCOMOTIVE — ALL CARS ARMED',warn:true};sfx.warn();}
function tcar(kind,lane,vy){const hp={tur:80,gat:120,flat:70}[kind];return spawn('tcar',laneX(G3.d+H+60,lane||0),-60,{kind,lane:lane||0,vy:vy||1,hp0:hp,cd:40+Math.floor(Math.random()*40)});}
function convoy(list,lane){list.forEach((k,i)=>later(i*58,()=>{if(G.stage===3)tcar(k,lane);}));}
function tunDrone(side){const e=spawn('swooper',side<0?40:W-40,-10,{x0:side<0?110:W-110,dir:side,shootAt:40});if(e)e.flashIn=24;}
const EV3=[[0,()=>{G.banner={t:0,a:'STAGE 3',b:'SPEED RUN — RAIL CHASE'};}],[260,()=>popcorn(6)],[520,()=>convoy(['tur','flat','tur'])],
 [1250,()=>{G.banner={t:110,a:'⚠ SIGNAL GANTRIES — FLY THE GAPS',b:'',small:true,c:COL.am};}],[1500,()=>swoop(-1)],[1850,()=>swoop(1)],
 [2200,()=>{G.banner={t:0,a:'◀ RISK  ·  SAFE ▶',b:'TRACK SWITCH — LEFT: MEDALS + GATLING   RIGHT: SALVAGE'};}],[2450,()=>convoy(['gat','tur'],-1)],[3000,()=>convoy(['flat'],1)],
 [3750,()=>{G.banner={t:110,a:'TUNNEL — FOLLOW THE SIGNALS',b:'',small:true,c:COL.cy};}],[4100,()=>tunDrone(-1)],[4300,()=>tunDrone(1)],[4500,()=>convoy(['tur','gat'])],[4900,()=>{tunDrone(-1);tunDrone(1);}],[5150,()=>popcorn(5)],
 [5500,()=>convoy(['gat','flat','tur'])],[6000,()=>popcorn(5)],[6700,()=>{G.banner={t:0,a:'◀ RISK  ·  SAFE ▶',b:'SECOND SWITCH'};}],[6950,()=>convoy(['gat','gat'],-1)],[7350,()=>convoy(['tur'],1)],
 [8000,()=>convoy(['flat','tur'])],[8350,()=>warning3()],[BOSS3D,()=>spawnBoss3()]];
function s3reset(d){Object.assign(G3,{d:d||0,spd:3,ev:0,tumble:[],morts:[],waves:[],sparks:[],fenceHits:0,ganHits:0,mortHits:0,waveHits:0,ramHits:0,inTun:0});
 G3.gans=GANS.map(g=>({d:g[0],gaps:g[1]}));G3.items=[];
 for(const b of BRS)for(let dd=b[0]+300;dd<b[1]-300;dd+=60){G3.items.push({d:dd,l:-1,k:'m'});if((dd-b[0])%120===0)G3.items.push({d:dd,l:1,k:'c'});}
 G3.lines=[];for(let i=0;i<26;i++)G3.lines.push({x:rnd(0,W),y:rnd(-200,H),len:rnd(60,170),c:i%3?'cy':'mg',v:rnd(1.6,2.6)});
 EV3.sort((p,q)=>p[0]-q[0]);if(G3.d>0)while(G3.ev<EV3.length&&EV3[G3.ev][0]<G3.d)G3.ev++;}
function toStage3(){if(G.state!=='play')return;G.stage=3;s3reset(0);G.hold=false;G.boss=null;EB.clear();const bon=G.lives*20000;G.score+=bon;G.shield=G.maxSh;G.hull=Math.min(G.hullM,G.hull+1);
 G.banner={t:0,a:'FOUNDRY CLEARED',b:'+'+bon.toLocaleString()+' · SHIELD FULL · HULL +1'};musicStart(4);G.ev3Delay=170;}
function s3Update(){for(const l of G3.lines){l.y+=G3.spd*l.v*(G.boss?.6:1);if(l.y-l.len>H){l.y=rnd(-120,-10);l.x=rnd(0,W);}}
 for(const s of G3.tumble){s.t++;s.x+=s.vx;s.y+=s.vy;s.vy+=.05;s.rot+=s.vr;if(s.t%4===0)G3.sparks.push({x:s.x,y:s.y+20,vx:rnd(-2,2),vy:rnd(1,4),t:0});if(s.t%25===0)boom(s.x+rnd(-10,10),s.y,1.1,'am');}
 G3.tumble=G3.tumble.filter(s=>s.y<H+120&&s.t<400);
 for(const s of G3.sparks){s.t++;s.x+=s.vx;s.y+=s.vy;}G3.sparks=G3.sparks.filter(s=>s.t<22);
 if(G.ev3Delay>0){G.ev3Delay--;return;}
 G3.d+=G3.spd;while(G3.ev<EV3.length&&EV3[G3.ev][0]<=G3.d){EV3[G3.ev][1]();G3.ev++;}
 G3.inTun=tunK(s3d(P.y));
 if(window.NG&&NG.auto)NG.auto();
 const alive=P.dead<=0&&G.lives>0;
 // mortars (boss): telegraphed impact squares
 for(const m of G3.morts){m.t++;if(m.t===m.T){boom(m.x,m.y,1.6,'am');G.shake=Math.max(G.shake,6);ring(m.x,m.y,m.n||6,rnd(0,1),1.5,false);
  if(alive&&Math.abs(P.x-m.x)<30&&Math.abs(P.y-m.y)<30){G.hitBy='mortar';if(playerHit())G3.mortHits++;}}}
 G3.morts=G3.morts.filter(m=>m.t<m.T+12);
 // whistle shockwave: expanding ring with two safe gaps
 for(const w of G3.waves){w.R+=4.4;if(alive&&!w.hit){const dd=Math.hypot(P.x-w.x,P.y-w.y);if(Math.abs(dd-w.R)<8){let a=Math.atan2(P.y-w.y,P.x-w.x),inGap=false;for(const g of w.gaps){let da=Math.abs(((a-g+Math.PI*3)%TAU)-Math.PI);if(da<w.gw)inGap=true;}
  if(!inGap){w.hit=true;G.hitBy='whistle';if(playerHit())G3.waveHits++;}}}}
 G3.waves=G3.waves.filter(w=>w.R<760);
 if(!alive)return;
 const pd=s3d(P.y);
 // switch fence between the two branches
 const k=brK(pd);if(k>.55){const fx=trX(pd);if(Math.abs(P.x-fx)<16){P.x=clamp(P.x<fx?fx-26:fx+26,10,W-10);G.hitBy='fence';if(playerHit())G3.fenceHits++;part(1,P.x,P.y,0,0,12,10,'li');}}
 // signal gantries
 for(const g of G3.gans){const y=s3y(g.d);if(y<-20||y>H+20)continue;if(Math.abs(P.y-y)<10){let ok=false;for(const gp of g.gaps)if(Math.abs(P.x-gp[0])<gp[1]/2-7)ok=true;
  if(!ok){P.y=clamp(y+20,20,H-16);G.hitBy='gantry';if(playerHit())G3.ganHits++;part(1,P.x,P.y,0,0,12,10,'am');}}}
 // branch pickups
 for(let i=G3.items.length-1;i<G3.items.length&&i>=0;i--){const it=G3.items[i],y=s3y(it.d);if(y>H+20){G3.items.splice(i,1);if(it.k==='m')G.chain=0;continue;}if(y<-10)continue;const ix=laneX(it.d,it.l);
  if(Math.abs(P.x-ix)<16&&Math.abs(P.y-y)<16){G3.items.splice(i,1);if(it.k==='m'){const v=CHAIN[Math.min(G.chain,CHAIN.length-1)];G.chain++;G.score+=v*2;G.pop2={t:0,x:ix,y,s:'+'+v*2};sfx.medal(G.chain);}else{G.salv+=4;sfx.cog();}}}}
// ---------- train cars
function carFire(e,kind,x,y,t){if(kind==='tur'){if(--e.cd<=0){e.cd=72;fan(x,y,aim(x,y),3,.42,2.5,t%2===0);}}
 else if(kind==='gat'){const c=t%130;e.spin=c>=95?1:c<48?.6:.1;if(c<48&&c%5===0)eShot(x,y+10,aim(x,y)+rnd(-.12,.12),3);}
 else if(kind==='flat'){if(t%150===40){for(const s of[-1,1]){const d=spawn('drone',x+s*12,y,{vy:2.2,x0:-1,home:true,shootAt:50,vx:s*1.2});if(d)d.flashIn=10;}sfx.hiss();}if(t%150===110)fan(x,y,aim(x,y),2,.3,2.4);}}
function updTcar(e){const t=e.t;e.y+=e.vy;const d=s3d(e.y);const nx=laneX(d,e.lane);e.rot=Math.atan2(nx-e.x,4)*.25;e.x=nx;
 if(e.y>20&&e.y<H*.7)carFire(e,e.kind,e.x,e.y,t);if(t%7===0)steam(e.x+rnd(-8,8),e.y-30);if(e.y>H+80)e.act=false;}
function drawCarBody(x,y,rot,kind,fl,spin,scale){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);const s=scale||1;ctx.scale(s,s);
 ctx.fillStyle=fl?'#c9d2ff':'#22253e';ctx.fillRect(-20,-30,40,60);ctx.strokeStyle='#7a6cff';ctx.lineWidth=2;ctx.strokeRect(-20,-30,40,60);
 ctx.fillStyle='#ffb52e';for(const yy of[-24,24])ctx.fillRect(-22,yy-2,44,4); // brass bands
 ctx.fillStyle='#3a3f66';for(const yy of[-20,20])for(const xx of[-21,17])ctx.fillRect(xx,yy-6,4,12); // bogies
 if(kind==='tur'){ctx.fillStyle='#1a1c30';ctx.fillRect(-11,-11,22,22);ctx.strokeStyle='#2ef9ff';ctx.strokeRect(-11,-11,22,22);ctx.fillStyle='#2ef9ff';ctx.fillRect(-2,6,4,14);}
 else if(kind==='gat'){ctx.fillStyle='#2b1d10';ctx.fillRect(-14,-6,28,26);ctx.strokeStyle='#ffb52e';ctx.strokeRect(-14,-6,28,26);const o=(G.t*(spin||.1))%6;ctx.fillStyle='#ffb52e';for(let i=-2;i<=2;i++)ctx.fillRect(i*4-1,18+((i*3+o)%6)/3,2,12);}
 else if(kind==='flat'){ctx.fillStyle='#14162a';ctx.fillRect(-16,-24,32,48);ctx.fillStyle='#ff3df0';for(const yy of[-12,10]){ctx.beginPath();ctx.moveTo(-8,yy+6);ctx.lineTo(0,yy-6);ctx.lineTo(8,yy+6);ctx.closePath();ctx.fill();}}
 else if(kind==='car'){ctx.fillStyle='#2b1d10';ctx.fillRect(-12,-18,24,36);}
 ctx.restore();}
function drawTcar(e){const fl=e.fl>0&&e.fl%2;if(e.kind==='gat'&&e.t%130>=95){ctx.globalAlpha=.5+.5*Math.sin(G.t*.8);txt('▼ GATLING',e.x,e.y+34,COL.am,8,'center',4);ctx.globalAlpha=1;}drawCarBody(e.x,e.y,e.rot,e.kind,fl,e.spin);}
// ---------- BOSS 3: IRON LOCOMOTIVE
const CARS3=[['TURRET CAR','tur',96,620],['DRONE FLATBED','flat',164,560],['GATLING CABOOSE','gat',232,700]];
function spawnBoss3(){const b=spawn('boss3',W/2,-150,{invT:200,phase:0,ms:0,mt:0,mcd:260,atk:0,hA:0,big:true});G.boss=b;
 b.cars=CARS3.map(c=>{const p=mkPart(b,0,c[2],26,c[3],c[0],'debris');p.kind=c[1];p.cd=60;return p;});
 b.fb=mkPart(b,0,40,22,780,'FIREBOX','debris');b.stk=mkPart(b,0,-46,20,700,'SMOKESTACK','debris');b.parts=[...b.cars,b.fb,b.stk];musicStart(5);G3.spd=1.3;}
function b3Rear(e){for(let i=e.cars.length-1;i>=0;i--)if(e.cars[i].act&&!e.cars[i].gone)return e.cars[i];return null;}
function b3PartDown(pa,q){const nc=pa.cars.filter(c=>c.act&&!c.gone).length;
 if(pa.cars.includes(q)){G3.tumble.push({x:q.x,y:q.y,vx:rnd(-2.5,2.5)||1.5,vy:1.2,rot:q.rot||0,vr:rnd(.04,.09)*(Math.random()<.5?-1:1),kind:q.kind,t:0});sfx.phase();
  pa.phase=3-nc;G.banner=nc?{t:70,a:q.label+' DETACHED',b:nc+' CAR'+(nc>1?'S':'')+' LEFT',small:false}:{t:70,a:'ENGINE EXPOSED',b:'FIREBOX · SMOKESTACK · COWCATCHER',warn:true};}
 else{const left=(pa.fb.act&&!pa.fb.gone?1:0)+(pa.stk.act&&!pa.stk.gone?1:0);if(!left){pa.phase=4;G.banner={t:40,a:'CORE EXPOSED',b:'BOILER OVERPRESSURE',warn:true};}}
 pa.invT=50;G.shake=12;flash(.5,'255,200,120');strobe(24);}
function b3Mortar(e,n){for(let i=0;i<n;i++){const tx=clamp(i===0?P.x:P.x+rnd(-120,120),24,W-24),ty=clamp(i===0?P.y:P.y+rnd(-110,60),H*.35,H-30);G3.morts.push({x:tx,y:ty,t:-i*12,T:70,n:e.phase>=4?8:6});}sfx.flame();
 for(let k=0;k<6;k++)steam(e.x+rnd(-6,6),e.y-66);}
function updBoss3(e){const t=e.t;
 if(e.dying){e.dT++;e.rot=Math.min(1.1,e.dT*.006)*e.dDir;e.x+=e.dDir*Math.min(3,e.dT*.02);e.y+=.5;G.shake=Math.max(G.shake,8);
  if(e.dT===1){strobe(220);sfx.bossDie();G.banner={t:20,a:'DERAILED!',b:'',warn:true};}
  for(let k=0;k<3;k++)G3.sparks.push({x:e.x+rnd(-24,24),y:e.y+rnd(30,90),vx:-e.dDir*rnd(2,6),vy:rnd(2,7),t:0});
  if(e.dT%5===0)boom(e.x+rnd(-60,60),e.y+rnd(-50,90),rnd(1,2.6),['am','mg','am','cy'][e.dT%4]);if(e.dT%35===0){part(1,e.x,e.y,0,0,30,60,'am');sfx.phase();}
  if(e.dT===240){boom(e.x,e.y,5.5,'am');boom(e.x,e.y+60,5,'mg');boom(e.x,e.y,4,'cy');part(1,e.x,e.y,0,0,60,160,'w');flash(1,'255,200,120');sfx.bossDie();
   for(let i=0;i<14;i++)G.fall.push({x:e.x+rnd(-90,90),y:e.y+rnd(-40,80),vx:rnd(-4,4),vy:rnd(-6,-1),rot:0,vr:rnd(-.12,.12),spr:i%3?'debris':'bGear',t:0});e.act=false;G.boss=null;later(170,stageClear);}return;}
 const rear=b3Rear(e);
 if(e.y<130&&e.ms===0){e.y+=1.2;e.invT=Math.max(e.invT,2);}
 // the whole train weaves along the track; parts follow the rails
 if(e.ms===0)e.x+=(trX(s3d(e.y))-e.x)*.05;
 for(const c of e.cars){if(!c.act)continue;c.ox=trX(s3d(e.y+c.oy))-e.x;c.rot=(c.ox)*.004;c.lock=c!==rear;}
 const engineLocked=!!rear;e.lock=e.fb.lock=e.stk.lock=engineLocked;
 if(t%4===0)steam(e.x+rnd(-5,5),e.y-62,rnd(-.4,.4));
 if(e.y<130&&e.ms===0)return;
 const ph=e.phase,sp=1+ph*.08;
 if(rear){carFire(rear,rear.kind,rear.x,rear.y,t);if(ph>=1&&t%150===75)fan(e.x,e.y-40,aim(e.x,e.y-40),3,.4,2.4,true);if(ph>=2&&--e.mcd<=0){e.mcd=320;b3Mortar(e,3);}return;}
 // engine: ram (cowcatcher) -> mortar -> whistle cycle; firebox breathes fire while alive
 const FB=e.fb.act&&!e.fb.gone,ST=e.stk.act&&!e.stk.gone,core=ph>=4;
 if(e.ms===0){e.x+=Math.sin(t*.02)*1.2;if(FB&&t%(core?40:56)===0)fan(e.x,e.y+40,aim(e.x,e.y+40),5,.8,2.3*sp,true);if(core&&t%7===0){e.hA+=.21;eShot(e.x,e.y,e.hA,2.4);eShot(e.x,e.y,e.hA+Math.PI,2.4);}
  if(--e.mcd<=0){const a=e.atk++%3;if(a===0){e.ms=1;e.mt=0;e.lx=clamp(P.x,60,W-60);sfx.hiss();G.banner={t:70,a:'⚠ RAM CHARGE',b:'',small:true,c:COL.am};}
   else if(a===1){b3Mortar(e,ST?(core?6:5):3);e.mcd=core?110:150;}
   else{e.ms=5;e.mt=0;e.gaps=[aim(e.x,e.y)+(Math.random()<.5?.55:-.55),aim(e.x,e.y)+Math.PI*.95];sfx.warn();G.banner={t:70,a:'♪ STEAM WHISTLE — FIND THE GAP',b:'',small:true,c:COL.cy};}}}
 else{e.mt++;
  if(e.ms===1){e.x+=(e.lx-e.x)*.1;if(e.mt>(core?52:72)){e.ms=2;e.mt=0;sfx.flame();}}
  else if(e.ms===2){e.y+=10;if(e.y>=H-150){e.ms=3;e.mt=0;G.shake=16;boom(e.x,e.y+80,2.6,'am');ring(e.x,e.y+80,core?14:10,t*.1,2);}}
  else if(e.ms===3){if(e.mt>22)e.ms=4;}
  else if(e.ms===4){e.y-=3.4;if(e.y<=130){e.y=130;e.ms=0;e.mcd=core?80:120;}}
  else if(e.ms===5){if(e.mt%6===0)steam(e.x+12,e.y-30,.6);if(e.mt>60){G3.waves.push({x:e.x,y:e.y,R:30,gaps:e.gaps,gw:.32,hit:false});sfx.bossDie&&sfx.phase();e.ms=0;e.mcd=core?90:130;}}}
 if(e.ms>=2&&e.ms<=3&&P.dead<=0&&Math.abs(P.x-e.x)<34&&P.y>e.y+20&&P.y<e.y+100){G.hitBy='cowcatcher';if(playerHit())G3.ramHits++;}}
// ---------- drawing
function s3DrawBack(){const tk=G.state==='play'?tunK(G3.d+H*.5):0;ctx.fillStyle='rgba(12,6,30,'+(.35+.3*tk).toFixed(2)+')';ctx.fillRect(0,0,W,H);
 // speed lines: thin, long, cyan/purple rails of light (never round, never red)
 ctx.globalCompositeOperation='lighter';for(const l of G3.lines){const g=ctx.createLinearGradient(0,l.y-l.len,0,l.y);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,l.c==='cy'?'rgba(46,249,255,.5)':'rgba(170,90,255,.45)');ctx.fillStyle=g;ctx.fillRect(l.x,l.y-l.len,1.2,l.len);}
 ctx.globalCompositeOperation='source-over';
 // tunnel walls
 for(const tn of TUN){const y0=s3y(tn[1]),y1=s3y(tn[0]);if(y1<0||y0>H)continue;ctx.fillStyle='#07040f';ctx.fillRect(0,Math.max(0,y0),18,Math.min(H,y1)-Math.max(0,y0));ctx.fillRect(W-18,Math.max(0,y0),18,Math.min(H,y1)-Math.max(0,y0));
  ctx.fillStyle='#3a2a6a';ctx.fillRect(0,y1-6,W,6);ctx.fillRect(0,y0,W,6);}
 // ties (motion-blurred sleepers) then rails, sampled along the twisting track
 const lanes=[0,-1,1];const off=G3.d%26;
 for(let y=H+26-off;y>-30;y-=26){const d=s3d(y),k=brK(d);for(const l of lanes){if(l&&k<=0)continue;if(!l&&k>=1)continue;const x=laneX(d,l);
  ctx.fillStyle='rgba(90,70,150,.18)';ctx.fillRect(x-17,y-12,34,14);ctx.fillStyle='#4b3a7a';ctx.fillRect(x-17,y,34,3);}}
 for(const l of lanes){for(const side of[-9,9]){ctx.beginPath();let st=false;for(let y=-20;y<=H+20;y+=10){const d=s3d(y),k=brK(d);if((l&&k<=0)||(!l&&k>=1)){st=false;continue;}const x=laneX(d,l)+side;if(!st){ctx.moveTo(x,y);st=true;}else ctx.lineTo(x,y);}
  ctx.strokeStyle=l<0?'#ff3df0':l>0?'#2ef9ff':'#8f7bff';ctx.lineWidth=1.6;ctx.globalAlpha=.25;ctx.lineWidth=5;ctx.stroke();ctx.globalAlpha=1;ctx.lineWidth=1.6;ctx.stroke();}}
 // switch fence (electrified divider)
 ctx.strokeStyle=COL.li;for(let y=-20;y<H+20;y+=14){const d=s3d(y),k=brK(d);if(k<=.55)continue;const x=trX(d);ctx.fillStyle='#2a2440';ctx.fillRect(x-4,y-1,8,12);ctx.globalAlpha=.5+.5*Math.random();ctx.beginPath();ctx.moveTo(x-6,y);ctx.lineTo(x+6,y+7);ctx.lineTo(x-6,y+14);ctx.lineWidth=1.4;ctx.stroke();ctx.globalAlpha=1;}
 // branch pickups
 for(const it of G3.items){const y=s3y(it.d);if(y<-10||y>H+10)continue;const x=laneX(it.d,it.l);if(it.k==='m'){ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillStyle=COL.li;ctx.fillRect(-4,-4,8,8);ctx.restore();}else{ctx.strokeStyle=COL.am;ctx.lineWidth=2;gearPath(x,y,6,6,G.t*.1);ctx.stroke();}}
 // gantries: steel truss with hazard stripes, green signal bars at each gap
 for(const g of G3.gans){const y=s3y(g.d);if(y<-30||y>H+30)continue;const segs=[];let x0=0;const gs=[...g.gaps].sort((a,b)=>a[0]-b[0]);for(const gp of gs){segs.push([x0,gp[0]-gp[1]/2]);x0=gp[0]+gp[1]/2;}segs.push([x0,W]);
  for(const s of segs){ctx.fillStyle='#2c2a40';ctx.fillRect(s[0],y-7,s[1]-s[0],14);ctx.fillStyle='#ffb52e';for(let x=s[0];x<s[1]-6;x+=14)ctx.fillRect(x,y-7,7,3);ctx.strokeStyle='#ffb52e';ctx.lineWidth=1;ctx.strokeRect(s[0]+.5,y-6.5,s[1]-s[0]-1,13);}
  for(const gp of gs)for(const sx of[-1,1]){ctx.fillStyle='#39ff9a';ctx.globalAlpha=.6+.4*Math.sin(G.t*.3);ctx.fillRect(gp[0]+sx*gp[1]/2-2,y-16,4,10);ctx.globalAlpha=1;}}
 // detached cars tumbling away
 for(const s of G3.tumble){drawCarBody(s.x,s.y,s.rot,s.kind,false,0,1-Math.min(.35,s.t/500));}
 // mortar targets: amber brackets + shrinking square (never round)
 for(const m of G3.morts){if(m.t<0)continue;const f=Math.max(0,1-m.t/m.T),s=12+26*f;ctx.strokeStyle=(m.t>>2)%2?'#ffb52e':'#fff3c0';ctx.lineWidth=2;ctx.strokeRect(m.x-s,m.y-s,s*2,s*2);ctx.beginPath();ctx.moveTo(m.x-8,m.y-8);ctx.lineTo(m.x+8,m.y+8);ctx.moveTo(m.x+8,m.y-8);ctx.lineTo(m.x-8,m.y+8);ctx.stroke();
  if(m.t<m.T){const sy=m.y-(1-f)*0-f*H*.6;ctx.fillStyle='#ffb52e';ctx.fillRect(m.x-1.5,sy-14,3,14);}}}
function s3DrawFront(){const k=G3.inTun;
 if(k>0){ // tunnel darkness with headlight cone (evenodd hole) + neon signals
  ctx.save();ctx.fillStyle='rgba(2,1,8,'+(.88*k).toFixed(3)+')';ctx.beginPath();ctx.rect(0,0,W,H);const cx=P.x,cy=P.y-10;ctx.moveTo(cx-12,cy);ctx.lineTo(cx-120,cy-360);ctx.lineTo(cx+120,cy-360);ctx.lineTo(cx+12,cy);ctx.lineTo(cx+30,cy+40);ctx.lineTo(cx-30,cy+40);ctx.closePath();ctx.fill('evenodd');
  ctx.globalCompositeOperation='lighter';const g=ctx.createLinearGradient(0,cy,0,cy-360);g.addColorStop(0,'rgba(200,240,255,.16)');g.addColorStop(1,'rgba(200,240,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(cx-12,cy);ctx.lineTo(cx-120,cy-360);ctx.lineTo(cx+120,cy-360);ctx.lineTo(cx+12,cy);ctx.fill();
  const off=G3.d%90;for(let y=H-off;y>-20;y-=90){const c=((Math.floor((G3.d+y)/90))%3===0)?'#ffb52e':'#39ff9a';ctx.fillStyle=c;ctx.globalAlpha=k*(.7+.3*Math.sin(G.t*.2+y));ctx.fillRect(6,y,5,14);ctx.fillRect(W-11,y,5,14);ctx.globalAlpha=k*.25;ctx.fillRect(2,y-6,13,26);ctx.fillRect(W-15,y-6,13,26);}
  ctx.globalAlpha=1;ctx.restore();
  // fairness: every live enemy gets a cyan bracket + flash-in burst so nothing is invisible
  for(const e of EN.a){if(!e.act||e.type==='part')continue;const r=Math.max(10,e.type==='boss3'?40:e.r);ctx.strokeStyle=COL.cy;ctx.globalAlpha=.75*k;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(e.x-r,e.y-r+6);ctx.lineTo(e.x-r,e.y-r);ctx.lineTo(e.x-r+6,e.y-r);ctx.moveTo(e.x+r-6,e.y-r);ctx.lineTo(e.x+r,e.y-r);ctx.lineTo(e.x+r,e.y-r+6);ctx.moveTo(e.x-r,e.y+r-6);ctx.lineTo(e.x-r,e.y+r);ctx.lineTo(e.x-r+6,e.y+r);ctx.moveTo(e.x+r-6,e.y+r);ctx.lineTo(e.x+r,e.y+r);ctx.lineTo(e.x+r,e.y+r-6);ctx.stroke();
   if(e.t<24){ctx.globalAlpha=(1-e.t/24)*k;ctx.fillStyle='#e8fbff';ctx.fillRect(e.x-r,e.y-2,r*2,4);ctx.fillRect(e.x-2,e.y-r,4,r*2);}}ctx.globalAlpha=1;}
 // sparks (streaks)
 ctx.strokeStyle='#ffd27a';ctx.lineWidth=1.3;ctx.beginPath();for(const s of G3.sparks){ctx.moveTo(s.x,s.y);ctx.lineTo(s.x-s.vx*2.5,s.y-s.vy*2.5);}ctx.stroke();
 // whistle shockwaves (hurt) — cyan/white ring with visible dark gaps
 for(const w of G3.waves){ctx.lineWidth=5;ctx.strokeStyle='rgba(200,250,255,.9)';let a0=0;const gs=w.gaps.map(g=>((g%TAU)+TAU)%TAU).sort((a,b)=>a-b);
  for(let i=0;i<gs.length;i++){const s=gs[i]+w.gw,e2=gs[(i+1)%gs.length]-w.gw+(i===gs.length-1?TAU:0);ctx.beginPath();ctx.arc(w.x,w.y,w.R,s,e2);ctx.stroke();}}
 const b=G.boss;if(b&&b.act&&b.type==='boss3'){
  if(b.ms===1){const a=.35+.35*Math.sin(G.t*.6);ctx.fillStyle='rgba(255,181,46,'+(a*.35).toFixed(3)+')';ctx.fillRect(b.lx-36,b.y+40,72,H);ctx.strokeStyle='#fff3c0';ctx.lineWidth=2;for(let y=b.y+60+(G.t*4)%40;y<H;y+=40){ctx.beginPath();ctx.moveTo(b.lx-16,y);ctx.lineTo(b.lx,y+12);ctx.lineTo(b.lx+16,y);ctx.stroke();}txt('⚠ COWCATCHER RAM ⚠',b.lx,H-60,'#ffb52e',12,'center',6);}
  if(b.ms===5){ctx.setLineDash([4,8]);ctx.strokeStyle='rgba(46,249,255,.55)';ctx.lineWidth=2;for(const g of b.gaps){ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x+Math.cos(g)*600,b.y+Math.sin(g)*600);ctx.stroke();}ctx.setLineDash([]);}}}
function drawBoss3(e){const sh=e.dying?rnd(-3,3):0,x=e.x+sh,y=e.y,fl=e.fl>0&&e.fl%2;
 // couplings + cars (rear to front)
 for(const c of e.cars){if(!c.act||c.gone)continue;ctx.strokeStyle='#8f7bff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y+56);ctx.lineTo(c.x,c.y-30);ctx.stroke();drawCarBody(c.x,c.y,c.rot,c.kind,c.fl>0&&c.fl%2,c.kind==='gat'?(e.t%130>=95?1:.6):0);
  if(c===b3Rear(e)&&!e.dying){ctx.strokeStyle=COL.cy;ctx.globalAlpha=.5+.4*Math.sin(G.t*.3);ctx.lineWidth=1.5;ctx.strokeRect(c.x-25,c.y-35,50,70);ctx.globalAlpha=1;}}
 ctx.save();ctx.translate(x,y);ctx.rotate(e.rot||0);
 ctx.fillStyle=fl?'#c9d2ff':'#1d1f36';ctx.fillRect(-30,-60,60,120);ctx.strokeStyle='#ffb52e';ctx.lineWidth=2;ctx.strokeRect(-30,-60,60,120);
 ctx.fillStyle='#2c2a40';ctx.fillRect(-24,-52,48,70);ctx.strokeStyle='#8f7bff';ctx.strokeRect(-24,-52,48,70); // boiler
 for(const yy of[-40,-20,0])ctx.fillStyle='#ffb52e',ctx.fillRect(-26,yy,52,3);
 // cowcatcher (front = up)
 const cc=e.ms===1||e.ms===2;ctx.fillStyle=cc&&(G.t>>2)%2?'#fff3c0':'#ffb52e';ctx.beginPath();ctx.moveTo(-30,-60);ctx.lineTo(0,-86);ctx.lineTo(30,-60);ctx.closePath();ctx.fill();ctx.strokeStyle='#2c2a40';ctx.lineWidth=2;for(let i=-2;i<=2;i++){ctx.beginPath();ctx.moveTo(i*12,-60);ctx.lineTo(i*4,-80);ctx.stroke();}
 // smokestack (square stack, amber rim)
 if(!e.stk.gone){ctx.fillStyle=e.stk.fl>0&&e.stk.fl%2?'#fff':'#14162a';ctx.fillRect(-11,-58,22,24);ctx.strokeStyle='#ffb52e';ctx.lineWidth=2;ctx.strokeRect(-13,-60,26,6);}
 // firebox: glowing grate (rectangles, orange — not round, not red)
 if(!e.fb.gone){const gl=.6+.4*Math.sin(G.t*.4);ctx.fillStyle='#120a06';ctx.fillRect(-18,28,36,24);ctx.fillStyle='rgba(255,'+Math.floor(140+60*gl)+',40,'+(.8*gl+.2).toFixed(2)+')';for(let i=0;i<4;i++)ctx.fillRect(-15+i*8,31,5,18);if(e.fb.fl>0&&e.fb.fl%2){ctx.fillStyle='#fff';ctx.fillRect(-18,28,36,24);}}
 // core (exposed phase): hex-ish plate
 if(e.phase>=4){ctx.fillStyle=(G.t>>2)%2?'#ff3df0':'#2ef9ff';ctx.fillRect(-10,-16,20,20);}
 // whistle
 ctx.fillStyle=e.ms===5?'#fff':'#c9d2ff';ctx.fillRect(10,-30,6,12);
 ctx.restore();
 if(e.ms===5){txt('WHISTLE',x,y-100,COL.cy,10,'center',6);}}
