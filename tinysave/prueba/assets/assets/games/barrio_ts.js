// TinySave · BARRIOS (r32b) = MOTOR de «Tu camino» de TinyQuit (camino.js: carretera, horneado por baldosas, gestos, inercia,
// paradas) + esta capa PROPIA de TinySave, que lo cambia todo lo que se ve (Jose: «partir del código, no plagiarlo»):
//  · cada barrio tiene SU suelo (aquí, tarima de una casa), SU camino (aquí, una alfombra larga) y SUS objetos;
//  · los barrios aún no hechos salen difuminados con su cartel y «Próximamente»;
//  · Savy es el de la app (imagen que manda la app, con su ropa); el cartel es el de TinySave (color del barrio + icono);
//  · voladores con lógica (en una casa: aviones de papel que vuelan hacia DONDE MIRAN, sin estela).
// La app pasa con CAM_INIT/BAR_UPDATE: {today, prizes:[{id,n,d,done,cur,gold,lock}], lv:[nombres], col:[colores], savy:dataURL}
// Reglas comprobadas por `_comun/qa/qa_barrio.py` leyendo BSPEC (abajo): nada de otro barrio, nada de exterior en un interior,
// escala real entre objetos, voladores orientados, suelo y camino propios, 45 barrios en el mapa.
const BSPEC=[{barrio:1,nombre:'Fuerte de mantas',interior:true,suelo:'tarima',camino:'alfombra larga',
 unicos:['cojín','osito','planta en lata','libros','bloques','castillo de almohadas','lámpara de pie','cesta de ovillos'],voladores:['avión de papel','bola de papel'],
 comunes:['alfombra','zapatilla','pelota','peonza','cubo de juguete'],
 // alto real (cm) y alto dibujado (px) de cada cosa: la proporción px/cm tiene que ser parecida en todas (escala real)
 escala:{'alfombra':[200,170],'cojín':[45,38],'osito':[30,30],'planta en lata':[40,40],'libros':[22,20],'bloques':[20,22],'castillo de almohadas':[70,60],'lámpara de pie':[150,120],'cesta de ovillos':[30,26],'Savy':[22,24]}}];
