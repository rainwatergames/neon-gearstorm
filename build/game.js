/*! NEON GEARSTORM v0.2 — © 2026 Rainwater Games (Jeff Rainwater). All rights reserved.
 *  Unauthorized copying, distribution or modification of this file is prohibited. */
(()=>{'use strict';
// ---- sprites.js : pre-rendered neon/steampunk sprites (glow baked once for speed)
const COL={cy:'#2ef9ff',mg:'#ff3df0',am:'#ffb52e',li:'#a6ff3a',br:'#c9963f',brD:'#5e3f17',cu:'#c8673a',cuD:'#4a2210',eb:'#ff2450'};
const TAU=Math.PI*2;
function mk(w,h,fn,s){s=s||2;const c=document.createElement('canvas');c.width=Math.ceil(w*s);c.height=Math.ceil(h*s);const g=c.getContext('2d');g.scale(s,s);g.translate(w/2,h/2);fn(g);c.w=w;c.h=h;return c;}
function glow(g,col,b){g.shadowColor=col;g.shadowBlur=b;}
function noGlow(g){g.shadowBlur=0;}
function gearPath(g,r,teeth,d){g.beginPath();const st=TAU/teeth;for(let i=0;i<teeth;i++){const a=i*st;g.lineTo(Math.cos(a)*(r-d),Math.sin(a)*(r-d));g.lineTo(Math.cos(a+st*.15)*r,Math.sin(a+st*.15)*r);g.lineTo(Math.cos(a+st*.45)*r,Math.sin(a+st*.45)*r);g.lineTo(Math.cos(a+st*.6)*(r-d),Math.sin(a+st*.6)*(r-d));}g.closePath();}
function brassGrad(g,r,dark){const gr=g.createRadialGradient(-r*.35,-r*.35,1,0,0,r*1.1);gr.addColorStop(0,'#f6d68e');gr.addColorStop(.5,COL.br);gr.addColorStop(1,dark||COL.brD);return gr;}
function rivets(g,pts){g.fillStyle='#2a1606';for(const[x,y]of pts){g.beginPath();g.arc(x,y,1.1,0,TAU);g.fill();}g.fillStyle='rgba(255,230,170,.7)';for(const[x,y]of pts){g.beginPath();g.arc(x-.35,y-.35,.45,0,TAU);g.fill();}}
function gearSpr(r,teeth,col,dark,eye){const p=r+7;return mk(p*2,p*2,g=>{gearPath(g,r,teeth,r*.2);g.fillStyle=brassGrad(g,r,dark);g.fill();glow(g,col,7);g.strokeStyle=col;g.lineWidth=1.5;g.stroke();noGlow(g);
 g.beginPath();g.arc(0,0,r*.62,0,TAU);g.strokeStyle='rgba(40,20,5,.85)';g.lineWidth=Math.max(1,r*.08);g.stroke();
 for(let i=0;i<5;i++){const a=i/5*TAU;g.beginPath();g.arc(Math.cos(a)*r*.42,Math.sin(a)*r*.42,r*.12,0,TAU);g.fillStyle='#140a04';g.fill();}
 g.beginPath();g.arc(0,0,r*.2,0,TAU);glow(g,eye||col,8);g.fillStyle=eye||col;g.fill();noGlow(g);});}
function dotSpr(col,r){return mk(r*4,r*4,g=>{const gr=g.createRadialGradient(0,0,0,0,0,r*2);gr.addColorStop(0,'#fff');gr.addColorStop(.22,col);gr.addColorStop(.5,col+'55');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(-r*2,-r*2,r*4,r*4);},1);}
function ebSpr(r){const p=r*2.3;return mk(p*2,p*2,g=>{glow(g,COL.eb,r*1.5);g.beginPath();g.arc(0,0,r,0,TAU);g.fillStyle=COL.eb;g.fill();g.fill();noGlow(g);g.beginPath();g.arc(0,0,r*.55,0,TAU);g.fillStyle='#fff';g.fill();});}
function whiteOf(c){const w=document.createElement('canvas');w.width=c.width;w.height=c.height;const g=w.getContext('2d');g.drawImage(c,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba(255,255,255,.9)';g.fillRect(0,0,w.width,w.height);w.w=c.w;w.h=c.h;return w;}
const S={};
function buildSprites(){
 S.player=mk(36,40,g=>{g.beginPath();g.moveTo(0,-16);g.lineTo(5,-4);g.lineTo(14,6);g.lineTo(13,12);g.lineTo(4,8);g.lineTo(3,14);g.lineTo(-3,14);g.lineTo(-4,8);g.lineTo(-13,12);g.lineTo(-14,6);g.lineTo(-5,-4);g.closePath();
  const gr=g.createLinearGradient(-14,0,14,0);gr.addColorStop(0,COL.cuD);gr.addColorStop(.5,'#f0c983');gr.addColorStop(1,COL.cuD);g.fillStyle=gr;g.fill();glow(g,COL.cy,7);g.strokeStyle=COL.cy;g.lineWidth=1.5;g.stroke();g.stroke();
  g.beginPath();g.ellipse(0,-3,2.4,5,0,0,TAU);glow(g,COL.mg,6);g.fillStyle=COL.mg;g.fill();noGlow(g);
  g.fillStyle='#6b4a1f';g.fillRect(-10,4,3,5);g.fillRect(7,4,3,5);rivets(g,[[-9,9],[9,9],[0,9],[-4,2],[4,2]]);});
 S.drone=mk(26,24,g=>{g.beginPath();g.moveTo(0,10);g.lineTo(10,-2);g.lineTo(7,-9);g.lineTo(-7,-9);g.lineTo(-10,-2);g.closePath();g.fillStyle=brassGrad(g,11,COL.cuD);g.fill();glow(g,COL.am,7);g.strokeStyle=COL.am;g.lineWidth=1.4;g.stroke();noGlow(g);
  g.fillStyle='#2a1606';g.fillRect(-5,-12,3,4);g.fillRect(2,-12,3,4);g.beginPath();g.arc(0,0,2.6,0,TAU);glow(g,COL.mg,6);g.fillStyle=COL.mg;g.fill();noGlow(g);rivets(g,[[-6,-6],[6,-6]]);});
 S.swooper=gearSpr(10,8,COL.mg,COL.cuD,COL.cy);
 S.turret=mk(36,36,g=>{g.beginPath();for(let i=0;i<8;i++){const a=i/8*TAU+TAU/16;g.lineTo(Math.cos(a)*15,Math.sin(a)*15);}g.closePath();g.fillStyle=brassGrad(g,15,'#3a2410');g.fill();glow(g,COL.am,6);g.strokeStyle=COL.am;g.lineWidth=1.3;g.stroke();noGlow(g);
  g.beginPath();g.arc(0,0,8,0,TAU);g.fillStyle='#24140a';g.fill();g.strokeStyle=COL.cu;g.lineWidth=1.5;g.stroke();
  g.fillStyle='#1a0f08';g.fillRect(-14,-14,6,6);g.strokeStyle='#8a5a2a';g.strokeRect(-14,-14,6,6);
  rivets(g,[[11,0],[-11,0],[0,11],[0,-11],[8,8],[-8,8],[8,-8]]);});
 S.barrel=mk(10,24,g=>{g.fillStyle=COL.cu;g.fillRect(-2.5,-11,5,14);g.fillStyle='#3a1a0a';g.fillRect(-3.5,-11,7,3);glow(g,COL.mg,6);g.fillStyle=COL.mg;g.fillRect(-2,-12,4,2);noGlow(g);});
 S.carrier=mk(60,34,g=>{g.beginPath();g.ellipse(0,0,24,11,0,0,TAU);g.fillStyle=brassGrad(g,22,'#3a2610');g.fill();glow(g,COL.li,8);g.strokeStyle=COL.li;g.lineWidth=1.6;g.stroke();noGlow(g);
  g.strokeStyle='rgba(60,30,8,.9)';g.lineWidth=1;for(let i=-2;i<=2;i++){g.beginPath();g.ellipse(i*7,0,2,10.5,0,0,TAU);g.stroke();}
  g.fillStyle='#2a1606';g.fillRect(-7,9,14,6);glow(g,COL.li,6);g.fillStyle=COL.li;g.fillRect(-4,11,8,2);noGlow(g);
  g.beginPath();g.moveTo(-24,0);g.lineTo(-29,-7);g.lineTo(-29,7);g.closePath();g.fillStyle=COL.cu;g.fill();rivets(g,[[-14,-5],[14,-5],[0,-8]]);});
 S.gunship=mk(140,96,g=>{g.beginPath();g.moveTo(0,40);g.lineTo(30,26);g.lineTo(52,6);g.lineTo(50,-22);g.lineTo(28,-36);g.lineTo(-28,-36);g.lineTo(-50,-22);g.lineTo(-52,6);g.lineTo(-30,26);g.closePath();
  const gr=g.createLinearGradient(-52,0,52,0);gr.addColorStop(0,'#3a1c0c');gr.addColorStop(.5,'#d9a45a');gr.addColorStop(1,'#3a1c0c');g.fillStyle=gr;g.fill();glow(g,COL.am,10);g.strokeStyle=COL.am;g.lineWidth=2;g.stroke();noGlow(g);
  g.strokeStyle='rgba(50,24,8,.9)';g.lineWidth=1.2;g.beginPath();g.moveTo(-40,-10);g.lineTo(40,-10);g.moveTo(-34,12);g.lineTo(34,12);g.stroke();
  for(const sx of[-18,18]){g.fillStyle='#24140a';g.fillRect(sx-6,-46,12,18);g.strokeStyle=COL.cu;g.lineWidth=1.5;g.strokeRect(sx-6,-46,12,18);g.fillStyle=COL.cu;g.fillRect(sx-8,-48,16,4);}
  g.beginPath();g.arc(0,4,14,0,TAU);g.fillStyle='#1a0c06';g.fill();glow(g,COL.mg,10);g.strokeStyle=COL.mg;g.lineWidth=2;g.stroke();g.beginPath();g.arc(0,4,6,0,TAU);g.fillStyle=COL.mg;g.fill();noGlow(g);
  g.fillStyle='#2a1606';g.fillRect(-36,22,8,12);g.fillRect(28,22,8,12);
  const rv=[];for(let i=-4;i<=4;i++){rv.push([i*10,-30]);rv.push([i*8,22]);}rivets(g,rv);});
 S.gGear=gearSpr(17,10,COL.cy,'#3a2410');
 S.boss=mk(240,190,g=>{
  // side frames / pipes
  g.fillStyle='#2a160a';g.fillRect(-110,-20,220,40);g.strokeStyle='#8a5a2a';g.lineWidth=2;g.strokeRect(-110,-20,220,40);
  for(const sx of[-1,1]){g.fillStyle='#3a2210';g.beginPath();g.moveTo(sx*60,-50);g.lineTo(sx*115,-30);g.lineTo(sx*115,40);g.lineTo(sx*60,62);g.closePath();g.fill();glow(g,COL.mg,8);g.strokeStyle=COL.mg;g.lineWidth=1.6;g.stroke();noGlow(g);
   g.strokeStyle=COL.cu;g.lineWidth=4;g.beginPath();g.moveTo(sx*62,52);g.quadraticCurveTo(sx*100,70,sx*108,30);g.stroke();}
  for(const sx of[-34,0,34]){g.fillStyle='#1c0f07';g.fillRect(sx-8,-92,16,30);g.strokeStyle=COL.cu;g.lineWidth=2;g.strokeRect(sx-8,-92,16,30);g.fillStyle=COL.cu;g.fillRect(sx-11,-94,22,5);}
  // clock face
  g.beginPath();g.arc(0,0,66,0,TAU);g.fillStyle=brassGrad(g,66,'#3a2410');g.fill();glow(g,COL.cy,14);g.strokeStyle=COL.cy;g.lineWidth=3;g.stroke();noGlow(g);
  g.beginPath();g.arc(0,0,54,0,TAU);g.fillStyle='#120a12';g.fill();glow(g,COL.am,8);g.strokeStyle=COL.am;g.lineWidth=1.5;g.stroke();
  for(let i=0;i<12;i++){const a=i/12*TAU;g.beginPath();g.moveTo(Math.cos(a)*44,Math.sin(a)*44);g.lineTo(Math.cos(a)*(i%3?49:52),Math.sin(a)*(i%3?49:52));g.strokeStyle=i%3?COL.am:COL.cy;g.lineWidth=i%3?2:3.5;g.stroke();}
  noGlow(g);const rv=[];for(let i=0;i<20;i++){const a=i/20*TAU;rv.push([Math.cos(a)*60,Math.sin(a)*60]);}rivets(g,rv);});
 S.bGear=gearSpr(42,14,COL.cy,'#3a2410',COL.mg);
 S.bGear2=gearSpr(22,10,COL.am,'#3a2410');
 for(const k of['player','drone','swooper','turret','carrier','gunship','boss'])S[k+'W']=whiteOf(S[k]);
 S.eb=ebSpr(4);S.ebB=ebSpr(6.5);
 S.pbS=mk(8,18,g=>{glow(g,COL.am,6);g.fillStyle=COL.am;g.beginPath();g.ellipse(0,0,2.4,7,0,0,TAU);g.fill();noGlow(g);g.fillStyle='#fff6';g.fillRect(-.8,-5,1.6,8);});
 S.pbT=mk(8,14,g=>{glow(g,COL.li,6);g.fillStyle=COL.li;g.beginPath();g.ellipse(0,0,2,5,0,0,TAU);g.fill();});
 S.pbL=[5,9,14].map(w=>mk(w+10,40,g=>{glow(g,COL.cy,8);g.fillStyle=COL.cy;g.fillRect(-w/2,-15,w,30);noGlow(g);g.fillStyle='rgba(255,255,255,.85)';g.fillRect(-w/5,-15,w/2.5,30);}));
 S.dot={};for(const[k,c]of Object.entries({cy:COL.cy,mg:COL.mg,am:COL.am,li:COL.li,eb:COL.eb,w:'#ffffff'}))S.dot[k]=dotSpr(c,8);
 S.debris=gearSpr(5,6,COL.am,'#3a2410');
 S.smoke=mk(32,32,g=>{const gr=g.createRadialGradient(0,0,0,0,0,16);gr.addColorStop(0,'rgba(220,220,235,.55)');gr.addColorStop(1,'rgba(200,200,220,0)');g.fillStyle=gr;g.fillRect(-16,-16,32,32);},1);
 S.bgGear=[gearSpr(60,16,'rgba(46,249,255,.9)','#1a1020'),gearSpr(38,12,'rgba(255,61,240,.9)','#1a1020'),gearSpr(26,9,'rgba(255,181,46,.9)','#1a1020')];
}

// ---- audio.js : WebAudio synth engine v0.2 — OutRun/Truxton-style music + chunky SFX (no assets)
// © 2026 Rainwater Games (Jeff Rainwater). All rights reserved.
const AU={c:null,m:null,mus:null,sfx:null,duck:null,rev:null,grev:null,gate:null,dly:null,dist:null,nb:null,muted:false,on:false,step:0,next:0,mode:0,timer:null,lastShot:0,
 origin:0,sp:.125,bpm:118,musV:+(lsGet('ngs_musv')||.8),sfxV:+(lsGet('ngs_sfxv')||.8)};
function lsGet(k){try{return localStorage.getItem(k);}catch(_){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(_){}}
function irBuf(a,dur,decay){const n=Math.floor(a.sampleRate*dur),b=a.createBuffer(2,n,a.sampleRate);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,decay);}return b;}
function auInit(){if(AU.c){if(AU.c.state!=='running'&&G.state!=='pause')AU.c.resume();return;}const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const a=new C();AU.c=a;
 // master bus: glue compressor -> brickwall-ish limiter -> out
 AU.m=a.createGain();AU.m.gain.value=AU.muted?0:.9;const comp=a.createDynamicsCompressor();comp.threshold.value=-20;comp.knee.value=8;comp.ratio.value=4;comp.attack.value=.004;comp.release.value=.18;
 const lim=a.createDynamicsCompressor();lim.threshold.value=-3;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=.001;lim.release.value=.08;
 const post=a.createGain();post.gain.value=1.25;AU.m.connect(comp);comp.connect(post);post.connect(lim);lim.connect(a.destination);
 AU.mus=a.createGain();AU.mus.connect(AU.m);AU.sfx=a.createGain();AU.sfx.connect(AU.m);applyVol();
 AU.duck=a.createGain();AU.duck.connect(AU.mus); // sidechain-style ducked bus (bass, pads, lead)
 // reverb (convolver) shared by music + sfx, gated reverb for snare
 AU.rev=a.createConvolver();AU.rev.buffer=irBuf(a,2.2,3);const rg=a.createGain();rg.gain.value=.5;AU.rev.connect(rg);rg.connect(AU.mus);
 AU.grev=a.createConvolver();AU.grev.buffer=irBuf(a,.9,1.2);AU.gate=a.createGain();AU.gate.gain.value=0;AU.grev.connect(AU.gate);AU.gate.connect(AU.mus);
 AU.srev=a.createGain();AU.srev.gain.value=.35;AU.srev.connect(AU.rev);AU.sfx.connect(AU.srev);
 // tempo-synced feedback delay for lead/arp
 AU.dly=a.createDelay(1);AU.dly.delayTime.value=.375;const fb=a.createGain();fb.gain.value=.38;const dl=a.createBiquadFilter();dl.type='lowpass';dl.frequency.value=2600;AU.dly.connect(dl);dl.connect(fb);fb.connect(AU.dly);const dw=a.createGain();dw.gain.value=.45;dl.connect(dw);dw.connect(AU.duck);
 // distortion for boss bass
 AU.dist=a.createWaveShaper();const cu=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i/512-1;cu[i]=Math.tanh(x*6)*.8;}AU.dist.curve=cu;AU.dist.oversample='2x';const dg=a.createGain();dg.gain.value=.55;AU.dist.connect(dg);dg.connect(AU.duck);
 const n=a.sampleRate;AU.nb=a.createBuffer(1,n,n);const d=AU.nb.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;}
function applyVol(){if(!AU.mus)return;AU.mus.gain.value=.55*AU.musV*AU.musV;AU.sfx.gain.value=.75*AU.sfxV*AU.sfxV;}
function setVol(k,v){AU[k]=v;lsSet(k==='musV'?'ngs_musv':'ngs_sfxv',v);applyVol();}
// generic voices
function tone(type,f0,f1,dur,vol,dest,t0,fq,atk,send){const a=AU.c;if(!a)return;t0=t0||a.currentTime;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f0,t0);if(f1!==f0)o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t0+dur);
 if(atk){g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(vol,t0+atk);}else g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);let n=o;if(fq){const f=a.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(fq,t0);f.frequency.exponentialRampToValueAtTime(Math.max(80,fq*.15),t0+dur);o.connect(f);n=f;}n.connect(g);g.connect(dest||AU.sfx);if(send)g.connect(send);o.start(t0);o.stop(t0+dur+.03);return o;}
