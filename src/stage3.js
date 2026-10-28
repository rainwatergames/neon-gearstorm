// ===================== STAGE 3: THE XENO HIVE (v1.3.0) — organic alien world =====================
// Open sky over a living planet. New mechanics (each gets a one-line hint the first time it appears):
//  EGGS hatch into swarmers if not shot in time · SPITTERS glow before they spit acid · ACID GEYSERS bubble then erupt
//  TENTACLES glow along their lane before they lash across it · HIVE PODS keep spawning swarmers until destroyed
const XU={},XD={}; // per-type update/draw hooks for stages 3+4 (used by main.js updEnemy/drawEnemy)
const G3={d:0,ev:0,gey:[],ten:[],flora:[],hint:{}};
const BOSS3D=3500;const C3={g:'#7dff4a',p:'#b44dff',c:'#3ff7e8',d:'#0b1a10',acid:'#c6ff2e'};
function hint3(k,a,c){if(G3.hint[k])return;G3.hint[k]=1;G.banner={t:20,a,b:'',small:true,c:c||C3.g};}
// --- enemies
function swarm(x,y,n,sp){for(let i=0;i<n;i++)later(i*(sp||8),()=>spawn('swarm',x+rnd(-14,14),y,{ph:rnd(0,TAU),vy:rnd(1.6,2.2)}));}
function swarmArc(dir){const x0=dir>0?20:W-20;for(let i=0;i<7;i++)later(i*7,()=>spawn('swarm',x0,-12,{ph:i*.5,vy:1.9,arc:dir}));}
function spitter(x){spawn('spitter',x,-24,{cd:90+rnd(0,40)|0,gl:0});}
function egg(x,y){return spawn('egg',x,y==null?-20:y,{hatch:200,vy:.55});}
function eggs(xs){xs.forEach((x,i)=>later(i*10,()=>egg(x)));}
function hive(x){spawn('hive',x,-40,{cd:80});}
function geyser(x,y){G3.gey.push({x,y,t:0});}
function tentacle(y,side,len){G3.ten.push({y,side,len:len||230,t:0});}
XU.swarm=e=>{const t=e.t;e.y+=e.vy;if(e.arc){e.x+=e.arc*2.2*Math.cos(t*.03);}else{e.x+=clamp((P.x-e.x)*.012,-1.2,1.2)+Math.sin(t*.12+e.ph)*1.3;}if(t===70&&Math.random()<.35)eShot(e.x,e.y,aim(e.x,e.y),2.4);};
XU.spitter=e=>{const t=e.t;if(e.y<110+((e.id*37)%90))e.y+=1.1;else{e.x+=Math.sin(t*.02)*.6;e.cd--;if(e.cd===35){e.gl=1;sfx.hiss();}if(e.cd<=0){e.gl=0;e.cd=170;fan(e.x,e.y+12,aim(e.x,e.y+12),3,.45,2.0,true);}if(t>60*14)e.y+=1.4;}};
XU.egg=e=>{e.y+=e.vy;if(e.y>30&&--e.hatch<=0){e.act=false;boom(e.x,e.y,.7,'li');for(let i=0;i<3;i++)spawn('swarm',e.x+(i-1)*14,e.y,{ph:i*2,vy:1.7});}};
XU.hive=e=>{const t=e.t;if(e.y<130)e.y+=.7;else{e.y+=.18;e.cd--;if(e.cd<=0){e.cd=110;spawn('swarm',e.x,e.y+20,{ph:rnd(0,TAU),vy:1.8});}}if(e.y>H+40)e.act=false;};
// --- boss 3: HIVE QUEEN. Parts: 2 claws + egg sac; core (glowing crown eye) armored until all three are broken.
function warning3(){strobe(90);G.banner={t:0,a:'⚠ WARNING ⚠',b:'HIVE QUEEN APPROACHING',warn:true};sfx.warn();}
function spawnBoss3(){const b=spawn('boss3',W/2,-150,{invT:150,phase:0,hA:0,cs:0,ct:0,ccd:220,side:1,mouth:0,ecd:260});G.boss=b;
 b.parts=[b.pL=mkPart(b,-92,30,26,160,'LEFT CLAW','debris'),b.pR=mkPart(b,92,30,26,160,'RIGHT CLAW','debris'),b.pM=mkPart(b,0,-70,30,170,'EGG SAC','debris')];musicStart(6);
 later(160,()=>{G.banner={t:30,a:'🎯 BREAK CLAWS + EGG SAC, THEN HIT THE EYE',b:'RED ZONE = CLAW SWIPE · MOVE TO THE OTHER SIDE',small:true,c:C3.c};});}
