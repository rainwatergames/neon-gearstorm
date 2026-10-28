// ---- main.js : game loop, entities, stage script
const VERSION='v1.3.0-dev';
const Q=new URLSearchParams(location.search);
const DBG=(Q.get('debug')||'').split(',');
const DBG_BOSS=DBG.includes('boss')&&!/boss[234]/.test(DBG.join(',')),DBG_MID=DBG.includes('mid'),DBG_INV=DBG.includes('inv'),DBG_S2=DBG.includes('stage2'),DBG_B2=DBG.includes('boss2'),QSTG=(Q.get('stage')||'').toLowerCase(),DBG_S3=DBG.includes('stage3')||QSTG==='3',DBG_B3=DBG.includes('boss3')||QSTG==='3boss',DBG_S4=DBG.includes('stage4')||QSTG==='4',DBG_B4=DBG.includes('boss4')||QSTG==='4boss'; // v1.3.0: ?stage=2|2boss|3|3boss|4|4boss test links // v0.3: ?debug=boss no longer silently grants invincibility (root cause of 'red bullets did no damage')
const cv=document.getElementById('c'),ctx=cv.getContext('2d',{alpha:false});
let W=360,H=640,SC=1,DPR=1;
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>v<a?a:v>b?b:v;
function resize(){const iw=innerWidth,ih=innerHeight;H=Math.round(clamp(ih/iw*W,560,800));SC=Math.min(iw/W,ih/H);DPR=Math.min(devicePixelRatio||1,2);cv.width=Math.round(W*SC*DPR);cv.height=Math.round(H*SC*DPR);cv.style.width=Math.round(W*SC)+'px';cv.style.height=Math.round(H*SC)+'px';
 // v1.1.2: bomb button sits just under the lowest top-HUD element (score/SHIELD/HULL bars, boss bar + label ≈ y74), in CSS px
 try{const r=cv.getBoundingClientRect();document.documentElement.style.setProperty('--hudb',Math.round(r.top+76*SC)+'px');}catch(_){}}
class Pool{constructor(n,f){this.a=[];for(let i=0;i<n;i++){const o=f();o.act=false;this.a.push(o);}this.i=0;}
 get(){const a=this.a,n=a.length;for(let k=0;k<n;k++){this.i=(this.i+1)%n;const o=a[this.i];if(!o.act){o.act=true;return o;}}return null;}
 clear(){for(const o of this.a)o.act=false;}count(){let c=0;for(const o of this.a)if(o.act)c++;return c;}}
const PB=new Pool(240,()=>({x:0,y:0,vx:0,vy:0,dmg:1,k:0,pierce:false,w:4,h:12,rot:0}));
const EB=new Pool(600,()=>({x:0,y:0,vx:0,vy:0,r:4,big:false}));
const PT=new Pool(520,()=>({x:0,y:0,vx:0,vy:0,life:0,max:1,s:1,k:0,c:null,rot:0,vr:0}));
const EN=new Pool(70,()=>({}));
const PU=new Pool(12,()=>({x:0,y:0,t:0,k:0,w:0,bomb:false}));
const CG=new Pool(120,()=>({x:0,y:0,vx:0,vy:0,v:1,t:0}));
const MD=new Pool(40,()=>({x:0,y:0,vx:0,vy:0,t:0}));
// ---------- meta progression (persisted)
const UPG=[ // v0.5: bigger, concrete steps + big-ticket weapons. Prices tuned so ~2-3 runs buys a Stage-2-capable ship.
 {k:'dmg',n:'DAMAGE',c:[90,200,380,650],e:l=>'Damage +'+(l*25)+'%'},
 {k:'fire',n:'FIRE RATE',c:[80,180,340,600],e:l=>'Fire rate +'+(l*25)+'%'},
 {k:'shield',n:'MAX SHIELD',c:[70,170,320,550],e:l=>'Shield bar '+(3+l)+' cells'},
 {k:'regen',n:'SHIELD REGEN',c:[90,220,420],e:l=>'Shield regen +'+(45*l)+'% · starts after '+(2.75-.25*l).toFixed(2)+'s'},
 {k:'hull',n:'HULL PLATING',c:[100,240,460],e:l=>'Hull '+(3+l)+' plates'},
 {k:'core',n:'★ OVERDRIVE CORE',c:[240,560],e:l=>['Weapon max LV3','LV4: 8-way spread · twin side lasers · 4 arcs','LV5: 11-way spread · tri-beam · 5 arcs'][l],big:1},
 {k:'pods',n:'★ OPTION PODS',c:[260,620],e:l=>['No pods','2 pods firing with you (+40% dps)','Pods lock-on + double fire (+80% dps)'][l],big:1},
 {k:'missile',n:'★ HOMING MISSILES',c:[320,700],e:l=>['No missiles','1 homing missile / 0.75s (6 dmg)','2 missiles / 0.5s (6 dmg each)'][l],big:1},
 {k:'wlvl',n:'START WEAPON LV',c:[110,280],e:l=>'Start at LV'+(1+l)},
 {k:'magnet',n:'MAGNET RANGE',c:[40,100,200],e:l=>'Cog pull '+(40+l*35)+'px'},
 {k:'bombcap',n:'BOMB CAPACITY',c:[80,200,400],e:l=>'Carry '+(2+l)+' bombs'},
 {k:'speed',n:'MOVE SPEED',c:[50,130,260],e:l=>'Move speed +'+(l*10)+'%'},
 {k:'drop',n:'POWER-UP DROPS',c:[90,220,450],e:l=>'Orb drops +'+(l*35)+'%'},
 {k:'life',n:'EXTRA LIFE',c:[250,600],e:l=>(2+l)+' lives'},
 {k:'cogs',n:'SALVAGE BONUS',c:[100,250,500],e:l=>'Salvage +'+(l*15)+'%'}];
const lvlCap=()=>3+UL('core');
// v0.5 Stage-2 difficulty: tougher enemies, faster + denser fire (fresh ships should struggle)
const S2D={hp:2.4,spd:1.2,extra:.3};
const BOMB_COST=25;
const META=(()=>{let m=null;try{m=JSON.parse(lsGet('ngs_meta')||'null');}catch(_){}m=m||{};return Object.assign({cogs:0,up:{},bombs:2,runs:0},m);})();
function metaSave(){lsSet('ngs_meta',JSON.stringify(META));}
const UL=k=>META.up[k]||0;
const MF={fr:1,dm:1,mag:40,sp:1};
function bombCap(){return 2+UL('bombcap');}

const WEAP=[{n:'SPREAD',c:COL.am,d:'am',l:'S'},{n:'LASER',c:COL.cy,d:'cy',l:'L'},{n:'TESLA',c:COL.li,d:'li',l:'T'}];
const G={state:'title',t:0,st:0,hold:false,score:0,hi:+(localStorage.getItem('ngs_hi')||0),lives:3,bombs:3,shield:3,maxSh:3,salv:0,chain:0,vig:0,pop:null,fall:[],weapon:0,lvl:1,shake:0,flash:0,bombT:0,boss:null,mid:null,evI:0,timers:[],banner:null,arcs:[],endT:0,kills:0,rip:[],spk:[],hull:3,hullM:3,noHit:0,regen:0,shDown:0,hullFl:0};
const P={x:180,y:560,inv:0,dead:0,fireT:0,zapT:0,bank:0};
// ---------- settings (persisted)
const SET={rf:lsGet('ngs_rf')==='1',sens:+(lsGet('ngs_sens')||1.3)};
// v0.5: bomb button side. Default LEFT (left thumb). One-time migration: older saved sides are discarded and reset to left.
(()=>{if(lsGet('ngs_bside_mig3')!=='1'){try{localStorage.removeItem('ngs_bomb_pos');localStorage.removeItem('ngs_bombpos');}catch(_){}lsSet('ngs_bside','L');lsSet('ngs_bside_mig','1');lsSet('ngs_bside_mig2','1');lsSet('ngs_bside_mig3','1');}if(lsGet('ngs_bside_mig2')!=='1'){try{localStorage.removeItem('ngs_bomb_pos');localStorage.removeItem('ngs_bombpos');}catch(_){}lsSet('ngs_bside','L');lsSet('ngs_bside_mig','1');lsSet('ngs_bside_mig2','1');}if(lsGet('ngs_bside_mig')!=='1'){try{localStorage.removeItem('ngs_bombside');localStorage.removeItem('ngs_bomb_side');}catch(_){}lsSet('ngs_bside','L');lsSet('ngs_bside_mig','1');}})();
SET.bside=lsGet('ngs_bside')==='R'?'R':'L';
// ---------- lighting FX: light bursts, color flash, strobe, beat pulse
const LT=new Pool(48,()=>({x:0,y:0,r:0,c:'am',life:0,max:1}));
const FX={pulse:0,beat:-1,strobe:0,strobeC:0,flashC:'255,255,255',streaks:[]};
function light(x,y,r,c,life){const l=LT.get();if(!l)return;l.x=x;l.y=y;l.r=r;l.c=c||'am';l.life=l.max=life||18;}
function flash(a,rgb){if(SET.rf)return;G.flash=Math.max(G.flash,a);FX.flashC=rgb||'255,255,255';}
function strobe(n){if(SET.rf)return;FX.strobe=Math.max(FX.strobe,n);}
function ramp(){if(G.stage>=2)return 1;return clamp((G.st-14*60)/(70*60),0,1);} // 0 for the first 14s -> 1 at ~84s
let eid=0;
const DEF={drone:{hp0:2,r:9,sc:100},swooper:{hp0:4,r:10,sc:150},turret:{hp0:16,r:14,sc:400},carrier:{hp0:14,r:18,sc:500},gunship:{hp0:420,r:44,sc:20000,big:true},part:{hp0:100,r:24,sc:0,big:true},boss:{hp0:900,r:44,sc:100000,big:true},boss2:{hp0:1700,r:22,sc:150000,big:true},block:{hp0:10,r:18,sc:200,big:true},
 swarm:{hp0:2,r:8,sc:120},spitter:{hp0:9,r:14,sc:400,med:1},egg:{hp0:4,r:11,sc:150},hive:{hp0:28,r:26,sc:1500,big:true,med:1},boss3:{hp0:520,r:22,sc:200000,big:true,xb:true,ns:true},
 wturret:{hp0:22,r:14,sc:500,big:true,med:1,ns:true},sentry:{hp0:5,r:11,sc:200},boss4:{hp0:650,r:24,sc:250000,big:true,xb:true,ns:true}};