function noise(dur,vol,ftype,f0,f1,dest,t0,q,send){const a=AU.c;if(!a)return;t0=t0||a.currentTime;const s=a.createBufferSource();s.buffer=AU.nb;const f=a.createBiquadFilter();f.type=ftype;if(q)f.Q.value=q;f.frequency.setValueAtTime(f0,t0);if(f1!==f0)f.frequency.exponentialRampToValueAtTime(f1,t0+dur);const g=a.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);s.connect(f);f.connect(g);g.connect(dest||AU.sfx);if(send)g.connect(send);s.start(t0,Math.random()*.5);s.stop(t0+dur+.03);}
function sub(f0,f1,dur,vol,t0){tone('sine',f0,f1,dur,vol,AU.sfx,t0);}
const sfx={
 shot(){if(!AU.c)return;const t=AU.c.currentTime;if(t-AU.lastShot<.085)return;AU.lastShot=t;tone('triangle',1700,900,.028,.022,null,t);noise(.012,.012,'highpass',6000,6000,null,t);},
 zap(){tone('sawtooth',1800,300,.06,.025,null,0,4000);noise(.05,.03,'bandpass',4000,1500,null,0,3);},
 boom(s){if(!AU.c)return;s=s||1;const t=AU.c.currentTime,k=Math.min(3,s);
  sub(120+20*Math.random(),32,.28+.12*k,.45+.12*k,t);                 // low-end boom
  tone('square',90,40,.08,.12*k,null,t,600);                            // punch
  noise(.3+.15*k,.32+.1*k,'lowpass',3200,140,null,t,0,AU.srev);         // body
  noise(.12+.05*k,.14,'highpass',3000,1200,null,t+.02);                 // crackle
  if(s>1.4)noise(.18,.1,'bandpass',1800,600,null,t+.06,2);},
 hit(){tone('square',300,200,.025,.012);},
 power(){if(!AU.c)return;const t=AU.c.currentTime;[72,76,79,84,88,91].forEach((m,i)=>{tone('triangle',mf(m),mf(m),.22,.11,null,t+i*.045,0,0,AU.srev);tone('sine',mf(m+12),mf(m+12),.15,.05,null,t+i*.045);});},
 bomb(){if(!AU.c)return;const t=AU.c.currentTime;noise(1.1,.5,'bandpass',180,4200,null,t,1.2,AU.srev);noise(.9,.35,'bandpass',5000,300,null,t+.25,1.5); // whoosh
  sub(110,28,1.6,.9,t+.05);tone('sawtooth',300,30,1.2,.22,null,t,1800);noise(1.6,.55,'lowpass',2600,80,null,t+.05,0,AU.srev);   // boom + sub drop
  tone('sine',60,22,2.2,.6,null,t+.3);},
 die(){if(!AU.c)return;const t=AU.c.currentTime;sfx.boom(2.5);tone('sawtooth',900,40,.9,.25,null,t,3000);tone('square',450,30,1,.12,null,t+.05,1200);noise(1.2,.4,'lowpass',2500,90,null,t,0,AU.srev);},
 warn(){if(!AU.c)return;const t=AU.c.currentTime;for(let i=0;i<4;i++){const s=t+i*.9;tone('sawtooth',380,760,.45,.08,null,s,2200,.05);tone('sawtooth',760,380,.45,.08,null,s+.45,2200);}},
 phase(){if(!AU.c)return;noise(.7,.45,'bandpass',500,4000,null,0,1,AU.srev);tone('triangle',200,900,.5,.2);sub(90,30,.8,.7);},
 bossDie(){if(!AU.c)return;const t=AU.c.currentTime;sub(100,20,3,1,t);noise(3,.6,'lowpass',4000,60,null,t,0,AU.srev);tone('sawtooth',200,25,2.5,.3,null,t,1500);[0,.2,.45,.7].forEach(d=>sfx.boomAt(t+d));},
 boomAt(t){sub(140,30,.5,.5,t);noise(.5,.35,'lowpass',2500,150,null,t);}
};
// ---------- music: 16th-step sequencer, song sections, beat clock
const mf=n=>440*Math.pow(2,(n-69)/12);
// main: A minor  i-VI-III-VII ; boss: D minor i-VI-iv-V
const HOOK=[[0,69,2],[2,72,2],[4,76,5],[10,74,2],[12,72,2],[14,74,2],[16,76,6],[22,72,2],[24,69,4],[28,72,2],[30,74,2],[32,76,2],[34,79,2],[36,76,5],[42,74,2],[44,72,2],[46,74,2],[48,71,6],[54,74,2],[56,76,4],[60,71,4]];
const BHOOK=[[0,74,3],[3,77,3],[6,81,2],[8,79,4],[12,77,4],[16,74,3],[19,70,3],[22,74,2],[24,72,8],[32,67,3],[35,70,3],[38,74,2],[40,72,4],[44,70,4],[48,69,3],[51,73,3],[54,76,2],[56,73,8]];
const SONGS=[{bpm:118,ch:[[57,60,64],[53,57,60],[52,55,60],[55,59,62]],root:[45,41,48,43],hook:HOOK,
 sec:[['intro',4,'k a p'],['verse',8,'k b h s a p'],['chorus',8,'k b h s a p l c'],['break',4,'p a lf'],['drop',8,'k b h s a p l c o r'],['verse',8,'k b h s a p'],['chorus',8,'k b h s a p l c o']]},
 {bpm:150,boss:1,ch:[[62,65,69],[58,62,65],[55,58,62],[57,61,64]],root:[38,46,43,45],hook:BHOOK,
 sec:[['siren',4,'S k'],['heavy',8,'k b h s a o'],['hook',8,'k b h s a l o r'],['break',2,'S p'],['hook',8,'k b h s a l o r c']]}];