XU.boss3=e=>{const t=e.t;
 if(e.dying){e.dT++;if(e.dT===1){strobe(200);sfx.bossDie();}if(e.dT%4===0)boom(e.x+rnd(-100,100),e.y+rnd(-70,70),rnd(1,2.4),['li','mg','cy'][e.dT%3]);e.y+=.3;G.shake=Math.max(G.shake,7);
  if(e.dT===200){boom(e.x,e.y,5,'li');boom(e.x,e.y,4,'mg');flash(1,'200,255,160');sfx.bossDie();e.act=false;G.boss=null;later(150,toStage4);}return;}
 if(e.y<150){e.y+=1;e.invT=Math.max(e.invT,2);return;}
 const ph=e.phase,L=e.pL.act,R=e.pR.act,M=e.pM.act;e.r=ph<3?22:36;
 if(e.invT>0)return;
 // claw swipe: 0 idle, 1 telegraph (red half-zone), 2 swipe, 3 recover
 if(e.cs===0){e.x=W/2+Math.sin(t*(.009+ph*.003))*(40+ph*14);e.y=150+Math.sin(t*.02)*10;
  if((L||R||ph===3)&&--e.ccd<=0){e.cs=1;e.ct=0;e.side=P.x<W/2?-1:1;if(e.side<0&&!L&&ph<3)e.side=1;if(e.side>0&&!R&&ph<3)e.side=-1;sfx.hiss();}}
 else{e.ct++;if(e.cs===1&&e.ct>(ph===3?62:80)){e.cs=2;e.ct=0;sfx.flame();G.shake=10;}
  else if(e.cs===2){const inZ=P.dead<=0&&(e.side<0?P.x<W/2+6:P.x>W/2-6)&&P.y>e.y-10&&P.y<e.y+330;if(e.ct<14&&inZ){G.hitBy='claw';playerHit();}
   if(e.ct===2)for(let i=0;i<10;i++)part(0,W/2+e.side*rnd(20,170),e.y+rnd(40,300),e.side*rnd(2,5),rnd(-1,1),20,1,'eb');if(e.ct>16){e.cs=3;e.ct=0;}}
  else if(e.cs===3&&e.ct>30){e.cs=0;e.ccd=ph===3?200:260;}}
 if(e.cs===1||e.cs===2)return; // readable: nothing else fires during the swipe telegraph
 const sp=1+ph*.1;
 // acid spit: mouth glows 30f then a fan
 if(t%130===70)e.mouth=40;if(e.mouth>0){e.mouth--;if(e.mouth===0)fan(e.x,e.y+40,aim(e.x,e.y+40),ph>=2?5:4,.8,2.0*sp,true);}
 // egg sac lobs eggs that hatch
 if(M&&--e.ecd<=0){e.ecd=ph>=1?230:300;for(const dx of[-70,0,70])egg(clamp(e.x+dx+rnd(-20,20),30,W-30),e.y-40).vy=.9;}
 if(L&&t%100===0)fan(e.x-92,e.y+30,aim(e.x-92,e.y+30),3,.4,2.5*sp);
 if(R&&t%100===50)fan(e.x+92,e.y+30,aim(e.x+92,e.y+30),3,.4,2.5*sp);
 if(ph>=1&&t%11===0){e.hA+=.21;eShot(e.x,e.y,e.hA,1.9);}
 if(ph>=2&&t%130===65)ring(e.x,e.y,11,t*.02,1.6,true);
 if(ph===3){e.hA+=.03;if(t%8===0)for(let k=0;k<3;k++)eShot(e.x,e.y,e.hA+k*TAU/3,2.1);if(t%90===0)ring(e.x,e.y,12,(t/90)%2?TAU/24:0,1.7,true);}};