const SD=()=>S2D;
function spawn(type,x,y,o){const e=EN.get();if(!e)return null;for(const k in e)if(k!=='act')delete e[k];Object.assign(e,{type,x,y,vx:0,vy:0,t:0,fl:0,rot:0,invT:0,id:++eid,big:false},DEF[type],o||{});e.hp=e.maxhp=e.hp0*(G.stage>=2&&type!=='block'&&type!=='part'&&type!=='boss2'&&!(DEF[type]&&DEF[type].ns)?SD().hp:1);return e;}
function later(f,fn){G.timers.push({at:G.t+f,fn});}
// ---------- enemy bullets
function aim(x,y){return Math.atan2(P.y-y,P.x-x);}
function eShot(x,y,a,spd,big,force){if(P.dead>0||G.bombT>0)return;const rr=ramp();if(!force&&!G.boss&&(G.st<14*60||Math.random()>.28+.72*rr))return;spd*=.7+.3*rr;if(G.stage>=2){const sd=SD();spd*=sd.spd;if(!force&&Math.random()<sd.extra)eShot(x,y,a+(Math.random()<.5?.13:-.13),spd/sd.spd,big,true);}const dx=P.x-x,dy=P.y-y;if(dx*dx+dy*dy<50*50)return;const b=EB.get();if(!b)return;b.x=x;b.y=y;b.vx=Math.cos(a)*spd;b.vy=Math.sin(a)*spd;b.big=!!big;b.r=big?6:4;}
function fan(x,y,a,n,sp,spd,big){for(let i=0;i<n;i++)eShot(x,y,a+(n>1?(i/(n-1)-.5)*sp:0),spd,big);}
function ring(x,y,n,off,spd,big){for(let i=0;i<n;i++)eShot(x,y,off+i/n*TAU,spd,big);}
function clearBullets(bonus){for(const b of EB.a)if(b.act){b.act=false;if(bonus){G.score+=10;part(0,b.x,b.y,rnd(-.5,.5),rnd(-1,0),8,.5,'cy');}}}
// ---------- particles
function part(k,x,y,vx,vy,life,s,c){const p=PT.get();if(!p)return null;p.k=k;p.x=x;p.y=y;p.vx=vx;p.vy=vy;p.life=p.max=life;p.s=s;p.c=c;p.rot=rnd(0,TAU);p.vr=rnd(-.2,.2);return p;}
function boom(x,y,s,c){c=c||'am';light(x,y,40+28*Math.min(s,5),c,16+5*Math.min(s,4));if(s>1.4)light(x,y,24*s,'w',10);const n=Math.min(32,Math.round(9*s));for(let i=0;i<n;i++){const a=rnd(0,TAU),v=rnd(.8,4.2)*Math.sqrt(s);part(0,x,y,Math.cos(a)*v,Math.sin(a)*v,rnd(16,34),rnd(.4,1)*(s>1.5?1.2:1),i%3?c:'w');}
 part(1,x,y,0,0,22,10*s,c);if(s>1.4)part(1,x,y,0,0,30,18*s,'mg');
 for(let i=0;i<Math.min(6,2+s);i++){const a=rnd(0,TAU),v=rnd(1,3);part(2,x,y,Math.cos(a)*v,Math.sin(a)*v-1,rnd(30,50),rnd(.8,1.4)*Math.min(2,s));}
 for(let i=0;i<Math.min(6,1+s*1.5);i++)part(3,x+rnd(-8,8)*s,y+rnd(-8,8)*s,rnd(-.4,.4),rnd(-.6,0),rnd(40,60),rnd(.8,1.5)*Math.min(2.5,s));
 G.shake=Math.max(G.shake,3*s);sfx.boom(s);}
function steam(x,y,dir){part(3,x,y,rnd(-.3,.3)+(dir||0),rnd(-1.2,-.6),rnd(30,45),rnd(.4,.7));}
// ---------- damage
function partsAlive(e){let n=0;if(e.parts)for(const q of e.parts)if(q.act&&q.p===e&&!q.gone)n++;return n;}
function hurt(e,d){if(e.invT>0||e.dying||e.lock)return;if(e.parts&&partsAlive(e)>0)d*=(e.type==='boss'||e.type==='boss2'||e.xb)?.12:.4;e.hp-=d;e.fl=3;e.hitT=90;if(e.hp<=0)kill(e);}
function cogs(x,y,n,v){for(let i=0;i<n;i++){const c=CG.get();if(!c)return;c.x=x+rnd(-8,8);c.y=y+rnd(-8,8);c.vx=rnd(-1.6,1.6);c.vy=rnd(-2.2,0);c.v=v||1;c.t=0;}}
function medal(x,y){const m=MD.get();if(!m)return;m.x=x;m.y=y;m.vx=rnd(-.6,.6);m.vy=-1.2;m.t=0;}
const CHAIN=[100,200,400,800,1500,3000,5000];
function killPart(e){e.act=false;e.gone=true;const pa=e.p,bb=pa.type==='boss'||pa.type==='boss2'||!!pa.xb;boom(e.x,e.y,bb?2.6:1.8,'am');later(8,()=>boom(e.x+rnd(-14,14),e.y+rnd(-10,10),1.4,'mg'));flash(.3,'255,200,120');
 G.fall.push({x:e.x,y:e.y,vx:rnd(-1,1)+Math.sign(e.ox||rnd(-1,1))*1.4,vy:-2.5,rot:0,vr:rnd(-.08,.08),spr:e.spr||'bGear',t:0});
 const sc=bb?15000:5000,sv=bb?40:12;G.score+=sc;cogs(e.x,e.y,bb?10:5,Math.ceil(sv/(bb?10:5)));for(let i=0;i<(bb?3:2);i++)medal(e.x+rnd(-20,20),e.y);
 G.banner={t:100,a:e.label+' DESTROYED',b:'',small:true,c:COL.am};clearBullets(true);if(bb)bossPhaseUp(pa);}
function bossPhaseUp(e){const ph=3-partsAlive(e);if(ph===e.phase)return;e.phase=ph;e.invT=50;G.shake=12;flash(.6,ph<3?'255,61,240':'255,36,80');strobe(24);sfx.phase();
 G.banner=ph<3?{t:60,a:'PHASE '+(ph+1),b:['','GEARS SLIPPING','PRESSURE CRITICAL'][ph]}:{t:40,a:'CORE EXPOSED',b:'BERSERK OVERCLOCK',warn:true};}
function kill(e){if(e.type==='part'){killPart(e);return;}if(e.type==='block'){e.act=false;G.score+=e.sc;G2.blocksBroken++;boom(e.x,e.y,e.glass?.8:1.2,e.glass?'cy':'am');for(let i=0;i<5;i++)part(2,e.x+rnd(-10,10),e.y+rnd(-10,10),rnd(-2,2),rnd(-3,0),30,rnd(.6,1.1));if(Math.random()<.5)cogs(e.x,e.y,1,1);if(Math.random()<.25)medal(e.x,e.y);return;}
 if(e.xb){e.dying=true;e.dT=0;clearBullets(true);G.score+=e.sc;cogs(e.x,e.y,15,10);G['boss'+(e.type==='boss3'?3:4)+'Kill']=true;return;}
 if(e.type==='boss2'){e.dying=true;e.dT=0;clearBullets(true);G.score+=e.sc;cogs(e.x,e.y,15,10);G.boss2Kill=true;return;}
 if(e.type==='boss'){e.dying=true;e.dT=0;clearBullets(true);G.score+=e.sc;cogs(e.x,e.y,15,10);G.bossKill=true;return;}
 e.act=false;G.score+=e.sc;G.kills++;if(e.big){flash(.35,'255,200,120');}boom(e.x,e.y,e.big?3.5:(e.r>12?1.6:1),e.type==='carrier'?'li':(e.type==='swooper'?'mg':'am'));
 if(e.type==='carrier')dropOrb(e.x,e.y,0);
 const cv0={drone:Math.random()<.4?1:0,swooper:Math.random()<.6?1:0,turret:3,carrier:4,gunship:12,swarm:Math.random()<.3?1:0,egg:1,spitter:2,hive:5,wturret:3,sentry:1}[e.type]||0;if(e.med)medal(e.x,e.y);if(e.type==='hive')dropOrb(e.x,e.y,0);if(cv0)cogs(e.x,e.y,cv0,e.type==='gunship'?2:1);
 if(e.type==='turret'||e.type==='carrier'||(e.type==='swooper'&&Math.random()<.25))medal(e.x,e.y);
 if(!e.big&&e.type!=='carrier'&&Math.random()<.012*(1+.35*UL('drop')))dropOrb(e.x,e.y,0);
 if((e.type==='carrier'||e.type==='turret')&&Math.random()<.07)dropBomb(e.x,e.y);
 {const st=G.stage||1,rc=e.type==='carrier'?.3*st:e.type==='gunship'?1:e.type==='turret'?.06*st:e.big?.08*st:.008*st;if(Math.random()<rc)dropRepair(e.x+8,e.y);}
 if(e.type==='gunship'){G.hold=false;G.mid=null;dropOrb(e.x-20,e.y,0);dropOrb(e.x+20,e.y,1);for(let i=0;i<5;i++)later(i*7,()=>boom(e.x+rnd(-50,50),e.y+rnd(-30,30),1.5));}}