function songLen(s){let n=0;for(const x of s.sec)n+=x[1];return n;}
function musicStart(mode){AU.mode=mode||0;const s=SONGS[AU.mode];AU.bpm=s.bpm;AU.sp=60/s.bpm/4;if(!AU.c)return;AU.step=0;AU.next=AU.c.currentTime+.08;AU.origin=AU.next;if(AU.dly)AU.dly.delayTime.value=AU.sp*3;if(!AU.timer)AU.timer=setInterval(musicTick,25);AU.on=true;}
function musicStop(){AU.on=false;}
// beat clock: {b: beat index, f: phase 0..1 within beat, bar}. Falls back to wall clock when audio is silent/blocked.
function beatClock(){let tt;if(AU.c&&AU.on&&AU.c.state==='running')tt=(AU.c.currentTime-AU.origin)/(AU.sp*4);else tt=performance.now()/1000*AU.bpm/60;const b=Math.floor(tt);return{b,f:tt-b,bar:Math.floor(b/4)};}
function secAt(song,bar){const L=songLen(song);let first=true;// loop skips intro after first pass
 let b=bar;if(b>=L){const lead=song.sec[0][1];b=lead+((b-L)%(L-lead));}for(const s of song.sec){if(b<s[1])return{s,bi:b};b-=s[1];}return{s:song.sec[0],bi:0};}
