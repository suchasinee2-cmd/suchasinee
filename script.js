const $=id=>document.getElementById(id);
const isTouch=matchMedia('(pointer:coarse)').matches;
const R=new THREE.WebGLRenderer({antialias:true,alpha:true});R.setPixelRatio(Math.min(devicePixelRatio,2));R.setSize(innerWidth,innerHeight);R.domElement.className='main';document.body.prepend(R.domElement);
const SKY=new THREE.Color(0x9bd7f5),S=new THREE.Scene();S.background=SKY;S.fog=new THREE.Fog(0x9bd7f5,45,130);
const cam=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,300);
S.add(new THREE.HemisphereLight(0xffffff,0x7bbf6a,.95));const sun=new THREE.DirectionalLight(0xfff2cc,.8);sun.position.set(30,50,20);S.add(sun);
const world=new THREE.Group();S.add(world);
const M={},mat=c=>M[c]||(M[c]=new THREE.MeshLambertMaterial({color:c,flatShading:true}));
const box=(w,h,d,c)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));
const sph=(r,c)=>new THREE.Mesh(new THREE.SphereGeometry(r,10,8),mat(c));
const cone=(r,h,c,s=8)=>new THREE.Mesh(new THREE.ConeGeometry(r,h,s),mat(c));
const cyl=(r,h,c)=>new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,8),mat(c));
const put=(o,m,x,y,z)=>{m.position.set(x,y,z);o.add(m);return m};
const flat=(w,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat(c));m.rotation.x=-Math.PI/2;return put(world,m,x,y,z)};

/* ---- World ---- */
flat(300,300,'#6cc66b',0,0,0);flat(58,58,'#7ad56f',0,.01,0);
flat(3,58,'#ecd9a6',9.5,.02,0);flat(3,58,'#ecd9a6',-9.5,.02,0);flat(58,3,'#ecd9a6',0,.02,9.5);flat(58,3,'#ecd9a6',0,.02,-9.5);
function fence(x1,z1,x2,z2,h,c){const L=Math.hypot(x2-x1,z2-z1),a=Math.atan2(x2-x1,z2-z1),n=Math.round(L/2);
 for(let i=0;i<=n;i++)put(world,box(.25,h,.25,c),x1+(x2-x1)*i/n,h/2,z1+(z2-z1)*i/n);
 for(const y of[h*.4,h*.85])put(world,box(.1,.12,L,c),(x1+x2)/2,y,(z1+z2)/2).rotation.y=a}
const B=28.5;[[-B,-B,B,-B],[B,-B,B,B],[B,B,-B,B],[-B,B,-B,-B]].forEach(f=>fence(...f,1.6,'#b5733a'));
// pond & mountain
const pond=new THREE.Mesh(new THREE.CircleGeometry(3.5,24),new THREE.MeshLambertMaterial({color:0x4fb8ff}));pond.rotation.x=-Math.PI/2;put(world,pond,3.5,.05,3.5);
for(let i=0;i<10;i++){const a=i/10*6.28;put(world,sph(.35,'#9aa0a6'),3.5+Math.cos(a)*3.6,.15,3.5+Math.sin(a)*3.6)}
put(world,cone(4.2,5.5,'#8d9a8b',7),-3.5,2.75,-3.5);put(world,cone(1.5,1.8,'#fff',7),-3.5,5.1,-3.5);

/* ---- Obstacles ---- */
const RECT=[],CIRC=[{x:3.5,z:3.5,r:3.7},{x:-3.5,z:-3.5,r:4}];

