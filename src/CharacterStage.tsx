import type {AnimState} from './game';
import {AnimeCharacter} from './AnimeCharacter';
import {StudentCharacter} from './StudentCharacter';
import {StudentTwoCharacter} from './StudentTwoCharacter';

export type CharacterVariant='anime'|'student'|'student2';

export function CharacterStage({state,variant}:{state:AnimState;variant:CharacterVariant}){
 if(variant==='anime')return <AnimeCharacter state={state}/>;
 if(variant==='student')return <StudentCharacter state={state}/>;
 return <StudentTwoCharacter state={state}/>;
}