function musicTick(){const a=AU.c;if(!a||!AU.on||a.state!=='running')return;const song=SONGS[AU.mode],sp=AU.sp;
 if(AU.next<a.currentTime-.2){const skip=Math.ceil((a.currentTime-AU.next)/sp);AU.step+=skip;AU.next+=skip*sp;} // resume after pause
 while(AU.next<a.currentTime+.12){const s=AU.step,t=AU.next,barN=Math.floor(s/16),st=s%16,sx=secAt(song,barN),P=sx.s[2],ci=barN%4,ch=song.ch[ci],root=song.root[ci],M=AU.mus,D=AU.duck,boss=song.boss,has=c=>P.indexOf(c)>=0;
  const lastBar=sx.bi===sx.s[1]-1;
  // KICK: four-on-the-floor, pitch-swept sine + click, ducks the D bus
  if(has('k')&&st%4===0){tone('sine',boss?170:155,42,.32,1.0,M,t);tone('sine',60,40,.18,.5,M,t);noise(.012,.35,'highpass',2500,2500,M,t);
   D.gain.setValueAtTime(.22,t);D.gain.linearRampToValueAtTime(1,t+sp*3.2);}
  // SNARE: gated reverb (gate opens on hit, slams shut)
  if(has('s')&&(st===4||st===12)){noise(.2,.5,'highpass',1200,900,M,t,0,AU.grev);noise(.08,.35,'bandpass',2200,1500,M,t,1);tone('triangle',210,150,.1,.35,M,t);AU.gate.gain.setValueAtTime(1,t);AU.gate.gain.setValueAtTime(1,t+.17);AU.gate.gain.linearRampToValueAtTime(0,t+.2);}
  if(has('s')&&lastBar&&st>=12)noise(.08,.25+.03*(st-12),'bandpass',2500,1500,M,t,1); // fill roll
  // HATS
  if(has('h')){const open=has('o')&&st%4===2;if(st%2===1||has('o')||boss)noise(open?.12:.03,open?.12:(st%2?.11:.05),'highpass',open?7000:8500,open?6000:8500,M,t);}
  // BASS: octave-jumping 8ths (main) / distorted rolling 16ths (boss)
  if(has('b')){if(boss){const n=root-12+(st%4===2?12:0);tone('sawtooth',mf(n),mf(n),sp*.85,.32,AU.dist,t,1800);tone('sine',mf(root-12),mf(root-12),sp*.9,.25,D,t);}
   else if(st%2===0){const n=root-12+(st%4===2?12:0);tone('sawtooth',mf(n),mf(n),sp*1.7,.2,D,t,1500);tone('square',mf(n)*1.003,mf(n),sp*1.6,.08,D,t,900);}}
  // ARP: 16th chord-tone arpeggio through the delay
  if(has('a')){const arp=ch[st%3]+12+(Math.floor(st/3)%2?12:0)+(boss?0:0);tone('square',mf(arp),mf(arp),sp*.7,boss?.04:.045,D,t,has('lf')?1200:3600,0,AU.dly);}
  // PAD: detuned saws, slow attack, ducked by kick
  if(has('p')&&st===0)for(const n of ch){tone('sawtooth',mf(n),mf(n),sp*16,.035,D,t,2400,.25,AU.rev);tone('sawtooth',mf(n)*1.006,mf(n)*1.006,sp*16,.03,D,t,2000,.3);}
  // CHORD stabs on the off-beats
  if(has('c')&&(st===2||st===10||st===14))for(const n of ch)tone('sawtooth',mf(n+12),mf(n+12),sp*1.2,.03,D,t,3200,0,AU.rev);
  // LEAD hook: two detuned saws + square, with delay + reverb
  if(has('l')||has('lf')){const pos=(barN%4)*16+st;for(const h of song.hook)if(h[0]===pos){const f=mf(h[1]+(has('lf')?-12:0)),d=sp*h[2];tone('sawtooth',f,f,d,.07,D,t,has('lf')?1400:5000,.01,AU.dly);tone('sawtooth',f*1.007,f*1.007,d,.05,D,t,4200,.01,AU.rev);tone('square',f*2,f*2,d*.6,.015,D,t,3000);}}
  // crash / riser
  if(has('r')&&sx.bi===0&&st===0)noise(1.6,.22,'highpass',5000,3000,M,t,0,AU.rev);
  if(lastBar&&st===0&&(has('k'))){const n=noise(sp*16,.12,'bandpass',400,6000,M,t,2);}
  // SIREN (boss intro / breakdown)
  if(has('S')&&st===0){tone('sawtooth',mf(root+12),mf(root+24),sp*8,.07,M,t,2600,.05,AU.rev);tone('sawtooth',mf(root+24),mf(root+12),sp*8,.07,M,t+sp*8,2600,.05,AU.rev);tone('sine',mf(root-24),mf(root-24),sp*16,.35,M,t);}
  AU.step++;AU.next+=sp;}}
function setMute(m){AU.muted=m;if(AU.m)AU.m.gain.value=m?0:.9;}

// ---- main.js : game loop, entities, stage script
const VERSION='v0.2';
const Q=new URLSearchParams(location.search);
const DBG=(Q.get('debug')||'').split(',');
const DBG_BOSS=DBG.includes('boss'),DBG_MID=DBG.includes('mid'),DBG_INV=DBG.includes('inv')||DBG.includes('boss');
const cv=document.getElementById('c'),ctx=cv.getContext('2d',{alpha:false});
let W=360,H=640,SC=1,DPR=1;
const rnd=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>v<a?a:v>b?b:v;
function resize(){const iw=innerWidth,ih=innerHeight;H=Math.round(clamp(ih/iw*W,560,800));SC=Math.min(iw/W,ih/H);DPR=Math.min(devicePixelRatio||1,2);cv.width=Math.round(W*SC*DPR);cv.height=Math.round(H*SC*DPR);cv.style.width=Math.round(W*SC)+'px';cv.style.height=Math.round(H*SC)+'px';}
class Pool{constructor(n,f){this.a=[];for(let i=0;i<n;i++){const o=f();o.act=false;this.a.push(o);}this.i=0;}
 get(){const a=this.a,n=a.length;for(let k=0;k<n;k++){this.i=(this.i+1)%n;const o=a[this.i];if(!o.act){o.act=true;return o;}}return null;}
 clear(){for(const o of this.a)o.act=false;}count(){let c=0;for(const o of this.a)if(o.act)c++;return c;}}
const PB=new Pool(240,()=>({x:0,y:0,vx:0,vy:0,dmg:1,k:0,pierce:false,w:4,h:12,rot:0}));
const EB=new Pool(600,()=>({x:0,y:0,vx:0,vy:0,r:4,big:false}));
const PT=new Pool(520,()=>({x:0,y:0,vx:0,vy:0,life:0,max:1,s:1,k:0,c:null,rot:0,vr:0}));
const EN=new Pool(70,()=>({}));
const PU=new Pool(12,()=>({x:0,y:0,t:0,k:0,w:0}));
const WEAP=[{n:'SPREAD',c:COL.am,d:'am',l:'S'},{n:'LASER',c:COL.cy,d:'cy',l:'L'},{n:'TESLA',c:COL.li,d:'li',l:'T'}];
const G={state:'title',t:0,st:0,hold:false,score:0,hi:+(localStorage.getItem('ngs_hi')||0),lives:3,bombs:3,weapon:0,lvl:1,shake:0,flash:0,bombT:0,boss:null,mid:null,evI:0,timers:[],banner:null,arcs:[],endT:0,kills:0};
const P={x:180,y:560,inv:0,dead:0,fireT:0,zapT:0,bank:0};
// ---------- settings (persisted)
const SET={rf:lsGet('ngs_rf')==='1',sens:+(lsGet('ngs_sens')||1.3)};
// ---------- lighting FX: light bursts, color flash, strobe, beat pulse
const LT=new Pool(48,()=>({x:0,y:0,r:0,c:'am',life:0,max:1}));
const FX={pulse:0,beat:-1,strobe:0,strobeC:0,flashC:'255,255,255',streaks:[]};
function light(x,y,r,c,life){const l=LT.get();if(!l)return;l.x=x;l.y=y;l.r=r;l.c=c||'am';l.life=l.max=life||18;}
function flash(a,rgb){if(SET.rf)return;G.flash=Math.max(G.flash,a);FX.flashC=rgb||'255,255,255';}
function strobe(n){if(SET.rf)return;FX.strobe=Math.max(FX.strobe,n);}
function ramp(){return Math.min(1,G.st/(75*60));} // 0 at start -> 1 after 75s
let eid=0;
const DEF={drone:{hp0:2,r:9,sc:100},swooper:{hp0:4,r:10,sc:150},turret:{hp0:16,r:14,sc:400},carrier:{hp0:14,r:18,sc:500},gunship:{hp0:420,r:44,sc:20000,big:true},boss:{hp0:1800,r:64,sc:100000,big:true}};
function spawn(type,x,y,o){const e=EN.get();if(!e)return null;for(const k in e)if(k!=='act')delete e[k];Object.assign(e,{type,x,y,vx:0,vy:0,t:0,fl:0,rot:0,invT:0,id:++eid,big:false},DEF[type],o||{});e.hp=e.maxhp=e.hp0;return e;}
function later(f,fn){G.timers.push({at:G.t+f,fn});}
// ---------- enemy bullets
function aim(x,y){return Math.atan2(P.y-y,P.x-x);}
function eShot(x,y,a,spd,big,force){if(P.dead>0||G.bombT>0)return;const rr=ramp();if(!force&&!G.boss&&Math.random()>.5+.5*rr)return;spd*=.72+.28*rr;const dx=P.x-x,dy=P.y-y;if(dx*dx+dy*dy<50*50)return;const b=EB.get();if(!b)return;b.x=x;b.y=y;b.vx=Math.cos(a)*spd;b.vy=Math.sin(a)*spd;b.big=!!big;b.r=big?6:4;}
function fan(x,y,a,n,sp,spd,big){for(let i=0;i<n;i++)eShot(x,y,a+(n>1?(i/(n-1)-.5)*sp:0),spd,big);}
function ring(x,y,n,off,spd,big){for(let i=0;i<n;i++)eShot(x,y,off+i/n*TAU,spd,big);}
function clearBullets(bonus){for(const b of EB.a)if(b.act){b.act=false;if(bonus){G.score+=10;part(0,b.x,b.y,rnd(-.5,.5),rnd(-1,0),14,1,'mg');}}}
// ---------- particles
function part(k,x,y,vx,vy,life,s,c){const p=PT.get();if(!p)return null;p.k=k;p.x=x;p.y=y;p.vx=vx;p.vy=vy;p.life=p.max=life;p.s=s;p.c=c;p.rot=rnd(0,TAU);p.vr=rnd(-.2,.2);return p;}
function boom(x,y,s,c){c=c||'am';light(x,y,40+28*Math.min(s,5),c,16+5*Math.min(s,4));if(s>1.4)light(x,y,24*s,'w',10);const n=Math.min(32,Math.round(9*s));for(let i=0;i<n;i++){const a=rnd(0,TAU),v=rnd(.8,4.2)*Math.sqrt(s);part(0,x,y,Math.cos(a)*v,Math.sin(a)*v,rnd(16,34),rnd(.4,1)*(s>1.5?1.2:1),i%3?c:'w');}
 part(1,x,y,0,0,22,10*s,c);if(s>1.4)part(1,x,y,0,0,30,18*s,'mg');
 for(let i=0;i<Math.min(6,2+s);i++){const a=rnd(0,TAU),v=rnd(1,3);part(2,x,y,Math.cos(a)*v,Math.sin(a)*v-1,rnd(30,50),rnd(.8,1.4)*Math.min(2,s));}
 for(let i=0;i<Math.min(6,1+s*1.5);i++)part(3,x+rnd(-8,8)*s,y+rnd(-8,8)*s,rnd(-.4,.4),rnd(-.6,0),rnd(40,60),rnd(.8,1.5)*Math.min(2.5,s));
 G.shake=Math.max(G.shake,3*s);sfx.boom(s);}