const QC=['#F7B6C3','#FFD98A','#9FDCC4','#A9CBF4','#FFE9CC','#C9B3EE','#FF9C86'];
// ---------------- objetos del fuerte de mantas (por código: nítidos con cualquier zoom) ----------------
const F={
 rug:(x,y,s,c)=>{const rx=60*s,ry=20*s;g.fillStyle='rgba(60,40,20,.12)';g.beginPath();g.ellipse(x+4,y+4,rx+4,ry+3,0,0,7);g.fill();
  for(let i=0;i<7;i++){const k=1-i/7;g.fillStyle=i%2?sh(c,-.08):sh(c,.1);g.beginPath();g.ellipse(x,y,rx*k,ry*k,0,0,7);g.fill();}
  g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=1.2;g.setLineDash([3,3]);g.beginPath();g.ellipse(x,y,rx*.93,ry*.9,0,0,7);g.stroke();g.setLineDash([]);},
 cushion:(x,y,s,c)=>{shadowG(x+5*s,y+1,18*s,4.5*s,.26);g.save();g.translate(x,y-9*s);g.fillStyle=lin(-10*s,8*s,[[0,sh(c,.22)],[1,sh(c,-.1)]]);g.beginPath();g.moveTo(-19*s,-4*s);g.quadraticCurveTo(0,-13*s,19*s,-4*s);g.quadraticCurveTo(23*s,4*s,17*s,8*s);g.quadraticCurveTo(0,12*s,-17*s,8*s);g.quadraticCurveTo(-23*s,4*s,-19*s,-4*s);g.fill();
  g.fillStyle=sh(c,-.06);rr(4*s,-3*s,9*s,7*s,1.5*s);g.fill();g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=.9;g.setLineDash([1.6,1.6]);rr(4*s,-3*s,9*s,7*s,1.5*s);g.stroke();g.setLineDash([]);ball3d(-4*s,0,2.2*s,sh(c,-.25),0);g.restore();},
 teddy:(x,y,s)=>{shadowG(x+5*s,y+1,12*s,3.5*s,.28);const c='#C98E5C';ell3d(x,y-9*s,9*s,8*s,c);ell3d(x-7*s,y-3*s,3.6*s,3*s,c,0);ell3d(x+7*s,y-3*s,3.6*s,3*s,c,0);ball3d(x,y-22*s,7*s,c);ball3d(x-6*s,y-27*s,3*s,c,0);ball3d(x+6*s,y-27*s,3*s,c,0);ell3d(x,y-19.5*s,3.2*s,2.5*s,'#F2D2B0',0);ell3d(x,y-8*s,4.5*s,4.5*s,'#E8B98C',0);g.fillStyle=INK;g.beginPath();g.arc(x-2.6*s,y-23*s,1*s,0,7);g.arc(x+2.6*s,y-23*s,1*s,0,7);g.arc(x,y-20.5*s,.9*s,0,7);g.fill();},
 plantTin:(x,y,s)=>{shadowG(x+5*s,y+1,10*s,3*s,.28);const L=[[-1,17],[-.5,21],[0,23],[.5,20],[1,16],[-.25,14],[.3,13]];L.forEach(([a,l],i)=>{g.save();g.translate(x,y-13*s);g.rotate(a*.85);g.fillStyle=i%2?'#3FAE5A':'#5BC46E';g.beginPath();g.moveTo(0,0);g.quadraticCurveTo(-5.5*s,-l*.55*s,0,-l*s);g.quadraticCurveTo(5.5*s,-l*.55*s,0,0);g.fill();g.restore();});
  // lata reciclada de maceta: cilindro metálico con su etiqueta
  g.fillStyle=cyl(x-7*s,x+7*s,'#C9D3DD');g.fillRect(x-7*s,y-14*s,14*s,14*s);g.fillStyle=cyl(x-7*s,x+7*s,'#E8505B');g.fillRect(x-7*s,y-10*s,14*s,6*s);g.fillStyle='#EEF2F6';g.beginPath();g.ellipse(x,y-14*s,7*s,2*s,0,0,7);g.fill();g.fillStyle='#7A5A3C';g.beginPath();g.ellipse(x,y-14*s,5.6*s,1.4*s,0,0,7);g.fill();},
 books:(x,y,s)=>{shadowG(x+5*s,y+1,13*s,3.5*s,.26);const C=['#E8505B','#4F9BE8','#FFC83D','#3FAE5A'];for(let i=0;i<4;i++){const w=(21-i*2)*s,dx=(i%2?2:-2)*s;box3(x+dx,y-i*3.8*s,w,3.6*s,7*s,C[i]);g.fillStyle='#FFF6E8';g.fillRect(x+dx+w/2-1*s,y-i*3.8*s-3*s,1.1*s,2.4*s);}},
 blocks:(x,y,s)=>{shadowG(x+6*s,y+1,14*s,3.5*s,.26);[[-6,0,'#FF6B7A','A'],[6,0,'#5FB8FF','B'],[0,-10,'#FFC83D','C']].forEach(([dx,dy,c,l])=>{box3(x+dx*s,y+dy*s,10*s,10*s,6*s,c);txt(l,x+dx*s,y+(dy-5)*s,7*s,'#fff',700);});},
 castle:(x,y,s)=>{shadowG(x+9*s,y+2,24*s,6*s,.28);const P=['#FFE9CC','#F7B6C3','#A9CBF4','#9FDCC4'];[[-13,0,13,11],[13,0,13,11],[0,0,20,15],[0,-15,15,11],[-13,-11,9,7],[13,-11,9,7]].forEach(([dx,dy,w,h],i)=>{g.fillStyle=lin(y+dy*s-h*s,y+dy*s,[[0,sh(P[i%4],.15)],[1,sh(P[i%4],-.1)]]);rr(x+dx*s-w*s/2,y+dy*s-h*s,w*s,h*s,4*s);g.fill();g.strokeStyle='rgba(255,255,255,.55)';g.setLineDash([2,2]);g.lineWidth=1;rr(x+dx*s-w*s/2+2,y+dy*s-h*s+2,w*s-4,h*s-4,3*s);g.stroke();g.setLineDash([]);});g.strokeStyle='#8A5A34';g.lineWidth=1.2;g.beginPath();g.moveTo(x,y-26*s);g.lineTo(x,y-37*s);g.stroke();g.fillStyle='#E8505B';g.beginPath();g.moveTo(x,y-37*s);g.lineTo(x+7*s,y-34*s);g.lineTo(x,y-31*s);g.fill();},
 lamp:(x,y,s)=>{shadowG(x+6*s,y+1,9*s,3*s,.26);ell3d(x,y-1*s,7*s,2.4*s,'#8A5A34',0);g.fillStyle=cyl(x-1.1*s,x+1.1*s,'#B07A44');g.fillRect(x-1.1*s,y-58*s,2.2*s,57*s);g.fillStyle=lin(y-74*s,y-56*s,[[0,'#FFE7A6'],[1,'#FFC85E']]);g.beginPath();g.moveTo(x-6*s,y-74*s);g.lineTo(x+6*s,y-74*s);g.lineTo(x+11*s,y-57*s);g.lineTo(x-11*s,y-57*s);g.fill();g.fillStyle='rgba(255,230,150,.16)';g.beginPath();g.ellipse(x,y-2*s,24*s,7*s,0,0,7);g.fill();},
 yarn:(x,y,s)=>{shadowG(x+5*s,y+1,12*s,3.5*s,.26);g.fillStyle=cyl(x-12*s,x+12*s,'#C99A62');rr(x-12*s,y-10*s,24*s,10*s,4*s);g.fill();g.strokeStyle='rgba(120,80,40,.4)';g.lineWidth=1;for(let i=-9;i<=9;i+=4.5){g.beginPath();g.moveTo(x+i*s,y-10*s);g.lineTo(x+i*s,y);g.stroke();}[['#FF8FB1',-5],['#7FC4FF',2],['#FFC83D',7]].forEach(([c,dx],i)=>ball3d(x+dx*s,y-12*s-(i%2)*2*s,5*s,c));},
 slipper:(x,y,s,c)=>{shadow(x+3*s,y+1,8*s,2.2*s,.2);ell3d(x,y-2*s,8*s,3*s,c,0);ell3d(x+3*s,y-2.6*s,3.6*s,2.1*s,'#FFFFFF',0);},
 toy:(x,y,s,k,c)=>{shadow(x+3*s,y+1,7*s,2.2*s,.22);if(k===0)ball3d(x,y-5*s,5*s,c);else if(k===1)box3(x,y,9*s,8*s,5*s,c);else{coneR(x,y-1*s,6*s,9*s,c);ball3d(x,y-11*s,1.6*s,'#fff',0);}},
};
// ---------------- suelo: tarima de una casa (tablas con juntas y vetas; cada barrio podrá tener su suelo) ----------------
function floorDraw(rect,T){const pc=T.fc||['#E9C08A','#E2B57E','#DDAF76','#E6BC86'],PH=15;let row=Math.floor(rect[1]/PH)-1;
 for(let y=row*PH;y<rect[3]+PH;y+=PH,row++){seed=(row*92821+7)>>>0||1;let x=-rnd()*90;while(x<W+20){const L=70+rnd()*90,c=pc[Math.floor(rnd()*pc.length)];g.fillStyle=c;g.fillRect(x,y,L,PH);
   g.strokeStyle=sh(c,-.06);g.lineWidth=.8;for(let k=0;k<2;k++){const yy=y+3+rnd()*(PH-6);g.beginPath();g.moveTo(x+4,yy);g.quadraticCurveTo(x+L/2,yy+(rnd()-.5)*3,x+L-4,yy);g.stroke();}
   g.fillStyle='rgba(120,80,40,.28)';g.fillRect(x+L-1,y,1.2,PH);x+=L;}
  g.fillStyle='rgba(120,80,40,.22)';g.fillRect(0,y+PH-1,W,1.1);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(0,y,W,1);}}
