import {useEffect,useState} from 'react';
import type {AnimState} from './game';

export type AnimeIdleMode='auto'|'front'|'right'|'left'|'shy';
type ClipName=Exclude<AnimeIdleMode,'auto'>;
type Frame={src:string;duration:number;mirror?:boolean};
const path=(folder:string,n:number)=>`/anime-girl/${folder}/frame-${String(n).padStart(2,'0')}.webp`;
const f=(folder:string,n:number,duration=125,mirror=false):Frame=>({src:path(folder,n),duration,mirror});
const mirrored=(frames:Frame[])=>frames.map(x=>({...x,mirror:true}));

const front:Frame[]=[
 f('idle',1,380),
 f('breathing',1,150),f('breathing',2,150),f('breathing',3,220),
 f('breathing',4,150),f('breathing',5,150),f('breathing',6,340),
 f('idle',4,90),f('idle',5,100),f('idle',6,120),
 f('idle-extra',1),f('idle-extra',2,210),f('idle-extra',3),
 f('idle-extra',2),f('idle-extra',1),f('idle',1,460)
];
const rightCore:Frame[]=[f('idle',1,300),f('look-transition',1),f('look-transition',2),f('look-transition',3),...Array.from({length:8},(_,i)=>f('look-right',i+1,i===0||i===7?280:120)),f('look-right',8),f('look-right',7),f('look-right',6),f('look-right',5,100),f('look-right',4),f('look-right',3),f('look-right',2),f('look-right',1,220),f('look-transition',3),f('look-transition',2),f('look-transition',1),f('idle',1,380)];
const shy:Frame[]=[f('shy-smile',1,300),f('shy-smile',2),f('shy-smile',3),f('shy-smile',4,100),f('shy-smile',5,110),f('shy-smile',6),f('shy-transition',1),f('shy-transition',2),f('shy-transition',3),f('shy-smile',7,220),f('shy-smile',5,90),f('shy-smile',7,260),f('shy-transition',3),f('shy-transition',2),f('shy-transition',1),f('shy-smile',6),f('shy-smile',4,90),f('shy-smile',5,90),f('shy-smile',6),f('shy-smile',8),f('shy-smile',1,420)];
const clips:Record<ClipName,Frame[]>={front,right:rightCore,left:mirrored(rightCore),shy};
const allFrames=[...new Set(Object.values(clips).flat().map(x=>x.src))];

export function AnimeCharacter({state,mode}:{state:AnimState;mode:AnimeIdleMode}){
 const [shown,setShown]=useState<Frame>(front[0]);
 useEffect(()=>{allFrames.forEach(src=>{const image=new Image();image.src=src})},[]);
 useEffect(()=>{
  if(state!=='idle'||matchMedia('(prefers-reduced-motion: reduce)').matches){setShown(front[0]);return}
  let stopped=false,timer=0,index=0,current:ClipName=mode==='auto'?'front':mode;
  const choose=()=>{const choices=(['front','right','left','shy'] as ClipName[]).filter(x=>x!==current);current=choices[Math.floor(Math.random()*choices.length)]};
  const advance=()=>{const sequence=clips[current],frame=sequence[index];setShown(frame);timer=window.setTimeout(()=>{if(stopped)return;index++;if(index>=sequence.length){index=0;if(mode==='auto')choose()}advance()},frame.duration+(mode==='auto'&&index===sequence.length-1?900+Math.random()*1700:0))};
  advance();return()=>{stopped=true;clearTimeout(timer)};
 },[state,mode]);
 return <div className={`stage anime-stage state-${state}`} aria-label={`حالة الشخصية الثالثة: ${state}`}>
  <div className="success">✓</div><div className="stars">✦　✧　✦</div>
  <div className={`character anime-character ${shown.mirror?'mirror':''}`}><img src={shown.src} alt="فتاة أنمي كاملة الجسم" draggable={false}/><div className="cream-face"/></div>
  <div className="arm"><span className="hand"/><span className="plate"><b/></span></div>
  <div className="burst"/><div className="drops">{Array.from({length:9},(_,i)=><i key={i}/>)}</div>
 </div>
}