// --- stage flow
const EV3=[[0,()=>{G.banner={t:0,a:'STAGE 3',b:'THE XENO HIVE'};}],
 [140,()=>swarmArc(1)],[260,()=>swarmArc(-1)],
 [380,()=>{hint3('egg','🥚 EGGS HATCH — SHOOT THEM BEFORE THEY CRACK',C3.acid);eggs([90,180,270]);}],
 [600,()=>swarm(100,-12,6)],[640,()=>swarm(260,-12,6)],
 [760,()=>{hint3('spit','SPITTERS GLOW GREEN, THEN SPIT — KEEP MOVING',C3.g);spitter(110);}],[800,()=>spitter(250)],
 [980,()=>{hint3('gey','◎ BUBBLING ACID ERUPTS — STAY OUT OF THE RING',C3.acid);geyser(120,330);}],[1060,()=>geyser(250,260)],[1120,()=>swarmArc(1)],
 [1300,()=>{hint3('ten','TENTACLE LANE GLOWS — LEAVE THAT ROW',C3.p);tentacle(H*.62,-1);}],[1420,()=>tentacle(H*.45,1)],[1500,()=>eggs([60,300])],
 [1640,()=>{hint3('hive','HIVE PODS SPAWN SWARMERS — DESTROY THEM',C3.c);hive(180);}],[1700,()=>swarmArc(-1)],
 [1900,()=>{spitter(80);spitter(280);}],[2000,()=>geyser(180,380)],[2080,()=>tentacle(H*.7,-1)],[2150,()=>tentacle(H*.5,1)],
 [2250,()=>eggs([70,140,220,290])],[2400,()=>{hive(90);hive(270);}],[2600,()=>swarm(180,-12,10,6)],
 [2780,()=>{geyser(90,300);geyser(270,300);}],[2900,()=>tentacle(H*.58,-1,200)],[2960,()=>tentacle(H*.58,1,200)],[3050,()=>{spitter(180);swarmArc(1);}],
 [3300,()=>warning3()],[BOSS3D,()=>spawnBoss3()]];
function s3reset(d){Object.assign(G3,{d:d||0,ev:0,gey:[],ten:[],hint:{}});G3.flora=[];for(let i=0;i<14;i++)G3.flora.push({x:i%2?rnd(W-38,W-6):rnd(6,38),y:rnd(0,H),h:rnd(30,70),ph:rnd(0,TAU),c:i%3});
 if(G3.d>0){while(G3.ev<EV3.length&&EV3[G3.ev][0]<G3.d)G3.ev++;for(const k of['egg','spit','gey','ten','hive'])G3.hint[k]=1;}}
function toStage3(){if(G.state!=='play')return;G.stage=3;s3reset(0);G.hold=false;G.boss=null;EB.clear();G.shield=Math.min(G.maxSh,G.shield+1);G.score+=G.lives*10000;
 G.banner={t:0,a:'STAGE 2 CLEAR',b:'+'+(G.lives*10000).toLocaleString()+' · SHIELD +1'};musicStart(5);G.ev3Delay=150;}