// ---------------- camino: una alfombra larga de pasillo (cada barrio su camino: alfombra, parque, carretera, tierra…) ----------------
function roadDraw(da,db){const pts=[];for(let d=da;d<=db;d+=.2)pts.push([...roadXY(d),d]);const lv=d=>LVd[Math.max(0,Math.min(LVd.length-1,Math.floor(d/30)))];
 const pth=(a,b)=>{g.beginPath();let st=0;for(let i=0;i<pts.length;i++){const p=pts[i];if(p[2]<a||p[2]>b)continue;st++?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);}};
 g.lineCap='round';g.lineJoin='round';g.save();g.translate(0,6);pth(da,db);g.strokeStyle='rgba(60,40,20,.18)';g.lineWidth=RW+10;g.stroke();g.restore();
 for(let L=Math.max(0,Math.floor(da/30));L<=Math.min(LVd.length-1,Math.floor(db/30));L++){const T=lv(L*30),C=T.rc||{edge:'#D98A9E',base:'#F7B6C3',stripe:'#FFF1DF',dot:'#E86F8F'},a=Math.max(da,L*30-.2),b=Math.min(db,L*30+30.2);
  [[RW+6,C.edge],[RW,C.base],[RW*.72,C.stripe],[RW*.6,C.base]].forEach(([w,c])=>{pth(a,b);g.strokeStyle=c;g.lineWidth=w;g.stroke();});
  for(let d=Math.ceil(a/.5)*.5;d<=b;d+=.5){const [x,y]=roadXY(d),[x2,y2]=roadXY(d+.05),an=Math.atan2(y2-y,x2-x);g.save();g.translate(x,y);g.rotate(an);g.fillStyle=C.dot;g.beginPath();g.moveTo(-5,0);g.lineTo(0,-4);g.lineTo(5,0);g.lineTo(0,4);g.closePath();g.fill();g.restore();}}}
