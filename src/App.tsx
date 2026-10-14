import {useEffect,useRef,useState} from 'react';
import {Volume2,VolumeX,RotateCcw} from 'lucide-react';
import {CharacterStage} from './CharacterStage'; import {questions,WRONG_TIMELINE,type AnimState} from './game'; import {useSound} from './useSound';
export function App(){
 const [index,setIndex]=useState(0),[score,setScore]=useState(0),[state,setState]=useState<AnimState>('idle'),[locked,setLocked]=useState(false),[feedback,setFeedback]=useState('اختر إجابتك'),[finished,setFinished]=useState(false); const timers=useRef<number[]>([]); const {muted,setMuted,play}=useSound(); const q=questions[index];
 const clear=()=>{timers.current.forEach(clearTimeout);timers.current=[]}; useEffect(()=>clear,[]); useEffect(()=>{const h=()=>document.hidden&&clear();document.addEventListener('visibilitychange',h);return()=>document.removeEventListener('visibilitychange',h)},[]);
 const later=(fn:()=>void,ms:number)=>timers.current.push(window.setTimeout(fn,ms));
 function next(){if(index===questions.length-1){setFinished(true);setLocked(false);setState('idle')}else{setIndex(i=>i+1);setLocked(false);setState('idle');setFeedback('اختر إجابتك')}}
 function answer(value:boolean){if(locked||finished)return;setLocked(true); const ok=value===q.answer;setFeedback(q.fact);if(ok){setScore(s=>s+1);setState('correct');play('correct');later(next,1150)}else{let t=0;WRONG_TIMELINE.forEach(([s,d],i)=>{t+=d;later(()=>{setState(s);if(i===1)play('hit')},t)});later(next,t+650)}}
 function restart(){clear();setIndex(0);setScore(0);setState('idle');setLocked(false);setFeedback('اختر إجابتك');setFinished(false)}
 return <main dir="rtl"><header><div><small>تحدّي المعرفة</small><h1>صح أم خطأ؟</h1></div><button className="icon" onClick={()=>setMuted(!muted)} aria-label={muted?'تشغيل الصوت':'كتم الصوت'}>{muted?<VolumeX/>:<Volume2/>}</button></header>
 <section className="game"><div className="progress"><span>السؤال {index+1} من {questions.length}</span><span>النقاط {score}</span></div><div className="bar"><i style={{width:`${((index+(finished?1:0))/questions.length)*100}%`}}/></div>
 <CharacterStage state={state}/><div className="card">{finished?<><h2>أحسنت!</h2><p>حصلت على {score} من {questions.length}</p><button className="restart" onClick={restart}><RotateCcw/> العب مجدداً</button></>:<><h2>{q.text}</h2><p className={locked?'visible':''}>{feedback}</p><div className="answers"><button disabled={locked} onClick={()=>answer(true)}>✓ صح</button><button disabled={locked} onClick={()=>answer(false)}>✕ خطأ</button></div></>}</div></section><footer>تعلّم، جرّب، وابتسم ✨</footer></main>}
