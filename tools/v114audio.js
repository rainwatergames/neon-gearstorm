// v1.1.4 audio peak check: renders music + heavy SFX through an OfflineAudioContext (the game's real master bus) and reports peak dBFS + samples >= 1.0 (would clip on device).
// usage: node tools/v114audio.js <url> [label]
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8765/';const LABEL=process.argv[3]||'';const RAW=process.argv.includes('--raw');
const SCEN=[['stage1',0,'normal'],['boss1',1,'heavy'],['stage2',2,'normal'],['stage2-heavy',2,'heavy'],['boss2',3,'heavy'],['stage3',5,'normal'],['boss3',6,'heavy'],['stage4',7,'normal'],['boss4',8,'heavy'],['victory',4,'normal']];
(async()=>{const b=await puppeteer.launch({protocolTimeout:600000,executablePath:'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});const out=[];let all=true;
 for(const [name,mode,load] of SCEN){const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.evaluateOnNewDocument(()=>{try{localStorage.setItem('ngs_photo','1');localStorage.setItem('ngs_musv','1');localStorage.setItem('ngs_sfxv','1');}catch(_){}});
  await p.goto(U,{waitUntil:'load'});await new Promise(r=>setTimeout(r,800));
  const r=await p.evaluate(async(mode,load,RAW)=>{const T=24,SR=48000;const oac=new OfflineAudioContext(2,SR*T,SR);let fake=true;Object.defineProperty(oac,'state',{get:()=>fake?'running':'closed'});const realResume=oac.resume.bind(oac);oac.resume=()=>Promise.resolve();
   const Real=window.AudioContext;window.AudioContext=function(){return oac;};window.webkitAudioContext=window.AudioContext;
   const AU=NG.AU;AU.c=null;AU.muted=false;AU.musV=1;AU.sfxV=1;NG.auInit();window.AudioContext=Real;if(AU.wd){clearInterval(AU.wd);AU.wd=0;}oac.onstatechange=null;if(RAW){AU.m.disconnect();AU.m.connect(oac.destination);} // RAW = pre-master mix bus
if(AU.timer){clearInterval(AU.timer);}NG.musicStart(mode);clearInterval(AU.timer);AU.timer=1;oac.resume=realResume;
   let osc=0,live=0,maxLive=0;const co=oac.createOscillator.bind(oac),cb=oac.createBufferSource.bind(oac);
   const wrap=n=>{osc++;live++;maxLive=Math.max(maxLive,live);n.addEventListener('ended',()=>{live--;});return n;};oac.createOscillator=()=>wrap(co());oac.createBufferSource=()=>wrap(cb());
   const S=NG.sfx,heavy=load==='heavy';let k=0;
   for(let t=.05;t<T-.2;t+=.05){const i=k++;oac.suspend(t).then(()=>{NG.musicTick();S.shot();
     if(i%(heavy?6:12)===3)S.boom(1+Math.random()*2);if(i%9===4)S.cog();if(i%23===7)S.zap();if(i%40===11)S.hit();if(i%70===20)S.crack();if(i%60===33)S.power&&S.power();if(i%55===15)S.medal(3);
     if(heavy&&i%90===45)S.bomb();if(heavy&&(i===150||i===300))S.bossDie();if(heavy&&i>=150&&i<300&&i%2===0)S.boom(2+Math.random()*3); // boss death: boom() every 5 frames like updBoss
     if(i%120===90){S.boom(4);S.boom(3.5);S.boom(3);} // big chain kill
if(heavy&&i%120===60)S.phase();if(!heavy&&i%160===120)S.bomb();if(i%300===250)S.warn();
     oac.resume();});}
   const buf=await oac.startRendering();let pk=0,clip=0,over1db=0;const lim=Math.pow(10,-1/20);for(let c=0;c<2;c++){const d=buf.getChannelData(c);for(let j=0;j<d.length;j++){const v=Math.abs(d[j]);if(v>pk)pk=v;if(v>=1)clip++;if(v>lim)over1db++;}}
   let rms=0;const d0=buf.getChannelData(0);for(let j=0;j<d0.length;j++)rms+=d0[j]*d0[j];rms=Math.sqrt(rms/d0.length);fake=false;
   return {peakDb:+(20*Math.log10(pk)).toFixed(2),clipped:clip,overMinus1dB:over1db,rmsDb:+(20*Math.log10(rms)).toFixed(1),voices:osc,maxConcurrent:maxLive,guitarNotes:AU.gcount,sfxDropped:AU.vDrop||0};},mode,load,RAW);
  r.name=name;r.errs=errs.length;out.push(r);console.log(LABEL,name,JSON.stringify(r));await p.close();}
 const ok=RAW||out.every(r=>r.peakDb<=-1&&r.clipped===0&&r.errs===0);console.log(LABEL,(ok?'PASS':'FAIL')+' all scenarios peak <= -1 dBFS, 0 clipped samples');
 require('fs').writeFileSync('/tmp/audio-'+(LABEL||'run')+'.json',JSON.stringify(out,null,1));await b.close();process.exit(ok?0:1);})();