function dropBomb(x,y){const u=PU.get();if(!u)return;u.x=x;u.y=y;u.t=0;u.k=0;u.bomb=true;u.rep=false;u.w=0;}
function dropOrb(x,y,k){const u=PU.get();if(!u)return;u.x=x;u.y=y;u.t=0;u.k=k;u.bomb=false;u.rep=false;u.w=(G.weapon+1+Math.floor(Math.random()*2))%3;}
// ---------- spawners
function swoop(dir,shoot){const x0=dir>0?50:310;for(let i=0;i<6;i++)later(i*10,()=>spawn('swooper',x0,-16,{x0,dir,shootAt:((shoot&&ramp()>.3)||i%2)?40+i*4:-1}));}
function droneCol(x,n){for(let i=0;i<n;i++)later(i*14,()=>spawn('drone',x,-14,{vy:2.4,x0:x,wob:i*.6,shootAt:i===n-1||i===2?50:-1}));}
function droneV(x){[[0,0],[-26,-22],[26,-22],[-52,-44],[52,-44]].forEach(([dx,dy],i)=>spawn('drone',x+dx,-14+dy,{vy:1.9,x0:x+dx,wob:0,shootAt:i===1||i===2?70:-1}));}
function popcorn(n){for(let i=0;i<n;i++)later(i*9,()=>spawn('drone',rnd(30,W-30),-14,{vy:3,x0:-1,home:true,shootAt:i%4===0?40:-1}));}
function turret(x){spawn('turret',x,-20,{cd:60+Math.floor(rnd(0,40))});}
function carrier(x){spawn('carrier',x,-20,{x0:x});}
function midboss(){G.hold=true;G.banner={t:0,a:'MID-BOSS',b:'IRONCLAD GUNSHIP'};G.mid=spawn('gunship',W/2,-60,{invT:60});const m=G.mid;m.parts=[mkPart(m,-58,6,22,70,'LEFT FAN TURRET','gGear'),mkPart(m,58,6,22,70,'RIGHT FAN TURRET','gGear')];}
function mkPart(pa,ox,oy,r,hp,label,spr){return spawn('part',pa.x+ox,pa.y+oy,{p:pa,ox,oy,r,hp0:hp,label,spr,invT:pa.invT,hitT:0});}
function warning(){strobe(90);G.banner={t:0,a:'⚠ WARNING ⚠',b:'CLOCKWORK COLOSSUS APPROACHING',warn:true};sfx.warn();}
function spawnBoss(){G.hold=true;const b=spawn('boss',W/2,-110,{invT:150,phase:0,hA:0,g:0});G.boss=b;b.parts=[b.pL=mkPart(b,-80,4,26,240,'LEFT GEAR CANNON','bGear'),b.pR=mkPart(b,80,4,26,240,'RIGHT GEAR CANNON','bGear'),b.pM=mkPart(b,0,-78,42,280,'SMOKESTACK MORTARS','debris')];musicStart(1);}
const EV=[[1,()=>{G.banner={t:0,a:'STAGE 1',b:'THE BRASS NEBULA'};}],
[3,()=>droneCol(90,5)],[4.5,()=>droneCol(270,5)],[7,()=>swoop(-1)],[9,()=>swoop(1)],[11,()=>carrier(W/2)],[13,()=>droneV(W/2)],
[15,()=>turret(70)],[15.5,()=>turret(290)],[18,()=>swoop(-1,1)],[19.5,()=>swoop(1,1)],[22,()=>popcorn(10)],[25,()=>turret(180)],[26,()=>carrier(80)],
[28,()=>droneCol(60,6)],[29,()=>droneCol(300,6)],[32,()=>swoop(1)],[33,()=>swoop(-1)],[34,()=>turret(110)],[34.5,()=>turret(250)],
[38,()=>popcorn(14)],[40,()=>carrier(280)],[42,()=>droneV(120)],[43,()=>droneV(240)],
[47,()=>midboss()],
[49,()=>carrier(W/2)],[51,()=>swoop(-1,1)],[52,()=>swoop(1,1)],[54,()=>{turret(60);turret(180);turret(300);}],
[58,()=>popcorn(16)],[60,()=>droneCol(90,7)],[60.5,()=>droneCol(270,7)],[63,()=>carrier(100)],[64,()=>swoop(1)],[65,()=>swoop(-1)],
[68,()=>turret(120)],[68.5,()=>turret(240)],[70,()=>droneV(W/2)],[73,()=>popcorn(20)],[76,()=>swoop(-1,1)],[76.5,()=>swoop(1,1)],[78,()=>carrier(260)],
[80,()=>{turret(80);turret(280);}],[83,()=>droneCol(180,8)],[86,()=>{droneV(90);droneV(270);}],[89,()=>popcorn(12)],
[93,()=>warning()],[97,()=>spawnBoss()]];
// ---------- enemy AI
function updEnemy(e){e.t++;if(e.fl>0)e.fl--;if(e.invT>0)e.invT--;const t=e.t;
 switch(e.type){
 case 'drone':e.y+=e.vy;if(e.home){e.vx=clamp(e.vx+Math.sign(P.x-e.x)*.04*(.4+.6*ramp()),-1.3,1.3);e.x+=e.vx;}else e.x=e.x0+Math.sin(t*.05+e.wob)*10;if(t===e.shootAt)eShot(e.x,e.y,aim(e.x,e.y),2.6);break;
 case 'swooper':e.y+=2.3;e.x=e.x0+e.dir*140*Math.sin(t*.021);e.rot+=.15*e.dir;if(t===e.shootAt)eShot(e.x,e.y,aim(e.x,e.y),2.7);break;
 case 'turret':e.y+=.9;e.rot=aim(e.x,e.y)+Math.PI/2;if(t%9===0)steam(e.x-11,e.y-13,-.2);if(e.y>20&&e.y<H*.72){e.cd--;if(e.cd<=0){e.cd=110+Math.round(50*(1-ramp()));for(let i=0;i<(ramp()<.4?2:3);i++)later(i*7,()=>{if(e.act)eShot(e.x,e.y,aim(e.x,e.y),2.5);});}}break;
 case 'carrier':e.y+=.6;e.x=e.x0+Math.sin(t*.02)*30;if(t%12===0)steam(e.x+26,e.y,.6);break;
 case 'gunship':if(e.y<120)e.y+=1.3;else{e.x=W/2+Math.sin(t*.012)*90;
   if(t%64===0)fan(e.x,e.y+20,aim(e.x,e.y+20),5,.8,2.8);
   if(t%110===55)ring(e.x,e.y,14,t*.01,2,true);
   const fl=e.parts[0].act,fr=e.parts[1].act;if(fl&&t%90===0)fan(e.x-58,e.y+6,aim(e.x-58,e.y+6),3,.4,2.6);if(fr&&t%90===45)fan(e.x+58,e.y+6,aim(e.x+58,e.y+6),3,.4,2.6);
   if(e.hp<e.maxhp*.5&&t%10===0){const a=t*.07;if(fl)eShot(e.x-58,e.y+6,a,2.2);if(fr)eShot(e.x+58,e.y+6,-a+Math.PI,2.2);if(!fl&&!fr&&t%30===0)ring(e.x,e.y,10,a,2.2);}}
   if(t%6===0){steam(e.x-18,e.y-50);steam(e.x+18,e.y-50);}
   if(t>60*40){e.y-=3;if(e.y<-120){e.act=false;G.hold=false;G.mid=null;}}break;
 case 'boss':updBoss(e);break;
 case 'boss2':updBoss2(e);break;
 case 'block':e.y=s2y(e.d);if(e.y>H+40)e.act=false;break;
 default:if(XU[e.type])XU[e.type](e);break;
 case 'part':{const pa=e.p;if(!pa.act||pa.dying){e.act=false;if(pa.dying||pa.hp<=0)boom(e.x,e.y,1.6,'mg');break;}e.x=pa.x+e.ox;e.y=pa.y+e.oy;if(pa.invT>e.invT)e.invT=pa.invT;if(e.hitT>0)e.hitT--;
  const f=e.hp/e.maxhp;if(f<.6&&t%(f<.3?5:10)===0)part(0,e.x+rnd(-e.r,e.r)*.6,e.y+rnd(-e.r,e.r)*.6,rnd(-2,2),rnd(-2,1),rnd(10,18),.6,Math.random()<.5?'am':'w');if(f<.5&&t%(f<.25?6:12)===0)part(3,e.x+rnd(-8,8),e.y,rnd(-.3,.3),rnd(-1,-.4),rnd(30,45),rnd(.5,.9));break;}}
 if(!e.big&&(e.y>H+40||e.x<-80||e.x>W+80)&&t>30)e.act=false;}
function updBoss(e){const t=e.t;if(e.dying){e.dT++;if(e.dT===1){strobe(150);sfx.bossDie();}if(e.dT%5===0)boom(e.x+rnd(-90,90),e.y+rnd(-60,60),rnd(1,2.2),['am','mg','cy'][e.dT%3]);G.shake=Math.max(G.shake,6);
  if(e.dT===150){boom(e.x,e.y,5,'cy');boom(e.x,e.y,4,'mg');flash(1,'255,255,255');sfx.bossDie();e.act=false;G.boss=null;later(120,DBG.includes('s1only')?stageClear:toStage2);}return;}
 if(e.y<150){e.y+=1;e.invT=Math.max(e.invT,2);return;}
 e.r=e.phase<3?26:44;
 const ph=e.phase,L=e.pL.act,Rt=e.pR.act,M=e.pM.act;
 e.g+=.02+ph*.02;if(M&&t%5===0)for(const sx of[-34,0,34])steam(e.x+sx,e.y-95);if(!M&&t%4===0)part(3,e.x+rnd(-30,30),e.y-90,rnd(-.4,.4),rnd(-1.4,-.8),rnd(40,60),rnd(.8,1.3));
 if(e.invT>0)return;
 const sp=1+ph*.12;e.x=W/2+Math.sin(t*(.01+ph*.004))*(40+ph*18);if(ph===3)e.y=150+Math.sin(t*.03)*18;
 // gear cannons: spiral streams + aimed fans later
 if(t%8===0){const a=t*.045;if(L)eShot(e.x-80,e.y+5,a,2*sp);if(Rt)eShot(e.x+80,e.y+5,Math.PI-a,2*sp);}
 if(ph>=1&&t%90===45){if(L)fan(e.x-80,e.y+5,aim(e.x-80,e.y),4,.5,2.8);if(Rt)fan(e.x+80,e.y+5,aim(e.x+80,e.y),4,.5,2.8);}
 // smokestack mortars: slow big shells lobbed in a spread
 if(M&&t%110===20){for(let i=0;i<5;i++)eShot(e.x,e.y-70,Math.PI/2+(i-2)*.32,1.7,true);}
 // clock core
 if(ph<3){if(t%100===0)fan(e.x,e.y+40,aim(e.x,e.y+40),3,.35,2.6,true);
  if(ph>=1){e.hA+=.022;if(t%(ph>=2?4:6)===0){eShot(e.x,e.y,e.hA,2.5);eShot(e.x,e.y,e.hA+Math.PI,2.5);}}
  if(ph>=2&&t%120===60)ring(e.x,e.y,16,t*.03,1.8,true);}
 else{e.hA+=.045;if(t%5===0){eShot(e.x,e.y,e.hA,2.8);eShot(e.x,e.y,e.hA+Math.PI*2/3,2.8);eShot(e.x,e.y,e.hA+Math.PI*4/3,2.8);}
  if(t%50===0)ring(e.x,e.y,20,(t/50)%2?TAU/40:0,2.1,true);if(t%80===40)fan(e.x,e.y+30,aim(e.x,e.y+30),7,.9,3.1);}}
// ---------- player weapons
function pb(x,y,vx,vy,dmg,k,pierce,w,h,rot){const b=PB.get();if(!b)return;b.x=x;b.y=y;b.vx=vx;b.vy=vy;b.dmg=dmg;b.k=k;b.pierce=pierce;b.w=w;b.h=h;b.rot=rot;}
function fire(){const L=G.lvl,w=G.weapon,D=MF.dm;podFire(D);if(P.fireT>0)return;G.muz=4;
 if(w===0){P.fireT+=6*MF.fr;const n=[3,5,6,8,11][L-1],sp=[.24,.38,.46,.62,.86][L-1];for(let i=0;i<n;i++){const a=-Math.PI/2+(i/(n-1)-.5)*sp;pb(P.x,P.y-12,Math.cos(a)*11,Math.sin(a)*11,D,0,false,5,12,a+Math.PI/2);}}
 else if(w===1){P.fireT+=3*MF.fr;pb(P.x,P.y-18,0,-16,[.9,1.25,1.7,1.7,1.8][L-1]*D,1,true,[5,9,14,14,16][L-1],30,0);if(L>=4){const o=L>=5?20:15,d=(L>=5?1.1:.8)*D;pb(P.x-o,P.y-10,0,-16,d,1,true,8,30,0);pb(P.x+o,P.y-10,0,-16,d,1,true,8,30,0);}}
 else{P.fireT+=6*MF.fr;pb(P.x-5,P.y-10,0,-12,D,2,false,4,10,0);pb(P.x+5,P.y-10,0,-12,D,2,false,4,10,0);
  const rg=[190,230,270,300,330][L-1],c=[];for(const e of EN.a){if(!e.act||e.y<-10||e.dying)continue;const dx=e.x-P.x,dy=e.y-P.y,d=dx*dx+dy*dy;if(d<rg*rg)c.push([d,e]);}
  c.sort((a,b)=>a[0]-b[0]);G.arcs.length=0;for(let i=0;i<Math.min(L,c.length);i++){const e=c[i][1];G.arcs.push({x:e.x,y:e.y});hurt(e,[2.2,2.4,2.8,3,3.3][L-1]*D);}if(c.length&&G.t%12===0)sfx.zap();}
 sfx.shot();}
// v0.5 option pods + homing missiles
function nearestEn(x,y,maxD){let best=null,bd=maxD*maxD;for(const e of EN.a){if(!e.act||e.dying||e.y<0)continue;const dx=e.x-x,dy=e.y-y,d=(dx*dx+dy*dy)*(e.type==='block'?2.5:1);if(d<bd){bd=d;best=e;}}return best;}
function podFire(D){const pl=UL('pods'),ml=UL('missile');if(P.dead>0)return;
 if(pl){P.podT=(P.podT||0)-1;if(P.podT<=0){P.podT=8*MF.fr;for(const s of[-1,1]){const px=P.x+s*28,py=P.y+8;let a=-Math.PI/2;if(pl>=2){const e=nearestEn(px,py,420);if(e)a=clamp(Math.atan2(e.y-py,e.x-px),-Math.PI/2-.5,-Math.PI/2+.5);}
   pb(px,py-6,Math.cos(a)*13,Math.sin(a)*13,.62*D,4,false,6,12,a+Math.PI/2);if(pl>=2)pb(px+s*5,py-2,Math.cos(a)*13,Math.sin(a)*13,.62*D,4,false,6,12,a+Math.PI/2);}}}
 if(ml){P.misT=(P.misT||0)-1;if(P.misT<=0){P.misT=(ml>=2?30:45)*MF.fr;const n=ml>=2?2:1;for(let i=0;i<n;i++){const s=n===1?(G.t%90<45?-1:1):(i?1:-1);pb(P.x+s*12,P.y,s*3.5,-2.5,6*D,3,false,10,10,0);}if(AU.c)tone('sawtooth',200,700,.12,.05,null,0,2400);}}}