// ---------------- barrios aún no hechos: niebla suave + su cartel con «Próximamente» ----------------
function fogDraw(r0){const rect=[r0[0],r0[1],r0[2],r0[3]-50];g.fillStyle=lin(rect[1],rect[3],[[0,'rgba(255,247,242,.9)'],[.5,'rgba(255,247,242,.78)'],[1,'rgba(255,247,242,.55)']]);g.fillRect(-40,rect[1],W+80,rect[3]-rect[1]);
 for(let i=0;i<10;i++){const x=R(-20,W+20),y=R(rect[1]+30,rect[3]-40);cloudPuff(x,y,R(1.2,2),.55);}
 g.fillStyle=lin(rect[3]-30,rect[3]+20,[[0,'rgba(255,247,242,.55)'],[1,'rgba(255,247,242,0)']]);g.fillRect(-40,rect[3],W+80,20);}
// ---------------- suelo + objetos de cada baldosa (sustituye al césped de TinyQuit) ----------------
function bakeRect2(rect,cv,sc){cv=cv||document.createElement('canvas');const BSx=sc||BS;const tw=rect[2]-rect[0],th=rect[3]-rect[1];cv.width=Math.ceil(tw*BSx);cv.height=Math.ceil(th*BSx);g=cv.getContext('2d');g.scale(BSx,BSx);g.translate(-rect[0],-rect[1]);
 const da=Math.min(dayAt(rect[0],rect[1]),dayAt(rect[2],rect[3]))-3,db=Math.max(dayAt(rect[0],rect[1]),dayAt(rect[2],rect[3]))+3;
 floorDraw(rect,LVd[0]);
 const hit=it=>it.bb[2]>rect[0]&&it.bb[0]<rect[2]&&it.bb[3]>rect[1]&&it.bb[1]<rect[3];
 const run=it=>{seed=it.seed;CUR_D=it.d;g.save();try{it.fn(it.x,it.y,it.s||1,it.f||1,it.i||0);}catch(e){}g.restore();};
 IT.filter(it=>it.b&&hit(it)).sort((a,b)=>(a.z||0)-(b.z||0)||(a.y-b.y)).forEach(run);
 roadDraw(Math.max(-3,da),Math.min(TOT+3,db));
 const st=IT.filter(it=>!it.b&&hit(it));SIGNS.forEach(([x,y,L])=>{const bb=[x-80,y-50,x+80,y+50];if(bb[2]>rect[0]&&bb[0]<rect[2]&&bb[3]>rect[1]&&bb[1]<rect[3])st.push({y:y+20,z:LVd[L].locked?60:0,fn:()=>signAt(x,y,L),seed:1,d:0});});
 st.sort((a,b)=>(a.z||0)-(b.z||0)||a.y-b.y).forEach(run);return cv;}
