import type {AnimState} from './game';

const wrongStates=new Set<AnimState>(['wrong_start','pie_hit','cream_splash','reaction']);

export function StudentCharacter({state}:{state:AnimState}){
 const isWrong=wrongStates.has(state);
 const src=state==='correct'?'/student/video/victory.webm':isWrong?'/student/video/wrong.webm':'/student/video/idle.webm';
 return <div className={`stage student-stage state-${state}`} aria-label={`حالة شخصية الطالب: ${state}`}>
  <div className="success">✓</div><div className="stars">✦　✧　✦</div>
  <div className="character student-character">
   <video key={src} src={src} autoPlay muted playsInline loop={state==='idle'} preload="auto" aria-label="شخصية الطالب المتحركة"/>
  </div>
 </div>
}
