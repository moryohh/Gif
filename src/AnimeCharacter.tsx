import type {AnimState} from './game';

const wrongStates=new Set<AnimState>(['wrong_start','pie_hit','cream_splash','reaction']);

export function AnimeCharacter({state}:{state:AnimState}){
 const isWrong=wrongStates.has(state);
 const src=state==='correct'?'/anime-girl/video/victory.webm':isWrong?'/anime-girl/video/wrong.webm':'/anime-girl/video/idle.webm';
 return <div className={`stage anime-stage state-${state}`} aria-label={`حالة فتاة الأنمي: ${state}`}>
  <div className="success">✓</div><div className="stars">✦　✧　✦</div>
  <div className="character anime-character"><video key={src} src={src} autoPlay muted playsInline loop={state==='idle'} preload="auto" aria-label="فتاة الأنمي المتحركة"/></div>
 </div>
}
