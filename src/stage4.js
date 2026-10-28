// ===================== STAGE 4: THE FROZEN CITADEL (v1.3.0) — ice-white + crimson wall fortress =====================
// Builds on Stage 2's "things on the walls": a scrolling citadel corridor whose WALLS fight back.
//  WALL TURRETS (glow red before firing, destructible) · LASER GATES (dashed = warning, solid = deadly) · SWEEP LASERS (wall pivots)
//  CRUSHERS (walls slam in, the green gap is safe) · boss CRIMSON WARDEN: wall cannons, laser lanes, closing walls, weak-spot eye
const G4={d:0,spd:1.4,ev:0,gates:[],sweeps:[],crush:[],hint:{}};
const BOSS4D=4900,WALL4=34;const C4={ice:'#e8f6ff',ice2:'#9fd8ff',cr:'#ff2a4a',bg:'#07101e',st:'#1a2a44'};
const s4y=d=>H-(d-G4.d),s4top=()=>G4.d+H+40;
function hint4(k,a,c){if(G4.hint[k])return;G4.hint[k]=1;G.banner={t:20,a,b:'',small:true,c:c||C4.ice2};}
function crushState(c){const t=c.t%240;return t<90?0:t<160?1:t<200?2:t<220?3:0;} // 0 open,1 warn,2 closed,3 opening
function crushW(c){const t=c.t%240,full=(W-WALL4*2-c.gap)/2;return t<160?0:t<172?full*(t-160)/12:t<200?full:t<220?full*(1-(t-200)/20):0;}
function s4span(y){let L=WALL4,R=W-WALL4,cr=0;for(const c of G4.crush){const cy=s4y(c.d);if(y>cy-c.len/2&&y<cy+c.len/2){const w=crushW(c);const gl=c.gx-c.gap/2,gr=c.gx+c.gap/2;L=Math.max(L,Math.min(WALL4+w*2,gl));R=Math.min(R,Math.max(W-WALL4-w*2,gr));const ct=c.t%240;if(w>0&&ct>=160&&ct<174)cr=1;}}
 if(G4.sq)L=Math.max(L,WALL4+G4.sq),R=Math.min(R,W-WALL4-G4.sq);return{L,R,cr};}
function s4BlockPB(b){return b.x<WALL4-2||b.x>W-WALL4+2;}
function s4BlockEB(b){return b.x<WALL4-4||b.x>W-WALL4+4;}
function wturret(side,cd){const d=s4top();spawn('wturret',side<0?WALL4+6:W-WALL4-6,s4y(d),{d,side,cd:cd||80,gl:0});}
function sentries(x,n){for(let i=0;i<n;i++)later(i*9,()=>spawn('sentry',x,-12,{ph:i,vy:2}));}
function gate(off){G4.gates.push({d:s4top(),t:off||0});}
function sweep(side){G4.sweeps.push({d:s4top(),side,t:0});}
function crusher(gx,gap){G4.crush.push({d:s4top()+60,len:120,gx,gap:gap||90,t:0});}
XU.wturret=e=>{e.y=s4y(e.d);e.x=e.side<0?WALL4+6:W-WALL4-6;if(e.y>H+40){e.act=false;return;}if(e.y<20)return;e.cd--;if(e.cd===30){e.gl=1;}if(e.cd<=0){e.gl=0;e.cd=140;fan(e.x,e.y,aim(e.x,e.y),3,.3,2.1,true);}};
XU.sentry=e=>{e.y+=e.vy;e.x+=Math.sin(e.t*.07+e.ph)*1.6;if(e.t===50)eShot(e.x,e.y,aim(e.x,e.y),2.6);};
// --- boss 4: CRIMSON WARDEN (gate machine across the corridor). Parts: two WALL CANNONS + LASER PRISM; eye core armored until they break.
function warning4(){strobe(90);G.banner={t:0,a:'⚠ WARNING ⚠',b:'CRIMSON WARDEN APPROACHING',warn:true};sfx.warn();}
function spawnBoss4(){G4.spd=0;const b=spawn('boss4',W/2,-140,{invT:150,phase:0,hA:0,ls:0,lt:0,lcd:200,lanes:[],sqs:0,sqt:0,sqcd:520});G.boss=b;
 b.parts=[b.pL=mkPart(b,-(W/2-WALL4-22),40,24,230,'LEFT WALL CANNON','debris'),b.pR=mkPart(b,W/2-WALL4-22,40,24,230,'RIGHT WALL CANNON','debris'),b.pM=mkPart(b,0,-58,26,240,'LASER PRISM','debris')];musicStart(8);
 later(160,()=>{G.banner={t:30,a:'🎯 BREAK BOTH WALL CANNONS + PRISM, THEN HIT THE EYE',b:'RED LANES = LASER · STAND IN A GREEN LANE',small:true,c:C4.ice2};});}
