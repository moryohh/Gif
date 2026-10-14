import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import type {AnimState} from './game';

type Controller={setState:(s:AnimState)=>void;destroy:()=>void};
type Particle={m:THREE.Mesh;v:THREE.Vector3;spin:THREE.Vector3;life:number};
const clamp=(n:number,a=0,b=1)=>Math.min(b,Math.max(a,n));
const smooth=(n:number)=>{n=clamp(n);return n*n*(3-2*n)};
const outBack=(n:number)=>{const c=1.70158;return 1+(c+1)*Math.pow(n-1,3)+c*Math.pow(n-1,2)};

function makeController(host:HTMLDivElement):Controller{
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(30,420/340,.1,100);camera.position.set(0,.15,6);
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(420,340,false);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;host.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xffffff,0x7187a9,2.8));const key=new THREE.DirectionalLight(0xfff0d0,3.7);key.position.set(3,5,5);scene.add(key);const rim=new THREE.DirectionalLight(0x79cfff,2.2);rim.position.set(-4,2,-2);scene.add(rim);
 const root=new THREE.Group(),body=new THREE.Group(),actor=new THREE.Group();scene.add(root);root.add(body);body.add(actor);
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(.78,40),new THREE.MeshBasicMaterial({color:0x21405a,transparent:true,opacity:.13,depthWrite:false}));shadow.scale.y=.22;shadow.position.set(0,-1.56,-.25);scene.add(shadow);
 let parts:THREE.Object3D[]=[];let bases:{p:THREE.Vector3;r:THREE.Euler}[]=[];
 const cream=new THREE.Group();scene.add(cream);cream.visible=false;const creamMat=new THREE.MeshStandardMaterial({color:0xfffdf3,roughness:.72});
 [[0,0,0,.48],[-.38,.06,.04,.23],[.38,.04,.03,.25],[.04,.35,.02,.24],[-.12,-.34,.03,.2]].forEach(([x,y,z,s])=>{const m=new THREE.Mesh(new THREE.SphereGeometry(s,18,14),creamMat);m.position.set(x,y,z);m.scale.y=.72;cream.add(m)});cream.position.set(0,.68,1.05);
 const pie=new THREE.Group();scene.add(pie);const plate=new THREE.Mesh(new THREE.CylinderGeometry(.64,.64,.1,36),new THREE.MeshStandardMaterial({color:0xdde8ee,metalness:.2,roughness:.45}));plate.rotation.x=Math.PI/2;pie.add(plate);const filling=new THREE.Mesh(new THREE.SphereGeometry(.53,24,14,0,Math.PI*2,0,Math.PI/2),creamMat);filling.rotation.x=-Math.PI/2;filling.position.z=.08;pie.add(filling);const hand=new THREE.Mesh(new THREE.SphereGeometry(.23,16,12),new THREE.MeshStandardMaterial({color:0xf2a071,roughness:.8}));hand.scale.set(1.35,.8,.65);hand.position.x=-.72;pie.add(hand);const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.17,1.65,8,16),new THREE.MeshStandardMaterial({color:0xf2a071,roughness:.8}));arm.rotation.z=Math.PI/2;arm.position.x=-1.55;pie.add(arm);pie.visible=false;
 const particles:Particle[]=[];
 function burst(color=0xffffff,count=22,power=3){for(let i=0;i<count;i++){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(Math.random()*.065+.035,0),new THREE.MeshBasicMaterial({color,transparent:true}));m.position.copy(cream.position);scene.add(m);particles.push({m,v:new THREE.Vector3((Math.random()-.5)*power,(Math.random()*.75+.15)*power,(Math.random()-.3)*1.6),spin:new THREE.Vector3(Math.random()*8,Math.random()*8,Math.random()*8),life:1})}}
 new GLTFLoader().load('/elf/scene.gltf',g=>{const model=g.scene,box=new THREE.Box3().setFromObject(g.scene),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),scale=3.55/Math.max(size.x,size.y,size.z);model.scale.setScalar(scale);model.position.copy(center).multiplyScalar(-scale);actor.add(model);actor.rotation.y=-.08;model.traverse(o=>{if((o as THREE.Mesh).isMesh){parts.push(o);(o as THREE.Mesh).castShadow=true}});bases=parts.map(p=>({p:p.position.clone(),r:p.rotation.clone()}))});
 let state:AnimState='idle',changed=performance.now(),raf=0,last=performance.now(),impactDone=false;const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const setState=(s:AnimState)=>{state=s;changed=performance.now();impactDone=false;pie.visible=s==='wrong_start'||s==='pie_hit';cream.visible=s==='cream_splash'||s==='reaction';if(s==='cream_splash'){cream.scale.setScalar(.08);burst(0xffffff,34,3.5)}if(s==='correct')burst(0x54f0ae,30,2.8)};
 function resetPose(){root.position.set(0,-.15,0);root.rotation.set(0,0,0);body.position.set(0,0,0);body.rotation.set(0,0,0);body.scale.set(1,1,1);actor.position.set(0,0,0);actor.rotation.set(0,-.08,0);actor.scale.set(1,1,1);camera.position.x=0;camera.position.y=.15;camera.rotation.z=0;}
 function frame(now:number){raf=requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.04);last=now;const t=now/1000,p=reduce?10:(now-changed)/1000;resetPose();
  const breath=Math.sin(t*2.15),sway=Math.sin(t*.92);root.position.y+=breath*.025;body.scale.set(1-breath*.006,1+breath*.009,1);body.rotation.z=sway*.014;actor.rotation.y=-.08+Math.sin(t*.66)*.035;
  parts.forEach((o,i)=>{const b=bases[i];if(!b)return;const lag=Math.sin(t*(1.05+i*.045)+i*.72);o.position.y=b.p.y+lag*.004;o.rotation.y=b.r.y+lag*.006;o.rotation.z=b.r.z+Math.sin(t*.78+i)*.004});
  if(state==='correct'){
   if(p<.16){const q=smooth(p/.16);body.position.y-=q*.13;body.scale.set(1+q*.05,1-q*.08,1)}
   else if(p<.52){const q=clamp((p-.16)/.36);root.position.y+=Math.sin(q*Math.PI)*.52;body.scale.set(1-q*.035,1+q*.055,1);body.rotation.z=-Math.sin(q*Math.PI)*.11;actor.rotation.y=-.08+Math.sin(q*Math.PI)*.4}
   else if(p<.78){const q=clamp((p-.52)/.26);root.position.y+=.1*(1-q);body.position.y-=Math.sin(q*Math.PI)*.07;body.rotation.z=.1*(1-q);body.scale.set(1+Math.sin(q*Math.PI)*.1,1-Math.sin(q*Math.PI)*.08,1)}
   else {const q=clamp((p-.78)/.28),r=Math.exp(-q*4)*Math.sin(q*16);body.position.y+=r*.035;body.scale.set(1-r*.025,1+r*.025,1)}
  }
  if(state==='wrong_start'){
   const q=smooth(p/.26);body.position.x=.06*q;body.rotation.z=.055*q;actor.rotation.y=-.08-.18*q;body.scale.set(1-q*.025,1+q*.025,1);pie.position.set(-2.8+outBack(q)*1.55,.48+Math.sin(q*Math.PI)*.08,1.2);pie.rotation.z=-.22+.18*q;
  } else if(state==='pie_hit'){
   const q=clamp(p/.33),hit=smooth(q/.34),recoil=smooth((q-.34)/.66);pie.position.set(-1.25+hit*1.23-recoil*.12,.52+Math.sin(hit*Math.PI)*.04,1.18);pie.rotation.z=-.05+hit*.12;root.position.x=hit*.31-recoil*.1;body.rotation.z=-hit*.22+recoil*.09;body.rotation.y=-hit*.2;body.scale.set(1+hit*.1,1-hit*.12,1);actor.position.y=hit*.04;camera.position.x=Math.sin(p*75)*.025*(1-recoil);camera.rotation.z=Math.sin(p*62)*.008*(1-recoil);if(!impactDone&&q>.28){impactDone=true;burst(0xffffff,18,2.7)}
  } else {pie.position.set(-2.8,.48,1.2);pie.rotation.z=-.22}
  if(state==='cream_splash'){
   const q=clamp(p/.48),w=(1-q)*Math.sin(q*36);cream.scale.setScalar(outBack(clamp(q*1.8)));root.position.x=w*.12;body.rotation.z=w*.1;body.scale.set(1+w*.035,1-w*.045,1);camera.position.x=w*.025;
  }
  if(state==='reaction'){
   const enter=smooth(p/.22),bob=Math.sin(t*4.2)*.018;cream.scale.setScalar(1);cream.position.y=.68-Math.min(p*.035,.15);body.position.y=-.09*enter+bob;body.rotation.z=.035*enter+Math.sin(t*2.2)*.012;actor.rotation.y=-.08+.1*enter;body.scale.set(1.025,.975,1);
  } else cream.position.y=.68;
  shadow.scale.set(.78*(1-root.position.y*.18),.22*(1-root.position.y*.18),1);(shadow.material as THREE.MeshBasicMaterial).opacity=.13-root.position.y*.035;
  particles.forEach((x,i)=>{x.life-=dt*1.3;x.v.y-=dt*2.1;x.m.position.addScaledVector(x.v,dt);x.m.rotation.x+=x.spin.x*dt;x.m.rotation.y+=x.spin.y*dt;x.m.scale.setScalar(Math.max(x.life,0));(x.m.material as THREE.MeshBasicMaterial).opacity=clamp(x.life*1.5);if(x.life<=0){scene.remove(x.m);x.m.geometry.dispose();(x.m.material as THREE.Material).dispose();particles.splice(i,1)}});renderer.render(scene,camera)}raf=requestAnimationFrame(frame);
 const ro=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()});ro.observe(host);
 return{setState,destroy:()=>{cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();renderer.domElement.remove();scene.traverse(o=>{const m=o as THREE.Mesh;if(m.geometry)m.geometry.dispose();if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>x.dispose())})}}
}
export function CharacterStage({state}:{state:AnimState}){const host=useRef<HTMLDivElement>(null),control=useRef<Controller|null>(null);useEffect(()=>{if(!host.current)return;control.current=makeController(host.current);return()=>{control.current?.destroy();control.current=null}},[]);useEffect(()=>control.current?.setState(state),[state]);return <div className="phaser-stage elf-stage" ref={host} aria-label={`حالة الشخصية: ${state}`}/>}