function bomb(){if(G.state!=='play'||G.bombs<=0||P.dead>0||G.bombT>0)return;G.bombs--;G.bombT=90;P.inv=Math.max(P.inv,40);clearBullets(true);G.shake=16;flash(.8,'120,250,255');strobe(12);light(P.x,P.y,260,'cy',40);sfx.bomb();
 for(const e of EN.a)if(e.act&&e.y>-20)hurt(e,e.big?50:40);updHud();}
// v1.0 damage model: SHIELD (regenerates after SH_DELAY frames unhit) absorbs hits first, then HULL (no regen; REPAIR pickups). Hull 0 = lose a life.
const SH_DELAY=165;const shDelay=()=>SH_DELAY-15*UL('regen');const shRate=()=>(1/80)*(1+.45*UL('regen'));
function playerHit(){if(P.inv>0||P.dead>0||DBG_INV||G.state!=='play')return false;G.hits=(G.hits||0)+1;G.noHit=0;if(DBG.includes('god')){P.inv=30;G.vig=1;return false;}
 for(const b of EB.a)if(b.act){const dx=b.x-P.x,dy=b.y-P.y;if(dx*dx+dy*dy<36*36)b.act=false;}
 if(G.shield>=.5){G.shield=Math.max(0,G.shield-1);G.lastHit='shield';P.inv=30;G.shake=Math.max(G.shake,6);sfx.hit();G.rip.push({x:P.x,y:P.y,t:0});G.pop={t:0,x:P.x,y:P.y-26,s:'-SHIELD',c:COL.cy};
  part(1,P.x,P.y,0,0,14,10,'cy');if(G.shield<.5){G.shield=0;G.shDown=100;}if(!SET.rf)G.flash=Math.max(G.flash,.25),FX.flashC='80,220,255';return true;}
 G.hull--;G.lastHit='hull';G.vig=1;G.hullFl=40;G.shake=Math.max(G.shake,18);sfx.crack();G.flash=Math.max(G.flash,SET.rf?.35:.85);FX.flashC='255,40,30';
 for(let i=0;i<18;i++){const a=Math.random()*TAU,v=2+Math.random()*5;G.spk.push({x:P.x,y:P.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,t:0});}
 if(G.hull>0){P.inv=50;G.pop={t:0,x:P.x,y:P.y-26,s:'-HULL',c:'#ff5a2a'};return true;}
 G.hull=0;boom(P.x,P.y,2.5,'cy');sfx.die();G.pop={t:0,x:P.x,y:P.y-20,s:'HULL BREACH',c:'#ff5a2a'};G.lives--;G.lvl=Math.max(G.stage>=3?3:1,G.lvl-1);P.dead=80;clearBullets(false);
 if(G.lives<=0){later(90,gameOver);}updHud();return true;}
function shieldTick(){if(G.state!=='play')return;G.noHit++;if(P.dead<=0&&G.noHit>shDelay()&&G.shield<G.maxSh){G.shield=Math.min(G.maxSh,G.shield+shRate());G.regen=1;if(G.shield>=G.maxSh)G.pop2={t:0,x:P.x,y:P.y-30,s:'SHIELD FULL'};}else G.regen=0;
 if(G.shDown>0)G.shDown--;if(G.hullFl>0)G.hullFl--;for(const r of G.rip)r.t++;G.rip=G.rip.filter(r=>r.t<30);for(const k of G.spk){k.x+=k.vx;k.y+=k.vy;k.vx*=.9;k.vy*=.9;k.t++;}G.spk=G.spk.filter(k=>k.t<22);}
function drawHitFX(){ctx.globalCompositeOperation='lighter';for(const r of G.rip){const f=r.t/30;ctx.strokeStyle='rgba(90,220,255,'+(1-f).toFixed(2)+')';ctx.lineWidth=4*(1-f)+1;ctx.beginPath();ctx.arc(r.x,r.y,22+f*46,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(r.x,r.y,14+f*30,0,TAU);ctx.stroke();}
 ctx.lineCap='round';for(const k of G.spk){const f=1-k.t/22;ctx.strokeStyle='rgba(255,'+(90+Math.round(120*f))+',40,'+f.toFixed(2)+')';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(k.x,k.y);ctx.lineTo(k.x-k.vx*3,k.y-k.vy*3);ctx.stroke();}ctx.lineCap='butt';ctx.globalCompositeOperation='source-over';}
function dropRepair(x,y){const u=PU.get();if(!u)return;u.x=x;u.y=y;u.t=0;u.k=0;u.bomb=false;u.rep=true;u.w=0;}
function drawExtraShots(){ctx.globalCompositeOperation='lighter';
 for(const b of PB.a){if(!b.act)continue;
  if(b.k===3){ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.rot||0);ctx.fillStyle='rgba(255,60,200,.35)';ctx.beginPath();ctx.arc(0,0,9,0,TAU);ctx.fill();ctx.fillStyle='#ffd0f4';ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(4,5);ctx.lineTo(-4,5);ctx.closePath();ctx.fill();ctx.restore();}
  else if(b.k===4){ctx.fillStyle='rgba(120,255,120,.35)';ctx.beginPath();ctx.arc(b.x,b.y,6,0,TAU);ctx.fill();ctx.fillStyle='#eaffd0';ctx.fillRect(b.x-1.5,b.y-6,3,12);}
  else if(b.k===0&&G.lvl>=4){ctx.fillStyle=G.lvl>=5?'rgba(255,80,200,.35)':'rgba(255,150,60,.3)';ctx.beginPath();ctx.arc(b.x,b.y,G.lvl>=5?7:5.5,0,TAU);ctx.fill();}}
 ctx.globalCompositeOperation='source-over';}
function drawShipExtras(){const L=G.lvl;ctx.globalCompositeOperation='lighter';
 // muzzle flash grows with weapon level + upgrades
 if(G.muz>0){G.muz--;const r=7+L*3+UL('dmg')*2+UL('fire')*1.5,c=[COL.am,COL.cy,COL.li][G.weapon];const g=ctx.createRadialGradient(P.x,P.y-16,0,P.x,P.y-16,r);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.35,c);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.globalAlpha=.55+.1*G.muz;ctx.beginPath();ctx.arc(P.x,P.y-16,r,0,TAU);ctx.fill();ctx.globalAlpha=1;}
 // option pods
 const pl=UL('pods');if(pl){for(const s of[-1,1]){const x=P.x+s*28,y=P.y+8+Math.sin(G.t*.12+s)*2;ctx.fillStyle='rgba(120,255,140,.3)';ctx.beginPath();ctx.arc(x,y,11,0,TAU);ctx.fill();ctx.fillStyle='#163b1c';ctx.strokeStyle=COL.li;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,6.5,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle='#eaffd0';ctx.beginPath();ctx.arc(x,y,2.4+(pl>=2?1:0),0,TAU);ctx.fill();}}
 // missile racks
 if(UL('missile')){ctx.fillStyle=COL.mg;for(const s of[-1,1])ctx.fillRect(P.x+s*12-2,P.y+2,4,8);}
 // shield bubble: one arc segment per pip, obvious at a glance
 if(G.shield>0&&P.dead<=0){const n=G.maxSh,f=G.shield/n,r=24+Math.max(0,n-3)*1.5,al=.25+.55*f;ctx.lineWidth=2+2*f;ctx.strokeStyle='rgba(90,240,255,'+al.toFixed(2)+')';ctx.beginPath();ctx.arc(P.x,P.y,r,-Math.PI/2,-Math.PI/2+TAU*f);ctx.stroke();
  ctx.fillStyle='rgba(46,249,255,'+(.04+.09*f+(G.regen?.04*Math.sin(G.t*.4):0)).toFixed(3)+')';ctx.beginPath();ctx.arc(P.x,P.y,r,0,TAU);ctx.fill();}
 ctx.globalCompositeOperation='source-over';}
// ---------- input
const keys={};let drag=null;
addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','KeyX','KeyB'].includes(e.code)){bomb();e.preventDefault();}if(e.code==='KeyP'||e.code==='Escape')togglePause();if(e.code==='KeyM')toggleMute();if(e.code==='Enter'&&G.state==='title')startGame();if(e.code.startsWith('Arrow'))e.preventDefault();});
addEventListener('keyup',e=>{keys[e.code]=false;});
const PTRS=new Set();
addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('button,.ov'))return;auInit();PTRS.add(e.pointerId);if(!drag)drag={id:e.pointerId,x:e.clientX,y:e.clientY};});
addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const k=SET.sens*MF.sp*(PTRS.size>=2?.45:1),dx=(e.clientX-drag.x)/SC*k,dy=(e.clientY-drag.y)/SC*k;drag.x=e.clientX;drag.y=e.clientY;
 if(G.state==='play'&&P.dead<=0){P.x=clamp(P.x+dx,10,W-10);P.y=clamp(P.y+dy,20,H-16);P.bank+=dx*.15;}});
const endDrag=e=>{PTRS.delete(e.pointerId);if(drag&&drag.id===e.pointerId)drag=null;};addEventListener('pointerup',endDrag);addEventListener('pointercancel',endDrag);
// ---------- UI
const $=id=>document.getElementById(id);
function show(id){for(const o of['title','pause','over','clear','settings','photo','hangar'])$(o).classList.toggle('hide',o!==id);$('hud').classList.toggle('hide',!(G.state==='play'||G.state==='pause'));}
function updHud(){const b=$('bBomb');b.textContent='BOMB ×'+G.bombs;b.classList.toggle('empty',G.bombs<=0);b.classList.toggle('ready',G.bombs>0); // v1.1.5: pulsing glow ring when bombs are available
 document.body.classList.toggle('rm',!!SET.rf);}
function bombPing(){const b=$('bBomb');b.classList.remove('ping');void b.offsetWidth;b.classList.add('ping');clearTimeout(bombPing.t);bombPing.t=setTimeout(()=>b.classList.remove('ping'),750);}
function togglePause(){if(G.state==='play'){G.state='pause';show('pause');if(AU.c)AU.c.suspend();}else if(G.state==='pause'){G.state='play';show(null);if(AU.c)AU.c.resume();}}
function toggleMute(){setMute(!AU.muted);$('bMute').textContent=AU.muted?'♪̸':'♪';try{localStorage.setItem('ngs_mute',AU.muted?1:0);}catch(_){}}
function applyMeta(){MF.fr=1/(1+.25*UL('fire'));MF.dm=1+.25*UL('dmg');MF.mag=40+35*UL('magnet');MF.sp=1+.1*UL('speed');}
function startGame(){auInit();applyMeta();const sb=Math.min(META.bombs,bombCap());META.bombs-=sb;metaSave();Object.assign(G,{state:'play',st:0,hold:false,score:0,lives:2+UL('life'),bombs:sb,weapon:0,lvl:1+UL('wlvl'),shield:3+UL('shield'),maxSh:3+UL('shield'),hull:3+UL('hull'),hullM:3+UL('hull'),noHit:0,regen:0,shDown:0,rip:[],spk:[],hullFl:0,salv:0,chain:0,vig:0,pop:null,pop2:null,fall:[],hits:0,bossKill:false,boss2Kill:false,boss3Kill:false,boss4Kill:false,ev3Delay:0,ev4Delay:0,medals:0,bestChain:0,stage:1,ev2Delay:0,banked:false,shake:0,flash:0,bombT:0,boss:null,mid:null,evI:0,timers:[],banner:null,arcs:[],kills:0});
 Object.assign(P,{x:W/2,y:H-90,inv:120,dead:0,fireT:0,bank:0});PB.clear();EB.clear();EN.clear();PU.clear();LT.clear();CG.clear();MD.clear();FX.strobe=0;
 if(DBG_BOSS||DBG_MID){const tt=DBG_BOSS?92:46;G.st=tt*60;while(G.evI<EV.length&&EV[G.evI][0]<tt)G.evI++;G.lvl=Math.max(G.lvl,3);G.weapon=DBG.includes('laser')?1:DBG.includes('tesla')?2:0;}
 if(QSTG==='2'||QSTG==='2boss'){G.stage=2;s2reset(QSTG==='2boss'?BOSS2D-30:0);G.lvl=Math.max(G.lvl,3);G.st=100*60;}
 if(DBG_S2||DBG_B2){G.stage=2;s2reset(DBG_B2?BOSS2D-30:0);G.lvl=Math.max(G.lvl,3);G.weapon=DBG.includes('laser')?1:DBG.includes('tesla')?2:0;}
 if(DBG_S3||DBG_B3){G.stage=3;s3reset(DBG_B3?BOSS3D-30:0);G.lvl=Math.max(G.lvl,4);G.st=100*60;}
 if(DBG_S4||DBG_B4){G.stage=4;s4reset(DBG_B4?BOSS4D-30:0);G.lvl=Math.max(G.lvl,4);G.st=100*60;}
 if(DBG.includes('wmax'))G.lvl=lvlCap();
 musicStart(G.stage===4?(DBG_B4?8:7):G.stage===3?(DBG_B3?6:5):G.stage===2?(DBG_B2||QSTG==='2boss'?3:2):0);show(null);updHud();}
