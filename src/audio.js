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