XU.boss4=e=>{const t=e.t;
 if(e.dying){e.dT++;if(e.dT===1){strobe(200);sfx.bossDie();G4.sq=0;}if(e.dT%4===0)boom(e.x+rnd(-120,120),e.y+rnd(-60,60),rnd(1,2.4),['eb','cy','am'][e.dT%3]);G.shake=Math.max(G.shake,7);
  if(e.dT===200){boom(e.x,e.y,5,'eb');boom(e.x,e.y,4,'cy');flash(1,'255,230,235');sfx.bossDie();e.act=false;G.boss=null;later(150,stageClear);}return;}
 if(e.y<130){e.y+=1;e.invT=Math.max(e.invT,2);return;}
 const ph=e.phase,L=e.pL.act,R=e.pR.act,M=e.pM.act;e.r=ph<3?24:34;e.x=W/2+Math.sin(t*.01)*(ph===3?30:12);
 if(e.invT>0)return;
 // laser lanes: 0 idle, 1 telegraph (60f), 2 fire (40f)
 if(e.ls===0&&(M||ph===3)&&--e.lcd<=0&&!e.sqs){e.ls=1;e.lt=0;const n=5,safe=new Set();const a=(Math.random()*n)|0;safe.add(a);safe.add((a+2+((Math.random()*2)|0))%n);e.lanes=[];for(let i=0;i<n;i++)if(!safe.has(i))e.lanes.push(i);sfx.hiss();}
 if(e.ls){e.lt++;if(e.ls===1&&e.lt>(ph===3?66:80)){e.ls=2;e.lt=0;sfx.flame();G.shake=8;}else if(e.ls===2){const lw=(W-WALL4*2)/5,li=Math.floor((P.x-WALL4)/lw);if(P.dead<=0&&e.lanes.includes(li)&&P.y>e.y){G.hitBy='laser';playerHit();}if(e.lt>40){e.ls=0;e.lcd=ph===3?240:300;}}return;}
 // crusher squeeze: walls close in (telegraphed), hold, reopen
 if(!e.sqs&&--e.sqcd<=0){e.sqs=1;e.sqt=0;G.banner={t:40,a:'◀ WALLS CLOSING ▶ — STAY CENTRE',b:'',small:true,c:C4.cr};sfx.warn();}
 if(e.sqs){e.sqt++;const T=e.sqt,mx=70;G4.sq=T<60?0:T<100?mx*(T-60)/40:T<300?mx:T<340?mx*(1-(T-300)/40):0;if(T>=340){e.sqs=0;e.sqcd=600;G4.sq=0;}}
 const sp=1+ph*.1;
 if(L&&t%120===0){const y=e.y+40;for(let k=0;k<3;k++)later(k*10,()=>eShot(WALL4+22,y,aim(WALL4+22,y),2.0*sp));}
 if(R&&t%120===60){const y=e.y+40;for(let k=0;k<3;k++)later(k*10,()=>eShot(W-WALL4-22,y,aim(W-WALL4-22,y),2.0*sp));}
 if(ph>=1&&t%14===0){e.hA+=.27;eShot(e.x,e.y,e.hA,1.8);eShot(e.x,e.y,e.hA+Math.PI,1.8);}
 if(ph>=2&&t%120===60)ring(e.x,e.y,10,t*.03,1.6,true);
 if(ph===3&&t%70===0)fan(e.x,e.y,aim(e.x,e.y),5,.9,2.1,true);};