function genLevel(L){const T=LVd[L],d0=30*L,d1=d0+30;seed=1000+L*7919;const rect=[0,yOf(d1),W,yOf(d0)];
 const add=it=>{it.seed=Math.floor(rnd()*1e9);it.d=dayAt(it.x,it.y);if(!it.bb){const s=it.s||1,bw=(it.bw||70)*s,bh=(it.bh||110)*s;it.bb=[it.x-bw,it.y-bh,it.x+bw,it.y+30*s];}if(it.a&&it.a!=='fx')SPR.push(it);else IT.push(it);if(it.fx)FXL.push(it);};
 if(T.locked){add({x:W/2,y:rect[3],z:50,bb:[-40,rect[1]-40,W+40,rect[3]+40],fn:()=>fogDraw(rect)});return;}
 const place=(spec,i)=>{const r=spec.r;spec._p=spec._p||[];for(let t=0;t<300;t++){const x=R(rect[0]+r*.6,rect[2]-r*.6),y=R(rect[1]+r*.5,rect[3]-r*.3);if(spec.sep&&spec._p.some(q=>Math.hypot(q[0]-x,(q[1]-y)*1.4)<spec.sep))continue;
  if(free(x,y,r)){if(!spec.under)take(x,y,r);spec._p.push([x,y]);const s=spec.sc?R(spec.sc[0],spec.sc[1]):1;add({x,y,r,s,f:flip(),i,a:spec.a,b:spec.b,fn:spec.f,bw:spec.bw,bh:spec.bh,z:spec.z||0});return;}}};
 (T.items||[]).forEach(spec=>{spec._p=[];for(let i=0;i<spec.n;i++)place(spec,i);});
 ((T.sky||{}).fly||[]).forEach(([k,n])=>{for(let i=0;i<n;i++)SKY.push({lo:-90,len:W+180,k,x:R(0,W),y:R(rect[1]+40,rect[3]-40),v:R(14,24)*(rnd()<.5?-1:1),s:R(.9,1.1),p:0,ph:R(0,6),pk:.16+rnd()*.22});});}
