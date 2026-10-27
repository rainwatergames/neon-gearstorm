/*! NEON GEARSTORM v1.2.0 — © 2026 Rainwater Games (Jeff Rainwater). All rights reserved.
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
const AU={c:null,m:null,mus:null,sfx:null,duck:null,rev:null,grev:null,gate:null,dly:null,dist:null,nb:null,muted:false,MG:.7,on:false,act:[],step:0,next:0,mode:0,timer:null,lastShot:0,
 origin:0,sp:.125,bpm:118,musV:+(lsGet('ngs_musv')||.8),sfxV:+(lsGet('ngs_sfxv')||.8)};
function lsGet(k){try{return localStorage.getItem(k);}catch(_){return null;}}
function lsSet(k,v){try{localStorage.setItem(k,v);}catch(_){}}
function irBuf(a,dur,decay){const n=Math.floor(a.sampleRate*dur),b=a.createBuffer(2,n,a.sampleRate);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,decay);}return b;}
function auInit(){if(AU.c){if(AU.c.state!=='running'&&G.state!=='pause')AU.c.resume();return;}const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const a=new C();AU.c=a;
 // v1.1.4 master bus (was: -20dB comp + makeup -> x1.25 -> -3dB "limiter" + makeup, which slammed ~+11dB of overload into 0dBFS and crunched on phones):
 // master gain .7 -> one fast compressor/limiter (-6dB, 12:1) -> trim -> soft-knee safety clipper with a -1dBFS ceiling -> out
 AU.m=a.createGain();AU.m.gain.value=AU.muted?0:AU.MG;const comp=a.createDynamicsCompressor();comp.threshold.value=-6;comp.knee.value=2;comp.ratio.value=12;comp.attack.value=.002;comp.release.value=.15;
 const trim=a.createGain();trim.gain.value=1;const safe=a.createWaveShaper();{const N=4096,c=new Float32Array(N),C=.86,K=.6;for(let i=0;i<N;i++){const x=i/(N/2)-1,ax=Math.abs(x);c[i]=Math.sign(x)*(ax<=K?ax:K+(C-K)*Math.tanh((ax-K)/(C-K)));}safe.curve=c;safe.oversample='none';}
 AU.m.connect(comp);comp.connect(trim);trim.connect(safe);safe.connect(a.destination);AU.comp=comp;AU.an=a.createAnalyser();AU.an.fftSize=256;trim.connect(AU.an);
 if(!AU.wd)AU.wd=setInterval(auWatch,400);a.onstatechange=()=>{if(a.state!=='running')setTimeout(auWatch,60);};
 AU.mus=a.createGain();AU.md=a.createGain();AU.mus.connect(AU.md);AU.md.connect(AU.m);AU.sfx=a.createGain();AU.sfx.connect(AU.m);applyVol(); // md = music duck on big explosions
 AU.duck=a.createGain();AU.duck.connect(AU.mus); // sidechain-style ducked bus (bass, pads, lead)
 // reverb (convolver) shared by music + sfx, gated reverb for snare
 AU.rev=a.createConvolver();AU.rev.buffer=irBuf(a,2.2,3);const rg=a.createGain();rg.gain.value=.5;AU.rev.connect(rg);rg.connect(AU.mus);
 AU.grev=a.createConvolver();AU.grev.buffer=irBuf(a,.9,1.2);AU.gate=a.createGain();AU.gate.gain.value=0;AU.grev.connect(AU.gate);AU.gate.connect(AU.mus);
 AU.srev=a.createGain();AU.srev.gain.value=.35;AU.srev.connect(AU.rev);AU.sfx.connect(AU.srev);
 // tempo-synced feedback delay for lead/arp
 AU.dly=a.createDelay(1);AU.dly.delayTime.value=.375;const fb=a.createGain();fb.gain.value=.38;const dl=a.createBiquadFilter();dl.type='lowpass';dl.frequency.value=2600;AU.dly.connect(dl);dl.connect(fb);fb.connect(AU.dly);const dw=a.createGain();dw.gain.value=.45;dl.connect(dw);dw.connect(AU.duck);
 // distortion for boss bass
 AU.dist=a.createWaveShaper();const cu=new Float32Array(1024);for(let i=0;i<1024;i++){const x=i/512-1;cu[i]=Math.tanh(x*6)*.8;}AU.dist.curve=cu;AU.dist.oversample='2x';const dg=a.createGain();dg.gain.value=.55;AU.dist.connect(dg);dg.connect(AU.duck);
 // v0.5 GUITAR RIG: pre-gain -> hard-clip waveshaper -> auto-wah bandpass (LFO) + cab lowpass -> duck bus (+delay/reverb sends)
 {const gi=a.createGain();gi.gain.value=1;const hp=a.createBiquadFilter();hp.type='highpass';hp.frequency.value=120;const ws=a.createWaveShaper();const gc=new Float32Array(2048);for(let i=0;i<2048;i++){const x=i/1024-1;gc[i]=Math.sign(x)*(1-Math.exp(-Math.abs(x)*12))*.7;}ws.curve=gc;ws.oversample='4x';
  const wah=a.createBiquadFilter();wah.type='peaking';wah.frequency.value=1100;wah.Q.value=3;wah.gain.value=8;const lfo=a.createOscillator();lfo.frequency.value=1.6;const lg=a.createGain();lg.gain.value=600;lfo.connect(lg);lg.connect(wah.frequency);lfo.start();
  const cab=a.createBiquadFilter();cab.type='lowpass';cab.frequency.value=4800;cab.Q.value=.9;const mid=a.createBiquadFilter();mid.type='peaking';mid.frequency.value=650;mid.gain.value=-5;const out=a.createGain();out.gain.value=.12;const fz=a.createBiquadFilter();fz.type='lowpass';fz.frequency.value=3600;fz.Q.value=.6; // v1.1.4 fizz filter right after the shaper
  gi.connect(hp);hp.connect(ws);ws.connect(fz);fz.connect(wah);wah.connect(mid);mid.connect(cab);cab.connect(out);out.connect(AU.duck);const sd=a.createGain();sd.gain.value=.35;out.connect(sd);sd.connect(AU.dly);const sr=a.createGain();sr.gain.value=.4;out.connect(sr);sr.connect(AU.rev);
  AU.gtr=gi;AU.gtrOut=out;AU.wah=wah;
  // palm-mute chug rig: separate shaper, dark cab
  const ci=a.createGain();const cs=a.createWaveShaper();cs.curve=gc;cs.oversample='2x';const cl=a.createBiquadFilter();cl.type='lowpass';cl.frequency.value=1300;cl.Q.value=1.4;const co=a.createGain();co.gain.value=.15;ci.connect(cs);cs.connect(cl);cl.connect(co);co.connect(AU.duck);AU.chug=ci;}
 AU.gcount=0;AU.mcount=[0,0,0,0,0,0];
 const n=a.sampleRate;AU.nb=a.createBuffer(1,n,n);const d=AU.nb.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;}
// v1.1.5 audio watchdog. Phones can suspend/'interrupt' the context mid-game (headset route change, audio-focus loss, render overload),
// and one NaN sample (e.g. from an unstable filter) poisons the delay feedback loop + compressor forever = total silence. The old code only resumed on a NEW
// touch, so a player holding the ship through the boss-2 death -> stage 3 transition got permanent silence. Now: auto-resume, and rebuild the graph on NaN.
function auWatch(){const a=AU.c;if(!a||document.hidden||(typeof G!=='undefined'&&G.state==='pause'))return;
 if(a.state==='suspended'||a.state==='interrupted'){AU.heals=(AU.heals||0)+1;try{const pr=a.resume();if(pr&&pr.catch)pr.catch(()=>{});}catch(_){}return;}
 if(a.state==='closed'){auRebuild();return;}
 if(AU.an){const d=AU.buf||(AU.buf=new Float32Array(AU.an.fftSize));AU.an.getFloatTimeDomainData(d);for(let i=0;i<d.length;i++)if(!isFinite(d[i])){auRebuild();return;}}}
function auRebuild(){AU.rebuilds=(AU.rebuilds||0)+1;const old=AU.c,on=AU.on,mode=AU.mode;AU.c=null;AU.act=[];try{if(old&&old.state!=='closed')old.close();}catch(_){}auInit();if(on&&AU.c)musicStart(mode);}
function applyVol(){if(!AU.mus)return;AU.mus.gain.value=.55*AU.musV*AU.musV;AU.sfx.gain.value=.75*AU.sfxV*AU.sfxV;}
function setVol(k,v){AU[k]=v;lsSet(k==='musV'?'ngs_musv':'ngs_sfxv',v);applyVol();}
// generic voices
function tone(type,f0,f1,dur,vol,dest,t0,fq,atk,send){const a=AU.c;if(!a)return;t0=t0||a.currentTime;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f0,t0);if(f1!==f0)o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t0+dur);
 if(atk){g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(vol,t0+atk);}else g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);let n=o;if(fq){const f=a.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(fq,t0);f.frequency.exponentialRampToValueAtTime(Math.max(80,fq*.15),t0+dur);o.connect(f);n=f;}n.connect(g);g.connect(dest||AU.sfx);if(send)g.connect(send);o.start(t0);o.stop(t0+dur+.03);AU.vEnd=Math.max(AU.vEnd||0,t0+dur+.03);o.onended=()=>{o.disconnect();if(n!==o)n.disconnect();g.disconnect();};return o;}
function noise(dur,vol,ftype,f0,f1,dest,t0,q,send){const a=AU.c;if(!a)return;t0=t0||a.currentTime;const s=a.createBufferSource();s.buffer=AU.nb;const f=a.createBiquadFilter();f.type=ftype;if(q)f.Q.value=q;f.frequency.setValueAtTime(f0,t0);if(f1!==f0)f.frequency.exponentialRampToValueAtTime(f1,t0+dur);const g=a.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);s.connect(f);f.connect(g);g.connect(dest||AU.sfx);if(send)g.connect(send);s.start(t0,Math.random()*.5);s.stop(t0+dur+.03);AU.vEnd=Math.max(AU.vEnd||0,t0+dur+.03);s.onended=()=>{s.disconnect();f.disconnect();g.disconnect();};}
function sub(f0,f1,dur,vol,t0){tone('sine',f0,f1,dur,vol*.6,AU.sfx,t0);} // v1.1.4: subs -4.4dB
const sfx={
 shot(){if(!AU.c)return;const t=AU.c.currentTime;if(t-AU.lastShot<.085)return;AU.lastShot=t;tone('triangle',1700,900,.028,.022,null,t);noise(.012,.012,'highpass',6000,6000,null,t);},
 zap(){tone('sawtooth',1800,300,.06,.025,null,0,4000);noise(.05,.03,'bandpass',4000,1500,null,0,3);},
 boom(s){if(!AU.c)return;s=s||1;const t=AU.c.currentTime,k=Math.min(3,s);
  sub(120+20*Math.random(),32,.28+.12*k,.45+.12*k,t);                 // low-end boom
  tone('square',90,40,.08,.12*k,null,t,600);                            // punch
  noise(.3+.15*k,.24+.07*k,'lowpass',3200,140,null,t,0,AU.srev);         // body
  noise(.12+.05*k,.14,'highpass',3000,1200,null,t+.02);                 // crackle
  if(s>1.4)noise(.18,.1,'bandpass',1800,600,null,t+.06,2);if(s>=2.5)duckMus(.3,.35);},
 hiss(){if(!AU.c)return;const t=AU.c.currentTime;noise(.7,.07,'highpass',5000,8000,null,t);noise(.5,.04,'bandpass',3000,6000,null,t+.2,2);},
 flame(){if(!AU.c)return;const t=AU.c.currentTime;noise(.6,.22,'bandpass',500,2200,null,t,1.2,AU.srev);tone('sawtooth',90,60,.5,.12,null,t,700);},
 hit(){tone('square',300,200,.025,.012);},
 power(){if(!AU.c)return;const t=AU.c.currentTime;[72,76,79,84,88,91].forEach((m,i)=>{tone('triangle',mf(m),mf(m),.22,.11,null,t+i*.045,0,0,AU.srev);tone('sine',mf(m+12),mf(m+12),.15,.05,null,t+i*.045);});},
 bomb(){if(!AU.c)return;const t=AU.c.currentTime;noise(1.1,.5,'bandpass',180,4200,null,t,1.2,AU.srev);noise(.9,.35,'bandpass',5000,300,null,t+.25,1.5); // whoosh
  sub(110,28,1.6,.9,t+.05);tone('sawtooth',300,30,1.2,.22,null,t,1800);noise(1.6,.4,'lowpass',2600,80,null,t+.05,0,AU.srev);   // boom + sub drop
  tone('sine',60,22,2.2,.35,null,t+.3);duckMus(.35,.9);},
 hit(){if(!AU.c)return;const t=AU.c.currentTime;tone('square',1400,180,.16,.22,null,t,4000);tone('sawtooth',300,60,.22,.25,null,t,1500);noise(.09,.35,'highpass',2500,2500,null,t);sub(120,40,.2,.6,t);},
 crack(){if(!AU.c)return;const t=AU.c.currentTime;noise(.05,.6,'highpass',3000,1800,null,t);noise(.22,.45,'bandpass',900,300,null,t+.01);tone('square',220,45,.3,.35,null,t,1200);sub(90,30,.35,.8,t);duckMus(.25,.3);},
 cog(){if(!AU.c)return;const t=AU.c.currentTime;if(t-(AU.lastCog||0)<.05)return;AU.lastCog=t;tone('triangle',1900,2400,.05,.04,null,t);},
 medal(n){if(!AU.c)return;const t=AU.c.currentTime,m=84+Math.min(n,7)*2;tone('square',mf(m),mf(m),.07,.05,null,t,5000);tone('triangle',mf(m+7),mf(m+7),.1,.05,null,t+.05);},
 deny(){if(!AU.c)return;const t=AU.c.currentTime;tone('square',160,120,.15,.08,null,t,900);},
 die(){if(!AU.c)return;const t=AU.c.currentTime;sfx.boom(2.5);tone('sawtooth',900,40,.9,.25,null,t,3000);tone('square',450,30,1,.12,null,t+.05,1200);noise(1.2,.4,'lowpass',2500,90,null,t,0,AU.srev);duckMus(.35,.8);},
 warn(){if(!AU.c)return;const t=AU.c.currentTime;for(let i=0;i<4;i++){const s=t+i*.9;tone('sawtooth',380,760,.45,.08,null,s,2200,.05);tone('sawtooth',760,380,.45,.08,null,s+.45,2200);}},
 phase(){if(!AU.c)return;noise(.7,.45,'bandpass',500,4000,null,0,1,AU.srev);tone('triangle',200,900,.5,.2);sub(90,30,.8,.7);},
 bossDie(){if(!AU.c)return;const t=AU.c.currentTime;sub(100,20,3,1,t);noise(3,.4,'lowpass',4000,60,null,t,0,AU.srev);duckMus(.35,1.6);tone('sawtooth',200,25,2.5,.3,null,t,1500);[0,.2,.45,.7].forEach(d=>sfx.boomAt(t+d));},
 boomAt(t){sub(140,30,.5,.5,t);noise(.5,.35,'lowpass',2500,150,null,t);}
};
// v1.1.4 SFX voice cap (max 3 of the same sound, 16 total; nested calls like die->boom ride along) + music duck on big hits
{const CAP_SAME=3,CAP_ALL=16;let depth=0;for(const k of Object.keys(sfx)){const f=sfx[k];sfx[k]=function(...ar){const a=AU.c;if(!a)return;const now=a.currentTime;
 if(!depth){AU.act=AU.act.filter(v=>v.e>now);let same=0;for(const v of AU.act)if(v.k===k)same++;if(AU.act.length>=CAP_ALL||same>=CAP_SAME){AU.vDrop=(AU.vDrop||0)+1;return;}}
 const pe=AU.vEnd||0;AU.vEnd=0;depth++;let r;try{r=f.apply(this,ar);}finally{depth--;}if(AU.vEnd>now&&!depth)AU.act.push({k,e:AU.vEnd});AU.vEnd=Math.max(pe,AU.vEnd);return r;};}}
function duckMus(depth,hold){const a=AU.c;if(!a||!AU.md)return;const t=a.currentTime,g=AU.md.gain;g.cancelScheduledValues(t);g.setValueAtTime(g.value,t);g.linearRampToValueAtTime(Math.min(g.value,1-depth),t+.03);g.setTargetAtTime(1,t+.03+hold,.2);}
// v0.5 guitar voice: saw+square pair into the rig. o: {bend:semis from below, vib:depth, dive:semis to drop, sq:pinch squeal}
function gtr(m,dur,t,o){const a=AU.c;if(!a||!AU.gtr)return;o=o||{};AU.gcount++;const f=mf(m),g=a.createGain(),o1=a.createOscillator(),o2=a.createOscillator();o1.type='sawtooth';o2.type='square';
 const st=o.bend?f*Math.pow(2,-o.bend/12):f;for(const os of[o1,o2]){os.frequency.setValueAtTime(st,t);if(o.bend)os.frequency.exponentialRampToValueAtTime(f,t+Math.min(dur*.4,.12));
  if(o.dive){os.frequency.setValueAtTime(f,t+dur*.45);os.frequency.exponentialRampToValueAtTime(f*Math.pow(2,-o.dive/12),t+dur);}}
 o2.detune.value=7;if(o.vib){const l=a.createOscillator(),lg=a.createGain();l.frequency.value=o.sq?7.5:5.8;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(f*.03*o.vib,t+dur*.5);l.connect(lg);lg.connect(o1.frequency);lg.connect(o2.frequency);l.start(t);l.stop(t+dur+.05);l.onended=()=>{l.disconnect();lg.disconnect();};}
 const v=o.sq?.5:.42;g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.006);g.gain.setValueAtTime(v*.85,t+dur*.8);g.gain.exponentialRampToValueAtTime(.001,t+dur+.08);
 o1.connect(g);o2.connect(g);g.connect(AU.gtr);o1.start(t);o2.start(t);o1.stop(t+dur+.1);o2.stop(t+dur+.1);o2.onended=()=>{o1.disconnect();o2.disconnect();g.disconnect();};
 if(o.sq){const h=a.createOscillator(),hg=a.createGain();h.type='sawtooth';h.frequency.setValueAtTime(f*3,t);h.frequency.exponentialRampToValueAtTime(f*3.06,t+dur);hg.gain.setValueAtTime(.0001,t);hg.gain.linearRampToValueAtTime(.18,t+.02);hg.gain.exponentialRampToValueAtTime(.001,t+dur);h.connect(hg);hg.connect(AU.gtr);h.start(t);h.stop(t+dur+.05);h.onended=()=>{h.disconnect();hg.disconnect();};}}
function chug(m,dur,t,acc){const a=AU.c;if(!a||!AU.chug)return;AU.gcount++;const g=a.createGain(),o=a.createOscillator(),o2=a.createOscillator();o.type='sawtooth';o2.type='sawtooth';o.frequency.value=mf(m);o2.frequency.value=mf(m+7);o2.detune.value=-6;
 g.gain.setValueAtTime(acc?.55:.4,t);g.gain.exponentialRampToValueAtTime(.002,t+dur);o.connect(g);o2.connect(g);g.connect(AU.chug);o.start(t);o2.start(t);o.stop(t+dur+.02);o2.stop(t+dur+.02);o2.onended=()=>{o.disconnect();o2.disconnect();g.disconnect();};}
// deterministic shred: minor-pentatonic random walk seeded by step
const PENT=[0,3,5,7,10,12,15,17,19,22,24];
function shred(root,s,st,barN,t,sp){const r=((s*2654435761)>>>0)%1000/1000,bar4=barN%4;
 if(bar4===3&&st===8){gtr(root+36,sp*8,t,{vib:1,dive:24});return;}          // dive bomb at end of phrase
 if(bar4===3&&st>8)return;
 if(st===0&&bar4===1){gtr(root+31,sp*4,t,{bend:2,vib:1.4,sq:1});return;}     // pinch-harmonic squeal
 if(bar4===1&&st<4)return;
 if(st%2===1&&r<.25)return;const i=Math.floor((Math.sin(s*.7)*.5+.5)*PENT.length*.999);gtr(root+24+PENT[i],sp*(st%4===0?1.6:.95),t,{bend:st%8===0?1:0,vib:st%8===0?.7:0});}
// ---------- music: 16th-step sequencer, song sections, beat clock
const mf=n=>440*Math.pow(2,(n-69)/12);
// main: A minor  i-VI-III-VII ; boss: D minor i-VI-iv-V
const HOOK=[[0,69,3],[3,72,3],[6,76,2],[8,75,2],[10,76,4],[16,77,3],[19,76,3],[22,72,2],[24,69,6],[32,70,3],[35,74,3],[38,77,2],[40,76,4],[44,74,2],[46,70,2],[48,68,4],[52,71,2],[54,74,2],[56,76,4],[60,75,2],[62,68,2]];
const BHOOK=[[0,74,3],[3,77,3],[6,81,2],[8,79,4],[12,77,4],[16,74,3],[19,70,3],[22,74,2],[24,72,8],[32,67,3],[35,70,3],[38,74,2],[40,72,4],[44,70,4],[48,69,3],[51,73,3],[54,76,2],[56,73,8]];
const SONGS=[{bpm:124,dark:1,ch:[[57,60,64],[53,57,60],[58,62,65],[56,59,64]],root:[45,41,46,40],hook:HOOK,
 sec:[['intro',4,'k a p'],['verse',8,'k b h s a p'],['chorus',8,'k b h s a p l c'],['break',4,'p a lf'],['drop',8,'k b h s a p l c o r'],['verse',8,'k b h s a p'],['chorus',8,'k b h s a p l c o']]},
 {bpm:150,boss:1,ch:[[62,65,69],[58,62,65],[55,58,62],[57,61,64]],root:[38,46,43,45],hook:BHOOK,
 sec:[['siren',4,'S k'],['heavy',8,'k b h s a o'],['hook',8,'k b h s a l o r'],['break',2,'S p'],['hook',8,'k b h s a l o r c']]}];
const tr=(h,k)=>h.map(x=>[x[0],x[1]+k,x[2]]);
// v0.4 stage 2: E phrygian grind, slower + heavier ; boss 2: C# minor, fast
SONGS.push({bpm:112,dark:1,ch:[[52,55,59],[53,57,60],[52,55,59],[50,53,57]],root:[40,41,40,38],hook:tr(HOOK,-5),
 sec:[['intro',4,'k p lf G'],['grind',8,'k b h s p G'],['verse',8,'k b h s a p G'],['chorus',8,'k b h s p c o g G'],['solo',8,'k b h s p G Q r'],['break',4,'p lf S'],['drop',8,'k b h s a p g c o r G']]});
SONGS.push({bpm:164,boss:1,ch:[[61,64,68],[57,61,64],[54,57,61],[56,60,63]],root:[37,45,42,44],hook:tr(BHOOK,-1),
 sec:[['siren',4,'S k G'],['heavy',8,'k b h s o G'],['hook',8,'k b h s g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G'],['solo',8,'k b h s o G Q']]});
// v1.2.0: stage 3 (and its two songs) removed. Mode 4 = ALL STAGES CLEAR victory theme: bright C major, 128 bpm, loops on the ending screen
SONGS.push({bpm:128,ch:[[60,64,67],[65,69,72],[67,71,74],[64,67,71]],root:[48,53,55,52],hook:tr(HOOK,0),
 sec:[['intro',2,'S p'],['chorus',8,'k b h s a l c o'],['hook',8,'k b h s a l o r c'],['break',2,'p lf'],['chorus',8,'k b h s a l c o g']]});
// stage-1 boss also gets the guitars + a solo
SONGS[1].sec=[['siren',4,'S k'],['heavy',8,'k b h s a o G'],['hook',8,'k b h s a l o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']];
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
   else if(song.dark){const n=root-12+(st%8===6?12:0)+(st===14?1:0);tone('sawtooth',mf(n),mf(n),sp*.8,.2,AU.dist,t,st%4===0?1400:700);tone('sawtooth',mf(n)*1.012,mf(n)*1.012,sp*.8,.1,D,t,900);if(st%4===0)tone('sine',mf(root-24),mf(root-24),sp*2,.22,D,t);}
  else if(st%2===0){const n=root-12+(st%4===2?12:0);tone('sawtooth',mf(n),mf(n),sp*1.7,.2,D,t,1500);tone('square',mf(n)*1.003,mf(n),sp*1.6,.08,D,t,900);}}
  // ARP: 16th chord-tone arpeggio through the delay
  if(has('a')){const arp=ch[st%3]+12+(Math.floor(st/3)%2?12:0)+(boss?0:0);tone('square',mf(arp),mf(arp),sp*.7,boss?.04:.045,D,t,has('lf')?1200:3600,0,AU.dly);}
  // PAD: detuned saws, slow attack, ducked by kick
  if(has('p')&&st===0)for(const n of ch){tone('sawtooth',mf(n),mf(n),sp*16,.035,D,t,2400,.25,AU.rev);tone('sawtooth',mf(n)*1.006,mf(n)*1.006,sp*16,.03,D,t,2000,.3);}
  // CHORD stabs on the off-beats
  if(has('c')&&(st===2||st===10||st===14))for(const n of ch)tone('sawtooth',mf(n+12),mf(n+12),sp*1.2,.03,D,t,3200,0,AU.rev);
  // LEAD hook: two detuned saws + square, with delay + reverb
  if(has('l')||has('lf')){const pos=(barN%4)*16+st;for(const h of song.hook)if(h[0]===pos){const f=mf(h[1]+(has('lf')?-12:0)),d=sp*h[2];tone('sawtooth',f,f,d,.07,D,t,has('lf')?1400:5000,.01,AU.dly);tone('sawtooth',f*1.007,f*1.007,d,.05,D,t,4200,.01,AU.rev);tone('square',f*2,f*2,d*.6,.015,D,t,3000);}}
  // v0.5 GUITARS: G = palm-muted gallop chugs, g = lead guitar doubling the hook (bends/vibrato/squeal), Q = shred solo with dive bombs
  if(has('G')){const gal=boss?[0,2,3,4,6,7,8,10,11,12,14,15]:[0,2,3,6,8,10,11,14];if(gal.indexOf(st)>=0)chug(root-12+(st===14&&lastBar?1:0),sp*(st%4===0?.9:.55),t,st%4===0);
   if(st===0&&sx.bi%2===0)gtr(root+(boss?12:7),sp*3,t,{vib:.6});}
  if(has('g')){const pos=(barN%4)*16+st;for(const h of song.hook)if(h[0]===pos){const d=sp*h[2],long=h[2]>=4;gtr(h[1]-12+(boss?0:0),d,t,{bend:h[2]>=3?2:0,vib:long?1:0,sq:long&&pos===song.hook[song.hook.length-1][0]});}}
  if(has('Q'))shred(root,s,st,barN,t,sp);
  AU.mcount[AU.mode]++;
  // crash / riser
  if(has('r')&&sx.bi===0&&st===0)noise(1.6,.22,'highpass',5000,3000,M,t,0,AU.rev);
  if(lastBar&&st===0&&(has('k'))){const n=noise(sp*16,.12,'bandpass',400,6000,M,t,2);}
  // SIREN (boss intro / breakdown)
  if(has('S')&&st===0){tone('sawtooth',mf(root+12),mf(root+24),sp*8,.07,M,t,2600,.05,AU.rev);tone('sawtooth',mf(root+24),mf(root+12),sp*8,.07,M,t+sp*8,2600,.05,AU.rev);tone('sine',mf(root-24),mf(root-24),sp*16,.35,M,t);}
  AU.step++;AU.next+=sp;}}
function setMute(m){AU.muted=m;if(AU.m)AU.m.gain.value=m?0:AU.MG;}

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
 for(let dd=BR0+120;dd<BR1-120;dd+=60){const s=s2span(dd);G2.items.push({d:dd,x:(s.L+s.a)/2,k:'m'});if((dd-BR0)%120===0)G2.items.push({d:dd,x:(s.b+s.R)/2,k:'c'});}
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
  if(Math.abs(P.x-it.x)<16&&Math.abs(P.y-y)<16){G2.items.splice(i,1);if(it.k==='m'){const v=CHAIN[Math.min(G.chain,CHAIN.length-1)];G.chain++;G.medals++;G.bestChain=Math.max(G.bestChain,G.chain);G.score+=v;G.pop2={t:0,x:it.x,y,s:'+'+v};sfx.medal(G.chain);}else{G.salv+=3;sfx.cog();}}}}
// bullets: player shots stop on walls/gears (sparks, small score on gears); enemy shots stop on walls
function s2BlockPB(b){const d=s2d(b.y);if(s2solid(b.x,d,0)){if(Math.random()<.3)part(0,b.x,b.y,rnd(-1,1),rnd(0,1),8,.5,'cy');return true;}
 for(const g of G2.gears){const gy=s2y(g.d);if(Math.abs(gy-b.y)>g.r)continue;const gx=gearX(g);if((b.x-gx)**2+(b.y-gy)**2<g.r*g.r){G.score+=5;if(Math.random()<.4)part(0,b.x,b.y,rnd(-1.5,1.5),rnd(0,1.5),8,.6,'am');return true;}}return false;}
function s2BlockEB(b){return s2solid(b.x,s2d(b.y),0);}
// ---------- boss 2: INFERNO DRILL ENGINE
function spawnBoss2(){const b=spawn('boss2',W/2,-130,{invT:150,phase:0,hA:0,ls:0,lt:0,lcd:200,big:true});G.boss=b;
 b.parts=[b.pL=mkPart(b,-76,-8,28,500,'LEFT FURNACE','debris'),b.pR=mkPart(b,76,-8,28,500,'RIGHT FURNACE','debris'),b.pM=mkPart(b,0,78,28,560,'DRILL HEAD','debris')];musicStart(3);G2.spd=.5;}
function updBoss2(e){const t=e.t;
 if(e.dying){e.dT++;if(e.dT===1){strobe(200);sfx.bossDie();}if(e.dT%4===0)boom(e.x+rnd(-100,100),e.y+rnd(-60,90),rnd(1,2.4),['am','mg','am','cy'][e.dT%4]);if(e.dT%30===0){part(1,e.x,e.y,0,0,30,60,'am');sfx.phase();}e.y+=.35;G.shake=Math.max(G.shake,7);
  if(e.dT===220){boom(e.x,e.y,5,'am');boom(e.x,e.y+60,4.5,'mg');boom(e.x,e.y,4,'cy');part(1,e.x,e.y,0,0,50,140,'w');flash(1,'255,200,120');sfx.bossDie();for(let i=0;i<10;i++)G.fall.push({x:e.x+rnd(-90,90),y:e.y+rnd(-40,60),vx:rnd(-3,3),vy:rnd(-5,-1),rot:0,vr:rnd(-.1,.1),spr:i%3?'debris':'bGear',t:0});e.act=false;G.boss=null;later(150,stageClear);}return;}
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
 if(!G2.pat){const c=document.createElement('canvas');c.width=c.height=24;const x=c.getContext('2d');x.fillStyle='#24140e';x.fillRect(0,0,24,24);x.strokeStyle='rgba(255,150,70,.16)';x.lineWidth=3;x.beginPath();x.moveTo(-6,30);x.lineTo(30,-6);x.moveTo(-18,18);x.lineTo(18,-18);x.moveTo(6,42);x.lineTo(42,6);x.stroke();G2.pat=ctx.createPattern(c,'repeat');}
 try{G2.pat.setTransform(new DOMMatrix([1,0,0,1,0,G2.d%24]));}catch(_){}
 const fill=G2.pat;
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
 const b=G.boss;if(b&&b.act&&b.type==='boss2'&&b.ls===1){ // v0.5: loud, pulsing lunge warning column with marching chevrons
  const pu=.5+.5*Math.sin(G.t*.55),x=b.lx,y0=b.y+40,hw=34;const g=ctx.createLinearGradient(x-hw,0,x+hw,0);g.addColorStop(0,'rgba(255,20,60,0)');g.addColorStop(.5,'rgba(255,40,80,'+(.28+.3*pu)+')');g.addColorStop(1,'rgba(255,20,60,0)');ctx.fillStyle=g;ctx.fillRect(x-hw*1.6,y0,hw*3.2,H);
  ctx.strokeStyle='rgba(255,80,110,'+(.6+.4*pu)+')';ctx.lineWidth=3;ctx.setLineDash([14,8]);ctx.lineDashOffset=-G.t*2;ctx.beginPath();ctx.moveTo(x-hw,y0);ctx.lineTo(x-hw,H);ctx.moveTo(x+hw,y0);ctx.lineTo(x+hw,H);ctx.stroke();ctx.setLineDash([]);
  ctx.lineWidth=5;ctx.strokeStyle='rgba(255,230,240,'+(.55+.45*pu)+')';const off=(G.t*3)%44;for(let y=y0+70+off;y<H;y+=44){ctx.beginPath();ctx.moveTo(x-18,y-10);ctx.lineTo(x,y+6);ctx.lineTo(x+18,y-10);ctx.stroke();}
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=.6+.4*pu;txt('⚠ DRILL LUNGE',x,Math.min(H-60,Math.max(y0+50,P.y-60)),'#ff3b6b',16,'center',8);ctx.globalAlpha=1;ctx.globalCompositeOperation='lighter';}
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

// ---- main.js : game loop, entities, stage script
const VERSION='v1.2.0';
const Q=new URLSearchParams(location.search);
const DBG=(Q.get('debug')||'').split(',');
const DBG_BOSS=DBG.includes('boss'),DBG_MID=DBG.includes('mid'),DBG_INV=DBG.includes('inv'),DBG_S2=DBG.includes('stage2'),DBG_B2=DBG.includes('boss2'),DBG_S3=DBG.includes('stage3'),DBG_B3=DBG.includes('boss3'); // v1.2.0: stage 3 removed — old stage3/boss3 links start at boss 2 (-> ALL STAGES CLEAR) // v0.3: ?debug=boss no longer silently grants invincibility (root cause of 'red bullets did no damage')
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
const DEF={drone:{hp0:2,r:9,sc:100},swooper:{hp0:4,r:10,sc:150},turret:{hp0:16,r:14,sc:400},carrier:{hp0:14,r:18,sc:500},gunship:{hp0:420,r:44,sc:20000,big:true},part:{hp0:100,r:24,sc:0,big:true},boss:{hp0:900,r:44,sc:100000,big:true},boss2:{hp0:1700,r:22,sc:150000,big:true},block:{hp0:10,r:18,sc:200,big:true}};
const SD=()=>S2D;
function spawn(type,x,y,o){const e=EN.get();if(!e)return null;for(const k in e)if(k!=='act')delete e[k];Object.assign(e,{type,x,y,vx:0,vy:0,t:0,fl:0,rot:0,invT:0,id:++eid,big:false},DEF[type],o||{});e.hp=e.maxhp=e.hp0*(G.stage>=2&&type!=='block'&&type!=='part'&&type!=='boss2'?SD().hp:1);return e;}
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
function hurt(e,d){if(e.invT>0||e.dying||e.lock)return;if(e.parts&&partsAlive(e)>0)d*=(e.type==='boss'||e.type==='boss2')?.12:.4;e.hp-=d;e.fl=3;e.hitT=90;if(e.hp<=0)kill(e);}
function cogs(x,y,n,v){for(let i=0;i<n;i++){const c=CG.get();if(!c)return;c.x=x+rnd(-8,8);c.y=y+rnd(-8,8);c.vx=rnd(-1.6,1.6);c.vy=rnd(-2.2,0);c.v=v||1;c.t=0;}}
function medal(x,y){const m=MD.get();if(!m)return;m.x=x;m.y=y;m.vx=rnd(-.6,.6);m.vy=-1.2;m.t=0;}
const CHAIN=[100,200,400,800,1500,3000,5000];
function killPart(e){e.act=false;e.gone=true;const pa=e.p,bb=pa.type==='boss'||pa.type==='boss2';boom(e.x,e.y,bb?2.6:1.8,'am');later(8,()=>boom(e.x+rnd(-14,14),e.y+rnd(-10,10),1.4,'mg'));flash(.3,'255,200,120');
 G.fall.push({x:e.x,y:e.y,vx:rnd(-1,1)+Math.sign(e.ox||rnd(-1,1))*1.4,vy:-2.5,rot:0,vr:rnd(-.08,.08),spr:e.spr||'bGear',t:0});
 const sc=bb?15000:5000,sv=bb?40:12;G.score+=sc;cogs(e.x,e.y,bb?10:5,Math.ceil(sv/(bb?10:5)));for(let i=0;i<(bb?3:2);i++)medal(e.x+rnd(-20,20),e.y);
 G.banner={t:100,a:e.label+' DESTROYED',b:'',small:true,c:COL.am};clearBullets(true);if(bb)bossPhaseUp(pa);}
function bossPhaseUp(e){const ph=3-partsAlive(e);if(ph===e.phase)return;e.phase=ph;e.invT=50;G.shake=12;flash(.6,ph<3?'255,61,240':'255,36,80');strobe(24);sfx.phase();
 G.banner=ph<3?{t:60,a:'PHASE '+(ph+1),b:['','GEARS SLIPPING','PRESSURE CRITICAL'][ph]}:{t:40,a:'CORE EXPOSED',b:'BERSERK OVERCLOCK',warn:true};}
function kill(e){if(e.type==='part'){killPart(e);return;}if(e.type==='block'){e.act=false;G.score+=e.sc;G2.blocksBroken++;boom(e.x,e.y,e.glass?.8:1.2,e.glass?'cy':'am');for(let i=0;i<5;i++)part(2,e.x+rnd(-10,10),e.y+rnd(-10,10),rnd(-2,2),rnd(-3,0),30,rnd(.6,1.1));if(Math.random()<.5)cogs(e.x,e.y,1,1);if(Math.random()<.25)medal(e.x,e.y);return;}
 if(e.type==='boss2'){e.dying=true;e.dT=0;clearBullets(true);G.score+=e.sc;cogs(e.x,e.y,15,10);G.boss2Kill=true;return;}
 if(e.type==='boss'){e.dying=true;e.dT=0;clearBullets(true);G.score+=e.sc;cogs(e.x,e.y,15,10);G.bossKill=true;return;}
 e.act=false;G.score+=e.sc;G.kills++;if(e.big){flash(.35,'255,200,120');}boom(e.x,e.y,e.big?3.5:(e.r>12?1.6:1),e.type==='carrier'?'li':(e.type==='swooper'?'mg':'am'));
 if(e.type==='carrier')dropOrb(e.x,e.y,0);
 const cv0={drone:Math.random()<.4?1:0,swooper:Math.random()<.6?1:0,turret:3,carrier:4,gunship:12}[e.type]||0;if(cv0)cogs(e.x,e.y,cv0,e.type==='gunship'?2:1);
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
 G.hull=0;boom(P.x,P.y,2.5,'cy');sfx.die();G.pop={t:0,x:P.x,y:P.y-20,s:'HULL BREACH',c:'#ff5a2a'};G.lives--;G.lvl=Math.max(1,G.lvl-1);P.dead=80;clearBullets(false);
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
function startGame(){auInit();applyMeta();const sb=Math.min(META.bombs,bombCap());META.bombs-=sb;metaSave();Object.assign(G,{state:'play',st:0,hold:false,score:0,lives:2+UL('life'),bombs:sb,weapon:0,lvl:1+UL('wlvl'),shield:3+UL('shield'),maxSh:3+UL('shield'),hull:3+UL('hull'),hullM:3+UL('hull'),noHit:0,regen:0,shDown:0,rip:[],spk:[],hullFl:0,salv:0,chain:0,vig:0,pop:null,pop2:null,fall:[],hits:0,bossKill:false,boss2Kill:false,medals:0,bestChain:0,stage:1,ev2Delay:0,banked:false,shake:0,flash:0,bombT:0,boss:null,mid:null,evI:0,timers:[],banner:null,arcs:[],kills:0});
 Object.assign(P,{x:W/2,y:H-90,inv:120,dead:0,fireT:0,bank:0});PB.clear();EB.clear();EN.clear();PU.clear();LT.clear();CG.clear();MD.clear();FX.strobe=0;
 if(DBG_BOSS||DBG_MID){const tt=DBG_BOSS?92:46;G.st=tt*60;while(G.evI<EV.length&&EV[G.evI][0]<tt)G.evI++;G.lvl=Math.max(G.lvl,3);G.weapon=DBG.includes('laser')?1:DBG.includes('tesla')?2:0;}
 if(DBG_S2||DBG_B2){G.stage=2;s2reset(DBG_B2?BOSS2D-30:0);G.lvl=Math.max(G.lvl,3);G.weapon=DBG.includes('laser')?1:DBG.includes('tesla')?2:0;}
 if(DBG_S3||DBG_B3){G.stage=2;s2reset(BOSS2D-30);G.lvl=Math.max(G.lvl,3);} // v1.2.0: legacy stage-3 links -> boss 2 -> ALL STAGES CLEAR
 if(DBG.includes('wmax'))G.lvl=lvlCap();
 musicStart(G.stage===2?(DBG_B2||DBG_S3||DBG_B3?3:2):0);show(null);updHud();}
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
function bankRun(){if(G.banked)return null;G.banked=true;const dist=Math.floor(G.st/60/3),kb=Math.floor((G.kills||0)/5),bk=(G.bossKill?150:0)+(G.boss2Kill?200:0),mul=1+.15*UL('cogs');
 const tot=Math.round((G.salv+dist+kb+bk)*mul);META.cogs+=tot;META.runs++;META.bombs=Math.min(bombCap(),META.bombs+G.bombs);metaSave();
 return {pick:G.salv,dist,kb,bk,mul,tot};}
function salvHTML(r){if(!r)return '';return '<div class="salv"><div class="lbl">SALVAGE EARNED</div><div class="sbig">⚙ +'+r.tot+'</div><div class="sdet">pickups '+r.pick+' · distance '+r.dist+' · kills '+r.kb+(r.bk?' · boss '+r.bk:'')+(r.mul>1?' · ×'+r.mul.toFixed(2):'')+'</div><div class="lbl">TOTAL ⚙ '+META.cogs+'</div></div>';}
function gameOver(){if(G.state!=='play')return;G.state='over';hiSave();musicStop();$('oSalv').innerHTML=salvHTML(bankRun());$('oScore').textContent=G.score.toLocaleString();$('oHi').textContent=G.hi.toLocaleString();show('over');}
function stageClear(){if(G.state!=='play')return;const fin=G.stage>=2;const h2=document.querySelector('#clear h2');if(h2){h2.textContent=fin?'ALL STAGES CLEAR!':'STAGE CLEAR';h2.nextElementSibling.textContent=fin?'Thanks for testing! More stages coming in later versions.':'CLOCKWORK COLOSSUS DESTROYED';}const bonus=G.lives*10000+G.bombs*5000;G.score+=bonus;G.state='clear';hiSave();if(fin)musicStart(4);else musicStop(); // v1.2.0: victory theme keeps audio going on the ending screen
 $('cRes').style.display=fin?'':'none';$('cRes').innerHTML=fin?'<div class="lbl">RESULTS</div><div class="sdet">Inferno Drill Engine destroyed · '+(G.kills||0)+' kills · '+G.hits+' hits taken</div><div class="lbl">MEDALS</div><div class="sdet" style="color:#5dff9a">🏅 '+G.medals+' collected · best chain ×'+G.bestChain+'</div>':'';$('cSalv').innerHTML=salvHTML(bankRun());$('cScore').textContent=G.score.toLocaleString();$('cBonus').textContent='Lives ×'+G.lives+' + Bombs ×'+G.bombs+' = '+bonus.toLocaleString();$('cHi').textContent=G.hi.toLocaleString();show('clear');}
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
 if(G.stage>2&&G.state==='play'){G.stage=2;stageClear();} // v1.2.0: no stage 3 — anything that lands past stage 2 goes to the ending
 // player
 if(P.dead>0){P.dead--;if(P.dead===0&&G.lives>0){P.x=W/2;P.y=H-80;P.inv=100;G.shield=G.maxSh;G.hull=G.hullM;updHud();}}
 else{let kx=(keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0),ky=(keys.ArrowDown||keys.KeyS?1:0)-(keys.ArrowUp||keys.KeyW?1:0);const sp=(keys.ShiftLeft||keys.ShiftRight?2.2:4.2)*MF.sp;
  if(kx||ky){const n=Math.hypot(kx,ky);P.x=clamp(P.x+kx/n*sp,10,W-10);P.y=clamp(P.y+ky/n*sp,20,H-16);P.bank+=kx*.6;}
  if(P.fireT>0)P.fireT--;fire();if(P.fireT<-1)P.fireT=0;if(P.inv>0)P.inv--;}
 shieldTick();
 P.bank*=.85;
 if(G.bombT>0){G.bombT--;for(const b of EB.a)b.act=false;if(G.bombT%3===0)for(const e of EN.a)if(e.act&&e.y>-20)hurt(e,e.big?1.2:3);}
 // player bullets
 for(const b of PB.a){if(!b.act)continue;if(b.k===3){b.t=(b.t||0)+1;if(b.t%3===0||!b.tg||!b.tg.act||b.tg.dying)b.tg=nearestEn(b.x,b.y,600);const sp=Math.min(9,3+b.t*.25);let a=Math.atan2(b.vy,b.vx);if(b.tg){let da=Math.atan2(b.tg.y-b.y,b.tg.x-b.x)-a;da=Math.atan2(Math.sin(da),Math.cos(da));a+=clamp(da,-.16,.16);}else a+=clamp(-Math.PI/2-a,-.1,.1);b.vx=Math.cos(a)*sp;b.vy=Math.sin(a)*sp;b.rot=a+Math.PI/2;if(b.t%2===0)part(0,b.x-b.vx,b.y-b.vy,rnd(-.5,.5),rnd(-.5,.5),14,.6,'mg');if(b.t>200){b.act=false;continue;}}b.x+=b.vx;b.y+=b.vy;if(b.y<-30||b.y>H+30||b.x<-20||b.x>W+20||(G.stage===2&&s2BlockPB(b))){b.act=false;continue;}
  for(const e of EN.a){if(!e.act||e.y<-8||e.dying)continue;const rx=e.r+b.w/2,ry=e.r+b.h/2;if(Math.abs(e.x-b.x)<rx&&Math.abs(e.y-b.y)<ry){hurt(e,b.dmg);if(Math.random()<.3)part(0,b.x,b.y-4,rnd(-1,1),rnd(-2,0),8,.5,(WEAP[b.k]||WEAP[2]).d);if(b.k===3)boom(b.x,b.y,.6,'mg');if(!b.pierce){b.act=false;break;}}}}
 // enemies
 for(const e of EN.a){if(!e.act)continue;updEnemy(e);if(!e.act||P.dead>0||e.dying)continue;const dx=e.x-P.x,dy=e.y-P.y,rr=e.r*.8+4;if(dx*dx+dy*dy<rr*rr&&e.y>0&&e.type!=='block'){G.hitBy=e.type;playerHit();}}
 // enemy bullets
 for(const b of EB.a){if(!b.act)continue;b.x+=b.vx;b.y+=b.vy;if(b.y<-20||b.y>H+20||b.x<-20||b.x>W+20||(G.stage===2&&s2BlockEB(b))){b.act=false;continue;}
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
 case 'part':if(e.p.type==='boss2')drawPart2(e);else drawPart(e);break;
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
 if(G.stage===2)s2DrawBack();
 // smoke under
 for(const p of PT.a){if(p.act&&p.k===3){ctx.globalAlpha=p.life/p.max*.7;ds(S.smoke,p.x,p.y,0,p.s);}}ctx.globalAlpha=1;
 for(const e of EN.a)if(e.act&&e.type==='turret')drawEnemy(e);
 for(const e of EN.a)if(e.act&&e.type!=='turret'&&!(e.type==='part'&&e.p&&(e.p.type==='boss'||e.p.type==='boss2')))drawEnemy(e);
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
 if(G.stage===2)s2DrawFront();
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
 window.NG={AU,auInit,musicTick,musicStart,sfx,hurtE:hurt,get H(){return H;},spawnTarget:()=>{const e=spawn('block',W/2,200,{d:s2d(200),r:90,hp0:1e7,glass:false,seed:1,sc:0});return e;},s2reset,spawnBoss2,G2,s2span,s2solid,s2d,s2y,flameState,flameOrigin,gearX,toStage2,kill,hurt,AU,FX,SET,G,P,EN,EB,PB,PT,CG,MD,META,UPG,buy,openHangar,playerHit,eShot,bomb,startGame,spawn,DEF,PU,dropRepair,togglePause,updHud,bombPing,step:n=>{for(let i=0;i<n;i++)update();},counts:()=>({en:EN.count(),eb:EB.count(),pb:PB.count(),pt:PT.count()})};}
// v0.5 update check: version.json is fetched with no-store; newer build -> reload once (title) or show a tap-to-update toast
function verNum(v){return parseFloat(String(v).replace(/^v/,''))||0;}
function verToast(){if(document.getElementById('updT'))return;const d=document.createElement('button');d.id='updT';d.textContent='NEW VERSION — TAP TO UPDATE';d.style.cssText='position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:99;background:#ff2e88;color:#fff;border:2px solid #fff;border-radius:8px;padding:10px 14px;font:bold 13px Trebuchet MS,sans-serif;letter-spacing:.08em;box-shadow:0 0 18px #ff2e88';d.onclick=()=>location.reload();document.body.appendChild(d);}
function verCheck(){if(!/^https?:/.test(location.protocol))return;fetch('version.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).then(j=>{if(!j||verNum(j.v)<=verNum(VERSION))return;window.NGS_NEWER=j.v;
  const k='ngs_rl_'+j.v;let done=false;try{done=sessionStorage.getItem(k);sessionStorage.setItem(k,1);}catch(_){}
  if(!done&&(G.state==='title'||G.state==='photo')){const u=new URL(location.href);u.searchParams.set('u',j.v);location.replace(u.href);}else verToast();}).catch(()=>{});}
boot();

})();
