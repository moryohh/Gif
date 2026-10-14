import {useCallback,useEffect,useRef,useState} from 'react';
export function useSound(){
 const [muted,setMuted]=useState(false); const ctx=useRef<AudioContext|null>(null);
 const play=useCallback((kind:'correct'|'hit')=>{if(muted)return; const C=window.AudioContext||(window as unknown as {webkitAudioContext:typeof AudioContext}).webkitAudioContext; if(!C)return; const c=ctx.current??(ctx.current=new C()); const o=c.createOscillator(),g=c.createGain(); o.connect(g);g.connect(c.destination); const now=c.currentTime; if(kind==='correct'){o.type='sine';o.frequency.setValueAtTime(520,now);o.frequency.exponentialRampToValueAtTime(880,now+.18)}else{o.type='square';o.frequency.setValueAtTime(150,now);o.frequency.exponentialRampToValueAtTime(60,now+.12)}g.gain.setValueAtTime(.09,now);g.gain.exponentialRampToValueAtTime(.001,now+.22);o.start(now);o.stop(now+.23)},[muted]);
 useEffect(()=>()=>{ctx.current?.close()},[]); return{muted,setMuted,play};
}
