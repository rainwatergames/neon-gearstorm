// ---- audio.js : synthesized SFX + synthwave loop (WebAudio, no assets)
const AU={c:null,m:null,mus:null,sfx:null,nb:null,muted:false,on:false,step:0,next:0,mode:0,timer:null,lastShot:0};
function auInit(){if(AU.c){if(AU.c.state!=='running')AU.c.resume();return;}const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const a=new C();AU.c=a;
 AU.m=a.createGain();AU.m.gain.value=AU.muted?0:.8;const comp=a.createDynamicsCompressor();AU.m.connect(comp);comp.connect(a.destination);
 AU.mus=a.createGain();AU.mus.gain.value=.32;AU.mus.connect(AU.m);AU.sfx=a.createGain();AU.sfx.gain.value=.55;AU.sfx.connect(AU.m);
 const n=a.sampleRate;AU.nb=a.createBuffer(1,n,n);const d=AU.nb.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;}
function tone(type,f0,f1,dur,vol,dest,t0,fq){const a=AU.c;if(!a)return;t0=t0||a.currentTime;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f0,t0);if(f1!==f0)o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t0+dur);
 g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);let n=o;if(fq){const f=a.createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(fq,t0);f.frequency.exponentialRampToValueAtTime(Math.max(80,fq*.15),t0+dur);o.connect(f);n=f;}n.connect(g);g.connect(dest||AU.sfx);o.start(t0);o.stop(t0+dur+.02);}
function noise(dur,vol,ftype,f0,f1,dest,t0){const a=AU.c;if(!a)return;t0=t0||a.currentTime;const s=a.createBufferSource();s.buffer=AU.nb;const f=a.createBiquadFilter();f.type=ftype;f.frequency.setValueAtTime(f0,t0);if(f1!==f0)f.frequency.exponentialRampToValueAtTime(f1,t0+dur);const g=a.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0008,t0+dur);s.connect(f);f.connect(g);g.connect(dest||AU.sfx);s.start(t0,Math.random()*.5);s.stop(t0+dur+.02);}
const sfx={
 shot(){if(!AU.c)return;const t=AU.c.currentTime;if(t-AU.lastShot<.07)return;AU.lastShot=t;tone('square',1100,520,.045,.035);},
 zap(){tone('sawtooth',1800,300,.06,.03,null,0,4000);},
 boom(s){noise(.25+.15*s,.35+.12*s,'lowpass',1800,120);tone('sine',140,38,.25+.1*s,.4);},
 hit(){tone('square',300,200,.03,.02);},
 power(){if(!AU.c)return;const t=AU.c.currentTime;[523,659,784,1046].forEach((f,i)=>tone('square',f,f,.09,.08,null,t+i*.05));},
 bomb(){noise(1.4,.6,'lowpass',3000,90);tone('sawtooth',400,30,1.2,.25,null,0,2000);},
 die(){noise(.8,.5,'lowpass',2500,100);tone('sawtooth',700,40,.8,.25);},
 warn(){if(!AU.c)return;const t=AU.c.currentTime;for(let i=0;i<4;i++)tone('square',440,330,.35,.07,null,t+i*.45,1500);},
 phase(){noise(.6,.4,'bandpass',600,3000);tone('triangle',200,800,.5,.2);}
};
// music: 16th-step sequencer with lookahead scheduling
const SONGS=[{bpm:112,ch:[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]},{bpm:128,ch:[[50,53,57],[46,50,53],[43,46,50],[45,49,52]]}];
const mf=n=>440*Math.pow(2,(n-69)/12);
function musicStart(mode){AU.mode=mode||0;if(!AU.c)return;AU.step=0;AU.next=AU.c.currentTime+.08;if(!AU.timer)AU.timer=setInterval(musicTick,25);AU.on=true;}
function musicStop(){AU.on=false;}
function musicTick(){const a=AU.c;if(!a||!AU.on||a.state!=='running')return;const song=SONGS[AU.mode],sp=60/song.bpm/4;
 while(AU.next<a.currentTime+.12){const s=AU.step,t=AU.next,bar=Math.floor(s/16)%4,st=s%16,ch=song.ch[bar],M=AU.mus;
  if(st%4===0){tone('sine',150,42,.22,.9,M,t);}
  if(st===4||st===12){noise(.16,.35,'bandpass',1800,900,M,t);tone('triangle',220,140,.08,.2,M,t);}
  if(st%2===1||AU.mode)noise(.04,st%2?.12:.05,'highpass',7000,7000,M,t);
  const bn=ch[0]-24+(st%2?12:0);tone('sawtooth',mf(bn),mf(bn),sp*.9,.16,M,t,AU.mode?1400:900);
  const arp=ch[(st)%3]+12+(Math.floor(st/3)%2?12:0);tone('square',mf(arp),mf(arp),sp*.7,.045,M,t,3200);
  if(st===0)tone('triangle',mf(ch[2]+12),mf(ch[2]+12),sp*7,.06,M,t);
  AU.step++;AU.next+=sp;}}
function setMute(m){AU.muted=m;if(AU.m)AU.m.gain.value=m?0:.8;}
