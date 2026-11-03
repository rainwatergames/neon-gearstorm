// ===================== v2.0.0 STAGES 5-11 (generic "V" stage engine + per-stage mechanics, bosses, art) =====================
const GV={n:0,t:0,ev:0,evs:[],delay:0,bossT:4200,esc:null,d:0};
const G5={hx:180,hy:240},G6={gx:0,gy:0},G7={fl:0,nf:120,tor:[],bx:0},G8={sc:0,ramps:[]},G9={fans:[],sparks:[],sc:0},G10={dark:0},G11={d:0,spd:1.2};
const noop=()=>{};
function vRR(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
let TINT={};
function mkTint(src,c){const k=document.createElement('canvas');k.width=src.width;k.height=src.height;const g=k.getContext('2d');g.drawImage(src,0,0);g.globalCompositeOperation='source-atop';g.fillStyle=c;g.fillRect(0,0,k.width,k.height);k.w=src.w;k.h=src.h;return k;}
function v2Defs(){Object.assign(DEF,{vd:{hp0:3,r:10,sc:150},vh:{hp0:20,r:18,sc:900,med:1},ast:{hp0:5,r:13,sc:200},seg5:{hp0:1e9,r:13,sc:0,big:true,ns:true},car:{hp0:6,r:12,sc:400},jelly:{hp0:6,r:13,sc:350},mine:{hp0:4,r:11,sc:300},ct:{hp0:14,r:15,sc:700,big:true,med:1,ns:false},b9c:{hp0:35,r:18,sc:6000,big:true,ns:true},
 b5:{hp0:750,r:24,sc:300000,big:true,xb:true,ns:true},b6:{hp0:600,r:24,sc:320000,big:true,xb:true,ns:true},b7:{hp0:1200,r:30,sc:340000,big:true,xb:true,ns:true},b8:{hp0:1300,r:28,sc:360000,big:true,xb:true,ns:true},b9:{hp0:700,r:26,sc:380000,big:true,xb:true,ns:true},b10:{hp0:1250,r:30,sc:400000,big:true,xb:true,ns:true},b11:{hp0:800,r:28,sc:500000,big:true,xb:true,ns:true}});
 TINT.red=mkTint(S.player,'rgba(255,36,80,.62)');TINT.gh=mkTint(S.player,'rgba(200,160,255,.55)');}
const NOCLONE=new Set(['seg5','ct','car','mine','b9c','part','block']);
// ---------- stage table
const VS={
 5:{name:'GRAVITY WELL',boss:'STAR-EATER SERPENT',c1:'#ff9a3c',c2:'#b06bff',ck:'am',init:()=>{G5.hx=W/2;G5.hy=H*.3;},upd:s5upd,back:s5back,front:noop,sp:[()=>wAst(),()=>wOrbit(),()=>wAst()],hint:'BLACK HOLE PULLS YOU AND ALL BULLETS · DON\'T TOUCH THE CORE',spawn:()=>spawnB5()},
 6:{name:'MIRROR DIMENSION',boss:'EVIL TWIN',c1:'#d8c8ff',c2:'#ff3df0',ck:'mg',init:noop,upd:s6upd,back:s6back,front:s6front,sp:[()=>wMirror(),()=>wShards(),()=>wMirror()],hint:'YOUR MIRROR GHOST COPIES YOU IN REVERSE — AND SHOOTS',spawn:()=>spawnB6()},
 7:{name:'STORM CHASER',boss:'THUNDERHEAD',c1:'#cfe0ff',c2:'#ffe14a',ck:'cy',init:()=>{G7.tor=[];G7.fl=0;G7.nf=90;},upd:s7upd,back:s7back,front:s7front,sp:[()=>wCloak(),()=>wTornado(),()=>wCloak()],hint:'LIGHTNING REVEALS CLOAKED DRONES · TORNADOES PULL YOU',spawn:()=>spawnB7()},
 8:{name:'NEON HIGHWAY',boss:'TRANSFORMING FUEL TANKER',c1:'#ff3df0',c2:'#2ef9ff',ck:'mg',init:()=>{G8.sc=0;G8.ramps=[];},upd:s8upd,back:s8back,front:noop,sp:[()=>wCars(),()=>wRamp(),()=>wCars()],hint:'ROAD CARS SHOOT · RAMPS LAUNCH THEM INTO YOUR PATH',spawn:()=>spawnB8()},
 9:{name:'SHRINK RAY LAB',boss:'MEGA VIRUS',c1:'#a6ff3a',c2:'#2ef9ff',ck:'li',init:()=>{G9.fans=[];G9.sparks=[];G9.sc=0;},upd:s9upd,back:s9back,front:s9front,sp:[()=>wFan(),()=>wSpark(),()=>wFan(),()=>wSpark()],hint:'FANS BLOW YOU AROUND · SPARK GAPS ARC AFTER A WARNING',spawn:()=>spawnB9()},
 10:{name:'DEEP SEA TRENCH',boss:'ABYSSAL ANGLER',c1:'#5af0ff',c2:'#ff9ad8',ck:'cy',init:()=>{G10.dark=0;},upd:s10upd,back:s10back,front:s10front,sp:[()=>wJelly(),()=>wMines(),()=>wJelly()],hint:'WATER DRAG SLOWS YOU · SONAR MINES ARM WHEN YOU\'RE CLOSE',spawn:()=>spawnB10()},
 11:{name:'COLOSSUS',boss:'THE GEARLORD COLOSSUS',c1:'#ff6a1e',c2:'#ff2450',ck:'eb',init:()=>{G11.d=0;G11.spd=1.2;},upd:s11upd,back:s11back,front:noop,sp:[()=>wCT(),()=>wCT(),()=>wCT2()],hint:'YOU\'RE ON ITS BACK · DESTROY THE SPINE TURRETS',spawn:()=>{G11.spd=0;cutscene('twist',()=>{G.state='play';show(null);updHud();spawnB11();});}}};
function vWaves(n){const L=[],c=VS[n];let t=200,i=0;const gen=[()=>wCol(60+((i*71)%240),5),()=>wVee(110+((i*53)%140)),()=>wSwoop(1),()=>wHeavy(90+((i*97)%180)),()=>wSwoop(-1),()=>wPop(7+(n>>1)),()=>wCol(W-60-((i*31)%200),5),()=>wPair()];
 L.push([60,()=>{G.banner={t:0,a:'STAGE '+n,b:c.name};}]);L.push([260,()=>{G.banner={t:20,a:c.hint,b:'',small:true,c:c.c1};}]);
 while(t<GV.bossT-320){const sp=i%3===2;L.push([t,sp?c.sp[(i/3|0)%c.sp.length]:gen[(i*3+n)%gen.length]]);if(i%5===4)L.push([t+60,gen[(i+n)%gen.length]]);t+=105+((i*37+n*13)%55);i++;}
 L.push([GV.bossT-230,()=>{strobe(90);G.banner={t:0,a:'⚠ WARNING ⚠',b:c.boss+' APPROACHING',warn:true};sfx.warn();}]);L.sort((a,b)=>a[0]-b[0]);return L;}
function startV(n,bossJump,fromPrev){G.stage=n;GV.n=n;GV.t=0;GV.ev=0;GV.esc=null;GV.bossT=4200;GV.evs=vWaves(n);G.hold=false;G.boss=null;G.mid=null;G.st=Math.max(G.st,100*60);G.lvl=Math.max(G.lvl,Math.min(lvlCap(),4));VS[n].init();
 if(bossJump){GV.t=GV.bossT-30;while(GV.ev<GV.evs.length&&GV.evs[GV.ev][0]<GV.t)GV.ev++;}
 if(fromPrev){G.shield=Math.min(G.maxSh,G.shield+1);G.score+=G.lives*10000;G.banner={t:0,a:'STAGE '+(n-1)+' CLEAR',b:'+'+(G.lives*10000).toLocaleString()+' · SHIELD +1'};GV.delay=150;}else GV.delay=0;
 musicStart(vMus(n,bossJump&&n!==11));}
function vUpdate(){if(G.state!=='play')return;const c=VS[GV.n];if(!c)return;if(GV.esc)GV.esc.t++;if(GV.delay>0){GV.delay--;c.upd();return;}
 GV.t++;while(GV.ev<GV.evs.length&&GV.evs[GV.ev][0]<=GV.t){GV.evs[GV.ev][1]();GV.ev++;}
 if(GV.t===GV.bossT){c.spawn();if(GV.n!==11)musicStart(vMus(GV.n,1));}
 if(window.NG&&NG.auto)NG.auto();c.upd();}
function vDrawBack(){const c=VS[GV.n];if(c)c.back();}
function vDrawFront(){const c=VS[GV.n];if(c)c.front();const e=GV.esc;if(e&&e.t<200){const k=e.t/200;lordPod(e.x+Math.sin(e.t*.1)*20,e.y-k*e.y-30,1-k*.5,G.t);if(e.t<120&&(e.t>>3)%2)txt('GEARLORD ESCAPING ▲',W/2,Math.max(90,e.y-70),COL.eb,12,'center',6);}}
// ---------- generic enemies
function vd(x,y,o){return spawn('vd',x,y,Object.assign({x0:x,vy:2.2,ph:rnd(0,6),amp:16},o||{}));}
function wCol(x,n){for(let i=0;i<n;i++)later(i*13,()=>vd(x,-14,{shootAt:i%2?50:-1}));}
function wVee(x){[[0,0],[-26,-22],[26,-22],[-52,-44],[52,-44]].forEach(([dx,dy],i)=>vd(x+dx,-14+dy,{vy:1.9,amp:0,shootAt:i<3?60:-1}));}
function wSwoop(d){const x0=d>0?-14:W+14;for(let i=0;i<6;i++)later(i*10,()=>vd(x0,60,{m:'s',dir:d,shootAt:i%2?45:-1}));}
function wHeavy(x){spawn('vh',x,-30,{yT:rnd(120,200),cd:70});}
function wPop(n){for(let i=0;i<n;i++)later(i*8,()=>vd(rnd(30,W-30),-14,{vy:3,amp:6,shootAt:i%3===0?40:-1}));}
function wPair(){for(let i=0;i<4;i++)later(i*14,()=>{vd(70,-14,{amp:24,shootAt:i===3?50:-1});vd(W-70,-14,{amp:-24,shootAt:i===3?50:-1});});}
XU.vd=e=>{const t=e.t;if(e.m==='s'){e.x+=e.dir*2.3;e.y+=1+Math.sin(t*.04)*1.1;}else if(e.m==='o'){e.oa+=.022;e.or-=.18;e.x=G5.hx+Math.cos(e.oa)*e.or;e.y=G5.hy+Math.sin(e.oa)*e.or*.8;if(e.or<26){e.act=false;part(1,e.x,e.y,0,0,14,6,'am');return;}if(t%90===40)eShot(e.x,e.y,aim(e.x,e.y),2.2);}
 else{e.y+=e.vy;e.x=e.x0+Math.sin(t*.05+e.ph)*e.amp;}if(t===e.shootAt)eShot(e.x,e.y,aim(e.x,e.y),2.4);
 if(e.ck&&e.fl>0)e.rev=30;if(e.rev>0)e.rev--;};
XU.vh=e=>{const t=e.t;if(t<400){e.y+=(e.yT-e.y)*.035;e.x+=Math.sin(t*.02)*.8;}else e.y+=1.6;if(t>60&&t<400&&--e.cd<=0){e.cd=95;fan(e.x,e.y+10,aim(e.x,e.y),GV.n>=9?5:4,.7,2.1,true);}if(e.y>H+40)e.act=false;};
XD.vd=(e,fl)=>vSkin(e,fl,0);XD.vh=(e,fl)=>vSkin(e,fl,1);
function vSkin(e,fl,hv){const n=GV.n,c=VS[n]||VS[5],x=e.x,y=e.y,t=e.t,r=hv?18:10;let al=1;
 if(e.ck){al=Math.max(.06,G7.fl,e.rev>0?1:0);ctx.globalAlpha=al;if(al<.3){ctx.strokeStyle='rgba(200,220,255,.18)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x+Math.sin(t*.3)*2,y,r,0,TAU);ctx.stroke();}}
 glowDot(c.ck,x,y,hv?2.6:1.5,.35*al);ctx.save();ctx.translate(x,y);
 if(n===5){ctx.rotate(t*.04);ctx.fillStyle=fl?'#fff':'#1a0c2a';ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.strokeStyle=c.c1;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,r+5,r*.45,0,0,TAU);ctx.stroke();ctx.fillStyle=c.c2;ctx.beginPath();ctx.arc(0,0,r*.4,0,TAU);ctx.fill();}
 else if(n===6){ctx.rotate(t*.03);ctx.fillStyle=fl?'#fff':'rgba(216,200,255,.85)';ctx.beginPath();ctx.moveTo(0,-r-4);ctx.lineTo(r*.8,0);ctx.lineTo(0,r+4);ctx.lineTo(-r*.8,0);ctx.closePath();ctx.fill();ctx.strokeStyle=c.c2;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(-2,-r,3,r);if(hv){ctx.strokeStyle='#fff';ctx.strokeRect(-r*.5,-r*.5,r,r);}}
 else if(n===7){ctx.fillStyle=fl?'#fff':'#2a3040';ctx.beginPath();ctx.moveTo(0,r+2);ctx.lineTo(r+4,-r*.6);ctx.lineTo(0,-r*.2);ctx.lineTo(-r-4,-r*.6);ctx.closePath();ctx.fill();ctx.strokeStyle=c.c2;ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle=c.c2;ctx.fillRect(-5,0,3,3);ctx.fillRect(2,0,3,3);if(hv){ctx.strokeStyle=c.c1;ctx.beginPath();ctx.arc(0,0,r+6,0,TAU);ctx.stroke();}}
 else if(n===8){ctx.fillStyle=fl?'#fff':'#1a0830';ctx.beginPath();ctx.moveTo(0,r+4);ctx.lineTo(r+6,-r*.4);ctx.lineTo(r*.3,-r);ctx.lineTo(-r*.3,-r);ctx.lineTo(-r-6,-r*.4);ctx.closePath();ctx.fill();ctx.strokeStyle=c.c1;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle=c.c2;ctx.fillRect(-r*.6,-2,r*1.2,3);if(hv){ctx.save();ctx.rotate(t*.5);ctx.fillStyle='rgba(46,249,255,.4)';ctx.fillRect(-r-10,-2,2*r+20,4);ctx.restore();}}
 else if(n===9){ctx.rotate(Math.sin(t*.1)*.2);ctx.strokeStyle=c.c1;ctx.lineWidth=1.5;for(let k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(-r*.6,k*5);ctx.lineTo(-r-5,k*7+Math.sin(t*.4+k)*3);ctx.moveTo(r*.6,k*5);ctx.lineTo(r+5,k*7-Math.sin(t*.4+k)*3);ctx.stroke();}ctx.fillStyle=fl?'#fff':'#0e2a10';ctx.beginPath();ctx.ellipse(0,0,r*.75,r,0,0,TAU);ctx.fill();ctx.strokeStyle=c.c1;ctx.stroke();ctx.fillStyle=c.c2;ctx.fillRect(-1,-r,2,2*r);if(hv){ctx.strokeStyle=c.c2;ctx.strokeRect(-r,-r,2*r,2*r);}}
 else if(n===10){ctx.fillStyle=fl?'#fff':'#0a2a3a';ctx.beginPath();ctx.ellipse(0,0,r*.7,r,0,0,TAU);ctx.fill();ctx.strokeStyle=c.c1;ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.moveTo(-r*.6,-r-6+Math.sin(t*.2)*3);ctx.lineTo(0,-r*.7);ctx.lineTo(r*.6,-r-6-Math.sin(t*.2)*3);ctx.stroke();ctx.fillStyle=c.c2;ctx.beginPath();ctx.arc(0,r*.4,2.5,0,TAU);ctx.fill();if(hv){ctx.fillStyle='rgba(90,240,255,.5)';ctx.fillRect(-r,-3,2*r,6);}}
 else{ctx.rotate(t*.05);ctx.fillStyle=fl?'#fff':'#2a1010';ctx.beginPath();for(let k=0;k<16;k++){const a=k/16*TAU,rr=k%2?r+3:r-1;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.strokeStyle=c.c1;ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle=c.c2;ctx.beginPath();ctx.arc(0,0,r*.35,0,TAU);ctx.fill();}
 ctx.restore();ctx.globalAlpha=1;}
// ---------- boss shared
function vBoss(type,x,y,o){const b=spawn(type,x,y,Object.assign({invT:150,ph:0,yT:150,cyc:0},o||{}));G.boss=b;later(140,()=>{G.banner={t:30,a:VS[GV.n].boss,b:o&&o.tip||'',small:true,c:VS[GV.n].c1};});return b;}
function vEnter(e){if(e.y<e.yT){e.y+=1.2;e.invT=Math.max(e.invT,2);return true;}return false;}
function vBossDie(e){e.dT++;if(e.dT===1){strobe(200);sfx.bossDie();e.lock=0;}if(e.dT%4===0)boom(e.x+rnd(-90,90),e.y+rnd(-50,50),rnd(1,2.4),['eb','cy','am','mg'][e.dT%4]);G.shake=Math.max(G.shake,7);
 if(e.dT===180){boom(e.x,e.y,5,VS[GV.n].ck);boom(e.x,e.y,4,'w');flash(1,'255,240,230');sfx.bossDie();e.act=false;G.boss=null;for(const q of EN.a)if(q.act&&(q.type==='seg5'||q.type==='b9c'))boom(q.x,q.y,1.4,'mg'),q.act=false;
  GV.esc={t:0,x:e.x,y:e.y};G.banner={t:40,a:'THE GEARLORD ESCAPED!',b:'...LEAVING HIS NEXT TRAP BEHIND',small:true,c:COL.eb};const n=GV.n;later(200,()=>n<11?goStage(n+1):finalClear());}}
const hph=e=>e.hp/e.maxhp;
function pDist(x,y){return Math.hypot(P.x-x,P.y-y);}
function hitP(why){if(P.dead>0)return;G.hitBy=why;playerHit();}
// =========== 5 GRAVITY WELL
function pullAt(x,y,k){const dx=G5.hx-x,dy=G5.hy-y,d=Math.hypot(dx,dy)||1,f=k*Math.min(1.6,30000/(d*d+4000));return[dx/d*f,dy/d*f,d];}
function s5upd(){const b=G.boss;G5.hx+=((b&&b.act?W/2:W/2+Math.sin(GV.t*.004)*90)-G5.hx)*.02;G5.hy+=((b&&b.act?H*.5:H*.3+Math.sin(GV.t*.0031)*50)-G5.hy)*.02;const K=b&&b.act?.75:1;
 if(P.dead<=0){const[fx,fy,d]=pullAt(P.x,P.y,1.05*K);P.x=clamp(P.x+fx,10,W-10);P.y=clamp(P.y+fy,20,H-16);if(d<24){hitP('blackhole');P.y=clamp(P.y+60,20,H-16);}}
 for(const q of PB.a){if(!q.act||q.k===1)continue;const[fx,fy,d]=pullAt(q.x,q.y,.22*K);q.vx+=fx;q.vy+=fy;if(d<20)q.act=false;}
 for(const q of EB.a){if(!q.act)continue;const[fx,fy,d]=pullAt(q.x,q.y,.06*K);q.vx+=fx;q.vy+=fy;const v=Math.hypot(q.vx,q.vy);if(v>5)q.vx*=5/v,q.vy*=5/v;if(d<18){q.act=false;}}
 if(G.t%3===0)part(0,G5.hx+rnd(-80,80),G5.hy+rnd(-60,60),0,0,10,.5,Math.random()<.5?'am':'mg');}
function wAst(){for(let i=0;i<6;i++)later(i*18,()=>{const s=i%2?-1:1;spawn('ast',s<0?-10:W+10,rnd(40,260),{vx:-s*rnd(1,2),vy:rnd(.3,1.2),rs:rnd(-.05,.05),sz:rnd(.8,1.3)});});}
function wOrbit(){for(let i=0;i<6;i++)vd(G5.hx,G5.hy,{m:'o',oa:i/6*TAU,or:170});}
XU.ast=e=>{const[fx,fy,d]=pullAt(e.x,e.y,.04);e.vx+=fx;e.vy+=fy;e.x+=e.vx;e.y+=e.vy;e.rot+=e.rs;if(d<22){e.act=false;part(1,e.x,e.y,0,0,14,8,'am');}};
XD.ast=(e,fl)=>{ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.rot);ctx.scale(e.sz,e.sz);ctx.fillStyle=fl?'#fff':'#3a2a30';ctx.beginPath();for(let k=0;k<9;k++){const a=k/9*TAU,r=12+((k*7)%5);ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.strokeStyle='#ff9a3c';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#22161c';ctx.beginPath();ctx.arc(-3,-2,3,0,TAU);ctx.arc(4,4,2,0,TAU);ctx.fill();ctx.restore();};
function drawHole(x,y,s,t){ctx.save();ctx.translate(x,y);ctx.globalCompositeOperation='lighter';
 const g=ctx.createRadialGradient(0,0,10*s,0,0,120*s);g.addColorStop(0,'rgba(255,160,60,.55)');g.addColorStop(.35,'rgba(176,107,255,.25)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,120*s,0,TAU);ctx.fill();
 for(let i=0;i<5;i++){ctx.save();ctx.rotate(-.35);ctx.scale(1,.32);ctx.rotate(t*.02*(1+i*.3)+i);ctx.strokeStyle=['rgba(255,220,140,.7)','rgba(255,154,60,.55)','rgba(255,61,240,.4)','rgba(176,107,255,.35)','rgba(255,255,255,.5)'][i];ctx.lineWidth=(6-i)*s;ctx.beginPath();ctx.arc(0,0,(34+i*12)*s,0,TAU*.8);ctx.stroke();ctx.restore();}
 ctx.globalCompositeOperation='source-over';ctx.fillStyle='#000';ctx.beginPath();ctx.arc(0,0,22*s,0,TAU);ctx.fill();ctx.strokeStyle='rgba(255,240,200,.9)';ctx.lineWidth=2*s;ctx.beginPath();ctx.arc(0,0,23*s,0,TAU);ctx.stroke();
 ctx.globalCompositeOperation='lighter';ctx.save();ctx.rotate(-.35);ctx.scale(1,.32);ctx.strokeStyle='rgba(255,200,120,.8)';ctx.lineWidth=4*s;ctx.beginPath();ctx.arc(0,0,40*s,Math.PI*.05,Math.PI*.95);ctx.stroke();ctx.restore();ctx.restore();}
function s5back(){ctx.fillStyle='rgba(4,2,10,.78)';ctx.fillRect(0,0,W,H);const t=G.t;
 for(let i=0;i<60;i++){const a=i*2.4+t*.003*(1+i%3),r=((i*61+t*(.6+i%4*.2))%420),R=420-r,x=G5.hx+Math.cos(a+R*.004)*R,y=G5.hy+Math.sin(a+R*.004)*R*.85;ctx.fillStyle='rgba(220,210,255,'+(.2+.6*(1-R/420))+')';ctx.fillRect(x,y,1.5,1.5);}
 drawHole(G5.hx,G5.hy,1,t);}
// boss 5: STAR-EATER SERPENT — the body blocks shots; inhales stars and exhales star rings
function spawnB5(){const b=vBoss('b5',W/2,-60,{yT:0,tr:[],tip:'ITS BODY BLOCKS SHOTS · HIT THE HEAD'});b.tr=[];for(let i=0;i<70;i++)b.tr.push({x:W/2,y:-60-i*2});for(let i=0;i<14;i++){const s=spawn('seg5',W/2,-80,{p5:b,idx:i,r:i<10?14-i*.4:9});}}
XU.b5=e=>{if(e.dying){vBossDie(e);return;}const t=e.t,ph=hph(e)<.5?1:0;
 const tx=W/2+Math.sin(t*.011)*125,ty=190+Math.sin(t*.021)*100;if(t<120){e.y+=(ty-e.y)*.03;e.x+=(tx-e.x)*.03;e.invT=Math.max(e.invT,2);}else{e.x+=(tx-e.x)*.08;e.y+=(ty-e.y)*.08;}
 e.tr.unshift({x:e.x,y:e.y});if(e.tr.length>120)e.tr.pop();if(t<120)return;
 const c=(t-120)%(ph?300:360);e.inh=c>=150&&c<230;e.mo=e.inh?Math.min(1,(c-150)/20):c>=230&&c<260?1:Math.max(0,(e.mo||0)-.1);
 if(c<150&&c%(ph?36:50)===0)fan(e.x,e.y+12,aim(e.x,e.y),ph?5:3,.6,2.3,false);
 if(e.inh){if(t%2===0){const a=rnd(0,TAU),r=rnd(140,240);part(0,e.x+Math.cos(a)*r,e.y+Math.sin(a)*r,-Math.cos(a)*r/18,-Math.sin(a)*r/18,18,.9,'w');}if(P.dead<=0){const dx=e.x-P.x,dy=e.y-P.y,d=Math.hypot(dx,dy)||1;P.x+=dx/d*.7;P.y+=dy/d*.7;}}
 if(c===230||c===246||(ph&&c===262)){ring(e.x,e.y,ph?20:16,t*.07,1.9,true);sfx.flame&&sfx.flame();G.shake=6;light(e.x,e.y,120,'am',20);}
 if(ph&&t%10===0){e.hA=(e.hA||0)+.4;eShot(e.x,e.y,e.hA,1.7);}};
XU.seg5=e=>{const h=e.p5;if(!h||!h.act){e.act=false;return;}const p=h.tr[Math.min(h.tr.length-1,(e.idx+1)*7)];if(p){e.x=p.x;e.y=p.y;}e.hp=1e9;if(h.t>140&&e.idx%3===1&&(h.t+e.idx*17)%150===0)eShot(e.x,e.y,aim(e.x,e.y),1.8);if(h.dying&&h.dT===e.idx*8+2){boom(e.x,e.y,1.6,'am');}};
XD.seg5=(e,fl)=>{const r=e.r;glowDot('mg',e.x,e.y,1.6,.25);ctx.fillStyle=fl?'#556':'#140a24';ctx.beginPath();ctx.arc(e.x,e.y,r,0,TAU);ctx.fill();ctx.strokeStyle='#ff9a3c';ctx.lineWidth=2;ctx.stroke();for(let k=0;k<3;k++){ctx.fillStyle='rgba(255,255,255,'+(.4+.4*Math.sin(G.t*.2+k+e.idx))+')';ctx.fillRect(e.x+Math.cos(k*2+e.idx)*r*.5,e.y+Math.sin(k*2+e.idx)*r*.5,1.5,1.5);}ctx.fillStyle='#b06bff';ctx.beginPath();ctx.moveTo(e.x-r*.4,e.y-r);ctx.lineTo(e.x,e.y-r-7);ctx.lineTo(e.x+r*.4,e.y-r);ctx.fill();};
XD.b5=(e,fl)=>{const p=e.tr[4]||e,a=Math.atan2(e.y-p.y,e.x-p.x)||Math.PI/2,mo=e.mo||0;glowDot('am',e.x,e.y,4,.35+.3*mo);ctx.save();ctx.translate(e.x+(e.dying?rnd(-3,3):0),e.y);ctx.rotate(a-Math.PI/2);
 ctx.fillStyle=fl?'#667':'#1a0c30';ctx.beginPath();ctx.ellipse(0,-6,24,22,0,0,TAU);ctx.fill();ctx.strokeStyle='#ff9a3c';ctx.lineWidth=2.5;ctx.stroke();
 for(const s of[-1,1]){ctx.save();ctx.rotate(s*(.2+mo*.5));ctx.fillStyle=fl?'#889':'#2a1448';ctx.beginPath();ctx.moveTo(s*4,6);ctx.lineTo(s*22,6);ctx.lineTo(s*8,32);ctx.closePath();ctx.fill();ctx.strokeStyle='#ffd28a';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(s*10,10);ctx.lineTo(s*13,18);ctx.lineTo(s*16,10);ctx.fill();ctx.restore();}
 if(mo>.1){ctx.globalCompositeOperation='lighter';const g=ctx.createRadialGradient(0,16,0,0,16,26*mo);g.addColorStop(0,'#fff');g.addColorStop(.4,'rgba(255,154,60,.8)');g.addColorStop(1,'rgba(255,61,240,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,16,26*mo,0,TAU);ctx.fill();ctx.globalCompositeOperation='source-over';}
 for(const s of[-1,1]){ctx.fillStyle='#ff2450';ctx.beginPath();ctx.ellipse(s*10,-8,5,3,s*.4,0,TAU);ctx.fill();glowDot('eb',s*10,-8,.9,.8);}ctx.fillStyle='#b06bff';for(const s of[-1,1]){ctx.beginPath();ctx.moveTo(s*12,-22);ctx.lineTo(s*22,-40);ctx.lineTo(s*6,-26);ctx.fill();}ctx.restore();};
// =========== 6 MIRROR DIMENSION
function s6upd(){const b=G.boss;G6.on=!(b&&b.act&&b.type==='b6');G6.gx=W-P.x;G6.gy=clamp(H-P.y,50,H*.42);if(G6.on&&P.dead<=0&&G.t%52===0&&GV.delay<=0){eShot(G6.gx,G6.gy+12,Math.PI/2,1.9,false,true);eShot(G6.gx-10,G6.gy+8,Math.PI/2+.12,1.7,false,true);}}
function wMirror(){for(let i=0;i<5;i++)later(i*12,()=>{vd(-14,80+i*6,{m:'s',dir:1,shootAt:i===2?40:-1});vd(W+14,80+i*6,{m:'s',dir:-1,shootAt:i===2?40:-1});});}
function wShards(){for(let i=0;i<10;i++)later(i*6,()=>vd(rnd(20,W-20),-14,{vy:3.4,amp:0,shootAt:-1}));}
function s6back(){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#160a2a');g.addColorStop(.5,'#2a1040');g.addColorStop(1,'#120820');ctx.globalAlpha=.85;ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.globalAlpha=1;const t=G.t;
 for(let i=0;i<14;i++){ctx.save();ctx.translate((i*83.3)%W,((i*131)+t*(.4+i%3*.2))%(H+80)-40);ctx.rotate(t*.006*(i%2?1:-1)+i);ctx.fillStyle='rgba(216,200,255,.07)';ctx.strokeStyle='rgba(230,215,255,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-26-i%3*8);ctx.lineTo(16,8);ctx.lineTo(-12,20);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();}
 ctx.globalCompositeOperation='lighter';const sy=H*.47;ctx.fillStyle='rgba(216,200,255,.06)';ctx.fillRect(0,sy-30,W,60);ctx.strokeStyle='rgba(230,215,255,'+(.35+.3*FX.pulse)+')';ctx.lineWidth=1.5;ctx.beginPath();for(let x=0;x<=W;x+=8)ctx.lineTo(x,sy+Math.sin(x*.05+t*.08)*2);ctx.stroke();
 for(const e of EN.a){if(!e.act||e.type==='b6')continue;ctx.globalAlpha=.12;ds(S.dot.mg,W-e.x,H-e.y,0,1.2);}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
function s6front(){if(!G6.on||P.dead>0)return;const x=G6.gx,y=G6.gy;ctx.save();ctx.globalAlpha=.55+.15*Math.sin(G.t*.2);ctx.translate(x+Math.sin(G.t*.5)*1.2,y);ctx.scale(1,-1);ctx.drawImage(TINT.gh,-S.player.w/2,-S.player.h/2,S.player.w,S.player.h);ctx.restore();ctx.globalAlpha=1;glowDot('mg',x,y,1.4,.4);
 ctx.strokeStyle='rgba(216,200,255,.25)';ctx.setLineDash([3,6]);ctx.beginPath();ctx.moveTo(x,y+18);ctx.lineTo(x,y+60);ctx.stroke();ctx.setLineDash([]);if(GV.t<900&&(G.t>>4)%2)txt('GHOST',x,y-30,'#d8c8ff',9,'center',4);}
// boss 6: EVIL TWIN — mirrors your x, cycles YOUR weapons: spread · laser · tesla
function spawnB6(){vBoss('b6',W/2,-40,{yT:140,md:0,mt:0,tip:'IT USES YOUR WEAPONS · WATCH THE TELEGRAPHS'});}
XU.b6=e=>{if(e.dying){vBossDie(e);return;}if(vEnter(e))return;const ph=hph(e)<.5?1:0;e.mt++;const MD=[150,130,150];
 if(e.md!==1)e.x+=((W-P.x)-e.x)*.05;e.y=140+Math.sin(e.t*.03)*14;
 if(e.mt>MD[e.md]-(ph?30:0)){e.md=(e.md+1)%3;e.mt=0;e.tz=[];if(e.md===1){e.lx=clamp(P.x,30,W-30);sfx.hiss&&sfx.hiss();}}
 if(e.md===0){if(e.mt%7===0){const a=aim(e.x,e.y);for(const o of(ph?[-.3,-.15,0,.15,.3]:[-.2,0,.2]))eShot(e.x,e.y+16,a+o,3.1,false,true);}}
 else if(e.md===1){e.x+=(e.lx-e.x)*.15;if(e.mt>55&&e.mt<100){if(P.dead<=0&&Math.abs(P.x-e.lx)<15&&P.y>e.y)hitP('laser');if(e.mt===56){sfx.flame&&sfx.flame();G.shake=6;}}}
 else{if(e.mt===10||e.mt===80){e.tz=[];for(let k=0;k<(ph?4:3);k++)e.tz.push({x:clamp(P.x+rnd(-70,70),20,W-20),y:clamp(P.y+rnd(-60,40),H*.4,H-20),t:0});e.tz[0].x=P.x;e.tz[0].y=P.y;}
  for(const z of e.tz||[]){z.t++;if(z.t===48){sfx.zap&&sfx.zap();if(pDist(z.x,z.y)<26)hitP('tesla');}}}
 if(ph&&e.t%90===0)ring(e.x,e.y,12,e.t*.1,1.6,true);};
XD.b6=(e,fl)=>{const x=e.x+(e.dying?rnd(-3,3):0),y=e.y;glowDot('eb',x,y,4,.3);ctx.save();ctx.translate(x,y);ctx.scale(2.1,-2.1);ctx.drawImage(fl?S.player:TINT.red,-S.player.w/2,-S.player.h/2,S.player.w,S.player.h);ctx.restore();ctx.globalCompositeOperation='lighter';ds(S.dot.eb,x,y-30,0,1.8);ctx.globalCompositeOperation='source-over';
 ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();
 if(e.md===1&&!e.dying){const lx=e.lx,mt=e.mt;if(mt<=55){if((mt>>2)%2){ctx.setLineDash([10,8]);ctx.strokeStyle='#ff2450';ctx.lineWidth=2;ctx.strokeRect(lx-15,y+20,30,H-y);ctx.setLineDash([]);}if(mt>20)txt('! LASER !',lx,y+40,'#ffd0d8',12,'center',6);}
  else if(mt<100){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,36,80,.45)';ctx.fillRect(lx-14,y+20,28,H-y);ctx.fillStyle='#ffe6ea';ctx.fillRect(lx-4,y+20,8,H-y);ctx.globalCompositeOperation='source-over';}}
 if(e.md===2&&!e.dying)for(const z of e.tz||[]){if(z.t<48){ctx.strokeStyle='rgba(166,255,58,'+(.4+.4*((z.t>>2)%2))+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(z.x,z.y,26*(1-z.t/60)+6,0,TAU);ctx.stroke();ctx.setLineDash([4,6]);ctx.beginPath();ctx.arc(z.x,z.y,26,0,TAU);ctx.stroke();ctx.setLineDash([]);}
  else if(z.t<62){ctx.strokeStyle=COL.li;ctx.lineWidth=3;drawLightning(x,y,z.x,z.y);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=1;drawLightning(x,y,z.x,z.y);ctx.stroke();glowDot('li',z.x,z.y,2.4,.8);}}};
// =========== 7 STORM CHASER
function s7upd(){if(--G7.nf<=0){G7.fl=1;G7.bx=rnd(30,W-30);G7.nf=rnd(110,200)|0;if(AU.c&&!AU.muted){tone('sawtooth',90,30,.5,.05,AU.sfx);}}G7.fl*=.93;
 for(let i=G7.tor.length-1;i>=0;i--){const o=G7.tor[i];o.t++;o.y+=o.vy;o.x=clamp(o.x0+Math.sin(o.t*.02)*60,30,W-30);if(o.y>H+100){G7.tor.splice(i,1);continue;}
  if(P.dead<=0){const dx=o.x-P.x,dy=P.y-o.y;if(Math.abs(dy)<110){P.x+=Math.sign(dx)*Math.min(1.5,40/(Math.abs(dx)+12)+.25);if(Math.abs(dx)<14&&Math.abs(dy)<50)hitP('tornado');}}
  for(const q of EB.a)if(q.act&&Math.abs(q.y-o.y)<90&&Math.abs(q.x-o.x)<40){q.vx+=Math.sign(o.x-q.x)*.08;}}}
function wCloak(){for(let i=0;i<6;i++)later(i*16,()=>vd(rnd(40,W-40),-14,{ck:1,vy:1.6,amp:30,shootAt:60}));if(G7.nf>40)G7.nf=40;}
function wTornado(){G7.tor.push({x0:rnd(80,W-80),x:W/2,y:-90,vy:1.1,t:0});}
function cloudL(x,y,r,c){cloud(x,y,r,c);}
function s7back(){ctx.fillStyle='rgba(8,10,20,.88)';ctx.fillRect(0,0,W,H);const t=G.t,f=G7.fl;
 for(let i=0;i<7;i++)cloudL(((i*67+t*.25*(1+i%2))%(W+160))-80,((i*97+t*.9)%(H+160))-80,36+(i%3)*12,f>.3?'rgba(110,130,180,.5)':'rgba(30,36,58,.6)');
 if(f>.5){ctx.strokeStyle='rgba(230,240,255,'+f+')';ctx.lineWidth=3;drawLightning(G7.bx,0,G7.bx+rnd(-60,60),H*.7);ctx.stroke();ctx.lineWidth=1;ctx.strokeStyle='#fff';drawLightning(G7.bx,0,G7.bx+rnd(-30,30),H*.5);ctx.stroke();}
 for(const o of G7.tor){for(let k=0;k<14;k++){const yy=o.y-50+k*8,w=8+k*k*.32,ph=o.t*.25+k*.6;ctx.strokeStyle='rgba(180,190,220,'+(.15+.25*(k%2))+')';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(o.x+Math.sin(ph*.3)*k*.8,yy,w,3+k*.3,0,ph%TAU,ph%TAU+4);ctx.stroke();}
  for(let k=0;k<4;k++){const a=o.t*.3+k*1.6;ctx.fillStyle='#556';ctx.fillRect(o.x+Math.cos(a)*24,o.y+Math.sin(a)*6+k*12,4,4);}if(o.t<120&&(o.t>>3)%2)txt('TORNADO',o.x,o.y-80,'#cfe0ff',10,'center',4);}}
function s7front(){const f=G7.fl;ctx.fillStyle='rgba(0,2,14,'+(.42*(1-f)).toFixed(3)+')';ctx.fillRect(0,0,W,H);if(f>.2&&!SET.rf){ctx.fillStyle='rgba(200,220,255,'+(f*.22).toFixed(3)+')';ctx.fillRect(0,0,W,H);}
 ctx.strokeStyle='rgba(150,180,255,.28)';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<46;i++){const x=(i*41.7+G.t*2)%W,y=(i*67.3+G.t*11)%H;ctx.moveTo(x,y);ctx.lineTo(x-3,y+12);}ctx.stroke();}
// boss 7: THUNDERHEAD — the storm's face
function spawnB7(){vBoss('b7',W/2,-60,{yT:140,cs:0,ct:0,strikes:[],gust:0,tip:'DASHED COLUMNS = LIGHTNING · GUSTS PUSH YOU'});}
XU.b7=e=>{if(e.dying){vBossDie(e);return;}if(vEnter(e))return;const ph=hph(e)<.5?1:0,t=e.t;e.x=W/2+Math.sin(t*.008)*70;e.ct++;
 if(e.ct>(ph?150:190)){e.ct=0;e.cs=(e.cs+1)%3;if(e.cs===0){e.strikes=[];for(let k=0;k<(ph?4:3);k++)e.strikes.push({x:k?rnd(20,W-20):P.x,t:0});}if(e.cs===2){e.gust=150;e.gd=Math.random()<.5?-1:1;G.banner={t:40,a:e.gd<0?'◀◀ GUST ◀◀':'▶▶ GUST ▶▶',b:'',small:true,c:'#cfe0ff'};}}
 for(const s of e.strikes){s.t++;if(s.t===60){G7.fl=1;G7.bx=s.x;sfx.zap&&sfx.zap();G.shake=6;}if(s.t>=60&&s.t<76&&P.dead<=0&&Math.abs(P.x-s.x)<18&&P.y>e.y)hitP('lightning');}
 if(e.cs===1&&e.ct%5===0)eShot(e.x+rnd(-110,110),e.y+40,Math.PI/2+rnd(-.12,.12),2.4,false,true);
 if(e.gust>0){e.gust--;if(P.dead<=0)P.x=clamp(P.x+e.gd*1.3,10,W-10);}
 if(t%(ph?70:110)===0)ring(e.x,e.y+20,ph?14:10,t*.05,1.7,true);if(t%60===30)fan(e.x,e.y+30,aim(e.x,e.y),3,.4,2.4,false);
 if(e.ct===0&&e.cs===0)e.strikes.forEach(s=>s.t=0);};
XD.b7=(e,fl)=>{const x=e.x+(e.dying?rnd(-4,4):0),y=e.y,f=G7.fl,t=G.t;ctx.globalAlpha=1;for(let i=0;i<7;i++){const a=i/7*TAU+t*.004;cloud(x+Math.cos(a)*70,y-10+Math.sin(a)*26,42,fl?'#9aa':f>.3?'#6a7aa8':'#2c3450');}cloud(x,y-14,62,fl?'#aab':f>.3?'#7a8ab8':'#38405e');
 const ang=e.cs===1||e.ct<30;for(const s of[-1,1]){ctx.fillStyle='#0a0c16';ctx.beginPath();ctx.moveTo(x+s*14,y-24);ctx.lineTo(x+s*46,y-34);ctx.lineTo(x+s*42,y-8);ctx.lineTo(x+s*14,y-6);ctx.closePath();ctx.fill();glowDot('cy',x+s*30,y-18,1.6,.9);ctx.fillStyle='#ffe14a';ctx.beginPath();ctx.arc(x+s*30,y-18,5,0,TAU);ctx.fill();}
 const mo=ang?16:6;ctx.fillStyle='#0a0c16';ctx.beginPath();ctx.ellipse(x,y+18,30,mo,0,0,TAU);ctx.fill();ctx.strokeStyle='#ffe14a';ctx.lineWidth=2;ctx.beginPath();for(let k=0;k<7;k++)ctx.lineTo(x-26+k*8.6,y+18+(k%2?-mo*.5:mo*.5));ctx.stroke();
 if(!e.dying)for(const s of e.strikes){if(s.t<60){if((s.t>>2)%2){ctx.setLineDash([8,8]);ctx.strokeStyle='#ffe14a';ctx.lineWidth=2;ctx.strokeRect(s.x-18,y+30,36,H-y);ctx.setLineDash([]);}txt('⚡',s.x,H*.55,'#ffe14a',18,'center',8);}else if(s.t<76){ctx.strokeStyle='#fff';ctx.lineWidth=5;drawLightning(s.x,y+20,s.x+rnd(-8,8),H);ctx.stroke();ctx.strokeStyle='#ffe14a';ctx.lineWidth=2;drawLightning(s.x,y+20,s.x,H);ctx.stroke();}}};
// =========== 8 NEON HIGHWAY  (perspective road; cars drive toward you; ramps launch them)
const HZ=()=>H*.2,hw=y=>20+Math.max(0,(y-HZ()))/(H-HZ())*200,dep=y=>clamp((y-HZ())/(H-HZ()),0,1);
function s8upd(){G8.sc+=3;for(let i=G8.ramps.length-1;i>=0;i--){const r=G8.ramps[i];r.y+=.6+3.4*dep(r.y);if(r.y>H+30)G8.ramps.splice(i,1);}}
function car(u,o){return spawn('car',W/2,HZ()+4,Object.assign({u,gnd:1,air:0,z:0,sp:rnd(.8,1.15),cd:rnd(30,90)|0,hue:Math.random()<.5?COL.mg:COL.cy},o||{}));}
function wCars(){const L=[-.75,-.25,.25,.75];for(let i=0;i<4;i++)later(i*28,()=>car(L[(i*3+GV.t)%4]));}
function wRamp(){const u=[-.75,-.25,.25,.75][(GV.t>>3)%4];G8.ramps.push({u,y:HZ()+2});later(20,()=>car(u,{sp:1.2}));later(50,()=>car(u,{sp:1.2}));}
XU.car=e=>{const d=dep(e.y);e.y+=(.6+3.4*d)*e.sp;const s=.35+.75*d;e.x=W/2+e.u*hw(e.y);e.r=12*s;
 for(const r of G8.ramps)if(!e.air&&r.u===e.u&&Math.abs(r.y-e.y)<8){e.air=60;sfx.hiss&&sfx.hiss();}
 if(e.air>0){e.air--;e.z=Math.sin((60-e.air)/60*Math.PI)*40;e.gnd=e.air>0?0:1;}else e.gnd=1;
 if(--e.cd<=0&&d>.15&&d<.7){e.cd=90;eShot(e.x,e.y,aim(e.x,e.y),2.3);}};
XD.car=(e,fl)=>{const d=dep(e.y),s=(.35+.75*d)*(1+e.z/60),x=e.x,y=e.y-e.z;if(e.z>0){ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(e.x,e.y+4,14*s,6*s,0,0,TAU);ctx.fill();}
 ctx.save();ctx.translate(x,y);ctx.scale(s,s);glowDot(e.hue===COL.mg?'mg':'cy',0,0,1.6,.4);ctx.fillStyle=fl?'#fff':'#14082a';vRR(-11,-18,22,36,5);ctx.fill();ctx.strokeStyle=e.hue;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='rgba(46,249,255,.5)';ctx.fillRect(-8,4,16,7);ctx.fillStyle='#ffe6a0';ctx.fillRect(-9,14,5,3);ctx.fillRect(4,14,5,3);ctx.fillStyle='#ff2450';ctx.fillRect(-9,-18,5,2);ctx.fillRect(4,-18,5,2);ctx.restore();
 if(e.air>0)txt('AIR!',x,y-24,'#ffe6a0',9,'center',4);};
function drawSynth(t,h,sc){const hz=h*.2,g=ctx.createLinearGradient(0,0,0,hz);g.addColorStop(0,'#12002a');g.addColorStop(1,'#ff3d9a');ctx.fillStyle=g;ctx.fillRect(0,0,W,hz);
 const sg=ctx.createLinearGradient(0,hz-110,0,hz);sg.addColorStop(0,'#ffe14a');sg.addColorStop(1,'#ff3df0');ctx.fillStyle=sg;ctx.beginPath();ctx.arc(W/2,hz,78,Math.PI,TAU);ctx.fill();ctx.fillStyle='#2a0838';for(let i=0;i<6;i++){const yy=hz-8-i*11;ctx.fillRect(W/2-80,yy,160,2+i*.6);}
 ctx.fillStyle='#1a0630';ctx.beginPath();ctx.moveTo(0,hz);for(let x=0;x<=W;x+=24)ctx.lineTo(x,hz-14-((x*7)%30));ctx.lineTo(W,hz);ctx.fill();
 ctx.fillStyle='#0a0418';ctx.fillRect(0,hz,W,h-hz);ctx.strokeStyle='rgba(255,61,240,.55)';ctx.lineWidth=1;for(let k=-8;k<=8;k++){ctx.beginPath();ctx.moveTo(W/2+k*6,hz);ctx.lineTo(W/2+k*90,h);ctx.stroke();}
 for(let i=0;i<14;i++){const f=((i/14)+(sc*.004)%(1/14)*14/14)%1,yy=hz+Math.pow(f,2.2)*(h-hz);ctx.strokeStyle='rgba(255,61,240,'+(.15+.5*f)+')';ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(W,yy);ctx.stroke();}
 const rw=y=>20+(y-hz)/(h-hz)*200;ctx.fillStyle='rgba(10,4,30,.85)';ctx.beginPath();ctx.moveTo(W/2-20,hz);ctx.lineTo(W/2+20,hz);ctx.lineTo(W/2+220,h);ctx.lineTo(W/2-220,h);ctx.fill();
 ctx.strokeStyle='#2ef9ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W/2-20,hz);ctx.lineTo(W/2-220,h);ctx.moveTo(W/2+20,hz);ctx.lineTo(W/2+220,h);ctx.stroke();
 for(const u of[-.5,0,.5])for(let i=0;i<12;i++){const f=((i/12)+(sc*.006)%(1/12))%1,y0=hz+Math.pow(f,2.2)*(h-hz),y1=hz+Math.pow(Math.min(1,f+.03),2.2)*(h-hz);ctx.strokeStyle='rgba(255,225,74,'+(.3+.6*f)+')';ctx.lineWidth=1+2*f;ctx.beginPath();ctx.moveTo(W/2+u*rw(y0),y0);ctx.lineTo(W/2+u*rw(y1),y1);ctx.stroke();}
 for(let i=0;i<6;i++){const f=((i/6)+(sc*.003)%(1/6))%1,y=hz+Math.pow(f,2.2)*(h-hz),s=.2+f*1.3;for(const sd of[-1,1]){const x=W/2+sd*(rw(y)+20+40*f);palm(x,y,s);}}}
function palm(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle='#ff3df0';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(6,-20,2,-44);ctx.stroke();ctx.strokeStyle='#2ef9ff';ctx.lineWidth=2;for(let k=0;k<5;k++){const a=-Math.PI/2+(k-2)*.6;ctx.beginPath();ctx.moveTo(2,-44);ctx.quadraticCurveTo(2+Math.cos(a)*14,-44+Math.sin(a)*14-6,2+Math.cos(a)*26,-44+Math.sin(a)*20+8);ctx.stroke();}ctx.restore();}
function s8back(){drawSynth(G.t,H,G8.sc);for(const r of G8.ramps){const d=dep(r.y),s=.35+.75*d,x=W/2+r.u*hw(r.y);ctx.save();ctx.translate(x,r.y);ctx.scale(s,s);ctx.fillStyle='#ffe14a';ctx.beginPath();ctx.moveTo(-16,8);ctx.lineTo(16,8);ctx.lineTo(12,-10);ctx.lineTo(-12,-10);ctx.fill();ctx.fillStyle='#14082a';for(let k=0;k<4;k++)ctx.fillRect(-14+k*8,-6,4,12);ctx.restore();if(d<.5&&(G.t>>3)%2)txt('RAMP',x,r.y-18,'#ffe14a',8,'center',4);}}
// boss 8: TRANSFORMING FUEL TANKER (truck → mech at 60% HP)
function spawnB8(){vBoss('b8',W/2,-120,{yT:180,mode:0,tf:0,lx:0,ls:0,tip:'TRANSFORMS AT 60% · SWEEP LASER AFTER'});}
XU.b8=e=>{if(e.dying){vBossDie(e);return;}if(vEnter(e))return;const t=e.t,f=hph(e);
 if(e.mode===0){e.x+=(W/2+Math.sin(t*.012)*80-e.x)*.05;if(t%60===0)for(const s of[-1,1])fan(e.x+s*26,e.y-40,aim(e.x+s*26,e.y-40),3,.4,2.3,false);if(t%110===50)for(let k=0;k<3;k++)later(k*12,()=>eShot(e.x+rnd(-20,20),e.y+50,Math.PI/2+rnd(-.3,.3),1.5,true,true));
  if(f<.6){e.mode=1;e.tf=0;e.invT=130;G.banner={t:0,a:'⚠ TRANSFORMING ⚠',b:'TANKER → BATTLE MECH',warn:true};sfx.phase();strobe(40);G.shake=10;}}
 else if(e.mode===1){e.tf++;e.y+=(150-e.y)*.05;if(e.tf>=120)e.mode=2;}
 else{e.x+=(W/2+Math.sin(t*.017)*110-e.x)*.06;if(t%80===0)for(const s of[-1,1])for(let k=0;k<3;k++)later(k*8,()=>eShot(e.x+s*52,e.y+10,aim(e.x+s*52,e.y)+s*.2*k,2.6,false,true));
  if(t%240===0){e.ls=1;e.la=-.3;}if(e.ls){e.ls++;if(e.ls>50){e.la+=.018;const a=Math.PI/2+Math.sin(e.la*3)*.9,dx=P.x-e.x,dy=P.y-e.y+20,u=dx*Math.cos(a)+dy*Math.sin(a),v=Math.abs(-dx*Math.sin(a)+dy*Math.cos(a));e.lA=a;if(u>0&&v<8)hitP('laser');}if(e.ls>170)e.ls=0;}
  if(t%100===50)ring(e.x,e.y,14,t*.05,1.8,true);}};
XD.b8=(e,fl)=>{const x=e.x+(e.dying?rnd(-4,4):0),y=e.y,k=e.mode===0?0:e.mode===1?Math.min(1,e.tf/120):1;glowDot('mg',x,y,5,.25);
 ctx.save();ctx.translate(x,y);// tank body (splits into arms)
 for(const s of[-1,1]){ctx.save();ctx.translate(s*k*44,-40+k*40);ctx.rotate(s*k*.5);ctx.fillStyle=fl?'#999':'#2a1040';vRR(-20+(1-k)*s*8,-60,40-(1-k)*0,90-k*30,14);ctx.fill();ctx.strokeStyle=COL.mg;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#ffe14a';ctx.fillRect(-16,-30,32,4);ctx.fillStyle=COL.cy;ctx.fillRect(-4,20-k*20,8,10+k*12);ctx.restore();}
 ctx.fillStyle=fl?'#bbb':'#1a0830';vRR(-24,10-k*30,48,44,8);ctx.fill();ctx.strokeStyle=COL.cy;ctx.lineWidth=2.5;ctx.stroke();// cab → head
 ctx.fillStyle='rgba(46,249,255,.6)';ctx.fillRect(-18,34-k*30,36,10);if(k>.5){ctx.fillStyle='#ff2450';ctx.fillRect(-14,0-k*10,8,4);ctx.fillRect(6,0-k*10,8,4);glowDot('eb',0,-6,1.4,.7);}
 for(const s of[-1,1]){ctx.fillStyle='#0a0418';ctx.fillRect(s*26-5,30-k*10,10,16);}
 if(k>=1){for(const s of[-1,1]){ctx.fillStyle='#14082a';ctx.fillRect(s*30-6,50,12,40);ctx.strokeStyle=COL.mg;ctx.strokeRect(s*30-6,50,12,40);}}ctx.restore();
 if(e.mode===1&&(e.tf>>2)%2){ctx.strokeStyle='#ffe14a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,60+e.tf*.3,0,TAU);ctx.stroke();}
 if(e.ls){const a=e.lA||Math.PI/2+Math.sin((e.la||0)*3)*.9;if(e.ls<=50){ctx.setLineDash([6,6]);ctx.strokeStyle='rgba(255,36,80,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-20);ctx.lineTo(x+Math.cos(a)*900,y-20+Math.sin(a)*900);ctx.stroke();ctx.setLineDash([]);}else{ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,36,80,.5)';ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(x,y-20);ctx.lineTo(x+Math.cos(a)*900,y-20+Math.sin(a)*900);ctx.stroke();ctx.strokeStyle='#ffe6ea';ctx.lineWidth=3;ctx.stroke();ctx.globalCompositeOperation='source-over';}}};
// =========== 9 SHRINK RAY LAB (inside a computer)
let PCB=null;function mkPCB(){const c=document.createElement('canvas');c.width=360;c.height=800;const g=c.getContext('2d');g.fillStyle='#04140a';g.fillRect(0,0,360,800);g.strokeStyle='rgba(166,255,58,.06)';for(let x=0;x<360;x+=20){g.beginPath();g.moveTo(x,0);g.lineTo(x,800);g.stroke();}
 let s=7;const R=()=>(s=(s*16807)%2147483647)/2147483647;g.lineWidth=3;for(let i=0;i<40;i++){g.strokeStyle=R()<.6?'rgba(166,255,58,.22)':'rgba(255,181,46,.2)';let x=(R()*18|0)*20,y=R()*800;g.beginPath();g.moveTo(x,y);for(let k=0;k<5;k++){if(k%2)x=clamp(x+((R()*6|0)-3)*20,0,360);else y+=(R()*5|0)*30-60;g.lineTo(x,y);}g.stroke();g.fillStyle='rgba(166,255,58,.35)';g.beginPath();g.arc(x,y,4,0,TAU);g.fill();}
 for(let i=0;i<7;i++){const x=R()*300,y=R()*760,w=40+R()*40,h=30+R()*50;g.fillStyle='#0a0a0e';g.fillRect(x,y,w,h);g.strokeStyle='rgba(200,200,220,.3)';g.lineWidth=1;g.strokeRect(x,y,w,h);g.fillStyle='rgba(220,220,230,.4)';for(let k=4;k<w-4;k+=6){g.fillRect(x+k,y-4,2,4);g.fillRect(x+k,y+h,2,4);}g.fillStyle='rgba(255,255,255,.15)';g.font='8px monospace';g.fillText('NG-'+(1000+i*37),x+4,y+12);}return c;}
function drawCircuit(t,h,sc){if(!PCB)PCB=mkPCB();const y=(sc%800);ctx.drawImage(PCB,0,y-800,W,800);ctx.drawImage(PCB,0,y,W,800);if(h>800)ctx.drawImage(PCB,0,y+800,W,800);
 ctx.globalCompositeOperation='lighter';for(let i=0;i<12;i++){const x=((i*7)%18)*20,yy=((t*(2+i%3)+i*90)%(h+40))-20;ds(S.dot[i%3?'li':'cy'],x,yy,0,.9);}ctx.globalCompositeOperation='source-over';}
function s9upd(){G9.sc+=1.3;for(const L of[G9.fans,G9.sparks])for(let i=L.length-1;i>=0;i--){const o=L[i];o.y+=1.3;o.t++;if(o.y>H+80)L.splice(i,1);}
 if(P.dead>0)return;for(const f of G9.fans){if(Math.abs(P.y-f.y)<70){P.x=clamp(P.x+f.dir*1.6,10,W-10);}}
 for(const s of G9.sparks){const c=s.t%200;if(c===150)sfx.zap&&sfx.zap();if(c>=150&&c<190&&Math.abs(P.y-s.y)<10&&P.x>s.x1&&P.x<s.x2)hitP('spark');}}
function wFan(){const d=Math.random()<.5?-1:1;G9.fans.push({x:d<0?W-6:6,y:-60,dir:d,t:0});vd(W/2,-14,{vy:2,shootAt:50});}
function wSpark(){const a=rnd(20,120);G9.sparks.push({x1:a,x2:a+rnd(140,220),y:-20,t:60});}
function s9back(){drawCircuit(G.t,H,G9.sc);for(const s of G9.sparks){const c=s.t%200;for(const x of[s.x1,s.x2]){ctx.fillStyle=c>=100?'#ffe14a':'#3a4a2a';ctx.fillRect(x-7,s.y-7,14,14);ctx.strokeStyle=COL.li;ctx.strokeRect(x-7,s.y-7,14,14);}
  if(c>=100&&c<150){if((c>>2)%2){ctx.setLineDash([6,6]);ctx.strokeStyle='#ffe14a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(s.x1,s.y);ctx.lineTo(s.x2,s.y);ctx.stroke();ctx.setLineDash([]);}txt('⚡ SPARK GAP',(s.x1+s.x2)/2,s.y-22,'#ffe14a',10,'center',4);}
  else if(c>=150&&c<190){ctx.strokeStyle='#fff';ctx.lineWidth=3;drawLightning(s.x1,s.y,s.x2,s.y);ctx.stroke();ctx.strokeStyle=COL.cy;ctx.lineWidth=1.5;drawLightning(s.x1,s.y,s.x2,s.y);ctx.stroke();glowDot('cy',s.x1,s.y,1.6,.8);glowDot('cy',s.x2,s.y,1.6,.8);}}}
function s9front(){for(const f of G9.fans){const x=f.x,y=f.y;ctx.fillStyle='#14181c';ctx.fillRect(f.dir>0?0:W-34,y-44,34,88);ctx.save();ctx.translate(f.dir>0?17:W-17,y);ctx.rotate(G.t*.4*f.dir);ctx.fillStyle='#8a9aa8';for(let k=0;k<5;k++){ctx.rotate(TAU/5);ctx.beginPath();ctx.ellipse(0,-14,6,14,.3,0,TAU);ctx.fill();}ctx.restore();ctx.strokeStyle=COL.cy;ctx.lineWidth=2;ctx.strokeRect(f.dir>0?0:W-34,y-44,34,88);
  ctx.strokeStyle='rgba(200,240,255,.35)';ctx.lineWidth=1;for(let k=0;k<6;k++){const xx=((G.t*6*f.dir+k*60)%W+W)%W,yy=y-50+k*18;ctx.beginPath();ctx.moveTo(xx,yy);ctx.lineTo(xx+f.dir*30,yy);ctx.stroke();}if((G.t>>4)%2&&Math.abs(y-H/2)<H/2)txt(f.dir>0?'FAN ▶▶':'◀◀ FAN',f.dir>0?60:W-60,y-58,COL.cy,10,'center',4);}}
// boss 9: MEGA VIRUS — copies itself at 70% and 40% (core locked while copies live; copies replicate every 8s, max 6)
function spawnB9(){vBoss('b9',W/2,-60,{yT:170,sp:0,tip:'SPLITS INTO COPIES — CORE LOCKED UNTIL THEY\'RE DELETED'});}
const nCopies=()=>EN.a.filter(q=>q.act&&q.type==='b9c').length;
function virusCopy(x,y){if(nCopies()>=6)return;const c=spawn('b9c',x,y,{vx:rnd(-1.5,1.5),vy:rnd(-1,1),rep:600,cd:rnd(40,80)|0});if(c)part(1,x,y,0,0,18,14,'li');}
XU.b9=e=>{if(e.dying){vBossDie(e);return;}if(vEnter(e))return;const t=e.t,f=hph(e);e.x=W/2+Math.sin(t*.013)*110;e.y=170+Math.sin(t*.026)*50;
 if((e.sp===0&&f<.7)||(e.sp===1&&f<.4)){e.sp++;for(let k=0;k<3;k++)virusCopy(e.x+(k-1)*50,e.y+30);G.banner={t:20,a:'VIRUS REPLICATING!',b:'DELETE THE COPIES TO UNLOCK THE CORE',small:true,c:COL.li};sfx.phase();}
 const n=nCopies();e.lock=n>0?1:0;if(t%(e.lock?120:80)===0)ring(e.x,e.y,e.lock?10:16,t*.04,1.8,true);if(t%45===0&&!e.lock)fan(e.x,e.y,aim(e.x,e.y),3,.5,2.6,false);};
XU.b9c=e=>{e.x+=e.vx;e.y+=e.vy;if(e.x<20||e.x>W-20)e.vx*=-1;if(e.y<70||e.y>H*.5)e.vy*=-1;if(--e.cd<=0){e.cd=70;eShot(e.x,e.y,aim(e.x,e.y),2.3);}if(--e.rep<=0){e.rep=600;virusCopy(e.x,e.y);if(G.boss)G.pop2={t:0,x:e.x,y:e.y-20,s:'REPLICATED!'};}};
function drawVirus(x,y,r,t,fl,lock){glowDot('li',x,y,r/9,.35);ctx.save();ctx.translate(x,y);ctx.rotate(t*.02);ctx.strokeStyle=COL.li;ctx.lineWidth=2;for(let k=0;k<12;k++){const a=k/12*TAU,l=r+8+Math.sin(t*.2+k)*3;ctx.beginPath();ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);ctx.lineTo(Math.cos(a)*l,Math.sin(a)*l);ctx.stroke();ctx.fillStyle='#ff3df0';ctx.beginPath();ctx.arc(Math.cos(a)*l,Math.sin(a)*l,2.5,0,TAU);ctx.fill();}ctx.restore();
 ctx.fillStyle=fl?'#fff':'#0e2a10';ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.strokeStyle=COL.li;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#ff2450';ctx.beginPath();ctx.arc(x-r*.35,y-r*.15,r*.18,0,TAU);ctx.arc(x+r*.35,y-r*.15,r*.18,0,TAU);ctx.fill();ctx.strokeStyle='#ff2450';ctx.beginPath();ctx.arc(x,y+r*.2,r*.4,.2,Math.PI-.2);ctx.stroke();
 if(lock){ctx.strokeStyle='rgba(46,249,255,'+(.5+.3*Math.sin(t*.2))+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,r+14,0,TAU);ctx.stroke();txt('🔒 LOCKED',x,y+r+18,COL.cy,10,'center',4);}}
XD.b9=(e,fl)=>drawVirus(e.x+(e.dying?rnd(-3,3):0),e.y,28,G.t,fl,e.lock);XD.b9c=(e,fl)=>{drawVirus(e.x,e.y,15,G.t+e.id*9,fl,0);ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(e.x-16,e.y+22,32,3);ctx.fillStyle=COL.mg;ctx.fillRect(e.x-16,e.y+22,32*(1-e.rep/600),3);};
// =========== 10 DEEP SEA TRENCH
function drawSea(t,h,sc){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#04324a');g.addColorStop(1,'#010a18');ctx.fillStyle=g;ctx.fillRect(0,0,W,h);
 ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(90,240,255,.05)';ctx.lineWidth=6;for(let i=0;i<8;i++){ctx.beginPath();for(let x=0;x<=W;x+=20)ctx.lineTo(x,i*h/8+Math.sin(x*.03+t*.03+i)*12+Math.sin(x*.07-t*.02)*6);ctx.stroke();}ctx.globalCompositeOperation='source-over';
 for(const s of[-1,1]){ctx.fillStyle='#020812';ctx.beginPath();ctx.moveTo(s<0?0:W,0);for(let y=0;y<=h+40;y+=40){const yy=y-((sc*.8)%40);ctx.lineTo(s<0?18+((y*13+(sc*.8/40|0)*7)%26):W-18-((y*13+(sc*.8/40|0)*7)%26),yy);}ctx.lineTo(s<0?0:W,h);ctx.fill();
  for(let k=0;k<4;k++){const ky=((k*230+sc*.8)%(h+200))-100,kx=s<0?24:W-24;ctx.strokeStyle='rgba(60,180,90,.5)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(kx,ky+120);for(let j=0;j<6;j++)ctx.lineTo(kx+Math.sin(t*.04+j*.8+k)*8*s,ky+120-j*24);ctx.stroke();}}
 for(let i=0;i<26;i++){const x=(i*53.1+Math.sin(t*.02+i)*8)%W,y=h-((t*(.6+i%3*.3)+i*97)%(h+20));ctx.strokeStyle='rgba(200,240,255,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,1.5+i%3,0,TAU);ctx.stroke();}
 for(let i=0;i<40;i++){ctx.fillStyle='rgba(220,230,255,.25)';ctx.fillRect((i*37.7)%W,(i*71.3+t*.4)%h,1.2,1.2);}}
function s10upd(){const b=G.boss;G10.dark=b&&b.act&&b.type==='b10'&&hph(b)<.5?Math.min(1,G10.dark+.01):Math.max(0,G10.dark-.02);}
function s10back(){drawSea(G.t,H,GV.t);}
function s10front(){const d=G10.dark;if(d<=0)return;const b=G.boss;ctx.save();ctx.fillStyle='rgba(0,2,8,'+(.92*d)+')';ctx.beginPath();ctx.rect(0,0,W,H);if(P.dead<=0)ctx.arc(P.x,P.y,90,0,TAU,true);ctx.fill('evenodd');ctx.restore();
 if(b&&b.act&&b.lr){glowDot('cy',b.lr.x,b.lr.y,4,.9);drawLure(b.lr.x,b.lr.y,b.lw);for(const s of[-1,1])glowDot('eb',b.x+s*18,b.y-6,1.2,.8);}if(d>.5&&(G.t>>4)%2&&b&&b.act)txt('LIGHTS OUT — TRUST NOTHING THAT GLOWS',W/2,H*.62,'#9ad',11,'center',4);}
function wJelly(){for(let i=0;i<4;i++)later(i*30,()=>spawn('jelly',rnd(40,W-40),-20,{ph:rnd(0,6)}));}
function wMines(){for(let i=0;i<3;i++)later(i*40,()=>spawn('mine',rnd(40,W-40),-20,{arm:0}));}
XU.jelly=e=>{const p=(e.t+e.ph*20)%90;e.y+=p<20?1.6:.35;e.x+=Math.sin(e.t*.03+e.ph)*.5;if(p===20&&e.y>20&&e.y<H*.7)for(const a of[-.3,0,.3])eShot(e.x,e.y+10,Math.PI/2+a,1.4,false);};
XD.jelly=(e,fl)=>{const p=(e.t+e.ph*20)%90,sq=p<20?1-p/40:.5+p/180;glowDot('mg',e.x,e.y,2,.4);ctx.fillStyle=fl?'#fff':'rgba(255,154,216,.55)';ctx.beginPath();ctx.ellipse(e.x,e.y,14*sq+4,11/sq*.6+4,0,Math.PI,TAU);ctx.fill();ctx.strokeStyle='#ffd0f0';ctx.lineWidth=1.5;ctx.stroke();
 ctx.strokeStyle='rgba(255,180,230,.6)';ctx.lineWidth=1.2;for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(e.x+k*4,e.y);for(let j=1;j<6;j++)ctx.lineTo(e.x+k*4+Math.sin(G.t*.1+j+k)*3,e.y+j*6);ctx.stroke();}};
XU.mine=e=>{e.y+=.7;e.x+=Math.sin(e.t*.02)*.3;if(e.t%120===0)e.ping=0;if(e.ping!=null)e.ping+=3;if(e.ping>140)e.ping=null;if(!e.arm&&pDist(e.x,e.y)<95){e.arm=1;e.at=0;}if(e.arm){e.at++;if(e.at%8===0&&AU.c)tone('square',1600,1600,.04,.03,AU.sfx);if(e.at>=45){ring(e.x,e.y,10,0,2,true);boom(e.x,e.y,1.4,'cy');e.act=false;}}};
XD.mine=(e,fl)=>{if(e.ping!=null){ctx.strokeStyle='rgba(90,240,255,'+(1-e.ping/140)*.5+')';ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x,e.y,e.ping,0,TAU);ctx.stroke();}const a=e.arm&&(e.at>>2)%2;ctx.fillStyle=fl?'#fff':'#1a2a34';ctx.beginPath();ctx.arc(e.x,e.y,10,0,TAU);ctx.fill();ctx.strokeStyle=a?'#ff2450':'#5af0ff';ctx.lineWidth=2;ctx.stroke();for(let k=0;k<6;k++){const an=k/6*TAU;ctx.beginPath();ctx.moveTo(e.x+Math.cos(an)*10,e.y+Math.sin(an)*10);ctx.lineTo(e.x+Math.cos(an)*15,e.y+Math.sin(an)*15);ctx.stroke();}glowDot(a?'eb':'cy',e.x,e.y,1,a?.9:.4);if(e.arm)txt('ARMED',e.x,e.y-26,'#ff8095',9,'center',4);};
// boss 10: ABYSSAL ANGLER — its lure is drawn exactly like a weapon power-up (a decoy!)
function spawnB10(){vBoss('b10',W/2,-80,{yT:160,lu:0,lt:0,lw:0,home:{x:W/2,y:160},tip:'THAT "POWER-UP" IS ITS LURE — DON\'T TOUCH IT'});}
function drawLure(x,y,w){const k=WEAP[w%3];ctx.globalCompositeOperation='lighter';ds(S.dot[k.d],x,y,0,1.6+Math.sin(G.t*.2)*.15);ctx.globalCompositeOperation='source-over';ctx.strokeStyle=k.c;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,12,0,TAU);ctx.stroke();ctx.fillStyle='#05030c';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(k.l,x,y+1);}
XU.b10=e=>{if(e.dying){vBossDie(e);return;}if(vEnter(e)){e.lr={x:e.x,y:e.y+40};return;}const t=e.t,ph=hph(e)<.5?1:0;if(t%90===0)e.lw++;
 if(!e.lu&&t%(ph?220:300)===0){e.lu=1;e.lt=0;}
 if(e.lu===1){e.lt++;if(e.lt>40){e.lu=2;e.lt=0;e.tx=P.x;e.ty=Math.min(P.y-40,H*.62);sfx.hiss&&sfx.hiss();}}
 else if(e.lu===2){e.lt++;e.x+=(e.tx-e.x)*.12;e.y+=(e.ty-e.y)*.12;e.r=40;if(e.lt===18){G.shake=8;sfx.crack&&sfx.crack();}if(e.lt>30){e.lu=3;e.lt=0;}}
 else if(e.lu===3){e.lt++;e.r=30;e.x+=(e.home.x-e.x)*.05;e.y+=(e.home.y-e.y)*.05;if(e.lt>70){e.lu=0;}}
 else{e.r=30;e.home.x=W/2+Math.sin(t*.01)*90;e.x+=(e.home.x-e.x)*.04;e.y+=(160-e.y)*.04;}
 const lx=e.x+Math.sin(t*.03)*30+(P.x-e.x)*.35,ly=e.y+90+Math.sin(t*.05)*30+(ph?60:0);e.lr=e.lr||{x:lx,y:ly};e.lr.x+=(lx-e.lr.x)*.05;e.lr.y+=(ly-e.lr.y)*.05;
 if(P.dead<=0&&pDist(e.lr.x,e.lr.y)<20){hitP('lure');G.pop={t:0,x:P.x,y:P.y-30,s:"IT'S A TRAP!",c:COL.eb};e.lu=1;e.lt=30;}
 if(t%70===0&&e.lu!==2)fan(e.x,e.y+20,aim(e.x,e.y),ph?6:4,.8,2.0,true);if(ph&&t%120===60)ring(e.x,e.y,12,t*.03,1.5,false);};
XD.b10=(e,fl)=>{const x=e.x+(e.dying?rnd(-3,3):0),y=e.y,ch=e.lu===2?Math.min(1,e.lt/18):e.lu===1?0:.15;
 if(e.lr){ctx.strokeStyle='#3a5a6a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y-26);ctx.quadraticCurveTo(x,y-60,e.lr.x,e.lr.y-14);ctx.stroke();}
 ctx.fillStyle=fl?'#889':'#0c1c26';ctx.beginPath();ctx.ellipse(x,y-6,52,34,0,0,TAU);ctx.fill();ctx.strokeStyle='#2a6a7a';ctx.lineWidth=2;ctx.stroke();
 for(const s of[-1,1]){ctx.fillStyle='#0c1c26';ctx.beginPath();ctx.moveTo(x+s*48,y-10);ctx.lineTo(x+s*76,y-30);ctx.lineTo(x+s*70,y+6);ctx.fill();}
 const jo=6+ch*24;ctx.fillStyle='#1a0408';ctx.beginPath();ctx.ellipse(x,y+16,40,jo,0,0,TAU);ctx.fill();ctx.fillStyle='#e8f0ff';for(let k=0;k<9;k++){const xx=x-34+k*8.5;ctx.beginPath();ctx.moveTo(xx,y+16-jo);ctx.lineTo(xx+4,y+16-jo+10);ctx.lineTo(xx+8,y+16-jo);ctx.fill();ctx.beginPath();ctx.moveTo(xx,y+16+jo);ctx.lineTo(xx+4,y+16+jo-10);ctx.lineTo(xx+8,y+16+jo);ctx.fill();}
 for(const s of[-1,1]){ctx.fillStyle=e.lu===1?'#ff2450':'#ffe14a';ctx.beginPath();ctx.arc(x+s*18,y-12,6,0,TAU);ctx.fill();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(x+s*18,y-12,2.5,0,TAU);ctx.fill();}
 if(e.lu===1&&(e.lt>>2)%2)txt('!',x,y-60,'#ff2450',22,'center',8);if(e.lr&&!e.dying){glowDot('cy',e.lr.x,e.lr.y,3,.5);drawLure(e.lr.x,e.lr.y,e.lw);}};
// =========== 11 COLOSSUS (on the back of a giant mech)
function giantBack(x,y,t,sc){sc=sc||0;ctx.save();ctx.translate(x,y);// drawn as a huge back seen from above, base at y
 ctx.fillStyle='#24181a';ctx.beginPath();ctx.moveTo(-170,0);ctx.lineTo(-150,-420);ctx.quadraticCurveTo(0,-520,150,-420);ctx.lineTo(170,0);ctx.fill();ctx.strokeStyle='#ff6a1e';ctx.lineWidth=2;ctx.stroke();
 for(let i=0;i<8;i++){const yy=-30-i*50;ctx.fillStyle='#3a2420';vRR(-24,yy-20,48,36,6);ctx.fill();ctx.strokeStyle='#ff2450';ctx.stroke();glowDot('eb',0,yy-2,.8,.4+.3*Math.sin(t*.1+i));}
 for(const s of[-1,1])for(let i=0;i<4;i++){ctx.fillStyle='#2e2022';ctx.fillRect(s*60-30+s*0,-60-i*90,60,70);ctx.strokeStyle='#5a3a30';ctx.strokeRect(s*60-30,-60-i*90,60,70);ctx.fillStyle='rgba(255,106,30,'+(.4+.4*Math.sin(t*.08+i))+')';ctx.fillRect(s*60-20,-40-i*90,40,4);}
 ctx.restore();}
function giantHead(x,y,s,k,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);// k: 0 = back of head, 1 = facing you
 const w=130*Math.max(.15,Math.abs(Math.cos(k*Math.PI/2))*.4+.6);ctx.fillStyle='#2a1a1c';ctx.beginPath();ctx.ellipse(0,0,130,110,0,0,TAU);ctx.fill();ctx.strokeStyle='#ff6a1e';ctx.lineWidth=3;ctx.stroke();
 for(let i=0;i<10;i++){const a=-Math.PI+i/9*Math.PI;ctx.fillStyle='#3a2420';ctx.save();ctx.rotate(a+Math.PI/2);ctx.fillRect(-8,-130,16,24);ctx.restore();}
 if(k<.5){ctx.globalAlpha=1-k*2;ctx.fillStyle='#3a2420';for(let i=0;i<5;i++)ctx.fillRect(-60+i*24,-60,16,120);ctx.fillStyle='#ff6a1e';for(let i=0;i<4;i++)ctx.fillRect(-40+i*24,-10,8,8);ctx.globalAlpha=1;}
 if(k>.4){const f=(k-.4)/.6,o=(1-f)*120;ctx.globalAlpha=Math.min(1,f*1.5);ctx.save();ctx.translate(o,0);for(const sd of[-1,1]){ctx.fillStyle='#0a0406';ctx.beginPath();ctx.moveTo(sd*20,-20);ctx.lineTo(sd*80,-40);ctx.lineTo(sd*76,0);ctx.lineTo(sd*22,4);ctx.closePath();ctx.fill();glowDot('eb',sd*50,-16,3,.9);ctx.fillStyle='#ff2450';ctx.beginPath();ctx.arc(sd*50,-16,9,0,TAU);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(sd*50,-16,3,0,TAU);ctx.fill();}
  ctx.fillStyle='#120608';vRR(-56,30,112,44,10);ctx.fill();ctx.fillStyle='#ff6a1e';for(let i=0;i<7;i++)ctx.fillRect(-48+i*15,34,9,10),ctx.fillRect(-48+i*15,60,9,10);ctx.restore();ctx.globalAlpha=1;}
 ctx.restore();}
function s11upd(){G11.d+=G11.spd;}
function wCT(){const x=[70,W-70,W/2-60,W/2+60][(GV.t>>4)%4];spawn('ct',x,-30,{cd:rnd(50,90)|0});}
function wCT2(){spawn('ct',60,-30,{cd:70});spawn('ct',W-60,-30,{cd:100});vd(W/2,-14,{shootAt:50});}
XU.ct=e=>{e.y+=G11.spd;if(e.y>H+40){e.act=false;return;}e.ga=aim(e.x,e.y);if(e.y>10&&--e.cd<=0){e.cd=110;fan(e.x,e.y,e.ga,3,.35,2.2,true);}};
XD.ct=(e,fl)=>{ctx.fillStyle='#1a1012';ctx.beginPath();ctx.arc(e.x,e.y,18,0,TAU);ctx.fill();ctx.strokeStyle='#5a3a30';ctx.lineWidth=3;ctx.stroke();ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.ga||0);ctx.fillStyle=fl?'#fff':'#4a2a24';ctx.fillRect(0,-4,24,8);ctx.restore();ctx.fillStyle=fl?'#fff':'#3a2420';ctx.beginPath();ctx.arc(e.x,e.y,11,0,TAU);ctx.fill();ctx.strokeStyle='#ff6a1e';ctx.lineWidth=2;ctx.stroke();glowDot('eb',e.x,e.y,1,e.cd<30?.9:.3);};
function s11back(){const d=G11.d,t=G.t;ctx.fillStyle='#120a10';ctx.fillRect(0,0,W,H);for(let i=0;i<6;i++)cloud(((i*80+t*.6)%(W+100))-50,((i*150+d*2.6)%(H+120))-60,30,'rgba(80,60,70,.35)');
 const L=22,R=W-22;ctx.fillStyle='#2a1c1e';ctx.fillRect(L,0,R-L,H);const off=d%120;
 for(let y=-120+off;y<H+120;y+=120){for(const s of[-1,1]){const x0=s<0?L+6:W/2+46;ctx.fillStyle='#352426';ctx.fillRect(x0,y+6,W/2-52-L,108);ctx.strokeStyle='#4a3230';ctx.lineWidth=2;ctx.strokeRect(x0,y+6,W/2-52-L,108);ctx.fillStyle='#5a4038';for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(x0+8+k*((W/2-68-L)/3),y+12,2.5,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(x0+8+k*((W/2-68-L)/3),y+108,2.5,0,TAU);ctx.fill();}
   ctx.fillStyle='#120a0a';ctx.fillRect(x0+20,y+40,W/2-92-L,30);ctx.fillStyle='rgba(255,106,30,'+(.35+.35*Math.sin(t*.1+y))+')';for(let k=0;k<4;k++)ctx.fillRect(x0+24,y+44+k*7,W/2-100-L,3);}
  ctx.fillStyle='#3a2420';vRR(W/2-38,y+10,76,96,10);ctx.fill();ctx.strokeStyle='#ff2450';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#ffb52e';for(let k=0;k<6;k++)ctx.fillRect(W/2-30+k*11,y+50,6,3);glowDot('eb',W/2,y+80,1,.3+.4*FX.pulse);}
 if(t%7===0)part(3,rnd(L+30,R-30),rnd(0,H),0,-.6,40,.8);ctx.fillStyle='#ffb52e';for(let y=-40+(d%40);y<H;y+=40){ctx.fillRect(L,y,6,20);ctx.fillRect(R-6,y,6,20);}
 const hy=(d-(GV.bossT*1.2-330));if(hy>-260)giantHead(W/2,Math.min(150,hy),1.25,0,t);}
// boss 11: THE GEARLORD COLOSSUS — the head turned around. Eye-laser sweeps, mouth rings, hand slams, forehead core opens
function spawnB11(){const b=vBoss('b11',W/2,110,{yT:110,invT:90,cyc:0,sw:0,hands:[],tip:'HIT THE FOREHEAD CORE WHEN IT OPENS'});musicStart(vMus(11,1));G11.spd=0;}
XU.b11=e=>{if(e.dying){vBossDie(e);return;}const t=e.t,f=hph(e),ph=f<.33?2:f<.66?1:0;e.x=W/2+Math.sin(t*.01)*20;e.y=110+Math.sin(t*.02)*6;
 const c=t%(ph?330:400),open=c>(ph?160:220);e.lock=open?0:1;e.open=open;
 if(!open&&c%140===30){e.sw=1;e.sa=Math.random()<.5?0:1;}if(e.sw){e.sw++;if(e.sw>45){const k=(e.sw-45)/90,base=e.sa?(Math.PI*.2+k*Math.PI*.6):(Math.PI*.8-k*Math.PI*.6);e.ang=base;for(const s of[-1,1]){const ox=e.x+s*62,oy=e.y+40,dx=P.x-ox,dy=P.y-oy,u=dx*Math.cos(base)+dy*Math.sin(base),v=Math.abs(-dx*Math.sin(base)+dy*Math.cos(base));if(u>0&&v<8)hitP('eye laser');}}else e.ang=e.sa?Math.PI*.2:Math.PI*.8;if(e.sw>135)e.sw=0;}
 if(c%(ph===2?110:160)===80){e.hands.push({x:clamp(P.x,50,W-50),y:clamp(P.y,H*.45,H-40),t:0,s:e.hands.length%2?1:-1});}
 for(let i=e.hands.length-1;i>=0;i--){const h=e.hands[i];h.t++;if(h.t===60){G.shake=14;boom(h.x,h.y,1.6,'am');if(pDist(h.x,h.y)<52)hitP('hand slam');ring(h.x,h.y,8,0,1.6,false);}if(h.t>100)e.hands.splice(i,1);}
 if(open&&t%30===0)ring(e.x,e.y+80,ph?16:12,t*.05,1.8,true);if(t%60===0)fan(e.x,e.y+80,aim(e.x,e.y+80),ph+3,.6,2.4,false);};
XD.b11=(e,fl)=>{const x=e.x+(e.dying?rnd(-4,4):0),y=e.y+40;giantHead(x,y,1.25,1,G.t);const cx=e.x,cy=e.y;
 ctx.fillStyle='#120608';ctx.beginPath();ctx.arc(cx,cy-10,26,0,TAU);ctx.fill();ctx.strokeStyle=e.open?'#ffe14a':'#5a3a30';ctx.lineWidth=4;ctx.stroke();
 if(e.open){glowDot('am',cx,cy-10,3+.6*Math.sin(G.t*.4),.9);ctx.fillStyle=fl?'#fff':'#ffb52e';ctx.beginPath();ctx.arc(cx,cy-10,12,0,TAU);ctx.fill();if((G.t>>3)%2)txt('CORE OPEN!',cx,cy-56,'#ffe14a',12,'center',6);}else{ctx.fillStyle='#3a2420';for(let k=0;k<6;k++){ctx.save();ctx.translate(cx,cy-10);ctx.rotate(k/6*TAU+G.t*.01);ctx.fillRect(-3,-24,6,24);ctx.restore();}}
 if(e.sw&&!e.dying){const a=e.ang;for(const s of[-1,1]){const ox=x+s*62,oy=y;if(e.sw<=45){ctx.setLineDash([6,6]);ctx.strokeStyle='rgba(255,36,80,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox+Math.cos(a)*1000,oy+Math.sin(a)*1000);ctx.stroke();ctx.setLineDash([]);}else{ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,36,80,.5)';ctx.lineWidth=14;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox+Math.cos(a)*1000,oy+Math.sin(a)*1000);ctx.stroke();ctx.strokeStyle='#fff0f0';ctx.lineWidth=3;ctx.stroke();ctx.globalCompositeOperation='source-over';}}}
 for(const h of e.hands){if(h.t<60){const r=52*(.5+.5*h.t/60);ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(h.x,h.y,r,r*.6,0,0,TAU);ctx.fill();ctx.strokeStyle=(h.t>>2)%2?'#ff2450':'#ffb52e';ctx.setLineDash([6,5]);ctx.lineWidth=2;ctx.beginPath();ctx.arc(h.x,h.y,52,0,TAU);ctx.stroke();ctx.setLineDash([]);}
  const hy=h.t<60?h.y-260+h.t*3.2:h.y;if(h.t<100){ctx.save();ctx.translate(h.x,hy);ctx.fillStyle='#3a2420';vRR(-40,-50,80,60,12);ctx.fill();ctx.strokeStyle='#ff6a1e';ctx.lineWidth=2;ctx.stroke();for(let k=0;k<4;k++){ctx.fillStyle='#2a1a1c';vRR(-38+k*20,6,16,30,5);ctx.fill();ctx.stroke();}ctx.restore();}}};