/* ---- Animals ---- */
function build(d){const g=new THREE.Group(),legs=[],lt=Math.max(.12,d.bw*.22);
 put(g,box(d.bw,d.bh,d.bl,d.c),0,d.lh+d.bh/2,0);
 [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sz])=>{const p=new THREE.Group();p.position.set(sx*d.bw*.32,d.lh,sz*(d.bl/2-lt));put(p,box(lt,d.lh,lt,d.lc||d.c),0,-d.lh/2,0);g.add(p);legs.push(p)});
 const ng=new THREE.Group();ng.position.set(0,d.lh+d.bh*.4,d.bl/2);
 if(d.nl>.3)put(ng,box(lt*1.2,d.nl,lt*1.2,d.c),0,d.nl/2,0);
 put(ng,sph(d.hr,d.hc||d.c),0,d.nl,d.hr*.5);put(ng,box(d.hr*.9,d.hr*.7,d.hr,d.sc||d.c),0,d.nl-d.hr*.2,d.hr*1.3);
 for(const s of[-1,1])put(ng,sph(d.hr*.12,'#111'),s*d.hr*.5,d.nl+d.hr*.3,d.hr*.95);
 ng.rotation.x=.35;g.add(ng);d.ex&&d.ex(g,ng,d);return{g,legs,ng}}
function flamingo(){const g=new THREE.Group(),legs=[],c='#ff7aa8';
 put(g,sph(.4,c),0,1.15,0).scale.set(.8,.8,1.4);
 for(const s of[-1,1]){const p=new THREE.Group();p.position.set(s*.15,1,0);put(p,box(.06,1,.06,'#ff5d93'),0,-.5,0);g.add(p);legs.push(p)}
 const ng=new THREE.Group();ng.position.set(0,1.3,.45);put(ng,box(.1,1.1,.1,c),0,.55,0);put(ng,sph(.16,c),0,1.15,.05);put(ng,box(.08,.08,.32,'#222'),0,1.12,.3);
 for(const s of[-1,1])put(ng,sph(.03,'#000'),s*.1,1.2,.15);ng.rotation.x=.2;g.add(ng);return{g,legs,ng}}