let setFrom='title',hFrom='title';
function openHangar(from){hFrom=from||'title';G.state='hangar';renderHangar();show('hangar');}
function renderHangar(){$('hCogs').textContent='⚙ '+META.cogs;let h='';
 for(const u of UPG){const l=UL(u.k),mx=u.c.length,cost=l<mx?u.c[l]:0,ok=l<mx&&META.cogs>=cost;
  h+='<button class="up'+(u.big?' bigt':'')+(l>=mx?' max':ok?' can':'')+'" data-k="'+u.k+'"><span class="un">'+u.n+'<i>'+'◆'.repeat(l)+'◇'.repeat(mx-l)+'</i></span><span class="ue">'+u.e(l)+(l<mx?' → <b>'+u.e(l+1)+'</b>':'')+'</span><span class="uc">'+(l>=mx?'MAX':'⚙ '+cost)+'</span></button>';}
 const bc=bombCap(),okb=META.bombs<bc&&META.cogs>=BOMB_COST;
 h+='<button class="up bombrow'+(okb?' can':'')+'" data-k="bomb"><span class="un">BOMB STOCK<i>'+'●'.repeat(META.bombs)+'○'.repeat(Math.max(0,bc-META.bombs))+'</i></span><span class="ue">Consumable, carried into next run ('+META.bombs+'/'+bc+')</span><span class="uc">'+(META.bombs>=bc?'FULL':'⚙ '+BOMB_COST)+'</span></button>';
 $('hList').innerHTML=h;}
function buy(k){if(k==='bomb'){if(META.bombs<bombCap()&&META.cogs>=BOMB_COST){META.cogs-=BOMB_COST;META.bombs++;metaSave();sfx.power();}else sfx.deny();renderHangar();return;}
 const u=UPG.find(x=>x.k===k);if(!u)return;const l=UL(k);if(l<u.c.length&&META.cogs>=u.c[l]){META.cogs-=u.c[l];META.up[k]=l+1;metaSave();sfx.power();}else sfx.deny();renderHangar();}
function rfLabel(){for(const id of['sRF','pRF']){$(id).textContent='REDUCE FLASHING: '+(SET.rf?'ON':'OFF');$(id).classList.toggle('on',SET.rf);}}
function wireSettings(){const m=$('sMus'),f=$('sSfx'),se=$('sSens');m.value=AU.musV;f.value=AU.sfxV;se.value=SET.sens;$('sSensV').textContent=SET.sens.toFixed(1);
 m.oninput=()=>setVol('musV',+m.value);f.oninput=()=>{setVol('sfxV',+f.value);auInit();sfx.power();};se.oninput=()=>{SET.sens=+se.value;lsSet('ngs_sens',SET.sens);$('sSensV').textContent=SET.sens.toFixed(1);};
 const bsl=()=>{$('sBS').textContent='BOMB BUTTON: '+(SET.bside==='R'?'RIGHT':'LEFT');$('bBomb').classList.toggle('rside',SET.bside==='R');};$('sBS').onclick=()=>{SET.bside=SET.bside==='R'?'L':'R';lsSet('ngs_bside',SET.bside);bsl();};bsl();
 const tg=()=>{SET.rf=!SET.rf;lsSet('ngs_rf',SET.rf?1:0);if(SET.rf){G.flash=0;FX.strobe=0;}rfLabel();document.body.classList.toggle('rm',SET.rf);};$('sRF').onclick=tg;$('pRF').onclick=tg;rfLabel();
 const open=from=>{setFrom=from;show('settings');};$('bSet1').onclick=()=>open('title');$('bSet2').onclick=()=>open('pause');$('bSetBack').onclick=()=>show(setFrom);
 $('bPhotoOk').onclick=()=>{lsSet('ngs_photo',1);show('title');};}
function hiSave(){if(G.score>G.hi){G.hi=G.score;try{localStorage.setItem('ngs_hi',G.hi);}catch(_){}}}
function bankRun(){if(G.banked)return null;G.banked=true;const dist=Math.floor(G.st/60/3),kb=Math.floor((G.kills||0)/5),bk=(G.bossKill?150:0)+(G.boss2Kill?200:0)+(G.boss3Kill?250:0)+(G.boss4Kill?300:0),mul=1+.15*UL('cogs');
 const tot=Math.round((G.salv+dist+kb+bk)*mul);META.cogs+=tot;META.runs++;META.bombs=Math.min(bombCap(),META.bombs+G.bombs);metaSave();
 return {pick:G.salv,dist,kb,bk,mul,tot};}
function salvHTML(r){if(!r)return '';return '<div class="salv"><div class="lbl">SALVAGE EARNED</div><div class="sbig">⚙ +'+r.tot+'</div><div class="sdet">pickups '+r.pick+' · distance '+r.dist+' · kills '+r.kb+(r.bk?' · boss '+r.bk:'')+(r.mul>1?' · ×'+r.mul.toFixed(2):'')+'</div><div class="lbl">TOTAL ⚙ '+META.cogs+'</div></div>';}
function gameOver(){if(G.state!=='play')return;G.state='over';hiSave();musicStop();$('oSalv').innerHTML=salvHTML(bankRun());$('oScore').textContent=G.score.toLocaleString();$('oHi').textContent=G.hi.toLocaleString();show('over');}
function stageClear(){if(G.state!=='play')return;const fin=G.stage>=4;const h2=document.querySelector('#clear h2');if(h2){h2.textContent=fin?'ALL STAGES CLEAR!':'STAGE CLEAR';h2.nextElementSibling.textContent=fin?'Thanks for testing! More stages coming in later versions.':'CLOCKWORK COLOSSUS DESTROYED';}const bonus=G.lives*10000+G.bombs*5000;G.score+=bonus;G.state='clear';hiSave();if(fin)musicStart(4);else musicStop(); // v1.2.0: victory theme keeps audio going on the ending screen
 $('cRes').style.display=fin?'':'none';$('cRes').innerHTML=fin?'<div class="lbl">RESULTS</div><div class="sdet">Hive Queen + Crimson Warden destroyed · '+(G.kills||0)+' kills · '+G.hits+' hits taken</div><div class="lbl">MEDALS</div><div class="sdet" style="color:#5dff9a">🏅 '+G.medals+' collected · best chain ×'+G.bestChain+'</div>':'';$('cSalv').innerHTML=salvHTML(bankRun());$('cScore').textContent=G.score.toLocaleString();$('cBonus').textContent='Lives ×'+G.lives+' + Bombs ×'+G.bombs+' = '+bonus.toLocaleString();$('cHi').textContent=G.hi.toLocaleString();show('clear');}
// ---------- background
const BG={stars:[],gears:[],neb:null,nebY:0,str:null,strY:0};
const LG={},TR={};
function buildFX(){const cols={cy:COL.cy,mg:COL.mg,am:COL.am,li:COL.li,eb:COL.eb,w:'#ffffff'};
 for(const k in cols){const c=cols[k];LG[k]=mk(128,128,g=>{const gr=g.createRadialGradient(0,0,0,0,0,64);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(.12,c);gr.addColorStop(.4,c+'44');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(-64,-64,128,128);},.5);
  TR[k]=mk(12,64,g=>{const gr=g.createLinearGradient(0,-32,0,32);gr.addColorStop(0,c+'cc');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.ellipse(0,0,5,32,0,0,TAU);g.fill();},1);}
 for(let i=0;i<10;i++)FX.streaks.push({x:rnd(40,W-40),y:rnd(-H,H),v:rnd(9,16),l:rnd(40,110),c:i%2?'cy':'mg'});}
function buildBG(){const L=[[60,.3,1,'rgba(110,100,190,.45)'],[34,.7,1.3,'rgba(120,130,220,.4)'],[14,1.2,1.6,'rgba(150,110,230,.35)']];for(const[n,v,s,c]of L)for(let i=0;i<n;i++)BG.stars.push({x:rnd(0,W),y:rnd(0,900),v,s,c});
 BG.neb=mk(W,900,g=>{g.translate(-W/2,-450);const cols=['rgba(255,61,240,.13)','rgba(46,249,255,.09)','rgba(120,50,255,.14)','rgba(255,181,46,.06)'];
  for(let i=0;i<16;i++){const x=rnd(0,W),y=rnd(0,900),r=rnd(80,220),c=cols[i%4];for(const oy of[-900,0,900]){const gr=g.createRadialGradient(x,y+oy,0,x,y+oy,r);gr.addColorStop(0,c);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y+oy-r,r*2,r*2);}}},1);
 BG.str=mk(W,800,g=>{g.translate(-W/2,-400);for(const side of[0,1]){const x0=side?W-34:0;g.fillStyle='rgba(30,16,10,.9)';g.fillRect(x0,0,34,800);
  g.strokeStyle='rgba(200,130,60,.55)';g.lineWidth=2;g.strokeRect(x0+3,-2,28,804);g.strokeStyle='rgba(150,90,40,.5)';g.lineWidth=1.5;
  for(let y=0;y<800;y+=40){g.beginPath();g.moveTo(x0+3,y);g.lineTo(x0+31,y+40);g.moveTo(x0+31,y);g.lineTo(x0+3,y+40);g.stroke();}
  glow(g,side?COL.mg:COL.cy,6);g.strokeStyle=side?'rgba(255,61,240,.7)':'rgba(46,249,255,.7)';g.lineWidth=1.2;g.beginPath();g.moveTo(side?x0:x0+34,0);g.lineTo(side?x0:x0+34,800);g.stroke();noGlow(g);
  for(let y=60;y<800;y+=180){g.fillStyle='#3a2210';g.fillRect(side?x0-16:x0+34,y,16,10);g.fillStyle=COL.cu;g.fillRect(side?x0-18:x0+48,y-3,4,16);}
  rivets(g,Array.from({length:20},(_,i)=>[x0+17,i*40+20]));}},1);
 for(let i=0;i<5;i++)BG.gears.push({x:i%2?rnd(W-40,W+20):rnd(-20,40),y:rnd(0,H),k:i%3,rot:rnd(0,TAU),vr:rnd(.004,.01)*(i%2?1:-1)});}