// --- stage flow
const EV4=[[0,()=>{G.banner={t:0,a:'STAGE 4',b:'THE FROZEN CITADEL'};}],
 [160,()=>{hint4('wt','WALL TURRETS GLOW RED BEFORE FIRING — SHOOT THEM',C4.cr);wturret(-1,60);}],[260,()=>wturret(1,60)],[360,()=>sentries(120,5)],[480,()=>sentries(240,5)],
 [640,()=>{hint4('gate','LASER GATE: DASHED = WARNING · SOLID = DEADLY',C4.cr);gate(0);}],[820,()=>gate(80)],[900,()=>{wturret(-1);wturret(1);}],
 [1100,()=>{hint4('cr','CRUSHERS SLAM SHUT — FLY THROUGH THE GREEN GAP',C4.ice2);crusher(W/2,100);}],[1320,()=>crusher(120,100)],[1540,()=>crusher(240,100)],
 [1700,()=>sentries(180,7)],[1850,()=>{hint4('sw','SWEEP LASERS PIVOT FROM THE WALL — WATCH THE ARC',C4.cr);sweep(-1);}],[2100,()=>sweep(1)],[2200,()=>{wturret(-1);wturret(1);}],
 [2400,()=>{gate(0);sentries(100,5);}],[2600,()=>crusher(W/2,90)],[2700,()=>wturret(-1)],[2800,()=>wturret(1)],[2950,()=>sweep(-1)],[3050,()=>sentries(260,6)],
 [3250,()=>gate(60)],[3400,()=>{crusher(110,95);}],[3600,()=>{wturret(-1);wturret(1);sentries(180,6);}],[3800,()=>sweep(1)],[4000,()=>gate(0)],[4150,()=>crusher(W/2,90)],
 [4500,()=>warning4()],[BOSS4D,()=>spawnBoss4()]];
function s4reset(d){Object.assign(G4,{d:d||0,spd:1.4,ev:0,gates:[],sweeps:[],crush:[],hint:{},sq:0});if(G4.d>0){while(G4.ev<EV4.length&&EV4[G4.ev][0]<G4.d)G4.ev++;for(const k of['wt','gate','cr','sw'])G4.hint[k]=1;}}
function toStage4(){if(G.state!=='play')return;G.stage=4;s4reset(0);G.hold=false;G.boss=null;EB.clear();G.shield=Math.min(G.maxSh,G.shield+1);G.score+=G.lives*10000;
 G.banner={t:0,a:'STAGE 3 CLEAR',b:'+'+(G.lives*10000).toLocaleString()+' · SHIELD +1'};musicStart(7);G.ev4Delay=150;}
function gateState(g){const t=(g.t)%200;return t<50?0:t<130?1:t<170?2:0;} // 0 off,1 warn,2 fire
function sweepAng(s){return s.side<0?(.15+.55*(1-Math.cos(s.t*.022))):(Math.PI-.15-.55*(1-Math.cos(s.t*.022)));}
function s4Update(){if(G.ev4Delay>0){G.ev4Delay--;return;}
 G4.d+=G4.spd;while(G4.ev<EV4.length&&EV4[G4.ev][0]<=G4.d-0){EV4[G4.ev][1]();G4.ev++;}
 if(window.NG&&NG.auto)NG.auto();
 const alive=P.dead<=0&&G.lives>0;
 for(let i=G4.gates.length-1;i>=0;i--){const g=G4.gates[i];g.t++;const y=s4y(g.d);if(y>H+30){G4.gates.splice(i,1);continue;}if(gateState(g)===2&&(g.t%200)===130)sfx.zap();if(alive&&gateState(g)===2&&Math.abs(P.y-y)<9){G.hitBy='gate';playerHit();}}
 for(let i=G4.sweeps.length-1;i>=0;i--){const s=G4.sweeps[i];s.t++;const y=s4y(s.d);if(y>H+60){G4.sweeps.splice(i,1);continue;}s.y=y;if(s.t<100||!alive)continue;const a=sweepAng(s),ox=s.side<0?WALL4:W-WALL4,dx=P.x-ox,dy=P.y-y,u=dx*Math.cos(a)+dy*Math.sin(a),v=Math.abs(-dx*Math.sin(a)+dy*Math.cos(a));if(u>0&&u<240&&v<7){G.hitBy='sweep';playerHit();}}
 for(let i=G4.crush.length-1;i>=0;i--){const c=G4.crush[i];c.t++;if(s4y(c.d)>H+90){G4.crush.splice(i,1);}}
 if(alive){const sp=s4span(P.y);if(P.x<sp.L+9||P.x>sp.R-9){const crushed=sp.cr;P.x=clamp(P.x,sp.L+9,sp.R-9);if(crushed&&P.x>sp.L+8&&P.x<sp.R-8){}if(crushed){G.hitBy='crusher';playerHit();}}}}