const D=[
{n:'สิงโต',e:'🦁',x:-19,z:-19,gc:'#e6d28a',c:'#e8b04a',bw:1,bh:.9,bl:1.8,lh:.7,nl:.25,hr:.42,sp:1.6,snd:['sawtooth',160,60,1.1],
 i:'แมวใหญ่ที่ตัวผู้มีแผงคอสง่างาม อยู่รวมกันเป็นฝูงเรียกว่า "ไพรด์"',f:'เนื้อสัตว์ เช่น ม้าลาย วิลเดอบีสต์ และกวาง',h:'ทุ่งหญ้าสะวันนาในทวีปแอฟริกา',
 ex:(g,ng,d)=>{put(ng,sph(.68,'#9c5a1e'),0,d.nl,-.1);put(g,box(.12,.12,.8,d.c),0,1.1,-1.2).rotation.x=.5;put(g,sph(.16,'#9c5a1e'),0,.85,-1.55)}},
{n:'ช้าง',e:'🐘',x:0,z:-20,gc:'#d9c690',c:'#9aa4b2',bw:2,bh:2,bl:3,lh:1.3,nl:.5,hr:.85,sp:1.1,snd:['sawtooth',300,650,.9],
 i:'สัตว์บกที่ใหญ่ที่สุด มีงวงยาวและหูใหญ่ ฉลาดและมีความจำดีเยี่ยม',f:'หญ้า ใบไม้ เปลือกไม้ และผลไม้ กินได้วันละหลายร้อยกิโลกรัม',h:'ป่าและทุ่งหญ้าในแอฟริกาและเอเชีย รวมถึงประเทศไทย',
 ex:(g,ng,d)=>{put(ng,box(.35,.35,1.6,d.c),0,d.nl-.6,d.hr+.8).rotation.x=.5;for(const s of[-1,1]){put(ng,box(.12,1.1,1.1,'#b3a0ac'),s*.95,d.nl,-.1);put(ng,box(.1,.1,.8,'#fff'),s*.4,d.nl-.5,d.hr+.9)}}},
{n:'ยีราฟ',e:'🦒',x:19,z:-19,gc:'#cfd98a',c:'#f2c14e',bw:.9,bh:.9,bl:1.8,lh:2.3,nl:2.4,hr:.38,sp:1.3,eat:.95,snd:['sine',260,180,.9],
 i:'สัตว์ที่สูงที่สุดในโลก คอยาวมาก มีลายจุดสีน้ำตาลและลิ้นยาวมาก',f:'ใบอะคาเซียและยอดอ่อนของต้นไม้',h:'ทุ่งหญ้าสะวันนาและป่าโปร่งในแอฟริกา',
 ex:(g,ng,d)=>{for(const s of[-1,1]){put(ng,cyl(.05,.3,'#a0642a'),s*.15,d.nl+.45,0);put(g,box(.3,.3,.3,'#a0642a'),s*.46,3,s*.3);put(g,box(.3,.3,.3,'#a0642a'),s*.46,2.8,-s*.5)}}},
{n:'ม้าลาย',e:'🦓',x:-19,z:0,gc:'#d6d99a',c:'#fafafa',bw:.9,bh:1,bl:1.8,lh:1.1,nl:.7,hr:.38,sp:2,snd:['square',520,280,.35],
 i:'ม้าลายมีลายขาวดำเฉพาะตัวเหมือนลายนิ้วมือ อยู่เป็นฝูงและวิ่งเร็ว',f:'หญ้า ใบไม้ และเปลือกไม้อ่อน',h:'ทุ่งหญ้าในแอฟริกาตะวันออกและตอนใต้',
 ex:(g,ng,d)=>{for(let i=-3;i<=3;i++)put(g,box(.92,1.02,.1,'#222'),0,1.6,i*.24);put(ng,box(.08,.5,.12,'#222'),0,d.nl+.1,-.2)}},
{n:'ลิง',e:'🐒',x:19,z:0,gc:'#9fd88a',c:'#9b6a3c',sc:'#f1c9a0',bw:.55,bh:.7,bl:.5,lh:.5,nl:.2,hr:.3,sp:2.4,rep:1,snd:['square',900,1500,.14],
 i:'ฉลาดและคล่องแคล่ว ปีนป่ายเก่ง มีหางยาว อยู่รวมกันเป็นกลุ่ม',f:'ผลไม้ ใบไม้ แมลง และไข่นก',h:'ป่าเขตร้อนในเอเชียและแอฟริกา',
 ex:(g,ng,d)=>{put(g,box(.1,.1,.9,d.c),0,1.05,-.65).rotation.x=-.8;for(const s of[-1,1])put(ng,sph(.1,d.sc),s*.3,d.nl+.05,.05)}},
{n:'หมี',e:'🐻',x:-19,z:19,gc:'#8cc07a',c:'#6b4226',sc:'#caa27a',bw:1.3,bh:1.2,bl:2,lh:.7,nl:.3,hr:.5,sp:1.2,snd:['sawtooth',110,55,1],
 i:'ตัวใหญ่ขนหนา เดินด้วยฝ่าเท้า ดมกลิ่นได้ดีมาก บางชนิดจำศีลในฤดูหนาว',f:'ทั้งพืชและสัตว์ เช่น ผลไม้ น้ำผึ้ง และปลา',h:'ป่าและภูเขาตั้งแต่เขตหนาวถึงเขตร้อน',
 ex:(g,ng,d)=>{for(const s of[-1,1])put(ng,sph(.18,d.c),s*.38,d.nl+.45,0)}},
{n:'กระต่าย',e:'🐰',x:0,z:20,gc:'#a8e08c',c:'#f5f0e8',sc:'#ffc0cb',bw:.45,bh:.4,bl:.7,lh:.22,nl:.1,hr:.22,sp:2.6,snd:['sine',1100,1600,.1],
 i:'หูยาว ขาหลังแข็งแรงกระโดดเก่ง ฟันหน้าโตขึ้นเรื่อย ๆ จึงต้องแทะอยู่เสมอ',f:'หญ้า ผักใบเขียว และแครอท',h:'ทุ่งหญ้า ป่าละเมาะ และโพรงดินทั่วโลก',
 ex:(g,ng,d)=>{for(const s of[-1,1])put(ng,box(.08,.45,.06,d.c),s*.1,d.nl+.45,-.05);put(g,sph(.12,'#fff'),0,.45,-.38)}},
{n:'ฟลามิงโก',e:'🦩',x:19,z:19,gc:'#a9e0e8',sp:1,mk:flamingo,eat:1.9,snd:['square',700,950,.3],
 i:'นกขายาว คอโค้ง ขนสีชมพูมาจากสารแคโรทีนอยด์ในอาหาร ยืนขาเดียวได้นาน',f:'กุ้งฝอย สาหร่าย และแพลงก์ตอน',h:'ทะเลสาบน้ำกร่อยและชายฝั่งในอเมริกา แอฟริกา และเอเชีย'}
];
const A=D.map(d=>{const o=d.mk?d.mk():build(d);const pen=flat(12,12,d.gc,d.x,.015,d.z);fence(d.x-6,d.z-6,d.x+6,d.z-6,1.1,'#e0b070');fence(d.x+6,d.z-6,d.x+6,d.z+6,1.1,'#e0b070');fence(d.x+6,d.z+6,d.x-6,d.z+6,1.1,'#e0b070');fence(d.x-6,d.z+6,d.x-6,d.z-6,1.1,'#e0b070');
 RECT.push({x:d.x,z:d.z,h:6.5});
 o.g.position.set(d.x+(Math.random()*4-2),0,d.z+(Math.random()*4-2));world.add(o.g);
 return{...o,d,cx:d.x,cz:d.z,ph:Math.random()*6,st:'idle',t:Math.random()*2,tx:d.x,tz:d.z}});

