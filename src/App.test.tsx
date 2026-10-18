import {render,screen,fireEvent,act} from '@testing-library/react'; import {describe,it,expect,vi} from 'vitest';
vi.mock('./CharacterStage',()=>({CharacterStage:()=> <div data-testid="character-stage"/>}));
import {App} from './App';
Object.defineProperty(window,'AudioContext',{value:undefined,writable:true});
describe('game',()=>{it('locks repeated answers and scores once',()=>{vi.useFakeTimers();render(<App/>);const yes=screen.getByRole('button',{name:/صح/});fireEvent.click(yes);fireEvent.click(yes);expect(screen.getByText('النقاط 1')).toBeInTheDocument();expect(yes).toBeDisabled();act(()=>vi.advanceTimersByTime(5200));expect(screen.getByText('السؤال 2 من 4')).toBeInTheDocument();vi.useRealTimers()});it('can mute audio',()=>{render(<App/>);fireEvent.click(screen.getByRole('button',{name:'كتم الصوت'}));expect(screen.getByRole('button',{name:'تشغيل الصوت'})).toBeInTheDocument()})});
