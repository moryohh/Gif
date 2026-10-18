import type {AnimState} from './game';

const wrongStates=new Set<AnimState>(['wrong_start','pie_hit','cream_splash','reaction']);

export function StudentTwoCharacter({state}:{state:AnimState}){
 const isWrong=wrongStates.has(state);
 const src=state==='correct'?'/student2/video/victory.webm':isWrong?'/student2/video/wrong.webm':'/student2/video/idle.webm';
 return <div className={`stage student-stage student-two-stage state-${state}`} aria-label={`حالة شخصية الطالب الثاني: ${state}`}>
  <div className="success">✓</div><div className="stars">✦　✧　✦</div>
  <div className="character student-character">
   <video key={src} src={src} autoPlay muted playsInline loop={state==='idle'} preload="auto" aria-label="شخصية الطالب الثاني المتحركة"/>
  </div>
 </div>
}
