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
// v1.1 stage 3: B minor rail-chase thrash, 172 bpm, squealing leads ; boss 3: F# minor, 184 bpm, double solos
SONGS.push({bpm:172,ch:[[59,62,66],[55,59,62],[57,61,64],[54,57,61]],root:[47,43,45,42],hook:tr(HOOK,2),
 sec:[['intro',4,'k h G S'],['gallop',8,'k b h s a G g'],['verse',8,'k b h s a p G'],['chorus',8,'k b h s a l c o g G'],['solo',8,'k b h s o G Q r'],['break',2,'S p'],['drop',8,'k b h s a g c o r G Q']]});
SONGS.push({bpm:184,boss:1,ch:[[54,57,61],[50,54,57],[52,56,59],[49,52,56]],root:[42,38,40,37],hook:tr(BHOOK,4),
 sec:[['siren',4,'S k G'],['heavy',8,'k b h s o G g'],['solo',8,'k b h s o G Q r'],['hook',8,'k b h s a g o r c G'],['break',2,'S p Q'],['solo',8,'k b h s a o G Q r c'],['hook',8,'k b h s a g o r c G Q']]});
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