// --- drawing
function s4DrawBack(){ctx.fillStyle='rgba(7,16,30,.9)';ctx.fillRect(0,0,W,H);const off=G4.d%60;
 // floor tiles: frozen steel plates
 ctx.strokeStyle='rgba(159,216,255,.10)';ctx.lineWidth=1;for(let y=-60+off;y<H+60;y+=60){ctx.beginPath();ctx.moveTo(WALL4,y);ctx.lineTo(W-WALL4,y);ctx.stroke();}for(let x=WALL4+48;x<W-WALL4;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
 // centre runner (crimson carpet light strip)
 ctx.fillStyle='rgba(255,42,74,.06)';ctx.fillRect(W/2-22,0,44,H);for(let y=-60+((G4.d*1.0)%60);y<H;y+=60){ctx.fillStyle='rgba(255,42,74,.25)';ctx.fillRect(W/2-2,y,4,20);}
 // gates telegraph + beams
 for(const g of G4.gates){const y=s4y(g.d),st=gateState(g);for(const x of[WALL4-4,W-WALL4+4]){ctx.fillStyle=st?C4.cr:'#5a6a80';ctx.fillRect(x-6,y-8,12,16);}
  if(st===1){const fl=(g.t>>2)%2;ctx.setLineDash([10,8]);ctx.strokeStyle=fl?'#ffd0d8':C4.cr;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(WALL4,y);ctx.lineTo(W-WALL4,y);ctx.stroke();ctx.setLineDash([]);if(fl)txt('! LASER !',W/2,y-20,'#ffd0d8',13,'center');}
  if(st===2){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,42,74,.35)';ctx.fillRect(WALL4,y-8,W-WALL4*2,16);ctx.fillStyle='#ffe6ea';ctx.fillRect(WALL4,y-2,W-WALL4*2,4);ctx.globalCompositeOperation='source-over';}}
 // sweep lasers
 for(const s of G4.sweeps){const y=s4y(s.d),ox=s.side<0?WALL4:W-WALL4,a=sweepAng(s);ctx.fillStyle=C4.cr;ctx.beginPath();ctx.arc(ox,y,11,0,TAU);ctx.fill();ctx.strokeStyle=C4.ice;ctx.lineWidth=2;ctx.stroke();
  if(s.t<100){ctx.setLineDash([6,6]);ctx.strokeStyle='rgba(255,140,160,.7)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(ox,y,240,s.side<0?.15:Math.PI-1.25,s.side<0?1.25:Math.PI-.15);ctx.stroke();ctx.beginPath();ctx.moveTo(ox,y);ctx.lineTo(ox+Math.cos(a)*240,y+Math.sin(a)*240);ctx.stroke();ctx.setLineDash([]);if((s.t>>2)%2)txt('⚠ SWEEP',ox+(s.side<0?60:-60),y-18,'#ffd0d8',12,'center');}
  else{ctx.globalCompositeOperation='lighter';ctx.strokeStyle='rgba(255,42,74,.45)';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(ox,y);ctx.lineTo(ox+Math.cos(a)*240,y+Math.sin(a)*240);ctx.stroke();ctx.strokeStyle='#ffe6ea';ctx.lineWidth=3;ctx.stroke();ctx.globalCompositeOperation='source-over';}}
 // crushers: safe-gap highlight during warning
 for(const c of G4.crush){const y=s4y(c.d),st=crushState(c);if(st===1||st===0&&c.t%240>60){const fl=(c.t>>2)%2;ctx.fillStyle='rgba(93,255,154,'+(fl?.22:.12)+')';ctx.fillRect(c.gx-c.gap/2,y-c.len/2,c.gap,c.len);ctx.strokeStyle='#5dff9a';ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.strokeRect(c.gx-c.gap/2,y-c.len/2,c.gap,c.len);ctx.setLineDash([]);if(st===1&&fl){txt('▶',WALL4+14,y-8,C4.cr,16,'center');txt('◀',W-WALL4-14,y-8,C4.cr,16,'center');txt('SAFE',c.gx,y-8,'#5dff9a',13,'center');}}}}
function s4DrawFront(){// walls (drawn over gameplay so wall-mounted stuff reads as embedded)
 const off=G4.d%80;for(const s of[-1,1]){const x0=s<0?0:W-WALL4;ctx.fillStyle=C4.st;ctx.fillRect(x0,0,WALL4,H);for(let y=-80+off;y<H;y+=80){ctx.fillStyle='#24375a';ctx.fillRect(x0+3,y+4,WALL4-6,72);ctx.fillStyle='rgba(232,246,255,.55)';ctx.fillRect(s<0?WALL4-4:W-WALL4,y,4,80);ctx.fillStyle=C4.cr;ctx.fillRect(x0+WALL4/2-3,y+36,6,6);}
  ctx.strokeStyle=C4.ice2;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(s<0?WALL4:W-WALL4,0);ctx.lineTo(s<0?WALL4:W-WALL4,H);ctx.stroke();
  // icicles
  ctx.fillStyle='rgba(232,246,255,.8)';for(let y=-80+off+20;y<H;y+=80){const xx=s<0?WALL4:W-WALL4;ctx.beginPath();ctx.moveTo(xx,y);ctx.lineTo(xx-s*-8,y+5);ctx.lineTo(xx,y+10);ctx.fill();}}
 // crusher blocks
 for(const c of G4.crush){const y=s4y(c.d),w=crushW(c);if(w<=0)continue;const gl=c.gx-c.gap/2,gr=c.gx+c.gap/2,l=Math.min(WALL4+w*2,gl),r=Math.max(W-WALL4-w*2,gr);
  for(const[a,b]of[[WALL4,l],[r,W-WALL4]]){if(b-a<=0)continue;ctx.fillStyle='#2a3e62';ctx.fillRect(a,y-c.len/2,b-a,c.len);ctx.strokeStyle=C4.ice;ctx.lineWidth=2;ctx.strokeRect(a,y-c.len/2,b-a,c.len);ctx.fillStyle=C4.cr;for(let yy=y-c.len/2+10;yy<y+c.len/2;yy+=22)ctx.fillRect(a<W/2?b-8:a+2,yy,6,12);}}
 // squeeze walls (boss)
 if(G4.sq>0){for(const s of[-1,1]){const x0=s<0?WALL4:W-WALL4-G4.sq;ctx.fillStyle='#2a3e62';ctx.fillRect(x0,0,G4.sq,H);ctx.fillStyle=C4.cr;ctx.fillRect(s<0?WALL4+G4.sq-4:W-WALL4-G4.sq,0,4,H);}}
 const b=G.boss;if(b&&b.act&&b.type==='boss4'){if(b.sqs&&b.sqt<60&&(b.sqt>>2)%2){txt('▶▶',WALL4+30,H/2,C4.cr,22,'center',8);txt('◀◀',W-WALL4-30,H/2,C4.cr,22,'center',8);}
  if(b.ls){const lw=(W-WALL4*2)/5;for(let i=0;i<5;i++){const x=WALL4+i*lw,bad=b.lanes.includes(i);if(b.ls===1){const fl=(b.lt>>2)%2;ctx.fillStyle=bad?'rgba(255,42,74,'+(fl?.22:.12)+')':'rgba(93,255,154,.12)';ctx.fillRect(x+2,b.y,lw-4,H-b.y);if(bad){ctx.setLineDash([10,8]);ctx.strokeStyle=C4.cr;ctx.lineWidth=2;ctx.strokeRect(x+3,b.y,lw-6,H-b.y);ctx.setLineDash([]);}else txt('SAFE',x+lw/2,H*.62,'#5dff9a',13,'center',6);}
    else if(bad){ctx.globalCompositeOperation='lighter';ctx.fillStyle='rgba(255,42,74,.5)';ctx.fillRect(x+6,b.y,lw-12,H-b.y);ctx.fillStyle='#ffe6ea';ctx.fillRect(x+lw/2-3,b.y,6,H-b.y);ctx.globalCompositeOperation='source-over';}}}}}
XD.wturret=(e,fl)=>{const s=e.side;ctx.fillStyle=fl?'#fff':'#3a4e72';ctx.fillRect(e.x-(s<0?14:4),e.y-14,18,28);ctx.strokeStyle=C4.ice;ctx.lineWidth=2;ctx.strokeRect(e.x-(s<0?14:4),e.y-14,18,28);
 const a=aim(e.x,e.y);ctx.strokeStyle=e.gl?C4.cr:C4.ice2;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(e.x,e.y);ctx.lineTo(e.x+Math.cos(a)*18,e.y+Math.sin(a)*18);ctx.stroke();
 ctx.beginPath();ctx.arc(e.x,e.y,7,0,TAU);ctx.fillStyle=e.gl&&(G.t>>2)%2?'#fff':C4.cr;ctx.fill();if(e.gl)glowDot('eb',e.x,e.y,2,.6);};
XD.sentry=(e,fl)=>{ctx.save();ctx.translate(e.x,e.y);ctx.rotate(e.t*.08);ctx.fillStyle=fl?'#fff':C4.ice;ctx.beginPath();for(let k=0;k<6;k++){const a=k/6*TAU;ctx.lineTo(Math.cos(a)*11,Math.sin(a)*11);ctx.lineTo(Math.cos(a+.52)*4,Math.sin(a+.52)*4);}ctx.closePath();ctx.fill();ctx.restore();blob(e.x,e.y,3,C4.cr);};
XD.boss4=(e,fl)=>{const x=e.x+(e.dying?rnd(-4,4):0),y=e.y;glowDot('eb',x,y,6,.3);
 // gate beam spanning the corridor
 ctx.fillStyle='#1c2c4c';ctx.fillRect(WALL4,y-30,W-WALL4*2,60);ctx.strokeStyle=C4.ice2;ctx.lineWidth=2;ctx.strokeRect(WALL4,y-30,W-WALL4*2,60);ctx.fillStyle=C4.cr;for(let k=0;k<8;k++)ctx.fillRect(WALL4+12+k*((W-WALL4*2-24)/7)-3,y+24,6,6);
 for(const[pp,s]of[[e.pL,-1],[e.pR,1]]){const cx=W/2+s*(W/2-WALL4-22),cy=y+40;if(pp&&pp.act){ctx.fillStyle='#3a4e72';ctx.fillRect(cx-18,cy-22,36,40);ctx.strokeStyle=C4.ice;ctx.lineWidth=2;ctx.strokeRect(cx-18,cy-22,36,40);ctx.fillStyle=C4.cr;ctx.fillRect(cx-5,cy+10,10,18);drawPart2(pp);}else{blob(cx,cy,10,'#0a0f18',C4.cr);if(G.t%6===0)part(3,cx,cy,0,-1,30,.7);}}
 const M=e.pM&&e.pM.act;if(M){ctx.save();ctx.translate(x,y-58);ctx.rotate(G.t*.03);ctx.fillStyle=e.ls===1?'#ff8095':C4.ice;ctx.beginPath();ctx.moveTo(0,-24);ctx.lineTo(20,0);ctx.lineTo(0,24);ctx.lineTo(-20,0);ctx.closePath();ctx.fill();ctx.strokeStyle=C4.cr;ctx.lineWidth=2;ctx.stroke();ctx.restore();drawPart2(e.pM);}
 const arm=partsAlive(e)>0;ctx.beginPath();ctx.arc(x,y,24,0,TAU);ctx.fillStyle=fl?'#556':'#0a0f18';ctx.fill();neonStroke(arm?'#5a6a80':C4.cr,3);
 if(arm){ctx.fillStyle='#5a6a80';ctx.fillRect(x-24,y-4,48,8);}glowDot(arm?'cy':'eb',x,y,arm?1.4:2.8+.6*Math.sin(G.t*.4),arm?.4:.85);if(!arm){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,6,0,TAU);ctx.fill();}};
