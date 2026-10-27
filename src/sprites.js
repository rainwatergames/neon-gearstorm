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