/* ---- Trees & flowers ---- */
function free(x,z,m=2){if(Math.abs(x)<10&&Math.abs(z)<10)return false;if(Math.abs(Math.abs(x)-9.5)<2.5||Math.abs(Math.abs(z)-9.5)<2.5)return false;return!RECT.some(r=>Math.abs(x-r.x)<6+m&&Math.abs(z-r.z)<6+m)}
let tn=0;while(tn<26){const x=Math.random()*54-27,z=Math.random()*54-27;if(!free(x,z))continue;tn++;
 const t=new THREE.Group();put(t,cyl(.3,1.6,'#7a4f2b'),0,.8,0);put(t,cone(1.5,2.2,'#2e9e4f'),0,2.6,0);put(t,cone(1.1,1.8,'#3dbb63'),0,3.7,0);t.scale.setScalar(.8+Math.random()*.5);t.position.set(x,0,z);world.add(t);CIRC.push({x,z,r:.7})}
const fl=new THREE.InstancedMesh(new THREE.SphereGeometry(.18,6,5),new THREE.MeshLambertMaterial({color:0xffffff}),160),dm=new THREE.Object3D(),fc=['#ff6b9d','#ffd93d','#fff','#b388ff','#ff9f43'];
for(let i=0,n=0;n<160&&i<2000;i++){const x=Math.random()*56-28,z=Math.random()*56-28;if(!free(x,z,1))continue;dm.position.set(x,.2,z);dm.updateMatrix();fl.setMatrixAt(n,dm.matrix);fl.setColorAt(n,new THREE.Color(fc[n%5]));n++}
world.add(fl);

/* ---- Player ---- */
const P=new THREE.Group();P.legs=[];S.add(P);P.position.set(0,0,9.5);
put(P,cyl(.35,.8,'#ff5a5f'),0,.95,0);put(P,sph(.3,'#ffd6a5'),0,1.65,0);put(P,cyl(.33,.14,'#2b6cb0'),0,1.9,0);put(P,box(.3,.06,.25,'#2b6cb0'),0,1.86,.3);
for(const s of[-1,1]){const l=new THREE.Group();l.position.set(s*.15,.5,0);put(l,box(.2,.5,.2,'#355'),0,-.25,0);P.add(l);P.legs.push(l)}

/* ---- Audio ---- */
let AC;
function tone(t,f0,f1,dur,v=.12){if(!AC)return;const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime;o.type=t;o.frequency.setValueAtTime(f0,n);o.frequency.exponentialRampToValueAtTime(f1,n+dur);g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+dur);o.connect(g);g.connect(AC.destination);o.start();o.stop(n+dur)}
function chirp(){const f=2200+Math.random()*1500;tone('sine',f,f*1.4,.12,.03);setTimeout(()=>tone('sine',f*1.3,f*.9,.1,.03),140)}
function initAudio(){try{AC=new(window.AudioContext||window.webkitAudioContext)();const b=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 const n=AC.createBufferSource();n.buffer=b;n.loop=true;const f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=450;const g=AC.createGain();g.gain.value=.05;n.connect(f);f.connect(g);g.connect(AC.destination);n.start();
 (function bird(){chirp();setTimeout(bird,1500+Math.random()*4000)})()}catch(e){}}
