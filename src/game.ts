export type Question={id:number;text:string,answer:boolean,fact:string};
export const questions:Question[]=[
 {id:1,text:'الشمس نجم يقع في مركز النظام الشمسي.',answer:true,fact:'صحيح! تدور الأرض وبقية الكواكب حول الشمس.'},
 {id:2,text:'الماء يغلي عند 50° مئوية عند مستوى سطح البحر.',answer:false,fact:'خطأ؛ درجة الغليان تقارب 100° مئوية.'},
 {id:3,text:'للنحلة ست أرجل.',answer:true,fact:'صحيح! النحل من الحشرات، وللحشرات ست أرجل.'},
 {id:4,text:'القمر يصدر ضوءه الخاص.',answer:false,fact:'القمر يعكس ضوء الشمس ولا يصدر ضوءاً خاصاً.'}
];
export type AnimState='idle'|'correct'|'wrong_start'|'pie_hit'|'cream_splash'|'reaction';
export const WRONG_TIMELINE:[AnimState,number][]=[['wrong_start',260],['pie_hit',330],['cream_splash',480],['reaction',620]];