function drawBG(spd){ctx.fillStyle='#05030c';ctx.fillRect(0,0,W,H);
 BG.nebY=(BG.nebY+.25*spd)%900;ctx.drawImage(BG.neb,0,BG.nebY-900,W,900);ctx.drawImage(BG.neb,0,BG.nebY,W,900);
 for(const s of BG.stars){s.y+=s.v*spd;if(s.y>H){s.y-=H+4;s.x=rnd(0,W);}ctx.fillStyle=s.c;ctx.beginPath();ctx.arc(s.x,s.y,s.s*.6,0,TAU);ctx.fill();}
 ctx.globalAlpha=.22;for(const g of BG.gears){g.y+=.7*spd;g.rot+=g.vr;if(g.y>H+80){g.y=-80;}ds(S.bgGear[g.k],g.x,g.y,g.rot);}ctx.globalAlpha=1;
 const pu=FX.pulse;BG.gY=((BG.gY||0)+1.1*spd)%40;ctx.globalCompositeOperation='lighter';ctx.lineWidth=1;
 ctx.strokeStyle='rgba(120,60,255,'+(.07+.13*pu).toFixed(3)+')';ctx.beginPath();for(let y=BG.gY-40;y<H;y+=40){ctx.moveTo(34,y);ctx.lineTo(W-34,y);}for(let x=34+29;x<W-34;x+=58){ctx.moveTo(x,0);ctx.lineTo(x,H);}ctx.stroke();
 // neon speed lines
 ctx.globalCompositeOperation='source-over'; // v0.3: speed-line streaks removed (looked like bullets)
 BG.strY=(BG.strY+1.1*spd)%800;ctx.globalAlpha=.8;ctx.drawImage(BG.str,0,BG.strY-800,W,800);ctx.drawImage(BG.str,0,BG.strY,W,800);ctx.globalAlpha=1;
 // scaffolding neon glow pulses on the beat
 ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.18+.5*pu;ctx.drawImage(LG.cy,34-14,-20,28,H+40);ctx.drawImage(LG.mg,W-34-14,-20,28,H+40);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
function ds(c,x,y,rot,sc){sc=sc||1;if(!rot){ctx.drawImage(c,x-c.w*sc/2,y-c.h*sc/2,c.w*sc,c.h*sc);return;}ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(c,-c.w*sc/2,-c.h*sc/2,c.w*sc,c.h*sc);ctx.restore();}
// ---------- update
function update(){G.t++;
 for(let i=G.timers.length-1;i>=0;i--){if(G.timers[i].at<=G.t){const f=G.timers[i].fn;G.timers.splice(i,1);f();}}
 if(G.state!=='play')return;
 if(!G.hold){G.st++;if(G.stage===1)while(G.evI<EV.length&&EV[G.evI][0]*60<=G.st){EV[G.evI][1]();G.evI++;}}
 if(G.stage===2)s2Update();
 if(G.stage===3)s3Update();
 if(G.stage===4)s4Update();
 if(G.stage>4&&G.state==='play'){G.stage=4;stageClear();} // v1.3.0: 4 stages; anything past goes to the ending
 // player
 if(P.dead>0){P.dead--;if(P.dead===0&&G.lives>0){P.x=W/2;P.y=H-80;P.inv=100;G.shield=G.maxSh;G.hull=G.hullM;updHud();}}
 else{let kx=(keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0),ky=(keys.ArrowDown||keys.KeyS?1:0)-(keys.ArrowUp||keys.KeyW?1:0);const sp=(keys.ShiftLeft||keys.ShiftRight?2.2:4.2)*MF.sp;
  if(kx||ky){const n=Math.hypot(kx,ky);P.x=clamp(P.x+kx/n*sp,10,W-10);P.y=clamp(P.y+ky/n*sp,20,H-16);P.bank+=kx*.6;}
  if(P.fireT>0)P.fireT--;fire();if(P.fireT<-1)P.fireT=0;if(P.inv>0)P.inv--;}
 shieldTick();
 P.bank*=.85;
 if(G.bombT>0){G.bombT--;for(const b of EB.a)b.act=false;if(G.bombT%3===0)for(const e of EN.a)if(e.act&&e.y>-20)hurt(e,e.big?1.2:3);}
 // player bullets
 for(const b of PB.a){if(!b.act)continue;if(b.k===3){b.t=(b.t||0)+1;if(b.t%3===0||!b.tg||!b.tg.act||b.tg.dying)b.tg=nearestEn(b.x,b.y,600);const sp=Math.min(9,3+b.t*.25);let a=Math.atan2(b.vy,b.vx);if(b.tg){let da=Math.atan2(b.tg.y-b.y,b.tg.x-b.x)-a;da=Math.atan2(Math.sin(da),Math.cos(da));a+=clamp(da,-.16,.16);}else a+=clamp(-Math.PI/2-a,-.1,.1);b.vx=Math.cos(a)*sp;b.vy=Math.sin(a)*sp;b.rot=a+Math.PI/2;if(b.t%2===0)part(0,b.x-b.vx,b.y-b.vy,rnd(-.5,.5),rnd(-.5,.5),14,.6,'mg');if(b.t>200){b.act=false;continue;}}b.x+=b.vx;b.y+=b.vy;if(b.y<-30||b.y>H+30||b.x<-20||b.x>W+20||(G.stage===2&&s2BlockPB(b))||(G.stage===4&&s4BlockPB(b))){b.act=false;continue;}
  for(const e of EN.a){if(!e.act||e.y<-8||e.dying)continue;if(e.xb&&partsAlive(e)>0)continue;const rx=e.r+b.w/2,ry=e.r+b.h/2;if(Math.abs(e.x-b.x)<rx&&Math.abs(e.y-b.y)<ry){hurt(e,b.pierce&&(e.xb||(e.p&&e.p.xb))?b.dmg*.22:b.dmg);if(Math.random()<.3)part(0,b.x,b.y-4,rnd(-1,1),rnd(-2,0),8,.5,(WEAP[b.k]||WEAP[2]).d);if(b.k===3)boom(b.x,b.y,.6,'mg');if(!b.pierce){b.act=false;break;}}}}
 // enemies
 for(const e of EN.a){if(!e.act)continue;updEnemy(e);if(!e.act||P.dead>0||e.dying)continue;const dx=e.x-P.x,dy=e.y-P.y,rr=e.r*.8+4;if(dx*dx+dy*dy<rr*rr&&e.y>0&&e.type!=='block'){G.hitBy=e.type;playerHit();}}
 // enemy bullets
 for(const b of EB.a){if(!b.act)continue;b.x+=b.vx;b.y+=b.vy;if(b.y<-20||b.y>H+20||b.x<-20||b.x>W+20||(G.stage===2&&s2BlockEB(b))||(G.stage===4&&s4BlockEB(b))){b.act=false;continue;}
  if(P.dead<=0){const dx=b.x-P.x,dy=b.y-P.y,rr=b.r+6;if(dx*dx+dy*dy<rr*rr){G.hitBy=b.big?'bigbullet':'bullet';if(playerHit())b.act=false;}}}
 // pickups
 for(const u of PU.a){if(!u.act)continue;u.t++;u.y+=.75;u.x+=Math.sin(u.t*.05)*.6;if(u.t%90===0&&!u.bomb&&!u.rep)u.w=(u.w+1)%3;if(u.y>H+20){u.act=false;continue;}
  if(P.dead<=0){const dx=u.x-P.x,dy=u.y-P.y;if(dx*dx+dy*dy<22*22){u.act=false;sfx.power();if(u.rep){if(G.hull<G.hullM){G.hull++;G.banner={t:100,a:'+1 HULL REPAIR',b:'',small:true,c:'#ffb52e'};}else{G.shield=G.maxSh;G.score+=2000;G.banner={t:100,a:'HULL FULL · +2000',b:'',small:true,c:'#ffb52e'};}part(1,P.x,P.y,0,0,16,18,'am');continue;}if(u.bomb){G.bombs=Math.min(bombCap()+1,G.bombs+1);updHud();bombPing();G.banner={t:100,a:'+1 BOMB',b:'',small:true,c:COL.mg};continue;}if(u.w===G.weapon){if(G.lvl<lvlCap())G.lvl++;else G.score+=5000;}else G.weapon=u.w;
   G.banner={t:100,a:WEAP[G.weapon].n+' LV'+G.lvl,b:'',small:true,c:WEAP[G.weapon].c};part(1,P.x,P.y,0,0,18,22,WEAP[G.weapon].d);}}}
 // salvage cogs (magnet)
 for(const c of CG.a){if(!c.act)continue;c.t++;c.vx*=.95;c.vy=Math.min(1.4,c.vy+.06);const dx=P.x-c.x,dy=P.y-c.y,d=Math.hypot(dx,dy);
  if(P.dead<=0&&d<MF.mag){c.x+=dx/d*6;c.y+=dy/d*6;}else{c.x+=c.vx;c.y+=c.vy;}if(c.y>H+12){c.act=false;continue;}
  if(P.dead<=0&&d<16){c.act=false;G.salv+=c.v;sfx.cog();}}
 // score medals: no magnet, vanish after ~4s, escalating chain
 for(const m of MD.a){if(!m.act)continue;m.t++;m.vy=Math.min(1.1,m.vy+.04);m.x+=m.vx;m.y+=m.vy;
  if(m.t>240||m.y>H+10){m.act=false;G.chain=0;continue;}
  if(P.dead<=0){const dx=m.x-P.x,dy=m.y-P.y;if(dx*dx+dy*dy<18*18){m.act=false;const v=CHAIN[Math.min(G.chain,CHAIN.length-1)];G.chain++;G.medals++;G.bestChain=Math.max(G.bestChain,G.chain);G.score+=v;G.pop2={t:0,x:m.x,y:m.y,s:'+'+v};sfx.medal(G.chain);}}}
 for(let i=G.fall.length-1;i>=0;i--){const f=G.fall[i];f.t++;f.vy+=.12;f.x+=f.vx;f.y+=f.vy;f.rot+=f.vr;if(f.t%4===0)part(3,f.x,f.y,0,-.3,30,.7);if(f.t%6===0)part(0,f.x,f.y,rnd(-1,1),rnd(-1,0),10,.5,'am');if(f.y>H+80)G.fall.splice(i,1);}
 if(G.vig>0)G.vig=Math.max(0,G.vig-.018);if(G.pop&&++G.pop.t>60)G.pop=null;if(G.pop2&&++G.pop2.t>40)G.pop2=null;
 // particles
 for(const p of PT.a){if(!p.act)continue;p.life--;if(p.life<=0){p.act=false;continue;}p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;if(p.k===0){p.vx*=.93;p.vy*=.93;}else if(p.k===2){p.vy+=.06;}else if(p.k===3){p.s+=.02;p.vy-=.005;}}
 for(const l of LT.a){if(l.act&&--l.life<=0)l.act=false;}if(FX.strobe>0)FX.strobe--;
 if(G.banner){G.banner.t++;if(G.banner.t>200)G.banner=null;}
 G.shake*=.88;if(G.shake<.3)G.shake=0;G.flash*=.9;if(G.flash<.02)G.flash=0;}
// ---------- draw
function dsF(k,x,y,r,fl){ds(S[k],x,y,r);if(fl){ctx.globalAlpha=.4;ds(S[k+'W'],x,y,r);ctx.globalAlpha=1;}}
function drawEnemy(e){const fl=e.fl>0&&(e.fl%2===1);
 switch(e.type){
 case 'drone':dsF('drone',e.x,e.y,0,fl);break;
 case 'swooper':dsF('swooper',e.x,e.y,e.rot,fl);break;
 case 'turret':dsF('turret',e.x,e.y,0,fl);ds(S.barrel,e.x,e.y,e.rot);break;
 case 'carrier':dsF('carrier',e.x,e.y,0,fl);break;
 case 'gunship':{const pl=e.parts&&e.parts[0].act,pr=e.parts&&e.parts[1].act;if(pl)ds(S.gGear,e.x-58,e.y+6,e.t*.05);else{ctx.fillStyle='#1a0f08';ctx.beginPath();ctx.arc(e.x-58,e.y+6,9,0,TAU);ctx.fill();}if(pr)ds(S.gGear,e.x+58,e.y+6,-e.t*.05);else{ctx.fillStyle='#1a0f08';ctx.beginPath();ctx.arc(e.x+58,e.y+6,9,0,TAU);ctx.fill();}dsF('gunship',e.x,e.y,0,fl);break;}
 case 'part':if(e.p.type==='boss2')drawPart2(e);else if(!e.p.xb)drawPart(e);break;
 default:if(XD[e.type])XD[e.type](e,fl);break;
 case 'block':drawBlock(e);break;
 case 'boss2':drawBoss2(e);break;
 case 'boss':{const sh=e.dying?rnd(-3,3):0,x=e.x+sh,y=e.y;ctx.globalCompositeOperation='lighter';ds(S.dot.mg,x,y,0,7);ctx.globalCompositeOperation='source-over';
  ds(S.bGear2,x-48,y+58,-e.g*1.8);ds(S.bGear2,x+48,y+58,e.g*1.8);dsF('boss',x,y,0,fl);if(e.pL&&e.pL.act){drawPart(e.pL);ds(S.bGear,x-80,y+4,e.g);}else{ctx.fillStyle='#140a06';ctx.beginPath();ctx.arc(x-74,y+4,14,0,TAU);ctx.fill();ctx.strokeStyle=COL.eb;ctx.lineWidth=1;ctx.stroke();}if(e.pR&&e.pR.act){drawPart(e.pR);ds(S.bGear,x+80,y+4,-e.g);}else{ctx.fillStyle='#140a06';ctx.beginPath();ctx.arc(x+74,y+4,14,0,TAU);ctx.fill();ctx.strokeStyle=COL.eb;ctx.lineWidth=1;ctx.stroke();}if(e.pM&&e.pM.act)drawPart(e.pM);else{ctx.fillStyle='rgba(15,8,5,.9)';ctx.fillRect(x-48,y-100,96,34);}if(e.phase===3&&(G.t>>3)%2){ctx.globalCompositeOperation='lighter';ds(S.dot.am,x,y,0,3);ctx.globalCompositeOperation='source-over';}
  ctx.save();ctx.translate(x,y);ctx.lineCap='round';const ha=(e.phase===1?e.hA:e.t*.01)-Math.PI/2+Math.PI/2,ma=e.t*.08;
  ctx.strokeStyle=e.phase===2?COL.eb:COL.mg;ctx.lineWidth=6;ctx.globalAlpha=.35;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(ha)*34,Math.sin(ha)*34);ctx.stroke();ctx.globalAlpha=1;ctx.lineWidth=3;ctx.stroke();
  ctx.strokeStyle=COL.cy;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(ma)*46,Math.sin(ma)*46);ctx.stroke();
  ctx.fillStyle=e.phase===2?COL.eb:COL.am;ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();ctx.restore();break;}}}