function sound(a){tone(...a.d.snd);if(a.d.rep)setTimeout(()=>tone(...a.d.snd),220)}

/* ---- Input ---- */
const keys={};let yaw=0,pitch=.4,vy=0,run=false,jumpReq=false,near=null,hideCard=false,lastSnd=0,started=false,ar=null,arRoot,arM,arS=1,stream;
addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='Space'){jumpReq=true;e.preventDefault()}if(e.code==='KeyE'&&started)toggleCard()});
addEventListener('keyup',e=>keys[e.code]=false);
function toggleCard(){if(!near)return;hideCard=!hideCard;if(!hideCard)sound(near)}
function look(dx,dy){if(ar==='cam'){arRoot.rotation.y+=dx*.01;return}if(ar)return;yaw-=dx*.004;pitch=Math.max(.05,Math.min(1.3,pitch+dy*.004))}
const cv=R.domElement;let lookId=null,lx=0,ly=0;
cv.addEventListener('pointerdown',e=>{lookId=e.pointerId;lx=e.clientX;ly=e.clientY;if(e.pointerType==='mouse'&&started&&!ar)cv.requestPointerLock?.()});
addEventListener('pointermove',e=>{if(document.pointerLockElement){look(e.movementX,e.movementY)}else if(e.pointerId===lookId){look(e.clientX-lx,e.clientY-ly);lx=e.clientX;ly=e.clientY}});
addEventListener('pointerup',e=>{if(e.pointerId===lookId)lookId=null});
const jv={x:0,y:0},joy=$('joy'),knob=$('knob');let jid=null;
function jm(e){const r=joy.getBoundingClientRect(),dx=e.clientX-r.left-65,dy=e.clientY-r.top-65,l=Math.min(1,Math.hypot(dx,dy)/50),a=Math.atan2(dy,dx);jv.x=Math.cos(a)*l;jv.y=Math.sin(a)*l;knob.style.transform=`translate(${jv.x*35}px,${jv.y*35}px)`}
joy.addEventListener('pointerdown',e=>{jid=e.pointerId;joy.setPointerCapture(jid);jm(e)});
joy.addEventListener('pointermove',e=>{if(e.pointerId===jid)jm(e)});
const jend=e=>{if(e.pointerId===jid){jid=null;jv.x=jv.y=0;knob.style.transform=''}};joy.addEventListener('pointerup',jend);joy.addEventListener('pointercancel',jend);
$('bJ').onpointerdown=()=>jumpReq=true;$('bE').onpointerdown=toggleCard;$('bR').onpointerdown=e=>{run=!run;e.target.classList.toggle('on',run)};
if(isTouch){joy.style.display='block';$('acts').style.display='flex'}

