import type {AnimState} from './game';
export function Character({state}:{state:AnimState}){return <div className={`stage state-${state}`} aria-label={`حالة الشخصية: ${state}`}>
 <div className="success">✓</div><div className="stars">✦　✧　✦</div>
 <div className="character"><img src="/character.png" alt="شخصية طالب كرتونية"/><div className="blink"/><div className="cream-face"><i/><i/><i/></div></div>
 <div className="arm"><span className="hand"/><span className="plate"><b/></span></div>
 <div className="burst"/><div className="drops">{Array.from({length:9},(_,i)=><i key={i}/>)}</div>
 </div>}