function s3Update(){if(G.ev3Delay>0){G.ev3Delay--;return;}
 if(!G.boss)G3.d++;while(G3.ev<EV3.length&&EV3[G3.ev][0]<=G3.d){EV3[G3.ev][1]();G3.ev++;}
 if(window.NG&&NG.auto)NG.auto();
 const alive=P.dead<=0&&G.lives>0;
 for(let i=G3.gey.length-1;i>=0;i--){const g=G3.gey[i];g.t++;g.y+=.35;if(g.t%9===0&&g.t<80)part(3,g.x+rnd(-20,20),g.y+rnd(-6,6),0,-.4,30,.6);
  if(g.t===80){sfx.flame();G.shake=Math.max(G.shake,5);for(let k=0;k<14;k++)eShot(g.x,g.y,-Math.PI/2+rnd(-1.3,1.3),rnd(1.2,2.6),true,true);}
  if(g.t>=80&&g.t<120&&alive&&Math.hypot(P.x-g.x,P.y-g.y)<34){G.hitBy='acid';playerHit();}
  if(g.t>140)G3.gey.splice(i,1);}
 for(let i=G3.ten.length-1;i>=0;i--){const T=G3.ten[i];T.t++;if(T.t===1)sfx.hiss();if(T.t===70)sfx.flame();
  const ext=T.t<70?0:T.t<86?(T.t-70)/16:T.t<120?1:Math.max(0,1-(T.t-120)/20);T.ext=ext;
  if(ext>.6&&alive){const x0=T.side<0?0:W-T.len*ext,x1=T.side<0?T.len*ext:W;if(P.x>x0-4&&P.x<x1+4&&Math.abs(P.y-T.y)<16){G.hitBy='tentacle';playerHit();}}
  if(T.t>140)G3.ten.splice(i,1);}}
// --- drawing
function s3DrawBack(){ctx.fillStyle='rgba(6,14,9,.86)';ctx.fillRect(0,0,W,H);const t=G.t,pu=FX.pulse||0;
 // bioluminescent haze
 if(!G3.neb){G3.neb=mk(W,900,g=>{g.translate(-W/2,-450);const cs=['rgba(125,255,74,.10)','rgba(180,77,255,.13)','rgba(63,247,232,.08)'];for(let i=0;i<14;i++){const x=rnd(0,W),y=rnd(0,900),r=rnd(70,190),c=cs[i%3];for(const oy of[-900,0,900]){const gr=g.createRadialGradient(x,y+oy,0,x,y+oy,r);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y+oy-r,r*2,r*2);}}},1);}
 G3.nY=((G3.nY||0)+.4)%900;ctx.drawImage(G3.neb,0,G3.nY-900,W,900);ctx.drawImage(G3.neb,0,G3.nY,W,900);
 // organic ridges on both edges (vein-lined flesh walls)
 for(const s of[-1,1]){ctx.beginPath();const x0=s<0?0:W;ctx.moveTo(x0,-10);for(let y=-10;y<=H+10;y+=12){const w=20+10*Math.sin((y-G3.d*.8)/55+s)+6*Math.sin((y-G3.d*.8)/19);ctx.lineTo(s<0?w:W-w,y);}ctx.lineTo(x0,H+10);ctx.closePath();ctx.fillStyle='#1a0f24';ctx.fill();ctx.strokeStyle='rgba(180,77,255,'+(.45+.3*pu).toFixed(2)+')';ctx.lineWidth=2;ctx.stroke();}
 // bioluminescent flora on the ridges
 for(const f of G3.flora){f.y+=.8;if(f.y>H+80){f.y=-80;}const sw=Math.sin(t*.03+f.ph)*6,c=[C3.c,C3.g,C3.p][f.c];ctx.strokeStyle='rgba(40,90,60,.9)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(f.x,f.y);ctx.quadraticCurveTo(f.x+sw,f.y-f.h*.5,f.x+sw*1.6,f.y-f.h);ctx.stroke();
  ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.5+.4*Math.sin(t*.06+f.ph);ds(S.dot[['cy','li','mg'][f.c]],f.x+sw*1.6,f.y-f.h,0,1.3);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle=c;ctx.beginPath();ctx.arc(f.x+sw*1.6,f.y-f.h,3,0,TAU);ctx.fill();}
 // geysers: bubbling ring telegraph
 for(const g of G3.gey){if(g.t<80){const k=g.t/80,fl=(g.t>>3)%2;ctx.beginPath();ctx.arc(g.x,g.y,34,0,TAU);ctx.fillStyle='rgba(198,255,46,'+(.08+.18*k).toFixed(2)+')';ctx.fill();ctx.setLineDash([6,5]);ctx.lineDashOffset=-g.t;ctx.strokeStyle=fl?'#eaff9a':C3.acid;ctx.lineWidth=2.5;ctx.stroke();ctx.setLineDash([]);
   for(let k2=0;k2<3;k2++){const a=g.t*.1+k2*2.1;ctx.beginPath();ctx.arc(g.x+Math.cos(a)*14,g.y+Math.sin(a)*8,3+2*Math.sin(g.t*.3+k2),0,TAU);ctx.fillStyle=C3.acid;ctx.fill();}if(fl)txt('!',g.x,g.y-9,'#eaff9a',16,'center');}
  else if(g.t<120){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=1-(g.t-80)/40;ds(S.dot.li,g.x,g.y,0,4);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}}
 // tentacle lane telegraph
 for(const T of G3.ten){if(T.t<70){const fl=(T.t>>2)%2;ctx.fillStyle='rgba(180,77,255,'+(fl?.22:.1)+')';const x0=T.side<0?0:W-T.len;ctx.fillRect(x0,T.y-16,T.len,32);ctx.setLineDash([8,6]);ctx.strokeStyle=fl?'#e6b8ff':C3.p;ctx.lineWidth=2;ctx.strokeRect(x0,T.y-16,T.len,32);ctx.setLineDash([]);if(fl)txt(T.side<0?'▶ ▶':'◀ ◀',x0+T.len/2,T.y-8,'#e6b8ff',14,'center');}}}