/* ---- AR ---- */
async function enterAR(){
 const a=near||A.reduce((m,x)=>Math.hypot(P.position.x-x.cx,P.position.z-x.cz)<Math.hypot(P.position.x-m.cx,P.position.z-m.cz)?x:m);
 arM=a.g.clone(true);arM.position.set(0,0,0);arM.rotation.set(0,0,0);arM.updateMatrixWorld(true);
 const sz=new THREE.Vector3();new THREE.Box3().setFromObject(arM).getSize(sz);
 const mk=new THREE.Group();mk.add(arM);arRoot=new THREE.Group();arRoot.add(mk);arRoot.userData.base=1/Math.max(sz.x,sz.y,sz.z);arS=arRoot.userData.base;
 world.visible=P.visible=false;S.background=null;S.fog=null;S.add(arRoot);
 ['hint','card','map','arbtn','joy','acts'].forEach(i=>$(i).style.display='none');$('arui').style.display='flex';
 let ok=false;
 if(navigator.xr){try{if(await navigator.xr.isSessionSupported('immersive-ar')){R.xr.enabled=true;R.xr.setReferenceSpaceType('local');
  const s=await navigator.xr.requestSession('immersive-ar',{optionalFeatures:['dom-overlay'],domOverlay:{root:document.body}});await R.xr.setSession(s);arRoot.position.set(0,-.4,-1.5);arS*=.8;ar='xr';s.addEventListener('end',exitAR);ok=true}}catch(e){R.xr.enabled=false}}
 if(!ok){ar='cam';arRoot.position.set(0,0,0);arS*=1.8;try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});$('vid').srcObject=stream;$('vid').style.display='block'}catch(e){document.body.style.background='linear-gradient(#8fd6ff,#c4f0a4)'}}
}
function exitAR(){if(!ar)return;const was=ar;ar=null;if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}$('vid').style.display='none';document.body.style.background='';
 const s=R.xr.getSession&&R.xr.getSession();if(was==='xr'&&s){try{s.end()}catch(e){}}R.xr.enabled=false;
 S.remove(arRoot);world.visible=P.visible=true;S.background=SKY;S.fog=new THREE.Fog(0x9bd7f5,45,130);
 ['hint','map','arbtn'].forEach(i=>$(i).style.display='');if(isTouch){joy.style.display='block';$('acts').style.display='flex'}$('arui').style.display='none'}
$('arbtn').onclick=enterAR;$('aX').onclick=exitAR;
$('aL').onclick=()=>arRoot.rotation.y-=.4;$('aR').onclick=()=>arRoot.rotation.y+=.4;$('aP').onclick=()=>arS*=1.15;$('aM').onclick=()=>arS/=1.15;

/* ---- Loop ---- */
const mapC=$('map').getContext('2d'),clock=new THREE.Clock();
function collide(p){for(const r of RECT){const dx=p.x-r.x,dz=p.z-r.z,h=r.h+.4;if(Math.abs(dx)<h&&Math.abs(dz)<h){const ox=h-Math.abs(dx),oz=h-Math.abs(dz);if(ox<oz)p.x+=Math.sign(dx||1)*ox;else p.z+=Math.sign(dz||1)*oz}}
 for(const c of CIRC){const dx=p.x-c.x,dz=p.z-c.z,d=Math.hypot(dx,dz),m=c.r+.4;if(d<m){const k=(m-d)/(d||1);p.x+=dx*k||m;p.z+=dz*k}}
 p.x=Math.max(-27.8,Math.min(27.8,p.x));p.z=Math.max(-27.8,Math.min(27.8,p.z))}
function updAnimal(a,dt,T){
 a.t-=dt;if(a.t<=0){const r=Math.random();if(r<.5){a.st='walk';a.tx=a.cx+(Math.random()*2-1)*4.2;a.tz=a.cz+(Math.random()*2-1)*4.2;a.t=3+Math.random()*4}else if(r<.8){a.st='eat';a.t=2.5+Math.random()*2}else{a.st='idle';a.t=1.5+Math.random()*2}}
 const g=a.g;let mv=false;
 if(a.st==='walk'){const dx=a.tx-g.position.x,dz=a.tz-g.position.z,d=Math.hypot(dx,dz);if(d>.3){const s=a.d.sp*dt;g.position.x+=dx/d*s;g.position.z+=dz/d*s;let da=Math.atan2(dx,dz)-g.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));g.rotation.y+=da*Math.min(1,dt*4);mv=true}else a.t=0}
 a.ph+=mv?dt*a.d.sp*5:0;
 a.legs.forEach((l,i)=>l.rotation.x=mv?Math.sin(a.ph+(i==1||i==2?Math.PI:0))*.5:l.rotation.x*.8);
 g.position.y=mv?Math.abs(Math.sin(a.ph))*.05:0;
 const tg=a.st==='eat'?(a.d.eat||1.25):(a.d.mk?.2:.35);a.ng.rotation.x+=(tg-a.ng.rotation.x)*Math.min(1,dt*4);a.ng.rotation.y=a.st==='idle'?Math.sin(T*1.5+a.ph)*.4:0}
