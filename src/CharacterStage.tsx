import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import type {AnimState} from './game';

type Controller={setState:(s:AnimState)=>void;destroy:()=>void};
function makeController(host:HTMLDivElement):Controller{
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(30,420/340,.1,100);camera.position.set(0,.15,6);
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(420,340,false);renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);
 scene.add(new THREE.HemisphereLight(0xffffff,0x7c8fad,2.7));const key=new THREE.DirectionalLight(0xfff0d0,3.5);key.position.set(3,5,5);scene.add(key);const rim=new THREE.DirectionalLight(0x79cfff,2);rim.position.set(-4,2,-2);scene.add(rim);
 const actor=new THREE.Group();scene.add(actor);let parts:THREE.Object3D[]=[];let bases:{p:THREE.Vector3;r:THREE.Euler}[]=[];
 const cream=new THREE.Group();scene.add(cream);cream.visible=false;const creamMat=new THREE.MeshStandardMaterial({color:0xfffdf3,roughness:.72});
 [[0,0,0,.48],[-.38,.06,.04,.23],[.38,.04,.03,.25],[.04,.35,.02,.24],[-.12,-.34,.03,.2]].forEach(([x,y,z,s])=>{const m=new THREE.Mesh(new THREE.SphereGeometry(s,18,14),creamMat);m.position.set(x,y,z);m.scale.y=.72;cream.add(m)});cream.position.set(0,.68,1.05);
 const pie=new THREE.Group();scene.add(pie);const plate=new THREE.Mesh(new THREE.CylinderGeometry(.64,.64,.1,36),new THREE.MeshStandardMaterial({color:0xdde8ee,metalness:.2,roughness:.45}));plate.rotation.x=Math.PI/2;pie.add(plate);const filling=new THREE.Mesh(new THREE.SphereGeometry(.53,24,14,0,Math.PI*2,0,Math.PI/2),creamMat);filling.rotation.x=-Math.PI/2;filling.position.z=.08;pie.add(filling);const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.17,1.65,8,16),new THREE.MeshStandardMaterial({color:0xf2a071}));arm.rotation.z=Math.PI/2;arm.position.x=-1.25;pie.add(arm);pie.visible=false;
 const particles:{m:THREE.Mesh;v:THREE.Vector3;life:number}[]=[];
 function burst(color=0xffffff,count=22){for(let i=0;i<count;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(Math.random()*.07+.035,8,6),new THREE.MeshBasicMaterial({color}));m.position.copy(cream.position);scene.add(m);particles.push({m,v:new THREE.Vector3((Math.random()-.5)*3,(Math.random()-.25)*3,Math.random()*1.5),life:1})}}
 new GLTFLoader().load('/elf/scene.gltf',g=>{const model=g.scene,box=new THREE.Box3().setFromObject(g.scene),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());model.position.sub(center);model.scale.setScalar(3.55/Math.max(size.x,size.y,size.z));actor.add(model);actor.rotation.y=-.08;model.traverse(o=>{if((o as THREE.Mesh).isMesh){parts.push(o);(o as THREE.Mesh).castShadow=true}});bases=parts.map(p=>({p:p.position.clone(),r:p.rotation.clone()}))});
 let state:AnimState='idle',changed=performance.now(),raf=0,last=performance.now();
 const setState=(s:AnimState)=>{state=s;changed=performance.now();pie.visible=s==='wrong_start'||s==='pie_hit';cream.visible=s==='cream_splash'||s==='reaction';if(s==='cream_splash'){cream.scale.setScalar(.2);burst(0xffffff,28)}if(s==='correct')burst(0x54f0ae,26)};
 function frame(now:number){raf=requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.04);last=now;const t=now/1000,p=(now-changed)/1000;actor.position.y=Math.sin(t*2.4)*.035-.15;actor.rotation.z=Math.sin(t*1.7)*.012;
  parts.forEach((o,i)=>{const b=bases[i];if(!b)return;o.position.y=b.p.y+Math.sin(t*(2+i*.13)+i)*.006;o.rotation.y=b.r.y+Math.sin(t*1.3+i)*.008});
  if(state==='correct'){actor.position.y=-.15+Math.abs(Math.sin(p*7))*Math.max(0,.42-p*.16);actor.rotation.y=Math.sin(p*8)*.15;parts.forEach((o,i)=>o.rotation.z=bases[i].r.z+Math.sin(p*10+i)*.025)}
  if(state==='wrong_start'){actor.scale.setScalar(1+Math.min(p/.22,1)*.055);pie.position.set(-2.4+Math.min(p/.28,1)*1.8,.45,1.2)}else if(state==='pie_hit'){const q=Math.min(p/.24,1);pie.position.set(-.6+q*.62,.55,1.18);actor.rotation.z=Math.sin(q*Math.PI)*-.19;actor.position.x=Math.sin(q*Math.PI)*.25}else{pie.position.x=-2.4;actor.position.x*=.82;actor.scale.lerp(new THREE.Vector3(1,1,1),.15)}
  if(state==='cream_splash'){cream.scale.lerp(new THREE.Vector3(1,1,1),.22);actor.rotation.z=Math.sin(p*38)*.08*Math.max(0,1-p)}if(state==='reaction'){actor.rotation.z=Math.sin(t*4)*.025;cream.position.y=.68-Math.min(p*.035,.16)}
  particles.forEach((x,i)=>{x.life-=dt*1.45;x.v.y-=dt*1.6;x.m.position.addScaledVector(x.v,dt);x.m.scale.setScalar(Math.max(x.life,0));if(x.life<=0){scene.remove(x.m);x.m.geometry.dispose();(x.m.material as THREE.Material).dispose();particles.splice(i,1)}});renderer.render(scene,camera)}raf=requestAnimationFrame(frame);
 const ro=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()});ro.observe(host);
 return{setState,destroy:()=>{cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();renderer.domElement.remove();scene.traverse(o=>{const m=o as THREE.Mesh;if(m.geometry)m.geometry.dispose();if(m.material)(Array.isArray(m.material)?m.material:[m.material]).forEach(x=>x.dispose())})}}
}
export function CharacterStage({state}:{state:AnimState}){const host=useRef<HTMLDivElement>(null),control=useRef<Controller|null>(null);useEffect(()=>{if(!host.current)return;control.current=makeController(host.current);return()=>{control.current?.destroy();control.current=null}},[]);useEffect(()=>control.current?.setState(state),[state]);return <div className="phaser-stage elf-stage" ref={host} aria-label={`حالة الشخصية: ${state}`}/>}
