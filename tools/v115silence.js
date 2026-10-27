// v1.1.5: boss 2 death -> stage 3 transition must keep audio alive. Taps everything that reaches ctx.destination into an AnalyserNode and samples RMS in real time.
const puppeteer=require('/workspace/cr-test/node_modules/puppeteer-core');const U=process.argv[2]||'http://localhost:8765/';
(async()=>{const b=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',protocolTimeout:300000,args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']});
 const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.setViewport({width:412,height:915});
 await p.evaluateOnNewDocument(()=>{localStorage.setItem('ngs_photo','1');const oc=AudioNode.prototype.connect;window.__an=null;
  AudioNode.prototype.connect=function(d,...r){if(d instanceof AudioDestinationNode){const c=this.context;if(!window.__an||window.__an.context!==c){window.__an=c.createAnalyser();window.__an.fftSize=2048;}oc.call(this,window.__an);}return oc.call(this,d,...r);};
  window.__rms=()=>{const a=window.__an;if(!a)return -1;const d=new Float32Array(a.fftSize);a.getFloatTimeDomainData(d);let s=0,nan=0;for(const x of d){if(x!==x){nan++;continue;}s+=x*x;}return nan?'NaN':Math.sqrt(s/d.length);};});
 await p.goto(U+'?debug=boss2,god',{waitUntil:'load'});await new Promise(r=>setTimeout(r,600));
 await p.evaluate(()=>{NG.META.up={};NG.startGame();});
 const samp=async(lbl,n,ms)=>{const out=[];for(let i=0;i<n;i++){await new Promise(r=>setTimeout(r,ms));out.push(await p.evaluate(()=>{const r=__rms();return {r:typeof r==='number'?+r.toFixed(4):r,st:NG.AU.c&&NG.AU.c.state,mode:NG.AU.mode,stage:NG.G.stage,on:NG.AU.on};}));}console.log(lbl,JSON.stringify(out.map(o=>o.r)),JSON.stringify(out[out.length-1]));return out;};
 await samp('boss2 fight',4,500);
 await p.evaluate(()=>{const bo=NG.G.boss;for(const q of bo.parts)q.act=false;bo.invT=0;bo.y=140;NG.kill(bo);});
 const d=await samp('boss2 dying',8,500);
 {const t0=Date.now();const f0=await p.evaluate(()=>NG.G.t);while(Date.now()-t0<40000&&await p.evaluate(()=>NG.G.stage!==3))await new Promise(r=>setTimeout(r,250));console.log('stage 3 reached after',Date.now()-t0,'ms, frames',await p.evaluate(f=>NG.G.t-f,f0));}
 const a=await samp('after',12,500);
 // phone-style interruption while the finger is held down (no new touch): must auto-resume
 await p.evaluate(()=>NG.AU.c.suspend());const sus=await samp('after ctx.suspend()',6,400);
 // NaN poisoning of the delay feedback loop: must self-heal
 await p.evaluate(()=>{const a=NG.AU.c,bf=a.createBuffer(1,128,a.sampleRate);bf.getChannelData(0).fill(NaN);const s=a.createBufferSource();s.buffer=bf;s.connect(NG.AU.dly);s.start();});
 const nan=await samp('after NaN injection',8,400);const heal=await p.evaluate(()=>({heals:NG.AU.heals||0,rebuilds:NG.AU.rebuilds||0}));console.log('watchdog',JSON.stringify(heal));
 const s3=await p.evaluate(()=>({stage:NG.G.stage,mode:NG.AU.mode,state:NG.G.state}));
 const tail=a.slice(-6);const ok=s3.stage===3&&s3.mode===4&&tail.every(o=>typeof o.r==='number'&&o.r>0.001)&&d.some(o=>typeof o.r==='number'&&o.r>0.001)&&!errs.length&&sus.slice(-3).every(o=>o.st==='running'&&o.r>0.001)&&nan.slice(-3).every(o=>typeof o.r==='number'&&o.r>0.001);
 console.log(JSON.stringify(s3),'errs',errs);console.log((ok?'PASS':'FAIL')+' audio stays alive through boss-2 death stinger -> stage 3 music (analyser RMS > 0), auto-resumes after suspend, self-heals after NaN');await b.close();process.exit(ok?0:1);})();