function milAt(){}
const BLEVELS=[{n:'Fuerte de mantas',c:'#F0727F',gr:['#E2B57E','#E2B57E'],fc:['#E9C08A','#E2B57E','#DDAF76','#E6BC86'],rc:{edge:'#D98A9E',base:'#F7B6C3',stripe:'#FFF1DF',dot:'#E86F8F'},
 sky:{fly:[['pplane',2],['pball',1]]},
 items:[I((x,y,s,f,i)=>F.rug(x,y,s,QC[(i*3)%7]),3,70,{b:1,z:-1,under:1,sep:190,sc:[1.1,1.5]}),
  I((x,y,s,f,i)=>F.cushion(x,y,s,QC[(i+2)%7]),5,20,{sep:70,sc:[.95,1.1]}),I((x,y,s,f)=>F.teddy(x,y,s,f),2,15,{sep:150}),I((x,y,s)=>F.plantTin(x,y,s),5,13,{sc:[.9,1.1],sep:60}),
  I((x,y,s)=>F.books(x,y,s),3,13),I((x,y,s)=>F.blocks(x,y,s),3,13),I((x,y,s)=>F.castle(x,y,s),1,28),I((x,y,s)=>F.lamp(x,y,s),2,12,{bh:110,sep:200}),I((x,y,s)=>F.yarn(x,y,s),2,14),
  I((x,y,s,f,i)=>F.slipper(x,y,s,QC[i%7]),4,8),I((x,y,s,f,i)=>F.toy(x,y,s,i%3,QC[(i+4)%7]),8,8)]}];
// ---------------- voladores: avión de papel (mira hacia donde vuela, sin estela) y bola de papel ----------------
function paperPlane(x,y,s,dir,t){g.save();g.translate(x,y);g.scale(dir*s,s);g.rotate(Math.sin(t*1.6)*.06);
 g.fillStyle='rgba(60,40,20,.12)';g.beginPath();g.ellipse(-4,58,16,4,0,0,7);g.fill(); // sombra en el suelo
 g.fillStyle='#FFFFFF';g.beginPath();g.moveTo(18,0);g.lineTo(-16,-9);g.lineTo(-10,0);g.closePath();g.fill();
 g.fillStyle='#DCEBFA';g.beginPath();g.moveTo(18,0);g.lineTo(-10,0);g.lineTo(-16,8);g.closePath();g.fill();
 g.fillStyle='#BFD7F2';g.beginPath();g.moveTo(18,0);g.lineTo(-10,0);g.lineTo(-7,3);g.closePath();g.fill();
 g.strokeStyle='rgba(120,150,190,.6)';g.lineWidth=.8;g.beginPath();g.moveTo(18,0);g.lineTo(-10,0);g.stroke();g.restore();}
function paperBall(x,y,s,t){g.save();g.translate(x,y);g.fillStyle='rgba(60,40,20,.1)';g.beginPath();g.ellipse(2,50,9,2.6,0,0,7);g.fill();g.rotate(t*.4);ball3d(0,0,8*s,'#FFF6E8');g.strokeStyle='rgba(200,170,130,.6)';g.lineWidth=.9;for(let i=0;i<4;i++){g.beginPath();g.arc(0,0,8*s,i*1.6,i*1.6+1);g.stroke();}g.restore();}
const _sky0=skyDraw;
skyDraw=function(t,v){SKY.forEach(o=>{if(o.k!=='pplane'&&o.k!=='pball')return;let x=o.lo+((o.x-o.lo+o.v*t*(o.k==='pball'?.35:1))%o.len+o.len)%o.len,y=o.y;x+=(x-cx)*o.pk;y+=(y-cy)*o.pk;if(x<v[0]-60||x>v[2]+60||y<v[1]-80||y>v[3]+80)return;
 if(o.k==='pplane')paperPlane(x,y+Math.sin(t*1.3+o.ph)*5,o.s,o.v>0?1:-1,t+o.ph);else paperBall(x,y+Math.sin(t*.8+o.ph)*7,o.s,t+o.ph);});};