function steam(x,y,dir){part(3,x,y,rnd(-.3,.3)+(dir||0),rnd(-1.2,-.6),rnd(30,45),rnd(.4,.7));}
// ---------- damage
function hurt(e,d){if(e.invT>0||e.dying)return;e.hp-=d;e.fl=3;if(e.hp<=0)kill(e);}
function kill(e){if(e.type==='boss'){e.dying=true;e.dT=0;clearBullets(true);G.score+=e.sc;return;}
 e.act=false;G.score+=e.sc;G.kills++;if(e.big){flash(.35,'255,200,120');}boom(e.x,e.y,e.big?3.5:(e.r>12?1.6:1),e.type==='carrier'?'li':(e.type==='swooper'?'mg':'am'));
 if(e.type==='carrier')dropOrb(e.x,e.y,0);
 if(e.type==='gunship'){G.hold=false;G.mid=null;dropOrb(e.x-20,e.y,0);dropOrb(e.x+20,e.y,1);for(let i=0;i<5;i++)later(i*7,()=>boom(e.x+rnd(-50,50),e.y+rnd(-30,30),1.5));}}
function dropOrb(x,y,k){const u=PU.get();if(!u)return;u.x=x;u.y=y;u.t=0;u.k=k;u.w=(G.weapon+1+Math.floor(Math.random()*2))%3;}
// ---------- spawners
function swoop(dir,shoot){const x0=dir>0?50:310;for(let i=0;i<6;i++)later(i*10,()=>spawn('swooper',x0,-16,{x0,dir,shootAt:(shoot||i%2)?40+i*4:-1}));}
function droneCol(x,n){for(let i=0;i<n;i++)later(i*14,()=>spawn('drone',x,-14,{vy:2.4,x0:x,wob:i*.6,shootAt:i===n-1||i===2?50:-1}));}
function droneV(x){[[0,0],[-26,-22],[26,-22],[-52,-44],[52,-44]].forEach(([dx,dy],i)=>spawn('drone',x+dx,-14+dy,{vy:1.9,x0:x+dx,wob:0,shootAt:i===1||i===2?70:-1}));}
function popcorn(n){for(let i=0;i<n;i++)later(i*9,()=>spawn('drone',rnd(30,W-30),-14,{vy:3,x0:-1,home:true,shootAt:i%4===0?40:-1}));}
function turret(x){spawn('turret',x,-20,{cd:60+Math.floor(rnd(0,40))});}
function carrier(x){spawn('carrier',x,-20,{x0:x});}
function midboss(){G.hold=true;G.banner={t:0,a:'MID-BOSS',b:'IRONCLAD GUNSHIP'};G.mid=spawn('gunship',W/2,-60,{invT:60});}
function warning(){strobe(90);G.banner={t:0,a:'⚠ WARNING ⚠',b:'CLOCKWORK COLOSSUS APPROACHING',warn:true};sfx.warn();}
function spawnBoss(){G.hold=true;const b=spawn('boss',W/2,-110,{invT:150,phase:0,hA:0,g:0});G.boss=b;musicStart(1);}
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
 case 'drone':e.y+=e.vy;if(e.home){e.vx=clamp(e.vx+Math.sign(P.x-e.x)*.04,-1.3,1.3);e.x+=e.vx;}else e.x=e.x0+Math.sin(t*.05+e.wob)*10;if(t===e.shootAt)eShot(e.x,e.y,aim(e.x,e.y),2.6);break;
 case 'swooper':e.y+=2.3;e.x=e.x0+e.dir*140*Math.sin(t*.021);e.rot+=.15*e.dir;if(t===e.shootAt)eShot(e.x,e.y,aim(e.x,e.y),2.7);break;
 case 'turret':e.y+=.9;e.rot=aim(e.x,e.y)+Math.PI/2;if(t%9===0)steam(e.x-11,e.y-13,-.2);if(e.y>20&&e.y<H*.72){e.cd--;if(e.cd<=0){e.cd=110;for(let i=0;i<3;i++)later(i*7,()=>{if(e.act)eShot(e.x,e.y,aim(e.x,e.y),2.5);});}}break;
 case 'carrier':e.y+=.6;e.x=e.x0+Math.sin(t*.02)*30;if(t%12===0)steam(e.x+26,e.y,.6);break;
 case 'gunship':if(e.y<120)e.y+=1.3;else{e.x=W/2+Math.sin(t*.012)*90;
   if(t%64===0)fan(e.x,e.y+20,aim(e.x,e.y+20),5,.8,2.8);
   if(t%110===55)ring(e.x,e.y,14,t*.01,2,true);
   if(e.hp<e.maxhp*.5&&t%10===0){const a=t*.07;eShot(e.x-58,e.y+6,a,2.2);eShot(e.x+58,e.y+6,-a+Math.PI,2.2);}}
   if(t%6===0){steam(e.x-18,e.y-50);steam(e.x+18,e.y-50);}
   if(t>60*40){e.y-=3;if(e.y<-120){e.act=false;G.hold=false;G.mid=null;}}break;
 case 'boss':updBoss(e);break;}
 if(!e.big&&(e.y>H+40||e.x<-80||e.x>W+80)&&t>30)e.act=false;}
function updBoss(e){const t=e.t;if(e.dying){e.dT++;if(e.dT===1){strobe(150);sfx.bossDie();}if(e.dT%5===0)boom(e.x+rnd(-90,90),e.y+rnd(-60,60),rnd(1,2.2),['am','mg','cy'][e.dT%3]);G.shake=Math.max(G.shake,6);
  if(e.dT===150){boom(e.x,e.y,5,'cy');boom(e.x,e.y,4,'mg');flash(1,'255,255,255');sfx.bossDie();e.act=false;G.boss=null;later(120,stageClear);}return;}
 if(e.y<150){e.y+=1;e.invT=Math.max(e.invT,2);return;}
 const ph=e.hp>1200?0:e.hp>600?1:2;if(ph!==e.phase){e.phase=ph;clearBullets(true);e.invT=70;G.shake=12;flash(.6,ph===1?'255,61,240':'255,36,80');strobe(24);sfx.phase();boom(e.x-78,e.y,2,'cy');boom(e.x+78,e.y,2,'mg');G.banner={t:60,a:'PHASE '+(ph+1),b:ph===1?'TIME HANDS':'OVERCLOCK'};}
 e.g+=.02+ph*.02;if(t%5===0)for(const sx of[-34,0,34])steam(e.x+sx,e.y-95);
 if(e.invT>0)return;
 if(ph===0){e.x=W/2+Math.sin(t*.01)*40;if(t%8===0){const a=t*.045;eShot(e.x-78,e.y+5,a,2);eShot(e.x+78,e.y+5,Math.PI-a,2);}
  if(t%100===0)fan(e.x,e.y+40,aim(e.x,e.y+40),3,.35,2.6,true);}
 else if(ph===1){e.x=W/2+Math.sin(t*.016)*80;e.hA+=.022;if(t%5===0){eShot(e.x,e.y,e.hA,2.6);eShot(e.x,e.y,e.hA+Math.PI,2.6);}
  if(t%120===60)ring(e.x,e.y,18,t*.03,1.8,true);}
 else{e.x=W/2+Math.sin(t*.02)*90;e.y=150+Math.sin(t*.03)*18;e.hA+=.04;
  if(t%50===0)ring(e.x,e.y,20,(t/50)%2?TAU/40:0,2.1,true);
  if(t%80===40){fan(e.x-78,e.y+5,aim(e.x-78,e.y),5,.7,3);fan(e.x+78,e.y+5,aim(e.x+78,e.y),5,.7,3);}}}