function s3DrawFront(){for(const T of G3.ten){if(!T.ext)continue;const L=T.len*T.ext,s=T.side,x0=s<0?0:W;ctx.beginPath();for(let k=0;k<=20;k++){const u=k/20,x=x0-s*L*u,w=(1-u)*14+3,y=T.y+Math.sin(u*8-G.t*.3)*6*u;if(k===0)ctx.moveTo(x,y-w);else ctx.lineTo(x,y-w);}for(let k=20;k>=0;k--){const u=k/20,x=x0-s*L*u,w=(1-u)*14+3,y=T.y+Math.sin(u*8-G.t*.3)*6*u;ctx.lineTo(x,y+w);}ctx.closePath();ctx.fillStyle='#4a1a6a';ctx.fill();ctx.strokeStyle=C3.p;ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle=C3.c;for(let k=2;k<20;k+=3){const u=k/20;ctx.beginPath();ctx.arc(x0-s*L*u,T.y+Math.sin(u*8-G.t*.3)*6*u,2.2,0,TAU);ctx.fill();}}
 const b=G.boss;if(b&&b.act&&b.type==='boss3'&&b.cs===1){const pu=.5+.5*Math.sin(G.t*.55),x0=b.side<0?0:W/2,y0=b.y-10;ctx.fillStyle='rgba(255,36,80,'+(.14+.18*pu).toFixed(2)+')';ctx.fillRect(x0,y0,W/2,340);ctx.setLineDash([12,8]);ctx.lineDashOffset=-G.t*2;ctx.strokeStyle='rgba(255,90,120,'+(.6+.4*pu)+')';ctx.lineWidth=3;ctx.strokeRect(x0+2,y0,W/2-4,340);ctx.setLineDash([]);
  txt('⚠ CLAW SWIPE',x0+W/4,y0+150,'#ff3b6b',16,'center',8);txt(b.side<0?'SAFE ▶':'◀ SAFE',b.side<0?W*.75:W*.25,y0+150,'#7dff4a',15,'center',6);}
 if(b&&b.act&&b.type==='boss3'&&b.cs===2&&b.ct<16){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,60,120,'+(.35*(1-b.ct/16)).toFixed(2)+')';ctx.fillRect(b.side<0?0:W/2,b.y-10,W/2,340);ctx.globalCompositeOperation='source-over';}}
// creature drawing
function blob(x,y,r,fill,stroke){ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.6;ctx.stroke();}}
function glowDot(k,x,y,s,a){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a==null?.7:a;ds(S.dot[k],x,y,0,s);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
XD.swarm=(e,fl)=>{const w=Math.sin(e.t*.5)*5;ctx.fillStyle='rgba(180,77,255,.55)';ctx.beginPath();ctx.ellipse(e.x-7,e.y-2,7,3+Math.abs(w)*.4,-.4,0,TAU);ctx.ellipse(e.x+7,e.y-2,7,3+Math.abs(w)*.4,.4,0,TAU);ctx.fill();blob(e.x,e.y,6,fl?'#fff':'#1f4a1a',C3.g);blob(e.x,e.y+3,2.2,C3.acid);};
XD.spitter=(e,fl)=>{const g=e.gl?1:0;if(g)glowDot('li',e.x,e.y+10,2.2,.5+.4*Math.sin(G.t*.6));ctx.fillStyle=fl?'#fff':'#2a1440';ctx.beginPath();ctx.ellipse(e.x,e.y,15,12,0,0,TAU);ctx.fill();ctx.strokeStyle=C3.p;ctx.lineWidth=2;ctx.stroke();
 ctx.strokeStyle='#5a2a7a';ctx.lineWidth=3;for(let k=-1;k<=1;k+=2){ctx.beginPath();ctx.moveTo(e.x+k*10,e.y+6);ctx.quadraticCurveTo(e.x+k*16,e.y+16+Math.sin(G.t*.2+k)*4,e.x+k*12,e.y+22);ctx.stroke();}
 blob(e.x,e.y+9,5+g*2,g?C3.acid:'#3a6a2a',C3.g);blob(e.x-5,e.y-4,2.2,C3.c);blob(e.x+5,e.y-4,2.2,C3.c);};
XD.egg=(e,fl)=>{const k=1-Math.max(0,e.hatch)/200,pu=.5+.5*Math.sin(G.t*(.1+k*.4));glowDot('li',e.x,e.y,1.4+k,.25+.4*pu*k);ctx.fillStyle=fl?'#fff':'#2a3a1a';ctx.beginPath();ctx.ellipse(e.x,e.y,10,13,0,0,TAU);ctx.fill();ctx.strokeStyle=k>.7&&(G.t>>2)%2?'#eaff9a':C3.g;ctx.lineWidth=2;ctx.stroke();
 if(k>.4){ctx.strokeStyle='#eaff9a';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(e.x-6,e.y-3);ctx.lineTo(e.x-1,e.y+2);ctx.lineTo(e.x+3,e.y-4);ctx.lineTo(e.x+7,e.y+1);ctx.stroke();}blob(e.x,e.y+2,3+2*pu,C3.acid);};
XD.hive=(e,fl)=>{const pu=.5+.5*Math.sin(G.t*.12);glowDot('cy',e.x,e.y,3.2,.25+.25*pu);ctx.fillStyle=fl?'#fff':'#2a1a3a';ctx.beginPath();ctx.ellipse(e.x,e.y,28+3*pu,24+2*pu,0,0,TAU);ctx.fill();ctx.strokeStyle=C3.p;ctx.lineWidth=2.5;ctx.stroke();
 for(let k=0;k<6;k++){const a=k/6*TAU+G.t*.01;blob(e.x+Math.cos(a)*15,e.y+Math.sin(a)*12,4,'rgba(63,247,232,'+(.3+.5*pu).toFixed(2)+')');}blob(e.x,e.y,7,C3.c);};
XD.boss3=(e,fl)=>{const sh=e.dying?rnd(-4,4):0,x=e.x+sh,y=e.y,pu=.5+.5*Math.sin(G.t*.1);glowDot('mg',x,y,6,.35);
 // abdomen / egg sac (top)
 const M=e.pM&&e.pM.act;ctx.beginPath();ctx.ellipse(x,y-70,M?40+3*pu:26,M?32+3*pu:20,0,0,TAU);ctx.fillStyle=M?'#3a1a4a':'#120a16';ctx.fill();ctx.strokeStyle=M?C3.p:COL.eb;ctx.lineWidth=2.5;ctx.stroke();
 if(M){for(let k=0;k<7;k++){const a=k/7*TAU;blob(x+Math.cos(a)*20,y-70+Math.sin(a)*15,5,'rgba(198,255,46,'+(.35+.4*pu).toFixed(2)+')');}drawPart2(e.pM);}
 // legs
 ctx.strokeStyle='#4a2a5a';ctx.lineWidth=5;for(const s of[-1,1])for(let k=0;k<3;k++){const a=G.t*.05+k;ctx.beginPath();ctx.moveTo(x+s*30,y-10+k*14);ctx.lineTo(x+s*(70+k*6),y-30+k*24+Math.sin(a)*5);ctx.lineTo(x+s*(84+k*8),y+10+k*22);ctx.stroke();}
 // thorax
 ctx.beginPath();ctx.ellipse(x,y,48,40,0,0,TAU);ctx.fillStyle=fl?'#5a3a6a':'#24122e';ctx.fill();neonStroke(C3.p,2.5);
 ctx.strokeStyle='rgba(63,247,232,.5)';ctx.lineWidth=1.5;for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(x+k*14,y-34);ctx.quadraticCurveTo(x+k*20,y,x+k*10,y+36);ctx.stroke();}
 // claws
 for(const[pp,s]of[[e.pL,-1],[e.pR,1]]){const cx=x+s*92,cy=y+30,sw=e.cs===2&&e.side===s?Math.min(1,e.ct/8):0,tel=e.cs===1&&e.side===s;
  if(pp&&pp.act){ctx.save();ctx.translate(cx,cy);ctx.rotate(s*(.3-sw*1.6));ctx.fillStyle=tel?'#6a1a2a':'#3a1a3a';ctx.beginPath();ctx.moveTo(-10,-20);ctx.lineTo(10,-20);ctx.lineTo(16,30);ctx.lineTo(0,58);ctx.lineTo(-6,26);ctx.closePath();ctx.fill();ctx.strokeStyle=tel?'#ff3b6b':C3.g;ctx.lineWidth=2.5;ctx.stroke();ctx.restore();
   if(tel)glowDot('eb',cx,cy+20,2.5,.4+.4*Math.sin(G.t*.6));drawPart2(pp);}
  else{blob(cx,cy,10,'#0d0710',COL.eb);if(G.t%6===0)part(3,cx,cy,rnd(-.3,.3),rnd(-1,-.5),30,.7);}}
 // head + crown eye (weak spot)
 const arm=partsAlive(e)>0,mo=e.mouth>0;ctx.beginPath();ctx.ellipse(x,y+38,28,22,0,0,TAU);ctx.fillStyle='#2a1238';ctx.fill();ctx.strokeStyle=C3.p;ctx.lineWidth=2;ctx.stroke();
 ctx.beginPath();ctx.ellipse(x,y+50,14,mo?9:3,0,0,TAU);ctx.fillStyle=mo?C3.acid:'#120814';ctx.fill();if(mo)glowDot('li',x,y+50,2,.6);
 ctx.beginPath();ctx.arc(x,y,20,0,TAU);ctx.fillStyle='#0c0612';ctx.fill();neonStroke(arm?'#6a5a7a':C3.c,arm?2:3);
 if(arm){ctx.fillStyle='#4a3a5a';for(let k=0;k<4;k++){ctx.save();ctx.translate(x,y);ctx.rotate(k*Math.PI/2+.4);ctx.fillRect(-4,-20,8,16);ctx.restore();}}
 glowDot(arm?'mg':'cy',x,y,arm?1.4:2.6+.6*Math.sin(G.t*.4),arm?.4:.8);if(!arm){ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(x,y,5,9,0,0,TAU);ctx.fill();}};