function frame(){
 const dt=Math.min(clock.getDelta(),.05),T=clock.elapsedTime;
 if(ar){arRoot.scale.setScalar(arS);if(ar==='cam'){cam.position.set(0,1.2,3.2);cam.lookAt(0,.5,0)}R.render(S,cam);return}
 A.forEach(a=>updAnimal(a,dt,T));
 if(started){
  let mx=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+jv.x,mz=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-jv.y;
  const l=Math.hypot(mx,mz),mv=l>.1,fast=keys.ShiftLeft||keys.ShiftRight||run;
  if(mv){if(l>1){mx/=l;mz/=l}const sp=fast?9:5,dx=-Math.sin(yaw)*mz+Math.cos(yaw)*mx,dz=-Math.cos(yaw)*mz-Math.sin(yaw)*mx;
   P.position.x+=dx*sp*dt;P.position.z+=dz*sp*dt;let da=Math.atan2(dx,dz)-P.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));P.rotation.y+=da*Math.min(1,dt*10)}
  collide(P.position);
  if(jumpReq&&P.position.y<=0){vy=7.5}jumpReq=false;vy-=20*dt;P.position.y=Math.max(0,P.position.y+vy*dt);if(P.position.y===0)vy=0;
  P.legs.forEach((l,i)=>l.rotation.x=mv?Math.sin(T*(fast?14:9)+i*Math.PI)*.8:0);
  // near animal
  let best=null,bd=9;A.forEach(a=>{const d=Math.hypot(P.position.x-a.cx,P.position.z-a.cz);if(d<bd){bd=d;best=a}});
  if(best!==near){near=best;hideCard=false;if(near){$('cE').textContent=near.d.e;$('cN').textContent=near.d.n;$('cI').innerHTML=`<b>ลักษณะทั่วไป</b><br>${near.d.i}<br><b>อาหารที่กิน</b><br>${near.d.f}<br><b>ถิ่นที่อยู่อาศัย</b><br>${near.d.h}`;if(T-lastSnd>3){sound(near);lastSnd=T}}
   $('hint').textContent=near?`ใกล้${near.d.n} — กด E เพื่อซ่อน/แสดงข้อมูล`:'WASD เดิน · Shift วิ่ง · Space กระโดด · E ข้อมูลสัตว์'}
  $('card').style.display=near&&!hideCard?'block':'none';
 }
 const D_=7,cp=Math.cos(pitch);cam.position.set(P.position.x+Math.sin(yaw)*cp*D_,Math.max(.6,P.position.y+1.4+Math.sin(pitch)*D_),P.position.z+Math.cos(yaw)*cp*D_);cam.lookAt(P.position.x,P.position.y+1.2,P.position.z);
 // minimap
 const s=130/60,X=x=>(x+30)*s;mapC.clearRect(0,0,130,130);mapC.fillStyle='#ecd9a6';[-9.5,9.5].forEach(v=>{mapC.fillRect(X(v)-4,0,8,130);mapC.fillRect(0,X(v)-4,130,8)});
 A.forEach(a=>{mapC.fillStyle=a.d.gc;mapC.fillRect(X(a.cx-6),X(a.cz-6),12*s,12*s);mapC.font='13px sans-serif';mapC.fillText(a.d.e,X(a.g.position.x)-7,X(a.g.position.z)+5)});
 mapC.fillStyle='#4fb8ff';mapC.beginPath();mapC.arc(X(3.5),X(3.5),3.5*s,0,6.3);mapC.fill();mapC.fillStyle='#8d9a8b';mapC.beginPath();mapC.arc(X(-3.5),X(-3.5),4*s,0,6.3);mapC.fill();
 mapC.save();mapC.translate(X(P.position.x),X(P.position.z));mapC.rotate(-P.rotation.y+Math.PI);mapC.fillStyle='#ff3b30';mapC.beginPath();mapC.moveTo(0,-6);mapC.lineTo(4,4);mapC.lineTo(-4,4);mapC.fill();mapC.restore();
 R.render(S,cam)}
R.setAnimationLoop(frame);
$('go').onclick=()=>{started=true;$('start').style.display='none';initAudio()};
addEventListener('resize',()=>{R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()});