// ---------- player weapons
function pb(x,y,vx,vy,dmg,k,pierce,w,h,rot){const b=PB.get();if(!b)return;b.x=x;b.y=y;b.vx=vx;b.vy=vy;b.dmg=dmg;b.k=k;b.pierce=pierce;b.w=w;b.h=h;b.rot=rot;}
function fire(){const L=G.lvl,w=G.weapon;if(P.fireT>0)return;
 if(w===0){P.fireT=6;const n=[3,5,6][L-1],sp=[.24,.38,.46][L-1];for(let i=0;i<n;i++){const a=-Math.PI/2+(i/(n-1)-.5)*sp;pb(P.x,P.y-12,Math.cos(a)*11,Math.sin(a)*11,1,0,false,5,12,a+Math.PI/2);}}
 else if(w===1){P.fireT=3;pb(P.x,P.y-18,0,-16,[.9,1.25,1.7][L-1],1,true,[5,9,14][L-1],30,0);}
 else{P.fireT=6;pb(P.x-5,P.y-10,0,-12,1,2,false,4,10,0);pb(P.x+5,P.y-10,0,-12,1,2,false,4,10,0);
  const rg=[190,230,270][L-1],c=[];for(const e of EN.a){if(!e.act||e.y<-10||e.dying)continue;const dx=e.x-P.x,dy=e.y-P.y,d=dx*dx+dy*dy;if(d<rg*rg)c.push([d,e]);}
  c.sort((a,b)=>a[0]-b[0]);G.arcs.length=0;for(let i=0;i<Math.min(L,c.length);i++){const e=c[i][1];G.arcs.push({x:e.x,y:e.y});hurt(e,[2.2,2.4,2.8][L-1]);}if(c.length&&G.t%12===0)sfx.zap();}
 sfx.shot();}
function bomb(){if(G.state!=='play'||G.bombs<=0||P.dead>0||G.bombT>0)return;G.bombs--;G.bombT=90;P.inv=Math.max(P.inv,130);clearBullets(true);G.shake=16;flash(.8,'120,250,255');strobe(12);light(P.x,P.y,260,'cy',40);sfx.bomb();
 for(const e of EN.a)if(e.act&&e.y>-20)hurt(e,e.big?50:40);updHud();}
function playerHit(){if(P.inv>0||P.dead>0||DBG_INV)return;boom(P.x,P.y,2.5,'cy');sfx.die();flash(.6,'255,80,120');G.shake=18;G.lives--;G.lvl=Math.max(1,G.lvl-1);P.dead=80;clearBullets(false);
 if(G.lives<=0){later(90,gameOver);}updHud();}
// ---------- input
const keys={};let drag=null;
addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','KeyX','KeyB'].includes(e.code)){bomb();e.preventDefault();}if(e.code==='KeyP'||e.code==='Escape')togglePause();if(e.code==='KeyM')toggleMute();if(e.code==='Enter'&&G.state==='title')startGame();if(e.code.startsWith('Arrow'))e.preventDefault();});
addEventListener('keyup',e=>{keys[e.code]=false;});
const PTRS=new Set();
addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('button,.ov'))return;auInit();PTRS.add(e.pointerId);if(!drag)drag={id:e.pointerId,x:e.clientX,y:e.clientY};});
addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const k=SET.sens*(PTRS.size>=2?.45:1),dx=(e.clientX-drag.x)/SC*k,dy=(e.clientY-drag.y)/SC*k;drag.x=e.clientX;drag.y=e.clientY;
 if(G.state==='play'&&P.dead<=0){P.x=clamp(P.x+dx,10,W-10);P.y=clamp(P.y+dy,20,H-16);P.bank+=dx*.15;}});
const endDrag=e=>{PTRS.delete(e.pointerId);if(drag&&drag.id===e.pointerId)drag=null;};addEventListener('pointerup',endDrag);addEventListener('pointercancel',endDrag);
// ---------- UI
const $=id=>document.getElementById(id);
function show(id){for(const o of['title','pause','over','clear','settings','photo'])$(o).classList.toggle('hide',o!==id);$('hud').classList.toggle('hide',!(G.state==='play'||G.state==='pause'));}
function updHud(){$('bBomb').textContent='BOMB ×'+G.bombs;$('bBomb').classList.toggle('empty',G.bombs<=0);}
function togglePause(){if(G.state==='play'){G.state='pause';show('pause');if(AU.c)AU.c.suspend();}else if(G.state==='pause'){G.state='play';show(null);if(AU.c)AU.c.resume();}}
function toggleMute(){setMute(!AU.muted);$('bMute').textContent=AU.muted?'♪̸':'♪';try{localStorage.setItem('ngs_mute',AU.muted?1:0);}catch(_){}}
function startGame(){auInit();Object.assign(G,{state:'play',st:0,hold:false,score:0,lives:3,bombs:3,weapon:0,lvl:1,shake:0,flash:0,bombT:0,boss:null,mid:null,evI:0,timers:[],banner:null,arcs:[],kills:0});
 Object.assign(P,{x:W/2,y:H-90,inv:120,dead:0,fireT:0,bank:0});PB.clear();EB.clear();EN.clear();PU.clear();LT.clear();FX.strobe=0;
 if(DBG_BOSS||DBG_MID){const tt=DBG_BOSS?92:46;G.st=tt*60;while(G.evI<EV.length&&EV[G.evI][0]<tt)G.evI++;G.lvl=3;G.weapon=DBG.includes('laser')?1:DBG.includes('tesla')?2:0;}
 musicStart(0);show(null);updHud();}
let setFrom='title';
function rfLabel(){for(const id of['sRF','pRF']){$(id).textContent='REDUCE FLASHING: '+(SET.rf?'ON':'OFF');$(id).classList.toggle('on',SET.rf);}}
function wireSettings(){const m=$('sMus'),f=$('sSfx'),se=$('sSens');m.value=AU.musV;f.value=AU.sfxV;se.value=SET.sens;$('sSensV').textContent=SET.sens.toFixed(1);
 m.oninput=()=>setVol('musV',+m.value);f.oninput=()=>{setVol('sfxV',+f.value);auInit();sfx.power();};se.oninput=()=>{SET.sens=+se.value;lsSet('ngs_sens',SET.sens);$('sSensV').textContent=SET.sens.toFixed(1);};
 const tg=()=>{SET.rf=!SET.rf;lsSet('ngs_rf',SET.rf?1:0);if(SET.rf){G.flash=0;FX.strobe=0;}rfLabel();};$('sRF').onclick=tg;$('pRF').onclick=tg;rfLabel();
 const open=from=>{setFrom=from;show('settings');};$('bSet1').onclick=()=>open('title');$('bSet2').onclick=()=>open('pause');$('bSetBack').onclick=()=>show(setFrom);
 $('bPhotoOk').onclick=()=>{lsSet('ngs_photo',1);show('title');};}
function hiSave(){if(G.score>G.hi){G.hi=G.score;try{localStorage.setItem('ngs_hi',G.hi);}catch(_){}}}
function gameOver(){if(G.state!=='play')return;G.state='over';hiSave();musicStop();$('oScore').textContent=G.score.toLocaleString();$('oHi').textContent=G.hi.toLocaleString();show('over');}
function stageClear(){if(G.state!=='play')return;const bonus=G.lives*10000+G.bombs*5000;G.score+=bonus;G.state='clear';hiSave();musicStop();$('cScore').textContent=G.score.toLocaleString();$('cBonus').textContent='Lives ×'+G.lives+' + Bombs ×'+G.bombs+' = '+bonus.toLocaleString();$('cHi').textContent=G.hi.toLocaleString();show('clear');}
// ---------- background
const BG={stars:[],gears:[],neb:null,nebY:0,str:null,strY:0};
const LG={},TR={};
function buildFX(){const cols={cy:COL.cy,mg:COL.mg,am:COL.am,li:COL.li,eb:COL.eb,w:'#ffffff'};
 for(const k in cols){const c=cols[k];LG[k]=mk(128,128,g=>{const gr=g.createRadialGradient(0,0,0,0,0,64);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(.12,c);gr.addColorStop(.4,c+'44');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(-64,-64,128,128);},.5);
  TR[k]=mk(12,64,g=>{const gr=g.createLinearGradient(0,-32,0,32);gr.addColorStop(0,c+'cc');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.ellipse(0,0,5,32,0,0,TAU);g.fill();},1);}
 for(let i=0;i<10;i++)FX.streaks.push({x:rnd(40,W-40),y:rnd(-H,H),v:rnd(9,16),l:rnd(40,110),c:i%2?'cy':'mg'});}
