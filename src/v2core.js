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
 try{if(AU.c&&!AU.muted&&AU.sfxV>0){const t=AU.c.currentTime,n=k===5?2:k===10?3:k===25?4:5,b=[110,138.6,164.8,220,277.2];for(let q=0;q<n;q++){tone('sawtooth',b[q],b[q],.22,.07,AU.sfx,t+q*.07);tone('square',b[q]/2,b[q]/2,.26,.05,AU.sfx,t+q*.07);}}}catch(_){}}
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
