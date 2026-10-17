import {useEffect,useState} from 'react';
import type {AnimState} from './game';

export type AnimeIdleMode='front'|'right'|'left'|'shy';
const frameSets:Record<AnimeIdleMode,string[]>={
 front:Array.from({length:8},(_,i)=>`/anime-girl/idle/frame-${String(i+1).padStart(2,'0')}.webp`),
 right:Array.from({length:8},(_,i)=>`/anime-girl/look-right/frame-${String(i+1).padStart(2,'0')}.webp`),
 left:Array.from({length:8},(_,i)=>`/anime-girl/look-right/frame-${String(i+1).padStart(2,'0')}.webp`),
 shy:Array.from({length:8},(_,i)=>`/anime-girl/shy-smile/frame-${String(i+1).padStart(2,'0')}.webp`)
};
const timings=[520,150,150,110,120,150,190,620];

export function AnimeCharacter({state,mode}:{state:AnimState;mode:AnimeIdleMode}){
 const [frame,setFrame]=useState(0);
 const frames=frameSets[mode];
 useEffect(()=>{frames.forEach(src=>{const image=new Image();image.src=src})},[frames]);
 useEffect(()=>{
  setFrame(0);
  if(state!=='idle'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let index=0,timer=0,stopped=false;
  const advance=()=>{timer=window.setTimeout(()=>{if(stopped)return;index=(index+1)%frames.length;setFrame(index);advance()},timings[index])};
  advance();
  return()=>{stopped=true;clearTimeout(timer)};
 },[state,mode]);
 return <div className={`stage anime-stage state-${state}`} aria-label={`حالة الشخصية الثالثة: ${state}`}>
  <div className="success">✓</div><div className="stars">✦　✧　✦</div>
  <div className={`character anime-character ${mode==='left'?'mirror':''}`}><img src={frames[frame]} alt="فتاة أنمي كاملة الجسم" draggable={false}/><div className="cream-face"/></div>
  <div className="arm"><span className="hand"/><span className="plate"><b/></span></div>
  <div className="burst"/><div className="drops">{Array.from({length:9},(_,i)=><i key={i}/>)}</div>
 </div>
}