function buildBG(){const L=[[70,.35,1,'#8890c0'],[40,.9,1.4,'#c8d8ff'],[16,2.2,2,'#ffffff']];for(const[n,v,s,c]of L)for(let i=0;i<n;i++)BG.stars.push({x:rnd(0,W),y:rnd(0,900),v,s,c});
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
 for(const s of BG.stars){s.y+=s.v*spd;if(s.y>H){s.y-=H+4;s.x=rnd(0,W);}ctx.fillStyle=s.c;ctx.fillRect(s.x,s.y,s.s,s.s*(s.v>2?2.5:1));}
 ctx.globalAlpha=.22;for(const g of BG.gears){g.y+=.7*spd;g.rot+=g.vr;if(g.y>H+80){g.y=-80;}ds(S.bgGear[g.k],g.x,g.y,g.rot);}ctx.globalAlpha=1;
 const pu=FX.pulse;BG.gY=((BG.gY||0)+1.1*spd)%40;ctx.globalCompositeOperation='lighter';ctx.lineWidth=1;
 ctx.strokeStyle='rgba(120,60,255,'+(.07+.13*pu).toFixed(3)+')';ctx.beginPath();for(let y=BG.gY-40;y<H;y+=40){ctx.moveTo(34,y);ctx.lineTo(W-34,y);}for(let x=34+29;x<W-34;x+=58){ctx.moveTo(x,0);ctx.lineTo(x,H);}ctx.stroke();
 // neon speed lines
 for(const k of FX.streaks){k.y+=k.v*spd*(G.bombT>0?2:1);if(k.y>H+k.l){k.y=-k.l-rnd(0,H);k.x=rnd(40,W-40);}ctx.globalAlpha=.10+.12*pu;ctx.drawImage(TR[k.c],k.x-1,k.y-k.l,2,k.l);}ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 BG.strY=(BG.strY+1.1*spd)%800;ctx.globalAlpha=.8;ctx.drawImage(BG.str,0,BG.strY-800,W,800);ctx.drawImage(BG.str,0,BG.strY,W,800);ctx.globalAlpha=1;
 // scaffolding neon glow pulses on the beat
 ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.18+.5*pu;ctx.drawImage(LG.cy,34-14,-20,28,H+40);ctx.drawImage(LG.mg,W-34-14,-20,28,H+40);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';}
function ds(c,x,y,rot,sc){sc=sc||1;if(!rot){ctx.drawImage(c,x-c.w*sc/2,y-c.h*sc/2,c.w*sc,c.h*sc);return;}ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(c,-c.w*sc/2,-c.h*sc/2,c.w*sc,c.h*sc);ctx.restore();}
// ---------- update
function update(){G.t++;
 for(let i=G.timers.length-1;i>=0;i--){if(G.timers[i].at<=G.t){const f=G.timers[i].fn;G.timers.splice(i,1);f();}}
 if(G.state!=='play')return;
 if(!G.hold){G.st++;while(G.evI<EV.length&&EV[G.evI][0]*60<=G.st){EV[G.evI][1]();G.evI++;}}
 // player
 if(P.dead>0){P.dead--;if(P.dead===0&&G.lives>0){P.x=W/2;P.y=H-80;P.inv=150;G.bombs=Math.max(G.bombs,3);updHud();}}
 else{let kx=(keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0),ky=(keys.ArrowDown||keys.KeyS?1:0)-(keys.ArrowUp||keys.KeyW?1:0);const sp=keys.ShiftLeft||keys.ShiftRight?2.2:4.2;
  if(kx||ky){const n=Math.hypot(kx,ky);P.x=clamp(P.x+kx/n*sp,10,W-10);P.y=clamp(P.y+ky/n*sp,20,H-16);P.bank+=kx*.6;}
  if(P.fireT>0)P.fireT--;fire();if(P.inv>0)P.inv--;}
 P.bank*=.85;
 if(G.bombT>0){G.bombT--;for(const b of EB.a)b.act=false;if(G.bombT%3===0)for(const e of EN.a)if(e.act&&e.y>-20)hurt(e,e.big?1.2:3);}
 // player bullets
 for(const b of PB.a){if(!b.act)continue;b.x+=b.vx;b.y+=b.vy;if(b.y<-30||b.x<-20||b.x>W+20){b.act=false;continue;}
  for(const e of EN.a){if(!e.act||e.y<-8||e.dying)continue;const rx=e.r+b.w/2,ry=e.r+b.h/2;if(Math.abs(e.x-b.x)<rx&&Math.abs(e.y-b.y)<ry){hurt(e,b.dmg);if(Math.random()<.3)part(0,b.x,b.y-4,rnd(-1,1),rnd(-2,0),8,.5,WEAP[b.k].d);if(!b.pierce){b.act=false;break;}}}}
 // enemies
 for(const e of EN.a){if(!e.act)continue;updEnemy(e);if(!e.act||P.dead>0||e.dying)continue;const dx=e.x-P.x,dy=e.y-P.y,rr=e.r*.75+3;if(dx*dx+dy*dy<rr*rr&&e.y>0)playerHit();}
 // enemy bullets
 for(const b of EB.a){if(!b.act)continue;b.x+=b.vx;b.y+=b.vy;if(b.y<-20||b.y>H+20||b.x<-20||b.x>W+20){b.act=false;continue;}
  if(P.dead<=0){const dx=b.x-P.x,dy=b.y-P.y,rr=b.r*.75+2.5;if(dx*dx+dy*dy<rr*rr)playerHit();}}
 // pickups
 for(const u of PU.a){if(!u.act)continue;u.t++;u.y+=.75;u.x+=Math.sin(u.t*.05)*.6;if(u.t%90===0)u.w=(u.w+1)%3;if(u.y>H+20){u.act=false;continue;}
  if(P.dead<=0){const dx=u.x-P.x,dy=u.y-P.y;if(dx*dx+dy*dy<22*22){u.act=false;sfx.power();if(u.w===G.weapon){if(G.lvl<3)G.lvl++;else G.score+=5000;}else G.weapon=u.w;
   G.banner={t:100,a:WEAP[G.weapon].n+' LV'+G.lvl,b:'',small:true,c:WEAP[G.weapon].c};part(1,P.x,P.y,0,0,18,22,WEAP[G.weapon].d);}}}
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
 case 'gunship':ds(S.gGear,e.x-58,e.y+6,e.t*.05);ds(S.gGear,e.x+58,e.y+6,-e.t*.05);dsF('gunship',e.x,e.y,0,fl);break;
 case 'boss':{const sh=e.dying?rnd(-3,3):0,x=e.x+sh,y=e.y;ctx.globalCompositeOperation='lighter';ds(S.dot.mg,x,y,0,7);ctx.globalCompositeOperation='source-over';
  ds(S.bGear,x-80,y+4,e.g);ds(S.bGear,x+80,y+4,-e.g);ds(S.bGear2,x-48,y+58,-e.g*1.8);ds(S.bGear2,x+48,y+58,e.g*1.8);dsF('boss',x,y,0,fl);
  ctx.save();ctx.translate(x,y);ctx.lineCap='round';const ha=(e.phase===1?e.hA:e.t*.01)-Math.PI/2+Math.PI/2,ma=e.t*.08;
  ctx.strokeStyle=e.phase===2?COL.eb:COL.mg;ctx.lineWidth=6;ctx.globalAlpha=.35;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(ha)*34,Math.sin(ha)*34);ctx.stroke();ctx.globalAlpha=1;ctx.lineWidth=3;ctx.stroke();
  ctx.strokeStyle=COL.cy;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(ma)*46,Math.sin(ma)*46);ctx.stroke();
  ctx.fillStyle=e.phase===2?COL.eb:COL.am;ctx.beginPath();ctx.arc(0,0,6,0,TAU);ctx.fill();ctx.restore();break;}}}