// ---------------- Savy: la imagen de la app (su ropa de verdad) ----------------
let SAVY_IMG=null;
function tiny(x,y,w){if(SAVY_IMG&&SAVY_IMG.complete&&SAVY_IMG.naturalWidth){const h=w*SAVY_IMG.naturalHeight/SAVY_IMG.naturalWidth;g.fillStyle='rgba(30,50,40,.2)';g.beginPath();g.ellipse(x,y-w*.66+h*.98,w*.36,w*.07,0,0,7);g.fill();g.drawImage(SAVY_IMG,x-w/2,y-w*.66,w,h);}}
// ---------------- paradas: objetivos (número · ✓ · dorado con comodín); el fuerte = fase 0, antes del 1 ----------------
function fortIcon(x,y,s,c){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='rgba(60,40,20,.2)';g.beginPath();g.ellipse(2,1,28,6,0,0,7);g.fill();
 g.fillStyle='#B07A44';[-22,22].forEach(dx=>{rr(dx-2,-30,4,30,1.5);g.fill();});
 g.fillStyle=lin(-34,0,[[0,sh(c,.25)],[1,c]]);g.beginPath();g.moveTo(-28,0);g.quadraticCurveTo(-24,-22,-20,-32);g.quadraticCurveTo(0,-26,20,-32);g.quadraticCurveTo(24,-22,28,0);g.closePath();g.fill();
 g.fillStyle=sh(c,-.35);g.beginPath();g.moveTo(-8,0);g.quadraticCurveTo(0,-22,8,0);g.fill();g.strokeStyle='rgba(255,255,255,.6)';g.setLineDash([2.5,2.5]);g.lineWidth=1.1;g.beginPath();g.moveTo(-22,-28);g.quadraticCurveTo(0,-23,22,-28);g.stroke();g.setLineDash([]);
 ['#FFD98A','#9FDCC4','#A9CBF4','#FFD98A'].forEach((q,i)=>{g.fillStyle=q;g.beginPath();g.moveTo(-15+i*10,-29);g.lineTo(-10+i*10,-29);g.lineTo(-12.5+i*10,-24);g.fill();});g.restore();}
function drawStation(p){const x=p.x,y=p.y,r=20,c=p.gold?'#E2A21A':(CFG.col&&CFG.col[0])||'#F0727F';
 if(p.home){fortIcon(x,y+6,.62,'#F7B6C3');return;}
 g.fillStyle='rgba(60,40,20,.26)';g.beginPath();g.ellipse(x+3,y+9,r+6,8,0,0,7);g.fill();g.fillStyle=sh(c,-.25);g.beginPath();g.arc(x,y,r,0,7);g.fill();
 g.fillStyle=p.done||p.cur?lin(y-r,y+r,[[0,sh(c,.25)],[1,c]]):lin(y-r,y+r,[[0,'#FFFFFF'],[1,'#F2F2F2']]);g.beginPath();g.arc(x,y-4,r,0,7);g.fill();g.lineWidth=3;g.strokeStyle=p.lock?'#C9BFB3':c;g.beginPath();g.arc(x,y-4,r-1.5,0,7);g.stroke();
 if(p.done){g.strokeStyle='#fff';g.lineWidth=4;g.lineCap='round';g.beginPath();g.moveTo(x-8,y-4);g.lineTo(x-2,y+2);g.lineTo(x+9,y-10);g.stroke();}else txt(String(p.n),x,y-4,18,p.cur?'#fff':(p.lock?'#A79C90':c),700);
 g.fillStyle='rgba(255,255,255,.65)';g.beginPath();g.ellipse(x-7,y-16,5,2.2,-.5,0,7);g.fill();}