function drawPart(e){if(e.p.type==='boss'||e.p.type==='gunship'){const x=e.x,y=e.y,fl=e.fl>0&&(e.fl%2===1),bossP=e.p.type==='boss';
  if(e.spr==='debris'){ctx.fillStyle='#3a2410';for(const sx of[-34,0,34]){ctx.fillRect(x+sx-7,y-20,14,30);}ctx.strokeStyle=COL.am;ctx.lineWidth=2;for(const sx of[-34,0,34]){ctx.strokeRect(x+sx-7,y-20,14,30);ctx.fillStyle=COL.am;ctx.fillRect(x+sx-5,y-24,10,4);ctx.fillStyle='#3a2410';}}
  else{ctx.fillStyle='#3a2410';ctx.fillRect(x-5,y+8,10,bossP?26:16);ctx.strokeStyle=COL.cu;ctx.lineWidth=1.5;ctx.strokeRect(x-5,y+8,10,bossP?26:16);}
  if(fl){ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.7;ds(S.dot.w||S.dot.am,x,y,0,2.2);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
  if(e.hitT>0){const f=Math.max(0,e.hp/e.maxhp),bw=e.r*1.5;ctx.globalAlpha=Math.min(1,e.hitT/30);ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(x-bw/2,y+e.r+6,bw,4);ctx.fillStyle=f>.5?COL.li:f>.25?COL.am:COL.eb;ctx.fillRect(x-bw/2,y+e.r+6,bw*f,4);ctx.globalAlpha=1;}}}
function drawLightning(x0,y0,x1,y1){const n=7;ctx.beginPath();ctx.moveTo(x0,y0);for(let i=1;i<n;i++){const f=i/n;ctx.lineTo(x0+(x1-x0)*f+rnd(-9,9),y0+(y1-y0)*f+rnd(-9,9));}ctx.lineTo(x1,y1);}
function draw(){const play=G.state!=='title';const bc=beatClock();FX.pulse=Math.exp(-bc.f*5)*(SET.rf?.3:1)*(bc.b%4===0?1:.75);const pq=Math.round(FX.pulse*10)/10;if(pq!==FX.pq){FX.pq=pq;document.documentElement.style.setProperty('--p',pq);}const sx=G.shake?rnd(-G.shake,G.shake):0,sy=G.shake?rnd(-G.shake,G.shake):0;
 ctx.setTransform(SC*DPR,0,0,SC*DPR,sx*SC*DPR,sy*SC*DPR);drawBG(G.state==='pause'?0:1);
 if(!play){return;}
 if(G.stage===2)s2DrawBack();if(G.stage===3)s3DrawBack();if(G.stage===4)s4DrawBack();
 // smoke under
 for(const p of PT.a){if(p.act&&p.k===3){ctx.globalAlpha=p.life/p.max*.7;ds(S.smoke,p.x,p.y,0,p.s);}}ctx.globalAlpha=1;
 for(const e of EN.a)if(e.act&&e.type==='turret')drawEnemy(e);
 for(const e of EN.a)if(e.act&&e.type!=='turret'&&!(e.type==='part'&&e.p&&(e.p.type==='boss'||e.p.type==='boss2'||e.p.xb)))drawEnemy(e);
 for(const f of G.fall){ctx.globalAlpha=.85;ds(S[f.spr]||S.debris,f.x,f.y,f.rot,f.spr==='debris'?4:1);}ctx.globalAlpha=1;
 for(const c of CG.a)if(c.act){ctx.fillStyle=COL.am;ctx.beginPath();ctx.arc(c.x,c.y,4,0,TAU);ctx.fill();ctx.fillStyle='#3a2410';ctx.beginPath();ctx.arc(c.x,c.y,1.6,0,TAU);ctx.fill();ctx.strokeStyle='#fff3c0';ctx.lineWidth=1;ctx.beginPath();ctx.arc(c.x,c.y,4.5,0,TAU);ctx.stroke();}
 for(const m of MD.a)if(m.act&&!(m.t>180&&(m.t>>2)%2)){ctx.save();ctx.translate(m.x,m.y);ctx.rotate(Math.PI/4);ctx.fillStyle=COL.li;ctx.fillRect(-4,-4,8,8);ctx.fillStyle='#fff';ctx.fillRect(-1.6,-1.6,3.2,3.2);ctx.restore();}
 // debris
 for(const p of PT.a){if(p.act&&p.k===2){ctx.globalAlpha=Math.min(1,p.life/20);ds(S.debris,p.x,p.y,p.rot,p.s);}}ctx.globalAlpha=1;
 // additive layer: player shots, sparks, rings, arcs
 ctx.globalCompositeOperation='lighter';
 ctx.globalAlpha=.28;for(const b of PB.a){if(!b.act||b.k===1||b.k>2)continue;const tr=TR[WEAP[b.k].d];if(b.k===0)ds(tr,b.x-b.vx*1.5,b.y-b.vy*1.5+0,b.rot,.6);else ctx.drawImage(tr,b.x-3,b.y+4,6,34);}
 ctx.globalAlpha=G.weapon===0&&G.lvl>=3?.42:.6;for(const b of PB.a){if(!b.act)continue;if(b.k===0)ds(S.pbS,b.x,b.y,b.rot);else if(b.k===1)ds(S.pbL[Math.min(G.lvl,3)-1]||S.pbL[0],b.x,b.y,0,b.w<10&&G.lvl>=4?.75:1);else if(b.k===2)ds(S.pbT,b.x,b.y);}ctx.globalAlpha=1;drawExtraShots();
 if(G.arcs.length&&P.dead<=0&&G.weapon===2){ctx.strokeStyle=COL.li;for(const a of G.arcs){ctx.globalAlpha=.25;ctx.lineWidth=6;drawLightning(P.x,P.y-8,a.x,a.y);ctx.stroke();ctx.globalAlpha=.95;ctx.lineWidth=1.6;drawLightning(P.x,P.y-8,a.x,a.y);ctx.stroke();ds(S.dot.li,a.x,a.y,0,1.2);}ctx.globalAlpha=1;}
 for(const p of PT.a){if(!p.act)continue;const f=p.life/p.max;if(p.k===0){ctx.globalAlpha=f;ds(S.dot[p.c],p.x,p.y,0,p.s);}else if(p.k===1){ctx.globalAlpha=f;ctx.strokeStyle=COL[p.c]||'#fff';ctx.lineWidth=3*f+.5;ctx.beginPath();ctx.arc(p.x,p.y,p.s*(1.6-f)*1.6,0,TAU);ctx.stroke();}}
 ctx.globalAlpha=1;
 if(G.bombT>0){const f=1-G.bombT/90;ctx.strokeStyle=COL.cy;ctx.lineWidth=10*(1-f)+2;ctx.globalAlpha=1-f;ctx.beginPath();ctx.arc(P.x,P.y,f*700,0,TAU);ctx.stroke();ctx.strokeStyle=COL.mg;ctx.beginPath();ctx.arc(P.x,P.y,f*480,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
 for(const l of LT.a){if(!l.act)continue;const f=l.life/l.max;ctx.globalAlpha=Math.min(.85,f*f*(SET.rf?.55:1));const r=l.r*(1.3-.3*f);ctx.drawImage(LG[l.c]||LG.w,l.x-r,l.y-r,r*2,r*2);}ctx.globalAlpha=1;
 // pickups
 for(const u of PU.a){if(!u.act)continue;const w=u.rep?{d:'am'}:u.bomb?{d:'mg'}:WEAP[u.w];ds(S.dot[w.d],u.x,u.y,0,1.6+Math.sin(u.t*.2)*.15);}
 ctx.globalCompositeOperation='source-over';
 for(const u of PU.a){if(!u.act)continue;const w=u.rep?{c:'#ffb52e',l:'+'}:u.bomb?{c:COL.mg,l:'B'}:WEAP[u.w];if(u.rep){txt('REPAIR',u.x,u.y+14,'#ffb52e',8,'center',3);ctx.lineWidth=1.5;}ctx.strokeStyle=w.c;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(u.x,u.y,12,0,TAU);ctx.stroke();ctx.fillStyle='#05030c';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(w.l,u.x,u.y+1);}
 // player
 if(P.dead<=0&&G.lives>0&&!(P.inv>0&&(G.t>>2)%2)){ctx.globalCompositeOperation='lighter';ds(S.dot.mg,P.x,P.y+15,0,.8+Math.random()*.4);ds(S.dot.am,P.x,P.y+13,0,.5);ctx.globalCompositeOperation='source-over';
  ctx.save();ctx.translate(P.x,P.y);ctx.scale(1-Math.min(.35,Math.abs(P.bank)*.05),1);ctx.drawImage(S.player,-S.player.w/2,-S.player.h/2,S.player.w,S.player.h);ctx.restore();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(P.x,P.y+1,2.5,0,TAU);ctx.fill();ctx.strokeStyle=COL.cy;ctx.lineWidth=1;ctx.stroke();drawShipExtras();drawHitFX();}
 if(P.dead<=0&&G.lives>0&&P.inv>0){ctx.strokeStyle=P.inv>50&&G.vig>.3?COL.eb:COL.cy;ctx.globalAlpha=.35+.35*Math.sin(G.t*.5);ctx.lineWidth=2;ctx.beginPath();ctx.arc(P.x,P.y,22,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
 if(G.stage===2)s2DrawFront();if(G.stage===3)s3DrawFront();if(G.stage===4)s4DrawFront();
 ctx.setTransform(SC*DPR,0,0,SC*DPR,0,0);
 if(G.flash>0&&!SET.rf){ctx.fillStyle='rgba('+FX.flashC+','+(G.flash*.45).toFixed(3)+')';ctx.fillRect(0,0,W,H);}
 if(G.vig>0){const gr=ctx.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,H*.75);gr.addColorStop(0,'rgba(255,20,50,0)');gr.addColorStop(1,'rgba(255,20,50,'+(G.vig*(SET.rf?.45:.75)).toFixed(3)+')');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);}
 if(FX.strobe>0&&!SET.rf&&(FX.strobe>>2)%2){const sc=['255,36,80','46,249,255','255,61,240','255,255,255'][(FX.strobe>>3)%4];ctx.fillStyle='rgba('+sc+',.16)';ctx.fillRect(0,0,W,H);}
 ctx.setTransform(SC*DPR,0,0,SC*DPR,sx*SC*DPR,sy*SC*DPR);
 // enemy bullets on top of ALL effects, dark halo + solid core for contrast
 for(const b of EB.a)if(b.act){ctx.fillStyle='rgba(5,3,12,.55)';ctx.beginPath();ctx.arc(b.x,b.y,b.r+2.5,0,TAU);ctx.fill();}
 for(const b of EB.a)if(b.act)ds(b.big?S.ebB:S.eb,b.x,b.y);
 ctx.setTransform(SC*DPR,0,0,SC*DPR,0,0);
 drawHUD();}
function txt(s,x,y,c,sz,al,gl){ctx.font='bold '+sz+'px "Trebuchet MS",system-ui,sans-serif';ctx.textAlign=al||'left';ctx.textBaseline='top';if(gl){ctx.shadowColor=c;ctx.shadowBlur=gl;}ctx.fillStyle=c;ctx.fillText(s,x,y);ctx.shadowBlur=0;}
function drawHUD(){txt(String(G.score).padStart(8,'0'),10,8,'#fff',16,'left',4+10*FX.pulse);txt('HI '+String(Math.max(G.hi,G.score)).padStart(8,'0'),W/2,10,'#9aa',11,'center');
 for(let i=0;i<G.lives-(P.dead>0?0:1);i++)ctx.drawImage(S.player,10+i*16,H-26,13,15);
 {const bw=Math.min(170,18*G.maxSh+44),sf=G.shield/G.maxSh,low=G.shDown>0&&(G.t>>3)%2;txt('SHIELD',10,28,low?COL.eb:COL.cy,10,'left',4);ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(58,29,bw,9);
  ctx.fillStyle=G.shield<.5?'rgba(255,36,80,.5)':COL.cy;ctx.fillRect(58,29,bw*sf,9);if(G.regen){const hx=58+((G.t*3)%Math.max(1,bw*sf));ctx.fillStyle='rgba(255,255,255,.75)';ctx.fillRect(hx,29,6,9);txt('▲',62+bw,28,COL.cy,9,'left',4);}
  ctx.strokeStyle='rgba(5,3,12,.9)';ctx.lineWidth=1;for(let i=1;i<G.maxSh;i++){const x=58+bw*i/G.maxSh;ctx.beginPath();ctx.moveTo(x,29);ctx.lineTo(x,38);ctx.stroke();}ctx.strokeStyle='#e6feff';ctx.strokeRect(58,29,bw,9);
  if(G.shDown>0&&(G.t>>2)%2)txt('SHIELD DOWN',66+bw,28,COL.eb,10,'left',8);
  const hw=Math.min(170,18*G.hullM+44),hf=G.hull/G.hullM,hc=G.hullFl>0&&(G.t>>2)%2?'#fff':'#ff6a1e';txt('HULL',10,42,hc,10,'left',4);ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(58,43,hw,9);ctx.fillStyle=hf<=.34?'#ff2a2a':hc;ctx.fillRect(58,43,hw*hf,9);
  ctx.strokeStyle='rgba(5,3,12,.9)';for(let i=1;i<G.hullM;i++){const x=58+hw*i/G.hullM;ctx.beginPath();ctx.moveTo(x,43);ctx.lineTo(x,52);ctx.stroke();}ctx.strokeStyle='#ffd0a0';ctx.strokeRect(58,43,hw,9);}
 txt('⚙ '+G.salv,W-12,H-112,COL.am,13,'right',4);if(G.chain>1)txt('MEDAL x'+G.chain,W-12,H-128,COL.li,10,'right',3);
 const pp=G.pop;if(pp){ctx.globalAlpha=Math.max(0,1-pp.t/60);txt(pp.s,pp.x,pp.y-pp.t*.6,pp.c||COL.eb,20,'center',10);ctx.globalAlpha=1;}
 const p2=G.pop2;if(p2){ctx.globalAlpha=Math.max(0,1-p2.t/40);txt(p2.s,p2.x,p2.y-p2.t*.5,COL.li,11,'center',4);ctx.globalAlpha=1;}
 const w=WEAP[G.weapon];txt(w.n,10,H-46,w.c,11,'left',4);for(let i=0;i<lvlCap();i++){ctx.fillStyle=i<G.lvl?(i>=3?COL.mg:w.c):'rgba(255,255,255,.15)';ctx.fillRect(64+i*10,H-44,7,8);}
 const bo=G.boss||G.mid;if(bo&&bo.act&&bo.y>0){const f=Math.max(0,bo.hp/bo.maxhp),arm=partsAlive(bo)>0;ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(40,60,W-80,6);if(arm)txt('CORE ARMORED — BREAK THE PARTS',W/2,69,'#aab',9,'center');ctx.fillStyle=arm?'#8a8aa0':G.boss?COL.mg:COL.am;ctx.fillRect(40,60,(W-80)*f,6);ctx.strokeStyle='rgba(255,255,255,'+(.35+.5*FX.pulse).toFixed(2)+')';ctx.strokeRect(40,60,W-80,6);}
 const b=G.banner;if(b){const a=b.t<20?b.t/20:b.t>170?(200-b.t)/30:1;ctx.globalAlpha=Math.max(0,a);
  if(b.small){txt(b.a,W/2,H*.62,b.c,18,'center',10);}else{if(b.warn&&(b.t>>3)%2){ctx.fillStyle='rgba(255,36,80,.12)';ctx.fillRect(0,0,W,H);}
  ctx.fillStyle='rgba(5,3,12,.55)';ctx.fillRect(0,H*.36,W,74);txt(b.a,W/2,H*.36+12,b.warn?COL.eb:COL.cy,28,'center',14);txt(b.b,W/2,H*.36+48,b.warn?'#fff':COL.am,13,'center',6);}ctx.globalAlpha=1;}}
// ---------- loop
let last=0,acc=0,fpsN=0,fpsT=0;window.__fps=0;
function frame(ts){requestAnimationFrame(frame);if(!last)last=ts;let dt=Math.min(100,ts-last);last=ts;fpsN++;fpsT+=dt;if(fpsT>=1000){window.__fps=fpsN;fpsN=0;fpsT=0;}
 if(G.state==='pause'){draw();return;}acc+=dt;let n=0;while(acc>=16.66&&n<4){update();acc-=16.66;n++;}if(n===4)acc=0;draw();}
function boot(){resize();addEventListener('resize',resize);buildSprites();buildBG();buildFX();
 $('ver').textContent=VERSION;$('bStart').onclick=startGame;$('bResume').onclick=togglePause;$('bQuit').onclick=()=>{bankRun();G.state='title';musicStop();if(AU.c)AU.c.resume();show('title');};
 $('bRetry').onclick=startGame;$('bAgain').onclick=startGame;$('bUp1').onclick=$('bUp2').onclick=()=>openHangar('over');$('bHangar').onclick=()=>openHangar('title');$('bLaunch').onclick=startGame;$('bHBack').onclick=()=>{G.state='title';show('title');};$('hList').addEventListener('click',e=>{const b=e.target.closest('.up');if(b){auInit();buy(b.dataset.k);}});$('bTitle1').onclick=$('bTitle2').onclick=()=>{G.state='title';show('title');};
 const bb=$('bBomb');bb.addEventListener('pointerdown',e=>{e.preventDefault();bomb();});$('bPause').onclick=togglePause;$('bMute').onclick=toggleMute;
 if(localStorage.getItem('ngs_mute')==='1')toggleMute();
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.state==='play')togglePause();});
 wireSettings();
 $('tHi').textContent=G.hi?('HI-SCORE '+G.hi.toLocaleString()):'';show(lsGet('ngs_photo')||DBG[0]?'title':'photo');requestAnimationFrame(frame);
 setTimeout(()=>{$('splash').classList.add('gone');setTimeout(()=>$('splash').remove(),600);},350);
 if(DBG.includes('autostart'))startGame();
 if('serviceWorker'in navigator&&(location.protocol==='https:'||DBG.includes('sw'))){navigator.serviceWorker.register('sw.js',{updateViaCache:'none'}).then(r=>r.update()).catch(()=>{});
  let had=!!navigator.serviceWorker.controller;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(had&&!window.__ngsRl){window.__ngsRl=1;if(G.state==='title'||G.state==='photo')location.reload();else verToast();}had=true;});}
 verCheck();
 window.NG={AU,auInit,musicTick,musicStart,sfx,hurtE:hurt,get H(){return H;},spawnTarget:()=>{const e=spawn('block',W/2,200,{d:s2d(200),r:90,hp0:1e7,glass:false,seed:1,sc:0});return e;},s2reset,spawnBoss2,G2,s2span,s2solid,s2d,s2y,flameState,flameOrigin,gearX,toStage2,kill,G3,G4,s3reset,s4reset,toStage3,toStage4,spawnBoss3,spawnBoss4,stageClear,hurt,AU,FX,SET,G,P,EN,EB,PB,PT,CG,MD,META,UPG,buy,openHangar,playerHit,eShot,bomb,startGame,spawn,DEF,PU,dropRepair,togglePause,updHud,bombPing,step:n=>{for(let i=0;i<n;i++)update();},counts:()=>({en:EN.count(),eb:EB.count(),pb:PB.count(),pt:PT.count()})};}
// v0.5 update check: version.json is fetched with no-store; newer build -> reload once (title) or show a tap-to-update toast
function verNum(v){return parseFloat(String(v).replace(/^v/,''))||0;}
function verToast(){if(document.getElementById('updT'))return;const d=document.createElement('button');d.id='updT';d.textContent='NEW VERSION — TAP TO UPDATE';d.style.cssText='position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:99;background:#ff2e88;color:#fff;border:2px solid #fff;border-radius:8px;padding:10px 14px;font:bold 13px Trebuchet MS,sans-serif;letter-spacing:.08em;box-shadow:0 0 18px #ff2e88';d.onclick=()=>location.reload();document.body.appendChild(d);}
function verCheck(){if(!/^https?:/.test(location.protocol))return;fetch('version.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{if(!j||verNum(j.v)<=verNum(VERSION))return;window.NGS_NEWER=j.v;
  const k='ngs_rl_'+j.v;let done=false;try{done=sessionStorage.getItem(k);sessionStorage.setItem(k,1);}catch(_){}
  if(!done&&(G.state==='title'||G.state==='photo')){const u=new URL(location.href);u.searchParams.set('u',j.v);location.replace(u.href);}else verToast();}).catch(()=>{});}
boot();