function drawLightning(x0,y0,x1,y1){const n=7;ctx.beginPath();ctx.moveTo(x0,y0);for(let i=1;i<n;i++){const f=i/n;ctx.lineTo(x0+(x1-x0)*f+rnd(-9,9),y0+(y1-y0)*f+rnd(-9,9));}ctx.lineTo(x1,y1);}
function draw(){const play=G.state!=='title';const bc=beatClock();FX.pulse=Math.exp(-bc.f*5)*(SET.rf?.3:1)*(bc.b%4===0?1:.75);const sx=G.shake?rnd(-G.shake,G.shake):0,sy=G.shake?rnd(-G.shake,G.shake):0;
 ctx.setTransform(SC*DPR,0,0,SC*DPR,sx*SC*DPR,sy*SC*DPR);drawBG(G.state==='pause'?0:1);
 if(!play){return;}
 // smoke under
 for(const p of PT.a){if(p.act&&p.k===3){ctx.globalAlpha=p.life/p.max*.7;ds(S.smoke,p.x,p.y,0,p.s);}}ctx.globalAlpha=1;
 for(const e of EN.a)if(e.act&&e.type==='turret')drawEnemy(e);
 for(const e of EN.a)if(e.act&&e.type!=='turret')drawEnemy(e);
 // debris
 for(const p of PT.a){if(p.act&&p.k===2){ctx.globalAlpha=Math.min(1,p.life/20);ds(S.debris,p.x,p.y,p.rot,p.s);}}ctx.globalAlpha=1;
 // additive layer: player shots, sparks, rings, arcs
 ctx.globalCompositeOperation='lighter';
 ctx.globalAlpha=.28;for(const b of PB.a){if(!b.act||b.k===1)continue;const tr=TR[WEAP[b.k].d];if(b.k===0)ds(tr,b.x-b.vx*1.5,b.y-b.vy*1.5+0,b.rot,.6);else ctx.drawImage(tr,b.x-3,b.y+4,6,34);}
 ctx.globalAlpha=G.weapon===0&&G.lvl>=3?.42:.6;for(const b of PB.a){if(!b.act)continue;if(b.k===0)ds(S.pbS,b.x,b.y,b.rot);else if(b.k===1)ds(S.pbL[G.lvl-1]||S.pbL[0],b.x,b.y);else ds(S.pbT,b.x,b.y);}ctx.globalAlpha=1;
 if(G.arcs.length&&P.dead<=0&&G.weapon===2){ctx.strokeStyle=COL.li;for(const a of G.arcs){ctx.globalAlpha=.25;ctx.lineWidth=6;drawLightning(P.x,P.y-8,a.x,a.y);ctx.stroke();ctx.globalAlpha=.95;ctx.lineWidth=1.6;drawLightning(P.x,P.y-8,a.x,a.y);ctx.stroke();ds(S.dot.li,a.x,a.y,0,1.2);}ctx.globalAlpha=1;}
 for(const p of PT.a){if(!p.act)continue;const f=p.life/p.max;if(p.k===0){ctx.globalAlpha=f;ds(S.dot[p.c],p.x,p.y,0,p.s);}else if(p.k===1){ctx.globalAlpha=f;ctx.strokeStyle=COL[p.c]||'#fff';ctx.lineWidth=3*f+.5;ctx.beginPath();ctx.arc(p.x,p.y,p.s*(1.6-f)*1.6,0,TAU);ctx.stroke();}}
 ctx.globalAlpha=1;
 if(G.bombT>0){const f=1-G.bombT/90;ctx.strokeStyle=COL.cy;ctx.lineWidth=10*(1-f)+2;ctx.globalAlpha=1-f;ctx.beginPath();ctx.arc(P.x,P.y,f*700,0,TAU);ctx.stroke();ctx.strokeStyle=COL.mg;ctx.beginPath();ctx.arc(P.x,P.y,f*480,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
 for(const l of LT.a){if(!l.act)continue;const f=l.life/l.max;ctx.globalAlpha=Math.min(.85,f*f*(SET.rf?.55:1));const r=l.r*(1.3-.3*f);ctx.drawImage(LG[l.c]||LG.w,l.x-r,l.y-r,r*2,r*2);}ctx.globalAlpha=1;
 // pickups
 for(const u of PU.a){if(!u.act)continue;const w=WEAP[u.w];ds(S.dot[w.d],u.x,u.y,0,1.6+Math.sin(u.t*.2)*.15);}
 ctx.globalCompositeOperation='source-over';
 for(const u of PU.a){if(!u.act)continue;const w=WEAP[u.w];ctx.strokeStyle=w.c;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(u.x,u.y,12,0,TAU);ctx.stroke();ctx.fillStyle='#05030c';ctx.font='bold 12px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(w.l,u.x,u.y+1);}
 // player
 if(P.dead<=0&&G.lives>0&&!(P.inv>0&&(G.t>>2)%2)){ctx.globalCompositeOperation='lighter';ds(S.dot.mg,P.x,P.y+15,0,.8+Math.random()*.4);ds(S.dot.am,P.x,P.y+13,0,.5);ctx.globalCompositeOperation='source-over';
  ctx.save();ctx.translate(P.x,P.y);ctx.scale(1-Math.min(.35,Math.abs(P.bank)*.05),1);ctx.drawImage(S.player,-S.player.w/2,-S.player.h/2,S.player.w,S.player.h);ctx.restore();
  ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(P.x,P.y+1,2.5,0,TAU);ctx.fill();ctx.strokeStyle=COL.cy;ctx.lineWidth=1;ctx.stroke();}
 ctx.setTransform(SC*DPR,0,0,SC*DPR,0,0);
 if(G.flash>0&&!SET.rf){ctx.fillStyle='rgba('+FX.flashC+','+(G.flash*.45).toFixed(3)+')';ctx.fillRect(0,0,W,H);}
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
 const w=WEAP[G.weapon];txt(w.n,10,H-46,w.c,11,'left',4);for(let i=0;i<3;i++){ctx.fillStyle=i<G.lvl?w.c:'rgba(255,255,255,.15)';ctx.fillRect(64+i*10,H-44,7,8);}
 const bo=G.boss||G.mid;if(bo&&bo.act&&bo.y>0){const f=Math.max(0,bo.hp/bo.maxhp);ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(40,32,W-80,6);ctx.fillStyle=G.boss?COL.mg:COL.am;ctx.fillRect(40,32,(W-80)*f,6);ctx.strokeStyle='rgba(255,255,255,'+(.35+.5*FX.pulse).toFixed(2)+')';ctx.strokeRect(40,32,W-80,6);}
 const b=G.banner;if(b){const a=b.t<20?b.t/20:b.t>170?(200-b.t)/30:1;ctx.globalAlpha=Math.max(0,a);
  if(b.small){txt(b.a,W/2,H*.62,b.c,18,'center',10);}else{if(b.warn&&(b.t>>3)%2){ctx.fillStyle='rgba(255,36,80,.12)';ctx.fillRect(0,0,W,H);}
  ctx.fillStyle='rgba(5,3,12,.55)';ctx.fillRect(0,H*.36,W,74);txt(b.a,W/2,H*.36+12,b.warn?COL.eb:COL.cy,28,'center',14);txt(b.b,W/2,H*.36+48,b.warn?'#fff':COL.am,13,'center',6);}ctx.globalAlpha=1;}}
// ---------- loop
let last=0,acc=0,fpsN=0,fpsT=0;window.__fps=0;
function frame(ts){requestAnimationFrame(frame);if(!last)last=ts;let dt=Math.min(100,ts-last);last=ts;fpsN++;fpsT+=dt;if(fpsT>=1000){window.__fps=fpsN;fpsN=0;fpsT=0;}
 if(G.state==='pause'){draw();return;}acc+=dt;let n=0;while(acc>=16.66&&n<4){update();acc-=16.66;n++;}if(n===4)acc=0;draw();}
function boot(){resize();addEventListener('resize',resize);buildSprites();buildBG();buildFX();
 $('ver').textContent=VERSION;$('bStart').onclick=startGame;$('bResume').onclick=togglePause;$('bQuit').onclick=()=>{G.state='title';musicStop();if(AU.c)AU.c.resume();show('title');};
 $('bRetry').onclick=startGame;$('bAgain').onclick=startGame;$('bTitle1').onclick=$('bTitle2').onclick=()=>{G.state='title';show('title');};
 const bb=$('bBomb');bb.addEventListener('pointerdown',e=>{e.preventDefault();bomb();});$('bPause').onclick=togglePause;$('bMute').onclick=toggleMute;
 if(localStorage.getItem('ngs_mute')==='1')toggleMute();
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.state==='play')togglePause();});
 wireSettings();
 $('tHi').textContent=G.hi?('HI-SCORE '+G.hi.toLocaleString()):'';show(lsGet('ngs_photo')||DBG[0]?'title':'photo');requestAnimationFrame(frame);
 setTimeout(()=>{$('splash').classList.add('gone');setTimeout(()=>$('splash').remove(),600);},350);
 if(DBG.includes('autostart'))startGame();
 if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('sw.js').catch(()=>{});
 window.NG={G,P,EN,EB,PB,PT,bomb,startGame,togglePause,step:n=>{for(let i=0;i<n;i++)update();},counts:()=>({en:EN.count(),eb:EB.count(),pb:PB.count(),pt:PT.count()})};}
boot();

})();