function openBubble(p){if(p&&p.id!=null&&!p.home)send('open:'+p.id);}
// cartel de TinySave: placa del color del barrio, círculo blanco con el icono y «Barrio n» + nombre; los que faltan, «Próximamente»
function signAt(x,y,L){const T=LVd[L],c=(CFG.col&&CFG.col[L])||T.c,nm=(CFG.lv&&CFG.lv[L])||T.n;g.save();g.translate(x,y-14);
 g.fillStyle=cyl(-3.5,3.5,'#8A5A34');rr(-3.5,10,7,34,2);g.fill();g.fillStyle='rgba(0,0,0,.18)';g.beginPath();g.ellipse(0,46,17,3.5,0,0,7);g.fill();
 g.fillStyle='rgba(0,0,0,.22)';rr(-75,-19,150,52,14);g.fill();g.fillStyle=sh(c,-.35);rr(-75,-23,150,52,14);g.fill();g.fillStyle=lin(-26,26,[[0,sh(c,.18)],[1,sh(c,-.1)]]);rr(-75,-26,150,52,14);g.fill();g.strokeStyle='rgba(255,255,255,.65)';g.lineWidth=1.6;rr(-72,-23,144,46,11);g.stroke();
 g.fillStyle='rgba(255,255,255,.95)';g.beginPath();g.arc(-52,0,18,0,7);g.fill();fortIcon(-52,9,.5,c);
 txt('BARRIO '+(L+1),-28,-9,10,'rgba(255,255,255,.92)',900,'left','N');g.font='700 15px F';const w=g.measureText(nm).width;txt(nm,-28,8,w>92?15*92/w:15,'#fff',700,'left');
 if(T.locked){g.font='900 10px N';const tw=g.measureText('PRÓXIMAMENTE').width+16;g.fillStyle='#22324F';rr(-tw/2,32,tw,16,8);g.fill();txt('PRÓXIMAMENTE',0,40.5,10,'#fff',900,'center','N');}
 g.restore();}
function buildPrz(){return [{id:'home',home:1,d:.6,k:'home'},...(CFG.prizes||[...Array(10)].map((_,i)=>({id:i,n:i+1,d:3*i+3,done:i<2,cur:i===2})))].map(p=>Object.assign({k:'num'},p));}
function loadSavy(){if(!CFG.savy)return;SAVY_IMG=new Image();SAVY_IMG.onload=()=>{tinyC=null;};SAVY_IMG.src=CFG.savy;}
function boot2(){TRX=CFG.tr||{};TODAY=CFG.today??1;span=14;MODE='big';const N=Math.max(1,(CFG.lv||[]).length);
 LVd=[BLEVELS[0],...[...Array(N-1)].map((_,i)=>({n:CFG.lv[i+1],c:(CFG.col||[])[i+1]||'#B9B2A8',locked:1,gr:['#F6EFE8','#F6EFE8'],rc:{edge:'#E6DCD2',base:'#F4EEE8',stripe:'#FBF8F4',dot:'#E6DCD2'}}))];
 BRIDGES=[];PRZ=buildPrz();loadSavy();genAll();fixSigns();layoutPrizes();document.getElementById('hoy').textContent='Savy';bodyBg();resize();centerToday();addEventListener('resize',()=>{if(boxW()>20&&boxH()>20)fixSize();});requestAnimationFrame(frame);}
// la app actualiza sin recargar (objetivo hecho, ropa nueva…): nada de pantalla de carga al volver a Barrios
window.BAR_UPDATE=o=>{if(!booted)return;Object.assign(CFG,o||{});TODAY=CFG.today??TODAY;PRZ=buildPrz();layoutPrizes();STC.clear();if(o&&o.savy)loadSavy();tinyC=null;};
// si ya había arrancado (con datos de ejemplo o viejos), se reconstruye con los de la app (nunca se queda con 1 solo barrio)
function barRebuild(){const N=Math.max(1,(CFG.lv||[]).length);LVd=[BLEVELS[0],...[...Array(N-1)].map((_,i)=>({n:CFG.lv[i+1],c:(CFG.col||[])[i+1]||'#B9B2A8',locked:1,gr:['#F6EFE8','#F6EFE8'],rc:{edge:'#E6DCD2',base:'#F4EEE8',stripe:'#FBF8F4',dot:'#E6DCD2'}}))];
 TODAY=CFG.today??TODAY;PRZ=buildPrz();loadSavy();genAll();fixSigns();layoutPrizes();TILES.clear();SPC.clear();STC.clear();tinyC=null;centerToday();}
window.CAM_INIT=o=>{if(booted){CFG=Object.assign({},o||{});barRebuild();send('ready');return;}CFG=Object.assign({},o||{});go();};
function fixSigns(){SIGNS.forEach(q=>{q[0]=Math.max(84,Math.min(W-84,q[0]));});} // el cartel entero dentro de la pantalla
