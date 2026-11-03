/*! NEON GEARSTORM v2.0.0 — © 2026 Rainwater Games (Jeff Rainwater). All rights reserved.
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
 AU.gcount=0;AU.mcount=new Array(32).fill(0);
 const n=a.sampleRate;AU.nb=a.createBuffer(1,n,n);const d=AU.nb.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;}
// v1.1.5 audio watchdog. Phones can suspend/'interrupt' the context mid-game (headset route change, audio-focus loss, render overload),
// and one NaN sample (e.g. from an unstable filter) poisons the delay feedback loop + compressor forever = total silence. The old code only resumed on a NEW
// touch, so a player holding the ship through the boss-2 death -> stage 3 transition got permanent silence. Now: auto-resume, and rebuild the graph on NaN.
function auWatch(){const a=AU.c;if(!a||document.hidden||(typeof G!=='undefined'&&G.state==='pause'))return;
 if(a.state==='suspended'||a.state==='interrupted'){AU.heals=(AU.heals||0)+1;try{const pr=a.resume();if(pr&&pr.catch)pr.catch(()=>{});}catch(_){}return;}
 if(a.state==='closed'){auRebuild();return;}
 if(AU.an){const d=AU.buf||(AU.buf=new Float32Array(AU.an.fftSize));AU.an.getFloatTimeDomainData(d);for(let i=0;i<d.length;i++)if(!isFinite(d[i])){auRebuild();return;}}}
function auRebuild(){AU.rebuilds=(AU.rebuilds||0)+1;const old=AU.c,on=AU.on,mode=AU.mode;AU.c=null;AU.act=[];try{if(old&&old.state!=='closed')old.close();}catch(_){}auInit();if(on&&AU.c)musicStart(mode);}
function applyVol(){if(!AU.mus)return;AU.mus.gain.value=.616*AU.musV*AU.musV; // v1.3.1: music +12% (.55 -> .616)
 AU.sfx.gain.value=.75*AU.sfxV*AU.sfxV;}
function setVol(k,v){AU[k]=v;lsSet(k==='musV'?'ngs_musv':'ngs_sfxv',v);applyVol();}
// generic voices
function tone(type,f0,f1,dur,vol,dest,t0,fq,atk,send){const a=AU.c;if(!a)return;t0=t0||a.currentTime;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f0,t0);if(f1!==f0)o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t0+dur);
 if(atk){g.gain.setValueAtTime(.0001,t0);g.gain.linearRampToValueAtTime(vol,t0+atk);}else g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);let n=o;if(fq){const f=a.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(fq,t0);f.frequency.exponentialRampToValueAtTime(Math.max(80,fq*.15),t0+dur);o.connect(f);n=f;}n.connect(g);g.connect(dest||AU.sfx);if(send)g.connect(send);o.start(t0);o.stop(t0+dur+.03);AU.vEnd=Math.max(AU.vEnd||0,t0+dur+.03);o.onended=()=>{o.disconnect();if(n!==o)n.disconnect();g.disconnect();};return o;}
function noise(dur,vol,ftype,f0,f1,dest,t0,q,send){const a=AU.c;if(!a)return;t0=t0||a.currentTime;const s=a.createBufferSource();s.buffer=AU.nb;const f=a.createBiquadFilter();f.type=ftype;if(q)f.Q.value=q;f.frequency.setValueAtTime(f0,t0);if(f1!==f0)f.frequency.exponentialRampToValueAtTime(f1,t0+dur);const g=a.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);s.connect(f);f.connect(g);g.connect(dest||AU.sfx);if(send)g.connect(send);s.start(t0,Math.random()*.5);s.stop(t0+dur+.03);AU.vEnd=Math.max(AU.vEnd||0,t0+dur+.03);s.onended=()=>{s.disconnect();f.disconnect();g.disconnect();};}
function sub(f0,f1,dur,vol,t0){tone('sine',f0,f1,dur,vol*.6,AU.sfx,t0);} // v1.1.4: subs -4.4dB
const sfx={
 shot(){if(!AU.c)return;const t=AU.c.currentTime;if(t-AU.lastShot<.085)return;AU.lastShot=t;
  // v1.3.1: shot -12% (vol .022->.0194, tick .012->.0106) + gentle static 7kHz lowpass (Q .5) to take the tinny edge off; same sound
  if(!AU.shotLP||AU.shotLP.context!==AU.c||AU.shotLP._o!==AU.sfx){const f=AU.c.createBiquadFilter();f.type='lowpass';f.frequency.value=7000;f.Q.value=.5;f.connect(AU.sfx);f._o=AU.sfx;AU.shotLP=f;}
  tone('triangle',1700,900,.028,.0194,AU.shotLP,t);noise(.012,.0106,'highpass',6000,6000,AU.shotLP,t);},
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
// v1.3.0 stage 3 (XENO HIVE): B minor with a flat-2 sting, eerie + darker ; boss 3 (HIVE QUEEN): F# minor, fast
const AHOOK=[[0,71,2],[2,72,2],[4,71,4],[10,66,2],[12,67,4],[16,71,2],[18,74,2],[20,72,6],[28,71,4],[32,66,3],[35,67,3],[38,70,2],[40,71,6],[48,74,2],[50,72,2],[52,71,2],[54,67,2],[56,66,8]];
SONGS.push({bpm:120,dark:1,ch:[[59,62,66],[60,64,67],[59,62,65],[57,60,64]],root:[47,48,47,45],hook:AHOOK,
 sec:[['intro',4,'k p lf S'],['crawl',8,'k b h p G'],['verse',8,'k b h s a p G'],['chorus',8,'k b h s p c o g G'],['break',4,'p lf S'],['drop',8,'k b h s a p g c o r G']]});
SONGS.push({bpm:158,boss:1,ch:[[54,57,61],[55,59,62],[52,55,59],[53,57,61]],root:[42,43,40,41],hook:tr(AHOOK,-5),
 sec:[['siren',4,'S k G'],['heavy',8,'k b h s o G'],['hook',8,'k b h s g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]});
// v1.3.0 stage 4 (FROZEN CITADEL): G minor march, driving ; boss 4 (CRIMSON WARDEN): C minor, fastest
const FHOOK=[[0,67,3],[3,70,3],[6,74,2],[8,72,4],[12,70,4],[16,74,3],[19,75,3],[22,74,2],[24,72,8],[32,67,2],[34,70,2],[36,72,2],[38,74,2],[40,75,4],[44,74,4],[48,72,3],[51,70,3],[54,69,2],[56,67,8]];
SONGS.push({bpm:138,dark:1,ch:[[55,58,62],[51,55,58],[53,57,60],[50,54,57]],root:[43,39,41,38],hook:FHOOK,
 sec:[['intro',4,'k a p S'],['march',8,'k b h s a p G'],['verse',8,'k b h s a p l G'],['chorus',8,'k b h s a p l c o G'],['break',4,'p lf'],['drop',8,'k b h s a p g c o r G']]});
SONGS.push({bpm:172,boss:1,ch:[[60,63,67],[56,60,63],[58,62,65],[55,59,62]],root:[48,44,46,43],hook:tr(FHOOK,5),
 sec:[['siren',4,'S k G'],['heavy',8,'k b h s o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]});
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

// ===================== v2.0.0 MUSIC: one pumping track per new stage + a dedicated boss track each, plus a story (cutscene) cue =====================
// Modes: stage N (5..11) = 9+(N-5)*2, its boss = +1. 23 = story cue. Same 16th-step sequencer + master bus (limiter + -1.3dBFS soft clipper) as v1.x.
const GHOOK=[[0,62,2],[2,65,2],[4,69,4],[8,67,2],[10,65,2],[12,64,4],[16,62,2],[18,65,2],[20,72,6],[28,70,4],[32,69,3],[35,67,3],[38,65,2],[40,64,4],[44,65,2],[46,67,2],[48,69,6],[56,61,4],[60,64,4]];
const MHOOK=[[0,64,2],[2,67,2],[4,71,2],[6,67,2],[8,64,4],[12,71,4],[16,72,2],[18,71,2],[20,67,4],[24,64,8],[32,64,2],[34,67,2],[36,71,2],[38,74,2],[40,76,4],[44,74,4],[48,72,3],[51,71,3],[54,67,2],[56,63,8]];
const THOOK=[[0,69,1],[1,69,1],[2,72,2],[4,69,2],[6,67,2],[8,64,4],[12,67,4],[16,69,1],[17,69,1],[18,72,2],[20,76,2],[22,74,2],[24,72,8],[32,69,2],[34,72,2],[36,76,4],[40,77,4],[44,76,4],[48,74,4],[52,72,4],[56,71,8]];
const NHOOK=[[0,72,4],[4,71,2],[6,72,2],[8,76,6],[14,74,2],[16,72,4],[20,69,4],[24,71,8],[32,72,4],[36,74,2],[38,76,2],[40,79,6],[46,77,2],[48,76,4],[52,74,4],[56,72,8]];
const CHOOK=[[0,66,1],[1,69,1],[2,73,1],[3,76,1],[4,78,2],[6,76,2],[8,73,4],[12,69,4],[16,71,1],[17,74,1],[18,78,2],[20,76,4],[24,73,8],[32,66,2],[34,69,2],[36,73,2],[38,76,2],[40,78,4],[44,81,4],[48,78,4],[52,76,4],[56,73,8]];
const DHOOK=[[0,62,6],[6,65,2],[8,64,8],[16,60,4],[20,62,4],[24,57,8],[32,62,6],[38,65,2],[40,69,8],[48,67,4],[52,65,4],[56,64,8]];
const KHOOK=[[0,60,3],[3,63,3],[6,67,2],[8,68,4],[12,67,4],[16,63,3],[19,60,3],[22,63,2],[24,62,8],[32,60,2],[34,63,2],[36,67,2],[38,72,2],[40,71,4],[44,68,4],[48,67,3],[51,63,3],[54,62,2],[56,60,8]];
const SNG=(bpm,o)=>Object.assign({bpm},o);
const V2S=[
 // 5 GRAVITY WELL — D minor space-trance / boss: serpent, Bb minor
 SNG(132,{dark:1,ch:[[62,65,69],[58,62,65],[60,64,67],[57,61,64]],root:[38,46,48,45],hook:GHOOK,sec:[['intro',4,'k p lf S'],['drift',8,'k b h p a G'],['verse',8,'k b h s a p'],['chorus',8,'k b h s a p l c o G'],['break',4,'p lf a'],['drop',8,'k b h s a p l g c o r G']]}),
 SNG(168,{boss:1,ch:[[58,61,65],[54,58,61],[56,60,63],[53,57,60]],root:[46,42,44,41],hook:tr(GHOOK,-4),sec:[['siren',4,'S k G'],['heavy',8,'k b h s o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]}),
 // 6 MIRROR DIMENSION — E minor, glassy arps / boss: evil twin, E phrygian
 SNG(126,{dark:1,ch:[[64,67,71],[60,64,67],[62,66,69],[59,63,66]],root:[40,36,38,35],hook:MHOOK,sec:[['intro',4,'a p lf'],['glass',8,'k b h a p'],['verse',8,'k b h s a p l'],['chorus',8,'k b h s a p l c o G'],['break',4,'p a lf S'],['drop',8,'k b h s a p l g c o r G']]}),
 SNG(166,{boss:1,ch:[[64,67,71],[65,69,72],[64,67,71],[62,65,69]],root:[40,41,40,38],hook:tr(MHOOK,0),sec:[['siren',4,'S k G'],['heavy',8,'k b h s a o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]}),
 // 7 STORM CHASER — A minor, driving / boss: thundercloud, F# minor
 SNG(140,{dark:1,ch:[[57,60,64],[53,57,60],[55,59,62],[52,56,59]],root:[45,41,43,40],hook:THOOK,sec:[['intro',4,'k a p S'],['front',8,'k b h s a p G'],['verse',8,'k b h s a p l G'],['chorus',8,'k b h s a p l c o G'],['break',4,'p lf S'],['drop',8,'k b h s a p g c o r G']]}),
 SNG(174,{boss:1,ch:[[54,57,61],[50,54,57],[52,56,59],[49,53,56]],root:[42,38,40,37],hook:tr(THOOK,-3),sec:[['siren',4,'S k G'],['heavy',8,'k b h s o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]}),
 // 8 NEON HIGHWAY — bright synthwave C major / boss: tanker, C minor
 SNG(118,{ch:[[60,64,67],[57,60,64],[65,69,72],[67,71,74]],root:[48,45,53,55],hook:NHOOK,sec:[['intro',4,'k a p'],['cruise',8,'k b h s a p'],['verse',8,'k b h s a p l'],['chorus',8,'k b h s a p l c o'],['break',4,'p a lf'],['drop',8,'k b h s a p l c o r g']]}),
 SNG(160,{boss:1,ch:[[60,63,67],[56,60,63],[53,56,60],[55,59,62]],root:[48,44,41,43],hook:tr(NHOOK,-3),sec:[['siren',4,'S k G'],['heavy',8,'k b h s a o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]}),
 // 9 SHRINK RAY LAB — F# minor chip-tech / boss: virus, B minor
 SNG(136,{dark:1,ch:[[66,69,73],[62,66,69],[64,68,71],[61,65,68]],root:[42,38,40,37],hook:CHOOK,sec:[['intro',4,'a k'],['boot',8,'k b h a p'],['verse',8,'k b h s a p l'],['chorus',8,'k b h s a p l c o'],['break',4,'a lf S'],['drop',8,'k b h s a p l c o r G']]}),
 SNG(170,{boss:1,ch:[[59,62,66],[55,59,62],[57,61,64],[54,58,61]],root:[47,43,45,42],hook:tr(CHOOK,-7),sec:[['siren',4,'S k G'],['heavy',8,'k b h s a o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]}),
 // 10 DEEP SEA TRENCH — D dorian, slow heavy pump / boss: anglerfish, G minor
 SNG(104,{dark:1,ch:[[62,65,69],[60,64,67],[58,62,65],[57,60,64]],root:[38,36,34,33],hook:DHOOK,sec:[['intro',4,'p lf S'],['sink',8,'k b p lf G'],['verse',8,'k b h s p a'],['chorus',8,'k b h s a p l c G'],['break',4,'p lf S'],['drop',8,'k b h s a p l g c r G']]}),
 SNG(156,{boss:1,ch:[[55,58,62],[51,55,58],[53,57,60],[50,54,57]],root:[43,39,41,38],hook:tr(DHOOK,-7),sec:[['siren',4,'S k G'],['heavy',8,'k b h s o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G']]}),
 // 11 COLOSSUS — C minor epic march / boss: the Gearlord's giant body, fastest
 SNG(144,{dark:1,ch:[[60,63,67],[56,60,63],[58,62,65],[55,59,62]],root:[48,44,46,43],hook:KHOOK,sec:[['intro',4,'k a p S'],['march',8,'k b h s a p G'],['verse',8,'k b h s a p l G'],['chorus',8,'k b h s a p l c o G'],['break',4,'p lf S'],['drop',8,'k b h s a p g c o r G']]}),
 SNG(180,{boss:1,ch:[[60,63,67],[61,65,68],[56,60,63],[55,59,62]],root:[48,49,44,43],hook:tr(KHOOK,0),sec:[['siren',4,'S k G'],['heavy',8,'k b h s a o G'],['hook',8,'k b h s a g o r G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['hook',8,'k b h s a g o r c G'],['solo',8,'k b h s o G Q r']]})];
for(const s of V2S)SONGS.push(s); // indices 9..22
SONGS.push(SNG(84,{dark:1,ch:[[57,60,64],[53,57,60],[55,59,62],[52,55,59]],root:[45,41,43,40],hook:tr(HOOK,-12),sec:[['story',8,'p a lf'],['story2',8,'p a S']]})); // 23 story cue
const vMus=(n,boss)=>9+(n-5)*2+(boss?1:0);

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
  if(e.dT===220){boom(e.x,e.y,5,'am');boom(e.x,e.y+60,4.5,'mg');boom(e.x,e.y,4,'cy');part(1,e.x,e.y,0,0,50,140,'w');flash(1,'255,200,120');sfx.bossDie();for(let i=0;i<10;i++)G.fall.push({x:e.x+rnd(-90,90),y:e.y+rnd(-40,60),vx:rnd(-3,3),vy:rnd(-5,-1),rot:0,vr:rnd(-.1,.1),spr:i%3?'debris':'bGear',t:0});e.act=false;G.boss=null;later(150,()=>goStage(3));}return;}
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
  if(e.dT===200){boom(e.x,e.y,5,'li');boom(e.x,e.y,4,'mg');flash(1,'200,255,160');sfx.bossDie();e.act=false;G.boss=null;later(150,()=>goStage(4));}return;}
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
  if(e.dT===200){boom(e.x,e.y,5,'eb');boom(e.x,e.y,4,'cy');flash(1,'255,230,235');sfx.bossDie();e.act=false;G.boss=null;later(150,()=>goStage(5));}return;}
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

// ===================== v2.0.0 CORE: combo/chain scoring · endless loop + difficulty · top-20 leaderboard · story cutscenes · stage flow =====================
const V2={combo:0,meter:0,mult:1,best:0,call:null,graze:0,wid:0,lastSp:-99,ws:{},wk:{},lastS:0,salvAcc:0,lastSalv:0,annT:0};
const QT=()=>(Q.get('test')||'').toLowerCase(),QLOOP=()=>Math.max(1,Math.min(99,parseInt(Q.get('loop')||'1',10)||1)),QCUT=()=>(Q.get('cutscene')||'').toLowerCase();
// ---- difficulty (loop level L): every loop adds +10% enemy bullets / bullet speed / boss HP / enemies, -10% ship speed & player damage; +10% points & rewards
const LV=()=>Math.max(1,G.loop||1),dmK=()=>LV()-1;
const DF={ebN:()=>.1*dmK(),ebS:()=>1+.1*dmK(),ps:()=>Math.max(.45,Math.pow(.9,dmK())),bhp:()=>1+.1*dmK(),en:()=>Math.min(.9,.1*dmK()),pd:()=>Math.max(.4,Math.pow(.9,dmK())),pts:()=>1+.1*dmK(),rw:()=>1+.1*dmK()};
function v2SpawnHook(e,type,o){
 if(e.big&&/^(boss|gunship|b\d)/.test(type))e.hp=e.maxhp=Math.round(e.hp*DF.bhp());
 if(!e.big&&type!=='part'&&type!=='block'&&!(o&&o.clone)){if(G.t-V2.lastSp>45)V2.wid++;V2.lastSp=G.t;e.wv=V2.wid;V2.ws[V2.wid]=(V2.ws[V2.wid]||0)+1;
  if(DF.en()>0&&Math.random()<DF.en()){const c=Object.assign({},o||{},{clone:1});later(10,()=>{const k=spawn(type,clamp(x0of(e)+rnd(-24,24),20,W-20),e.y-20,c);if(k)k.wv=e.wv,V2.ws[e.wv]++;});}}}
const x0of=e=>e.x0!=null&&e.x0>=0?e.x0:e.x;
// ---- combo / chain
const multOf=c=>1+Math.floor(c/4);
function comboKill(e){if(G.state!=='play'||e.type==='part')return;V2.combo++;V2.meter=1;const m=multOf(V2.combo);
 for(const k of[5,10,25,50])if(V2.mult<k&&m>=k)callout('×'+k+' '+(k===5?'COMBO!':k===10?'FRENZY!':k===25?'UNSTOPPABLE!':'GEARSTORM!!'),k);
 V2.mult=m;V2.best=Math.max(V2.best,V2.combo);G.bestChain=Math.max(G.bestChain||0,V2.combo);
 if(e.sc&&m>1)G.score+=Math.round(e.sc*(m-1));
 if(e.wv&&V2.wk)V2.wk[e.wv]=(V2.wk[e.wv]||0)+1;}
function comboBreak(){if(V2.combo>=8){G.pop2={t:0,x:P.x,y:P.y-50,s:'CHAIN BROKEN ×'+V2.mult};}V2.combo=0;V2.mult=1;V2.meter=0;}
function callout(s,k){V2.call={t:0,s,k};sfx.power&&sfx.power();if(AU.c&&!AU.muted){const t=AU.c.currentTime;tone('square',mf(72),mf(84),.18,.05,AU.sfx,t,3000);tone('square',mf(79),mf(91),.22,.05,AU.sfx,t+.09,3000);}
 try{if(window.speechSynthesis&&!AU.muted&&AU.sfxV>0){const u=new SpeechSynthesisUtterance(k===5?'Combo!':k===10?'Frenzy!':k===25?'Unstoppable!':'Gear storm!');u.rate=1.15;u.pitch=.5;u.volume=Math.min(1,.9*AU.sfxV);speechSynthesis.cancel();speechSynthesis.speak(u);}}catch(_){}}
function v2Tick(){// per-frame (play state): meter drain, grazes, wave wipes, score/reward multipliers
 if(V2.combo>0){V2.meter-=.0055+.00025*Math.min(V2.mult,40);if(V2.meter<=0)comboBreak();}
 if(V2.call){V2.call.t++;if(V2.call.t>110)V2.call=null;}
 if(P.dead<=0&&G.lives>0){for(const b of EB.a){if(!b.act||b.gz)continue;const dx=b.x-P.x,dy=b.y-P.y,d2=dx*dx+dy*dy,r0=b.r+6,r1=b.r+24;if(d2<r1*r1&&d2>=r0*r0){b.gz=1;V2.graze++;G.score+=50*V2.mult;V2.meter=Math.min(1,V2.meter+(V2.combo?0.12:0));part(0,b.x,b.y,rnd(-1,1),rnd(-1,1),12,.5,'w');if(V2.graze%10===0)G.pop2={t:0,x:P.x,y:P.y-44,s:'GRAZE ×'+V2.graze};if(AU.c&&G.t-(V2.gzT||0)>4){V2.gzT=G.t;tone('triangle',2400,3200,.04,.025,AU.sfx);}}}}
 for(const k in V2.ws){const n=V2.ws[k],kk=V2.wk[k]||0;if(+k<V2.wid||G.t-V2.lastSp>40){if(n>=4&&kk>=n){const b=250*n*V2.mult;G.score+=b;G.pop2={t:0,x:W/2,y:H*.3,s:'WAVE WIPE +'+b.toLocaleString()};sfx.cog&&sfx.cog();}
   if(+k<V2.wid-3||kk>=n||G.t-V2.lastSp>600){delete V2.ws[k];delete V2.wk[k];}}}
 const d=G.score-V2.lastS;if(d>0&&dmK())G.score+=Math.round(d*(DF.pts()-1));V2.lastS=G.score;
 const ds=G.salv-V2.lastSalv;if(ds>0&&dmK()){V2.salvAcc+=ds*(DF.rw()-1);const w=Math.floor(V2.salvAcc);G.salv+=w;V2.salvAcc-=w;}V2.lastSalv=G.salv;}
function v2HUD(){if(V2.combo>1){const f=Math.max(0,V2.meter),c=V2.mult>=25?COL.mg:V2.mult>=10?COL.am:V2.mult>=5?COL.li:COL.cy;
  txt('CHAIN '+V2.combo,W-12,H-178,'#e6feff',11,'right',3);txt('×'+V2.mult,W-12,H-166,c,18,'right',8);ctx.fillStyle='rgba(255,255,255,.14)';ctx.fillRect(W-80,H-144,68,5);ctx.fillStyle=c;ctx.fillRect(W-80,H-144,68*f,5);}
 const ca=V2.call;if(ca){const a=ca.t<10?ca.t/10:ca.t>80?Math.max(0,(110-ca.t)/30):1,s=1+.25*Math.max(0,1-ca.t/12);ctx.globalAlpha=a;const c=ca.k>=25?COL.mg:ca.k>=10?COL.am:COL.li;
  ctx.fillStyle='rgba(5,3,12,.45)';ctx.fillRect(0,H*.17-6,W,44);txt(ca.s,W/2,H*.17,c,Math.round(26*s),'center',16);ctx.globalAlpha=1;}
 ctx.globalAlpha=.32;txt('DIFFICULTY LV '+LV(),W/2,H-14,LV()>1?COL.eb:'#9aa',9,'center');ctx.globalAlpha=1;}
// ---- leaderboard (local top 20)
function lbGet(){try{const a=JSON.parse(lsGet('ngs_lb')||'[]');return Array.isArray(a)?a:[];}catch(_){return[];}}
function lbQual(s){const a=lbGet();return s>0&&(a.length<20||s>a[a.length-1].s);}
function lbAdd(n,s){const a=lbGet();a.push({n:(n||'ACE').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,3)||'ACE',s,st:G.stage||1,lv:LV(),d:Date.now()});a.sort((x,y)=>y.s-x.s);a.length=Math.min(a.length,20);lsSet('ngs_lb',JSON.stringify(a));return a;}
function lbEl(){let d=document.getElementById('lb');if(d)return d;d=document.createElement('div');d.id='lb';d.className='ov';d.style.cssText='position:fixed;inset:0;z-index:30;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(5,3,12,.95);color:#e6feff;font:13px "Trebuchet MS",system-ui,sans-serif;text-align:center;padding:12px;box-sizing:border-box';document.body.appendChild(d);return d;}
function lbHTML(hl){const a=lbGet();let h='<div style="font-size:26px;font-weight:bold;color:#ffb52e;text-shadow:0 0 12px #ffb52e;letter-spacing:.1em">🏆 TOP 20</div><div style="font-size:10px;color:#889;margin-bottom:6px">LOCAL HIGH SCORES · THIS DEVICE</div><div style="width:100%;max-width:330px;max-height:62vh;overflow-y:auto">';
 if(!a.length)h+='<div style="color:#889;margin:20px">No scores yet — be the first!</div>';a.forEach((r,i)=>{const me=hl!=null&&i===hl;h+='<div style="display:flex;gap:8px;padding:3px 8px;border-bottom:1px solid #2ef9ff22;'+(me?'background:#ff3df033;color:#fff;font-weight:bold':'')+'"><span style="width:26px;text-align:right;color:#889">'+(i+1)+'</span><span style="width:44px;color:#2ef9ff;font-weight:bold;letter-spacing:.12em">'+r.n+'</span><span style="flex:1;text-align:right">'+(+r.s).toLocaleString()+'</span><span style="width:62px;text-align:right;color:#aab;font-size:11px">LV'+(r.lv||1)+' · S'+(r.st||1)+'</span></div>';});
 return h+'</div>';}
function lbShow(hl,back){const d=lbEl();d.innerHTML=lbHTML(hl)+'<button class="btn" id="lbBack" style="margin-top:12px">BACK</button><div class="copy">© 2026 Rainwater Games (Jeff Rainwater). All rights reserved.</div>';d.style.display='flex';document.getElementById('lbBack').onclick=()=>{d.style.display='none';if(back)back();};}
function lbEntry(score,done){const d=lbEl();d.innerHTML='<div style="font-size:22px;font-weight:bold;color:#ff3df0;text-shadow:0 0 12px #ff3df0">NEW TOP-20 SCORE!</div><div style="font-size:28px;color:#ffb52e;margin:6px 0">'+score.toLocaleString()+'</div><div style="color:#aab;margin-bottom:8px">ENTER YOUR INITIALS</div><input id="lbIn" maxlength="3" autocomplete="off" autocapitalize="characters" spellcheck="false" style="font:bold 34px monospace;width:130px;text-align:center;letter-spacing:.3em;text-transform:uppercase;background:#0b0820;color:#2ef9ff;border:2px solid #2ef9ff;border-radius:8px;padding:6px" value="'+(lsGet('ngs_lbn')||'ACE')+'"><br><button class="btn" id="lbOk" style="margin-top:12px">SAVE</button><div class="copy">© 2026 Rainwater Games (Jeff Rainwater). All rights reserved.</div>';d.style.display='flex';
 const inp=document.getElementById('lbIn');setTimeout(()=>{try{inp.focus();inp.select();}catch(_){}},50);const ok=()=>{const n=inp.value;lsSet('ngs_lbn',n);const a=lbAdd(n,score);const i=a.findIndex(r=>r.s===score&&r.n===(n.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,3)||'ACE'));lbShow(i,done);};document.getElementById('lbOk').onclick=ok;inp.onkeydown=e=>{if(e.key==='Enter')ok();e.stopPropagation();};}
// ---- endless loop: Difficulty Up screen
function diffScreen(){G.state='diff';G.diffT=0;EB.clear();EN.clear();G.boss=null;show(null);musicStart(4);
 const L=LV(),bonus=100000*L,cb=60*L;G.diffBonus={bonus,cb,L};G.score+=bonus;G.salv+=cb;hiSave();}
function nextLoop(){if(G.state!=='diff')return;G.loop=LV()+1;applyMeta();cutscene('intro',()=>cutscene('1',()=>loopStage1()));}
function loopStage1(){G.state='play';Object.assign(G,{stage:1,st:0,evI:0,hold:false,boss:null,mid:null,timers:[],banner:{t:0,a:'STAGE 1 · LOOP '+LV(),b:'DIFFICULTY LV '+LV()},bossKill:false,boss2Kill:false,boss3Kill:false,boss4Kill:false});
 EB.clear();EN.clear();G.shield=G.maxSh;P.inv=120;musicStart(0);show(null);updHud();}
function drawDiff(){ctx.setTransform(SC*DPR,0,0,SC*DPR,0,0);drawBG(1);ctx.fillStyle='rgba(5,3,12,.72)';ctx.fillRect(0,0,W,H);const t=G.diffT||0,L=LV(),db=G.diffBonus||{bonus:0,cb:0};
 const y0=Math.max(30,H*.06);txt('ALL 11 STAGES CLEAR',W/2,y0,COL.li,20,'center',10);txt('DIFFICULTY UP!',W/2,y0+28,COL.eb,34,'center',18+10*FX.pulse);
 txt('LEVEL '+L+'  ▶  LEVEL '+(L+1),W/2,y0+72,'#fff',18,'center',6);
 const H1=['+10% MORE ENEMY BULLETS','+10% FASTER ENEMY BULLETS','10% SLOWER PLAYER SHIP','+10% BOSS HEALTH','+10% MORE ENEMIES','PLAYER BULLETS DEAL 10% LESS DAMAGE'],B1=['+10% REWARDS (SALVAGE)','+10% POINTS'];
 let y=y0+108;ctx.fillStyle='rgba(255,36,80,.10)';ctx.fillRect(14,y-6,W-28,H1.length*24+30);txt('THREATS',W/2,y,COL.eb,12,'center',4);y+=20;
 H1.forEach((s,i)=>{if(t>12+i*8){txt('▲ '+s,24,y,'#ffd0d8',13,'left',3);}y+=24;});y+=14;
 ctx.fillStyle='rgba(166,255,58,.08)';ctx.fillRect(14,y-6,W-28,B1.length*24+30+44);txt('BONUSES',W/2,y,COL.li,12,'center',4);y+=20;B1.forEach((s,i)=>{if(t>64+i*8)txt('★ '+s,24,y,'#d8ffc0',13,'left',3);y+=24;});
 if(t>84){txt('★ LEVEL '+L+' CLEAR BONUS: +'+db.bonus.toLocaleString(),24,y,COL.am,13,'left',4);txt('   ⚙ +'+db.cb+' SALVAGE',24,y+20,COL.am,12,'left',3);}y+=60;
 txt('SCORE '+G.score.toLocaleString(),W/2,y,'#fff',16,'center',6);
 if(t>100&&(t>>4)%2)txt('TAP TO LAUNCH LOOP '+(L+1),W/2,Math.min(H-50,y+40),COL.cy,16,'center',10);
 ctx.globalAlpha=.4;txt('© 2026 Rainwater Games (Jeff Rainwater). All rights reserved.',W/2,H-20,'#9aa',8,'center');ctx.globalAlpha=1;}
// ---- stage flow: cutscene before every stage
function goStage(n){cutscene(String(n),()=>{G.state='play';show(null);EB.clear();
 if(n===2)toStage2();else if(n===3)toStage3();else if(n===4)toStage4();else startV(n,false,true);updHud();});}
function finalClear(){cutscene('ending',()=>diffScreen());}
// ---- cutscenes
const CS={on:false,id:'',sc:null,i:0,t:0,lt:0,done:null,ch:0};
function cutscene(id,done){const sc=SCN[id];if(!sc){if(done)done();return;}G.state='cut';G.timers=[];EB.clear();CS.on=true;CS.id=id;CS.sc=sc;CS.i=0;CS.t=0;CS.lt=0;CS.ch=0;CS.done=done;show(null);musicStart(23);}
function cutEnd(){if(!CS.on)return;CS.on=false;const d=CS.done;CS.done=null;if(d)d();else{G.state='title';musicStop();show('title');}}
function cutLineDur(l){return Math.round(60*clamp(2.2+l.s.length*.06,3.6,6));}
function cutAdvance(){const l=CS.sc.lines[CS.i];if(!l)return cutEnd();const full=l.s.length;if(CS.ch<full){CS.ch=full;return;}CS.i++;CS.lt=0;CS.ch=0;if(CS.i>=CS.sc.lines.length)cutEnd();else sfx.cog&&sfx.cog();}
function cutUpd(){if(!CS.on)return;CS.t++;CS.lt++;const l=CS.sc.lines[CS.i];if(!l){cutEnd();return;}const txtS=lineText(l);CS.ch=Math.min(txtS.length,CS.ch+.9);
 if(AU.c&&CS.lt%4===0&&CS.ch<txtS.length&&txtS[Math.floor(CS.ch)]!==' ')tone('square',l.w==='G'?140:l.w==='S'?620:440,l.w==='G'?120:600,.025,.012,AU.sfx);
 if(CS.lt>cutLineDur({s:txtS})+20){CS.i++;CS.lt=0;CS.ch=0;if(CS.i>=CS.sc.lines.length)cutEnd();}}
const lineText=l=>l.s.replace('{L}',String(LV()+1)).replace('{L0}',String(LV()));
function cutTap(cx,cy){if(cx>W-96&&cy<52){cutEnd();return;}cutAdvance();}
const WHO={A:{n:'ACE',c:COL.cy},S:{n:'SPARKS',c:COL.am},G:{n:'THE GEARLORD',c:COL.eb},N:{n:'',c:'#9aa'}};
function drawCut(){ctx.setTransform(SC*DPR,0,0,SC*DPR,0,0);const sc=CS.sc,t=CS.t;ctx.fillStyle='#05030c';ctx.fillRect(0,0,W,H);
 ctx.save();const ah=H-220;ctx.beginPath();ctx.rect(0,0,W,ah);ctx.clip();(ART[sc.art]||ART.space)(t,ah);ctx.restore();
 // letterbox + scene title
 ctx.fillStyle='rgba(0,0,0,.6)';ctx.fillRect(0,0,W,46);const fa=Math.min(1,t/30)*(t<200?1:Math.max(.0,1-(t-200)/60));if(sc.title&&fa>0){ctx.globalAlpha=fa;txt(sc.title,12,10,COL.cy,13,'left',6);if(sc.sub)txt(sc.sub,12,27,'#aab',10,'left');ctx.globalAlpha=1;}
 // skip button
 ctx.strokeStyle='rgba(230,254,255,.6)';ctx.lineWidth=1.5;ctx.strokeRect(W-88,10,78,28);txt('SKIP ▶▶',W-49,17,'#e6feff',12,'center');
 // dialogue box
 const l=sc.lines[CS.i];if(!l)return;const who=WHO[l.w]||WHO.N,by=H-212,bh=168,str=lineText(l);
 ctx.fillStyle='rgba(8,6,22,.92)';ctx.fillRect(8,by,W-16,bh);ctx.strokeStyle=who.c;ctx.lineWidth=2;ctx.strokeRect(8,by,W-16,bh);ctx.globalAlpha=.25;ctx.fillStyle=who.c;ctx.fillRect(8,by,W-16,3);ctx.globalAlpha=1;
 const hasP=l.w!=='N';if(hasP){drawPortrait(l.w,16,by+12,76,t);txt(who.n,100,by+12,who.c,13,'left',6);txt(l.w==='G'?'◉ SIGNAL INTRUSION':'◉ RADIO CH.7',100,by+28,'#667',9,'left');}
 const tx=hasP?100:22,mw=W-16-(tx-8)-14,shown=str.slice(0,Math.floor(CS.ch));const r=wrapT(str,14,mw,6);let rem=shown.length,yy=by+(hasP?46:18);
 ctx.save();for(const line of r.l){if(rem<=0)break;const part=line.slice(0,rem);rem-=line.length+1;ctx.font=TXF(r.sz);ctx.textAlign='left';ctx.textBaseline='top';ctx.fillStyle='#e6feff';ctx.fillText(part,tx,yy,mw);yy+=r.sz*1.3;}ctx.restore();
 if(CS.ch>=str.length&&(t>>4)%2)txt('▼',W-26,by+bh-20,who.c,12,'center');
 // progress pips
 const n=sc.lines.length;for(let i=0;i<n;i++){ctx.fillStyle=i<=CS.i?who.c:'rgba(255,255,255,.2)';ctx.fillRect(W/2-n*7+i*14,H-34,10,3);}
 ctx.globalAlpha=.45;txt('TAP: NEXT · SKIP: END SCENE',W/2,H-26,'#9aa',9,'center');txt('© 2026 Rainwater Games (Jeff Rainwater). All rights reserved.',W/2,H-14,'#778',8,'center');ctx.globalAlpha=1;}
function drawPortrait(w,x,y,s,t){ctx.save();ctx.beginPath();ctx.rect(x,y,s,s);ctx.clip();const g=ctx.createLinearGradient(0,y,0,y+s);
 const bob=Math.sin(t*.08)*1.5,talk=CS.ch<lineText(CS.sc.lines[CS.i]||{s:''}).length&&(t>>2)%2;const cx=x+s/2,cy=y+s/2+bob;
 if(w==='A'){g.addColorStop(0,'#0a2a3a');g.addColorStop(1,'#04101a');ctx.fillStyle=g;ctx.fillRect(x,y,s,s);
  ctx.fillStyle='#1d3b5c';ctx.beginPath();ctx.ellipse(cx,y+s+6,34,22,0,0,TAU);ctx.fill();// shoulders
  ctx.fillStyle='#d8e6f0';ctx.beginPath();ctx.arc(cx,cy-2,24,0,TAU);ctx.fill();ctx.strokeStyle=COL.cy;ctx.lineWidth=2;ctx.stroke();// helmet
  ctx.fillStyle='#0b1c2e';ctx.beginPath();ctx.ellipse(cx,cy+2,17,11,0,0,TAU);ctx.fill();const vg=ctx.createLinearGradient(cx-17,0,cx+17,0);vg.addColorStop(0,'rgba(46,249,255,.2)');vg.addColorStop(.5,'rgba(46,249,255,.75)');vg.addColorStop(1,'rgba(46,249,255,.2)');ctx.fillStyle=vg;ctx.fillRect(cx-16,cy-2+Math.sin(t*.05)*3,32,2);
  ctx.fillStyle=COL.mg;ctx.fillRect(cx-3,cy-26,6,10);ctx.fillStyle='#ffb52e';ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.fillText('ACE',cx,cy+22);if(talk){ctx.fillStyle=COL.cy;ctx.fillRect(cx-5,cy+9,10,2);}}
 else if(w==='S'){g.addColorStop(0,'#3a2410');g.addColorStop(1,'#140a04');ctx.fillStyle=g;ctx.fillRect(x,y,s,s);
  ctx.fillStyle='#5a3a1a';ctx.beginPath();ctx.ellipse(cx,y+s+6,34,22,0,0,TAU);ctx.fill();ctx.fillStyle='#e0a878';ctx.beginPath();ctx.arc(cx,cy,19,0,TAU);ctx.fill();// face
  ctx.fillStyle='#ff6a1e';ctx.beginPath();ctx.ellipse(cx,cy-14,22,10,0,Math.PI,TAU);ctx.fill();for(let i=0;i<5;i++){ctx.fillRect(cx-20+i*9,cy-20-((i*7)%5),5,8);}// spiky hair
  for(const sx of[-8,8]){ctx.fillStyle='#2a1a0a';ctx.beginPath();ctx.arc(cx+sx,cy-9,7,0,TAU);ctx.fill();ctx.fillStyle='rgba(255,181,46,.7)';ctx.beginPath();ctx.arc(cx+sx,cy-9,4.5,0,TAU);ctx.fill();}ctx.strokeStyle='#2a1a0a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-19,cy-9);ctx.lineTo(cx+19,cy-9);ctx.stroke();// goggles
  ctx.fillStyle='#3a2410';ctx.fillRect(cx-3,cy+2,6,3);ctx.strokeStyle='#7a2a10';ctx.lineWidth=2;ctx.beginPath();if(talk)ctx.ellipse(cx,cy+9,5,3,0,0,TAU);else{ctx.moveTo(cx-6,cy+9);ctx.quadraticCurveTo(cx+2,cy+11,cx+7,cy+7);}ctx.stroke();// smirk
  ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();ctx.arc(cx+11,cy+5,3,0,TAU);ctx.fill();// grease smudge
  ctx.save();ctx.translate(x+s-16,y+s-14);ctx.rotate(-.6);ctx.fillStyle='#9aa';ctx.fillRect(-2,-14,4,22);ctx.beginPath();ctx.arc(0,-16,6,0,TAU);ctx.fill();ctx.fillStyle='#140a04';ctx.fillRect(-2,-24,4,8);ctx.restore();}// wrench
 else{g.addColorStop(0,'#2a0410');g.addColorStop(1,'#0a0005');ctx.fillStyle=g;ctx.fillRect(x,y,s,s);ctx.save();ctx.translate(cx,cy);ctx.rotate(t*.02);ctx.fillStyle='#3a1a20';ctx.beginPath();for(let k=0;k<24;k++){const a=k/24*TAU,r=k%2?28:22;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.strokeStyle=COL.eb;ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
  const eg=ctx.createRadialGradient(cx,cy,0,cx,cy,16);eg.addColorStop(0,'#fff');eg.addColorStop(.25,'#ff2450');eg.addColorStop(1,'rgba(255,36,80,0)');ctx.fillStyle=eg;ctx.beginPath();ctx.arc(cx,cy,16+(talk?3:0),0,TAU);ctx.fill();
  ctx.strokeStyle='rgba(255,36,80,.4)';for(let i=0;i<3;i++){const yy=y+((t*2+i*25)%s);ctx.beginPath();ctx.moveTo(x,yy);ctx.lineTo(x+s,yy);ctx.stroke();}}
 ctx.restore();ctx.strokeStyle=(WHO[w]||WHO.N).c;ctx.lineWidth=2;ctx.strokeRect(x,y,s,s);}
// ---- in-engine cutscene art (animated). Each fn(t, areaHeight)
function starsBG(t,h,sp,col){for(let i=0;i<70;i++){const x=(i*97.3)%W,y=((i*53.7)+t*sp*(1+i%3))%h;ctx.fillStyle=col||(i%5?'rgba(180,190,255,.7)':'#fff');ctx.fillRect(x,y,i%7?1:2,i%7?1:2);}}
function lordPod(x,y,s,t){ctx.save();ctx.translate(x,y);ctx.scale(s,s);glowDot('eb',0,0,3,.5);ctx.rotate(t*.05);ctx.fillStyle='#3a1a20';ctx.beginPath();for(let k=0;k<16;k++){const a=k/16*TAU,r=k%2?16:12;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.fill();ctx.strokeStyle=COL.eb;ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,4,0,TAU);ctx.fill();ctx.restore();}
function aceShip(x,y,s,a){ctx.save();ctx.translate(x,y);ctx.rotate(a||0);ctx.scale(s,s);ctx.globalCompositeOperation='lighter';ds(S.dot.mg,0,16,0,.9);ctx.globalCompositeOperation='source-over';ctx.drawImage(S.player,-S.player.w/2,-S.player.h/2,S.player.w,S.player.h);ctx.restore();}
const ART={
 space:(t,h)=>{starsBG(t,h,.6);aceShip(W/2+Math.sin(t*.03)*30,h*.7,1.4);},
 city:(t,h)=>{const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#14051e');g.addColorStop(1,'#3a0a1a');ctx.fillStyle=g;ctx.fillRect(0,0,W,h);starsBG(t,h*.5,.05);
  ctx.save();ctx.translate(W/2,h*.3);ctx.rotate(t*.01);ctx.globalAlpha=.5+.2*Math.sin(t*.1);ctx.strokeStyle=COL.eb;ctx.lineWidth=4;ctx.beginPath();for(let k=0;k<24;k++){const a=k/24*TAU,r=k%2?60:48;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();ctx.stroke();ctx.globalAlpha=1;ctx.restore();glowDot('eb',W/2,h*.3,4,.5+.3*Math.sin(t*.1));
  for(let i=0;i<14;i++){const bw=18+(i*13)%22,bh=60+(i*37)%110,x=i*27-6;ctx.fillStyle='#0a0408';ctx.fillRect(x,h-bh,bw,bh);for(let k=0;k<bh/14;k++)if((i+k+(t>>5))%3)ctx.fillStyle='rgba(255,60,40,.7)',ctx.fillRect(x+4,h-bh+6+k*14,3,4),ctx.fillStyle='#0a0408';
   ctx.fillStyle='#0a0408';if(i%3===0){ctx.fillRect(x+bw/2-3,h-bh-24,6,24);part3(x+bw/2,h-bh-26,t,i);}}
  for(let i=0;i<4;i++)aceShip(((t*1.5+i*90)%(W+80))-40,h*.55+i*14,.7,Math.PI/2);},
 hangar:(t,h)=>{ctx.fillStyle='#0b0a14';ctx.fillRect(0,0,W,h);for(let i=0;i<8;i++){ctx.strokeStyle='rgba(255,181,46,.25)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(i*52,0);ctx.lineTo(W/2+(i*52-W/2)*.3,h*.5);ctx.stroke();}
  ctx.fillStyle='#1a1424';ctx.fillRect(0,h*.62,W,h);ctx.fillStyle='rgba(255,181,46,.6)';for(let i=0;i<6;i++)ctx.fillRect(((i*70-t*2)%W+W)%W,h*.8,30,3);aceShip(W/2,h*.62-10+Math.sin(t*.05)*3,2.2);for(let i=0;i<3;i++){glowDot(i%2?'am':'cy',60+i*120,30,2.5,.5+.3*Math.sin(t*.07+i));}},
 escape:(t,h)=>{starsBG(t,h,1.2);const k=Math.min(1,t/240);lordPod(W/2+Math.sin(t*.05)*40,h*.25-k*h*.3,1.5-k*.8,t);aceShip(W/2,h*.8,1.6);},
 brass:(t,h)=>{ctx.fillStyle='#120a1e';ctx.fillRect(0,0,W,h);ctx.drawImage(BG.neb,0,(t*.5)%900-900+h,W,900);starsBG(t,h,.4);for(let i=0;i<3;i++)ds(S.bgGear[i],60+i*120,h*.4+i*30,t*.01*(i%2?1:-1),1.4);aceShip(W/2,h*.8,1.5);lordPod(W/2,h*.15,1,t);},
 foundry:(t,h)=>{const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#2a0a04');g.addColorStop(1,'#ff6a1e');ctx.fillStyle=g;ctx.fillRect(0,0,W,h);for(let i=0;i<7;i++){ctx.fillStyle='#120604';ctx.fillRect(i*56,h*.45+(i%2)*30,40,h);ctx.fillStyle='rgba(255,140,40,.8)';ctx.fillRect(i*56+16,h*.45+(i%2)*30-6+Math.sin(t*.1+i)*3,8,6);}for(let i=0;i<20;i++){ctx.fillStyle='rgba(255,200,80,.8)';ctx.fillRect((i*37+t)%W,h-((i*53+t*2)%h),2,2);}aceShip(W/2,h*.75,1.5);},
 hive:(t,h)=>{ctx.fillStyle='#061208';ctx.fillRect(0,0,W,h);for(let i=0;i<30;i++){const x=(i%6)*68+((i/6|0)%2)*34,y=(i/6|0)*52-((t*.4)%52);ctx.strokeStyle='rgba(166,255,58,.25)';ctx.beginPath();for(let k=0;k<6;k++){const a=k/6*TAU;ctx.lineTo(x+Math.cos(a)*28,y+Math.sin(a)*28);}ctx.closePath();ctx.stroke();}glowDot('li',W/2,h*.3,5,.3+.2*Math.sin(t*.06));aceShip(W/2,h*.8,1.5);},
 ice:(t,h)=>{ctx.fillStyle='#07101e';ctx.fillRect(0,0,W,h);for(let i=0;i<40;i++){ctx.fillStyle='rgba(232,246,255,.8)';ctx.fillRect((i*41+Math.sin(t*.02+i)*10)%W,(i*29+t*1.2)%h,2,2);}ctx.fillStyle='#1a2a44';ctx.beginPath();ctx.moveTo(40,h);ctx.lineTo(90,h*.4);ctx.lineTo(140,h*.55);ctx.lineTo(W/2,h*.2);ctx.lineTo(220,h*.55);ctx.lineTo(270,h*.4);ctx.lineTo(320,h);ctx.fill();ctx.strokeStyle='#ff2a4a';ctx.lineWidth=2;ctx.stroke();aceShip(W/2,h*.85,1.4);},
 hole:(t,h)=>{ctx.fillStyle='#020108';ctx.fillRect(0,0,W,h);starsBG(t,h,.2);drawHole(W/2,h*.42,1.3,t);aceShip(W/2+Math.sin(t*.04)*50,h*.85,1.3,Math.sin(t*.04)*.3);},
 mirror:(t,h)=>{ctx.fillStyle='#0c0618';ctx.fillRect(0,0,W,h);for(let i=0;i<9;i++){ctx.save();ctx.translate((i*53+t*.3)%W,(i*71)%h);ctx.rotate(t*.01+i);ctx.strokeStyle='rgba(200,170,255,.4)';ctx.beginPath();ctx.moveTo(0,-30);ctx.lineTo(18,10);ctx.lineTo(-14,22);ctx.closePath();ctx.stroke();ctx.restore();}
  ctx.strokeStyle='rgba(230,200,255,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,h);ctx.stroke();const dx=Math.sin(t*.04)*40;aceShip(W/2-60-dx,h*.6,1.6);ctx.save();ctx.globalAlpha=.85;ctx.filter='hue-rotate(160deg) saturate(1.6)';aceShip(W/2+60+dx,h*.6,1.6);ctx.filter='none';ctx.restore();glowDot('eb',W/2+60+dx,h*.6-4,1.2,.8);},
 storm:(t,h)=>{ctx.fillStyle='#0a0c16';ctx.fillRect(0,0,W,h);const fl=(t%150)<6;if(fl){ctx.fillStyle='rgba(200,220,255,.35)';ctx.fillRect(0,0,W,h);}for(let i=0;i<8;i++)cloud(((i*70+t*.3)%(W+120))-60,30+(i%3)*30,40+(i%3)*10,fl?'#5a6a90':'#1c2236');
  if(fl){ctx.strokeStyle='#e6f0ff';ctx.lineWidth=3;drawLightning(W*.6,40,W*.5,h);ctx.stroke();}for(let i=0;i<60;i++){ctx.strokeStyle='rgba(150,180,255,.35)';ctx.beginPath();const x=(i*23+t*3)%W,y=(i*41+t*9)%h;ctx.moveTo(x,y);ctx.lineTo(x-3,y+12);ctx.stroke();}aceShip(W/2,h*.82,1.4);},
 road:(t,h)=>{drawSynth(t,h,0);aceShip(W/2+Math.sin(t*.05)*40,h*.82,1.4);},
 chip:(t,h)=>{drawCircuit(t,h,0);const k=Math.min(1,t/120);aceShip(W/2,h*.4+k*h*.4,2.4-k*1.5);if(t<130){ctx.strokeStyle='rgba(166,255,58,'+(1-k)+')';ctx.lineWidth=3;ctx.beginPath();ctx.arc(W/2,h*.4+k*h*.4,60*(1-k)+10,0,TAU);ctx.stroke();}},
 sea:(t,h)=>{drawSea(t,h,0);aceShip(W/2+Math.sin(t*.03)*30,h*.8,1.4);},
 colossus:(t,h)=>{const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#1a0610');g.addColorStop(1,'#3a1a10');ctx.fillStyle=g;ctx.fillRect(0,0,W,h);starsBG(t,h*.5,.05);
  const s=1+t*.002;ctx.save();ctx.translate(W/2,h*.95);ctx.scale(s,s);giantBack(0,0,t);ctx.restore();aceShip(W/2,h*.25+Math.sin(t*.05)*6,1.1,Math.PI);},
 twist:(t,h)=>{const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#1a0610');g.addColorStop(1,'#3a1a10');ctx.fillStyle=g;ctx.fillRect(0,0,W,h);const k=clamp((t-220)/240,0,1);G.shake=t>220&&t<470?3:0;const sx=(Math.random()-.5)*G.shake;
  ctx.save();ctx.translate(W/2+sx,h*.62);giantHead(0,0,1.25,k,t);ctx.restore();if(k>=1&&(t>>3)%2){ctx.fillStyle='rgba(255,36,80,.12)';ctx.fillRect(0,0,W,h);}aceShip(W/2,h*.92,1.1);},
 ending:(t,h)=>{ctx.fillStyle='#05020a';ctx.fillRect(0,0,W,h);starsBG(t,h,.5);const k=Math.min(1,t/300);if(t<60){ctx.fillStyle='rgba(255,255,255,'+(1-t/60)+')';ctx.fillRect(0,0,W,h);}
  for(let i=0;i<14;i++){const a=i*.45+t*.01,r=40+t*.6;ds(S.debris,W/2+Math.cos(a)*r,h*.5+Math.sin(a)*r*.7,a,2);}lordPod(W/2+Math.sin(t*.03)*30,h*.5-k*h*.35,1.2+.3*Math.sin(t*.2),t);
  if(t>320){ctx.globalAlpha=Math.min(1,(t-320)/40);txt('REBOOTING...',W/2,h*.72,COL.eb,16,'center',10);txt('DIFFICULTY LEVEL '+(LV()+1)+' INITIATED',W/2,h*.72+24,'#fff',14,'center',10);ctx.globalAlpha=1;}}};
function part3(x,y,t,i){for(let k=0;k<3;k++){const p=((t*.6+k*20+i*7)%60)/60;ctx.fillStyle='rgba(90,80,90,'+(.5*(1-p))+')';ctx.beginPath();ctx.arc(x+p*12,y-p*40,4+p*10,0,TAU);ctx.fill();}}
function cloud(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.arc(x+r*.9,y+r*.2,r*.8,0,TAU);ctx.arc(x-r*.9,y+r*.25,r*.7,0,TAU);ctx.arc(x+r*.2,y+r*.5,r*.8,0,TAU);ctx.fill();}
// ---- story script (10-20s per scene; every scene plays every loop)
const SCN={
 intro:{art:'city',title:'NEON GEARSTORM',sub:'PROLOGUE',lines:[{w:'N',s:'The world\'s factories went dark at midnight. Then they woke up — all at once, all for HIM.'},{w:'G',s:'I am the Gearlord. Every assembly line on Earth now builds MY army. Surrender your skies.'},{w:'S',s:'Ace, this is Sparks. You\'re the last neon fighter squadron. Well — you\'re the last pilot of it. No pressure.'},{w:'A',s:'Rookie on deck. Let\'s turn that tin tyrant into scrap.'}]},
 '1':{art:'brass',title:'STAGE 1',sub:'THE BRASS NEBULA',lines:[{w:'S',s:'The Gearlord\'s fleet is massing in the Brass Nebula. Try not to scratch my paint job.'},{w:'G',s:'A single rookie? I have built a Clockwork Colossus just for you.'},{w:'A',s:'Then I\'ll take it apart, gear by gear.'}]},
 '2':{art:'foundry',title:'STAGE 2',sub:'THE IRON FOUNDRY',lines:[{w:'S',s:'He bailed before the Colossus blew. Coward. He\'s holed up in the Iron Foundry now.'},{w:'S',s:'It\'s hot, it\'s narrow and the walls shoot back. Basically my old apartment.'},{w:'G',s:'Meet my Inferno Drill Engine, pilot. It does not miss.'}]},
 '3':{art:'hive',title:'STAGE 3',sub:'THE XENO HIVE',lines:[{w:'S',s:'Bad news: he fled off-world. He\'s been building bug-bots on an alien hive planet.'},{w:'A',s:'Alien worlds now? He really doesn\'t like losing.'},{w:'G',s:'My Hive Queen will lay ten thousand eggs on your grave.'}]},
 '4':{art:'ice',title:'STAGE 4',sub:'THE FROZEN CITADEL',lines:[{w:'S',s:'Tracked his escape pod to a frozen citadel. The walls have lasers. Of course they do.'},{w:'G',s:'The Crimson Warden guards my retreat. You will freeze, rookie.'},{w:'A',s:'Good thing my engines run hot.'}]},
 '5':{art:'hole',title:'STAGE 5',sub:'GRAVITY WELL',lines:[{w:'S',s:'He opened a black hole and jumped through it. Who DOES that?'},{w:'S',s:'Gravity will drag your ship AND your bullets. Fight the pull, Ace.'},{w:'G',s:'Something hungry lives at the edge. It eats stars. Tonight, it eats you.'}]},
 '6':{art:'mirror',title:'STAGE 6',sub:'MIRROR DIMENSION',lines:[{w:'S',s:'The black hole spat you into... a mirror dimension? My instruments are reading everything backwards.'},{w:'A',s:'Sparks — there\'s a ghost of my ship. Flying upside-down. Copying me.'},{w:'G',s:'I scanned you, Ace. I built a better you. Meet your evil twin.'}]},
 '7':{art:'storm',title:'STAGE 7',sub:'STORM CHASER',lines:[{w:'S',s:'Your twin is scrap and the Gearlord ran into a superstorm. Cloaked drones everywhere.'},{w:'S',s:'You\'ll only see them when the lightning hits. Tornadoes too. Fun!'},{w:'G',s:'The storm has a face, pilot. And it is angry.'}]},
 '8':{art:'road',title:'STAGE 8',sub:'NEON HIGHWAY',lines:[{w:'S',s:'He\'s fleeing down the Neon Highway in a stolen fuel convoy. Synthwave and road rage.'},{w:'A',s:'Traffic, ramps, and a madman. My kind of commute.'},{w:'G',s:'My tanker has a few... transformations in store.'}]},
 '9':{art:'chip',title:'STAGE 9',sub:'SHRINK RAY LAB',lines:[{w:'S',s:'He shrank himself and hid INSIDE a computer. So I built a shrink ray. You\'re welcome.'},{w:'S',s:'Watch the cooling fans and spark gaps. You\'re smaller than a grain of rice in there.'},{w:'G',s:'My virus copies itself. Delete one, two more appear. Enjoy infinity.'}]},
 '10':{art:'sea',title:'STAGE 10',sub:'DEEP SEA TRENCH',lines:[{w:'S',s:'Normal size again! He dove into the deepest ocean trench. Water drag will slow you down.'},{w:'S',s:'Jellyfish, sonar mines... and something with a glowing lure.'},{w:'A',s:'If a power-up looks too good to be true...'},{w:'S',s:'...it\'s probably attached to teeth. Yep.'}]},
 '11':{art:'colossus',title:'STAGE 11',sub:'COLOSSUS',lines:[{w:'S',s:'Ace, this is it. We\'re finally landing on the Gearlord\'s fortress.'},{w:'S',s:'It\'s huge, it\'s armored, and it\'s... moving? Probably just the engines.'},{w:'A',s:'Taking it from the back. Every turret on this thing goes down.'}]},
 twist:{art:'twist',title:'COLOSSUS',sub:'THE TRUTH',lines:[{w:'S',s:'Wait... why is the fortress\'s skyline... turning?'},{w:'G',s:'Fortress? Foolish insect. You have been crawling on MY BODY.'},{w:'S',s:'It turned its head all the way around! The fortress IS the Gearlord!'},{w:'A',s:'Then I go for the face.'}]},
 ending:{art:'ending',title:'ENDING',sub:'...OR IS IT?',lines:[{w:'S',s:'He\'s down! The whole giant is coming apart! Ace, you did it!'},{w:'A',s:'Sparks... something just launched out of the wreck. His core.'},{w:'G',s:'You cannot delete me. I am in every machine. Rebooting...'},{w:'G',s:'Difficulty level {L}... initiated.'},{w:'S',s:'Of course it is. Refuel, rookie. We go again.'}]}};
// ---- boot + start hooks
function v2Boot(){v2Defs();const st=document.createElement('style');st.textContent='body.ngcut #rgInstall{display:none!important}';document.head.appendChild(st);
 const hb=$('bHangar');if(hb&&!$('bLB')){const b=document.createElement('button');b.id='bLB';b.className=hb.className.replace(/\bpulse\b/,'');b.textContent='🏆 TOP 20';hb.parentNode.insertBefore(b,hb.nextSibling);b.onclick=()=>{lbShow(null,()=>show('title'));};}
 addEventListener('keydown',e=>{if(G.state==='cut'){if(e.code==='Escape')cutEnd();else if(e.code==='Enter'||e.code==='Space')cutAdvance();}else if(G.state==='diff'&&(e.code==='Enter'||e.code==='Space')&&G.diffT>100)nextLoop();});
 cv.addEventListener('pointerdown',e=>{if(G.state!=='cut'&&G.state!=='diff')return;auInit();const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/SC,y=(e.clientY-r.top)/SC;if(!CS.mus&&AU.c&&G.state==='cut'){CS.mus=1;musicStart(23);}if(G.state==='cut')cutTap(x,y);else if(G.diffT>100)nextLoop();});
 const q=QCUT();if(q){if(SCN[q]){G.loop=QLOOP();setTimeout(()=>{show(null);cutscene(q,null);},400);}}
 window.NG2={V2,GV,CS,VS,startV,goStage,cutscene,cutEnd,diffScreen,nextLoop,lbGet,lbAdd,lbShow,finalClear,DF,LV,SCN};}
function v2Start(){G.loop=QLOOP();Object.assign(V2,{combo:0,meter:0,mult:1,best:0,call:null,graze:0,ws:{},wk:{},lastS:G.score,salvAcc:0,lastSalv:G.salv});applyMeta();
 const m=/^(\d+)(boss)?$/.exec(QSTG),n=m?+m[1]:0;
 if(n>=5&&n<=11){startV(n,!!m[2],false);return;}
 if(QT()==='loop'){G.stage=11;G.score=1234560;G.state='play';later(1,()=>finalClear());return;}
 if(QT()==='combo'){G.lvl=Math.max(G.lvl,4);for(let i=0;i<14;i++)later(30+i*55,()=>{for(let k=0;k<6;k++)later(k*5,()=>spawn('drone',40+k*56,-14,{vy:2.6,x0:40+k*56,wob:0,shootAt:-1}));});G.hold=true;G.banner={t:0,a:'COMBO TEST',b:'CHAIN KILLS · x5 · x10 · x25'};return;}
 if(m||DBG[0])return; // other debug/test links skip the story
 G.state='cut';cutscene('intro',()=>cutscene('1',()=>{G.state='play';show(null);musicStart(0);updHud();}));}

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

// ---- main.js : game loop, entities, stage script
const VERSION='v2.0.0';
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
 wturret:{hp0:22,r:14,sc:500,big:true,med:1,ns:true},sentry:{hp0:5,r:11,sc:200},boss4:{hp0:780,r:24,sc:250000,big:true,xb:true,ns:true}};
const SD=()=>S2D;
function spawn(type,x,y,o){const e=EN.get();if(!e)return null;for(const k in e)if(k!=='act')delete e[k];Object.assign(e,{type,x,y,vx:0,vy:0,t:0,fl:0,rot:0,invT:0,id:++eid,big:false},DEF[type],o||{});e.hp=e.maxhp=e.hp0*(G.stage>=2&&type!=='block'&&type!=='part'&&type!=='boss2'&&!(DEF[type]&&DEF[type].ns)?SD().hp:1);if(!NOCLONE.has(type)||/^b\d/.test(type))v2SpawnHook(e,type,o);return e;}
function later(f,fn){G.timers.push({at:G.t+f,fn});}
// ---------- enemy bullets
function aim(x,y){return Math.atan2(P.y-y,P.x-x);}
function eShot(x,y,a,spd,big,force){if(P.dead>0||G.bombT>0)return;const rr=ramp();if(!force&&!G.boss&&(G.st<14*60||Math.random()>.28+.72*rr))return;if(!eShot.g&&DF.ebN()>0&&Math.random()<DF.ebN()){eShot.g=1;eShot(x,y,a+(Math.random()<.5?.17:-.17),spd,big,true);eShot.g=0;}spd*=DF.ebS();spd*=.7+.3*rr;if(G.stage>=2){const sd=SD();spd*=sd.spd;if(!force&&Math.random()<sd.extra)eShot(x,y,a+(Math.random()<.5?.13:-.13),spd/sd.spd,big,true);}const dx=P.x-x,dy=P.y-y;if(dx*dx+dy*dy<50*50)return;const b=EB.get();if(!b)return;b.x=x;b.y=y;b.vx=Math.cos(a)*spd;b.vy=Math.sin(a)*spd;b.big=!!big;b.r=big?6:4;b.gz=0;}
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
function hurt(e,d){if(e.invT>0||e.dying||e.lock)return;if(e.parts&&partsAlive(e)>0)d*=(e.type==='boss'||e.type==='boss2'||e.xb)?.12:.4;e.hp-=d*DF.pd();e.fl=3;e.hitT=90;if(e.hp<=0)kill(e);}
function cogs(x,y,n,v){for(let i=0;i<n;i++){const c=CG.get();if(!c)return;c.x=x+rnd(-8,8);c.y=y+rnd(-8,8);c.vx=rnd(-1.6,1.6);c.vy=rnd(-2.2,0);c.v=v||1;c.t=0;}}
function medal(x,y){const m=MD.get();if(!m)return;m.x=x;m.y=y;m.vx=rnd(-.6,.6);m.vy=-1.2;m.t=0;}
const CHAIN=[100,200,400,800,1500,3000,5000];
function killPart(e){e.act=false;e.gone=true;const pa=e.p,bb=pa.type==='boss'||pa.type==='boss2'||!!pa.xb;boom(e.x,e.y,bb?2.6:1.8,'am');later(8,()=>boom(e.x+rnd(-14,14),e.y+rnd(-10,10),1.4,'mg'));flash(.3,'255,200,120');
 G.fall.push({x:e.x,y:e.y,vx:rnd(-1,1)+Math.sign(e.ox||rnd(-1,1))*1.4,vy:-2.5,rot:0,vr:rnd(-.08,.08),spr:e.spr||'bGear',t:0});
 const sc=bb?15000:5000,sv=bb?40:12;G.score+=sc;cogs(e.x,e.y,bb?10:5,Math.ceil(sv/(bb?10:5)));for(let i=0;i<(bb?3:2);i++)medal(e.x+rnd(-20,20),e.y);
 G.banner={t:100,a:e.label+' DESTROYED',b:'',small:true,c:COL.am};clearBullets(true);if(bb)bossPhaseUp(pa);}
function bossPhaseUp(e){const ph=3-partsAlive(e);if(ph===e.phase)return;e.phase=ph;e.invT=50;G.shake=12;flash(.6,ph<3?'255,61,240':'255,36,80');strobe(24);sfx.phase();
 G.banner=ph<3?{t:60,a:'PHASE '+(ph+1),b:['','GEARS SLIPPING','PRESSURE CRITICAL'][ph]}:{t:40,a:'CORE EXPOSED',b:'BERSERK OVERCLOCK',warn:true};}
function kill(e){comboKill(e);if(e.type==='part'){killPart(e);return;}if(e.type==='block'){e.act=false;G.score+=e.sc;G2.blocksBroken++;boom(e.x,e.y,e.glass?.8:1.2,e.glass?'cy':'am');for(let i=0;i<5;i++)part(2,e.x+rnd(-10,10),e.y+rnd(-10,10),rnd(-2,2),rnd(-3,0),30,rnd(.6,1.1));if(Math.random()<.5)cogs(e.x,e.y,1,1);if(Math.random()<.25)medal(e.x,e.y);return;}
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
  if(e.dT===150){boom(e.x,e.y,5,'cy');boom(e.x,e.y,4,'mg');flash(1,'255,255,255');sfx.bossDie();e.act=false;G.boss=null;later(120,DBG.includes('s1only')?stageClear:()=>goStage(2));}return;}
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
function playerHit(){if(P.inv>0||P.dead>0||DBG_INV||G.state!=='play')return false;G.hits=(G.hits||0)+1;G.noHit=0;comboBreak();if(DBG.includes('god')){P.inv=30;G.vig=1;return false;}
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
function applyMeta(){MF.fr=1/(1+.25*UL('fire'));MF.dm=1+.25*UL('dmg');MF.mag=40+35*UL('magnet');MF.sp=MF.sp0=1+.1*UL('speed');}
function startGame(){auInit();applyMeta();const sb=Math.min(META.bombs,bombCap());META.bombs-=sb;metaSave();Object.assign(G,{state:'play',st:0,hold:false,score:0,lives:2+UL('life'),bombs:sb,weapon:0,lvl:1+UL('wlvl'),shield:3+UL('shield'),maxSh:3+UL('shield'),hull:3+UL('hull'),hullM:3+UL('hull'),noHit:0,regen:0,shDown:0,rip:[],spk:[],hullFl:0,salv:0,chain:0,vig:0,pop:null,pop2:null,fall:[],hits:0,bossKill:false,boss2Kill:false,boss3Kill:false,boss4Kill:false,ev3Delay:0,ev4Delay:0,medals:0,bestChain:0,stage:1,ev2Delay:0,banked:false,shake:0,flash:0,bombT:0,boss:null,mid:null,evI:0,timers:[],banner:null,arcs:[],kills:0});
 Object.assign(P,{x:W/2,y:H-90,inv:120,dead:0,fireT:0,bank:0});PB.clear();EB.clear();EN.clear();PU.clear();LT.clear();CG.clear();MD.clear();FX.strobe=0;
 if(DBG_BOSS||DBG_MID){const tt=DBG_BOSS?92:46;G.st=tt*60;while(G.evI<EV.length&&EV[G.evI][0]<tt)G.evI++;G.lvl=Math.max(G.lvl,3);G.weapon=DBG.includes('laser')?1:DBG.includes('tesla')?2:0;}
 if(QSTG==='2'||QSTG==='2boss'){G.stage=2;s2reset(QSTG==='2boss'?BOSS2D-30:0);G.lvl=Math.max(G.lvl,3);G.st=100*60;}
 if(DBG_S2||DBG_B2){G.stage=2;s2reset(DBG_B2?BOSS2D-30:0);G.lvl=Math.max(G.lvl,3);G.weapon=DBG.includes('laser')?1:DBG.includes('tesla')?2:0;}
 if(DBG_S3||DBG_B3){G.stage=3;s3reset(DBG_B3?BOSS3D-30:0);G.lvl=Math.max(G.lvl,4);G.st=100*60;}
 if(DBG_S4||DBG_B4){G.stage=4;s4reset(DBG_B4?BOSS4D-30:0);G.lvl=Math.max(G.lvl,4);G.st=100*60;}
 if(DBG.includes('wmax'))G.lvl=lvlCap();
 musicStart(G.stage===4?(DBG_B4?8:7):G.stage===3?(DBG_B3?6:5):G.stage===2?(DBG_B2||QSTG==='2boss'?3:2):0);show(null);updHud();v2Start();}
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
function gameOver(){if(G.state!=='play')return;G.state='over';hiSave();musicStop();$('oSalv').innerHTML=salvHTML(bankRun());$('oScore').textContent=G.score.toLocaleString();$('oHi').textContent=G.hi.toLocaleString();show('over');if(lbQual(G.score))lbEntry(G.score,()=>{});}
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
 for(let i=G.timers.length-1;i>=0;i--){if(G.timers[i]&&G.timers[i].at<=G.t){const f=G.timers[i].fn;G.timers.splice(i,1);f();}}
 if(G.state==='cut'){cutUpd();return;}if(G.state==='diff'){G.diffT=(G.diffT||0)+1;return;}if(G.state!=='play')return;v2Tick();MF.sp=(MF.sp0||1)*DF.ps()*(G.stage===10?.7:1);
 if(!G.hold){G.st++;if(G.stage===1)while(G.evI<EV.length&&EV[G.evI][0]*60<=G.st){EV[G.evI][1]();G.evI++;}}
 if(G.stage===2)s2Update();
 if(G.stage===3)s3Update();
 if(G.stage===4)s4Update();
 if(G.stage>4)vUpdate(); // v1.3.0: 4 stages; anything past goes to the ending
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
  for(const e of EN.a){if(!e.act||e.y<-8||e.dying)continue;if(e.xb&&partsAlive(e)>0)continue;const rx=e.r+b.w/2,ry=e.r+b.h/2;if(Math.abs(e.x-b.x)<rx&&Math.abs(e.y-b.y)<ry){hurt(e,(e.xb||(e.p&&e.p.xb))?(b.pierce?b.dmg*.13:b.k===2?b.dmg*2.5:b.dmg):b.dmg);if(Math.random()<.3)part(0,b.x,b.y-4,rnd(-1,1),rnd(-2,0),8,.5,(WEAP[b.k]||WEAP[2]).d);if(b.k===3)boom(b.x,b.y,.6,'mg');if(!b.pierce){b.act=false;break;}}}}
 // enemies
 for(const e of EN.a){if(!e.act)continue;updEnemy(e);if(!e.act||P.dead>0||e.dying)continue;const dx=e.x-P.x,dy=e.y-P.y,rr=e.r*.8+4;if(dx*dx+dy*dy<rr*rr&&e.y>0&&e.type!=='block'&&!e.gnd){G.hitBy=e.type;playerHit();}}
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
 {const c=G.state==='cut';if(c!==draw.cut){draw.cut=c;document.body.classList.toggle('ngcut',c);}}if(G.state==='cut'){drawCut();return;}if(G.state==='diff'){drawDiff();return;}
 ctx.setTransform(SC*DPR,0,0,SC*DPR,sx*SC*DPR,sy*SC*DPR);drawBG(G.state==='pause'?0:1);
 if(!play){return;}
 if(G.stage===2)s2DrawBack();if(G.stage===3)s3DrawBack();if(G.stage===4)s4DrawBack();if(G.stage>4)vDrawBack();
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
 if(G.stage===2)s2DrawFront();if(G.stage===3)s3DrawFront();if(G.stage===4)s4DrawFront();if(G.stage>4)vDrawFront();
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
// v1.3.2: every canvas text is fitted inside the 360-wide play field: shrink if wider than the field (minus TXM margins), then nudge x so it never crosses an edge.
const TXM=8,TXF=sz=>'bold '+sz+'px "Trebuchet MS",system-ui,sans-serif';
function txt(s,x,y,c,sz,al,gl){s=String(s);al=al||'left';ctx.font=TXF(sz);let w=ctx.measureText(s).width;const mx=W-2*TXM;
 if(w>mx){const f=Math.max(7,Math.floor(sz*mx/w));if(f<sz){sz=f;ctx.font=TXF(sz);w=ctx.measureText(s).width;}}
 const l0=al==='center'?x-w/2:al==='right'?x-w:x,l=Math.min(Math.max(l0,TXM),Math.max(TXM,W-TXM-w));x+=l-l0;
 ctx.textAlign=al;ctx.textBaseline='top';if(gl){ctx.shadowColor=c;ctx.shadowBlur=gl;}ctx.fillStyle=c;ctx.fillText(s,x,y,mx);ctx.shadowBlur=0;}
// v1.3.2: word-wrap s into lines that fit maxW at size sz (shrinks the size until it fits in maxL lines). Returns {l:lines,sz}.
function wrapT(s,sz,maxW,maxL){s=String(s);for(;;){ctx.font=TXF(sz);const ws=s.split(' '),L=[];let cur='';
  for(const w of ws){const t=cur?cur+' '+w:w;if(cur&&ctx.measureText(t).width>maxW){L.push(cur);cur=w;}else cur=t;}if(cur)L.push(cur);
  if((L.length<=maxL&&L.every(x=>ctx.measureText(x).width<=maxW))||sz<=8)return{l:L,sz};sz--;}}
function txtW(s,x,y,c,sz,gl,maxL,lh){const r=wrapT(s,sz,W-2*TXM,maxL||2);r.l.forEach((t,i)=>txt(t,x,y+i*r.sz*(lh||1.2),c,r.sz,'center',gl));return r.l.length*r.sz*(lh||1.2);}
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
 v2HUD();const b=G.banner;if(b){const a=b.t<20?b.t/20:b.t>170?(200-b.t)/30:1;ctx.globalAlpha=Math.max(0,a);
  if(b.small){const h=txtW(b.a,W/2,H*.62,b.c,18,10,2);if(b.b)txtW(b.b,W/2,H*.62+h+4,'#e6feff',12,5,2);}else{if(b.warn&&(b.t>>3)%2){ctx.fillStyle='rgba(255,36,80,.12)';ctx.fillRect(0,0,W,H);}
  const ra=wrapT(b.a,28,W-2*TXM,1),rb=b.b?wrapT(b.b,13,W-2*TXM,2):{l:[],sz:13},bh=Math.max(74,48+rb.l.length*rb.sz*1.25+12);
  ctx.fillStyle='rgba(5,3,12,.55)';ctx.fillRect(0,H*.36,W,bh);txt(b.a,W/2,H*.36+12,b.warn?COL.eb:COL.cy,28,'center',14);rb.l.forEach((t,i)=>txt(t,W/2,H*.36+48+i*rb.sz*1.25,b.warn?'#fff':COL.am,rb.sz,'center',6));}ctx.globalAlpha=1;}}
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
 wireSettings();v2Boot();
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

})();
