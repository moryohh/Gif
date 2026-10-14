import {useEffect,useRef} from 'react';
import Phaser from 'phaser';
import type {AnimState} from './game';

class QuizCharacterScene extends Phaser.Scene{
  actor!:Phaser.GameObjects.Container; head!:Phaser.GameObjects.Container; eyes!:Phaser.GameObjects.Container;
  mouth!:Phaser.GameObjects.Graphics; pie!:Phaser.GameObjects.Container; cream!:Phaser.GameObjects.Container;
  idle?:Phaser.Tweens.Tween;
  constructor(){super('quiz-character')}
  create(){
    const g=(fill:number,stroke=0x442719)=>{const x=this.add.graphics();x.fillStyle(fill);x.lineStyle(5,stroke);return x};
    const body=g(0xf7b928);body.fillRoundedRect(-76,-15,152,145,36);body.lineBetween(0,-8,0,118);
    const neck=g(0xef9c62);neck.fillRoundedRect(-26,-34,52,55,18);
    this.head=this.add.container(0,-92);
    const ears=g(0xf3a36b);ears.fillCircle(-77,4,22);ears.fillCircle(77,4,22);
    const face=g(0xf4aa70);face.fillEllipse(0,0,150,166);
    const hair=g(0x4b2b23);hair.fillEllipse(0,-65,144,52);hair.fillTriangle(-72,-56,-30,-84,-20,-38);hair.fillTriangle(-15,-78,25,-95,18,-43);hair.fillTriangle(28,-80,74,-65,48,-35);
    this.eyes=this.add.container(0,-12);
    for(const x of [-31,31]){const white=g(0xffffff,0x543128);white.fillEllipse(x,0,34,42);const pupil=g(0x352019,0x352019);pupil.fillCircle(x,2,8);this.eyes.add([white,pupil])}
    const brows=g(0x4b2b23,0x4b2b23);brows.lineStyle(7,0x4b2b23);brows.beginPath();brows.arc(-31,-27,18,3.5,5.8);brows.strokePath();brows.beginPath();brows.arc(31,-27,18,3.6,5.9);brows.strokePath();
    const nose=g(0xe78855);nose.fillCircle(0,16,7);
    this.mouth=g(0xffffff);this.drawMouth('idle');
    this.head.add([ears,face,hair,this.eyes,brows,nose,this.mouth]);
    const armL=g(0xf3a36b);armL.fillRoundedRect(-103,10,34,115,17);const armR=g(0xf3a36b);armR.fillRoundedRect(69,10,34,115,17);
    this.actor=this.add.container(210,292,[neck,body,armL,armR,this.head]).setScale(.95);
    this.cream=this.add.container(210,195).setAlpha(0);
    const blob=g(0xfffdf2,0xcbd9e2);blob.fillEllipse(0,0,115,96);blob.fillCircle(-48,-20,24);blob.fillCircle(48,-18,26);blob.fillCircle(5,-48,26);blob.fillRoundedRect(-14,35,25,58,12);this.cream.add(blob);
    this.pie=this.makePie(); this.pie.setVisible(false);
    this.startIdle();
  }
  drawMouth(kind:'idle'|'smile'|'shock'){
    this.mouth.clear();this.mouth.lineStyle(6,0x55251f,1);
    if(kind==='shock'){this.mouth.fillStyle(0x55251f);this.mouth.fillEllipse(0,46,28,36)}
    else{this.mouth.beginPath();this.mouth.arc(0,36,kind==='smile'?35:25,.15,3);this.mouth.strokePath()}
  }
  makePie(){
    const c=this.add.container(-120,190).setDepth(10); const arm=this.add.graphics().fillStyle(0xf3a36b).fillRoundedRect(-170,-18,165,42,20);
    const plate=this.add.graphics().fillStyle(0xd8e2e8).fillCircle(0,0,68).fillStyle(0xffffff).fillCircle(0,0,55);
    const hand=this.add.graphics().fillStyle(0xf3a36b).fillEllipse(-42,18,62,35);c.add([arm,plate,hand]);return c;
  }
  startIdle(){this.idle?.destroy();this.idle=this.tweens.add({targets:this.actor,y:286,angle:{from:-1,to:1},duration:1200,yoyo:true,repeat:-1,ease:'Sine.InOut'});this.time.addEvent({delay:2500,loop:true,callback:()=>this.tweens.add({targets:this.eyes,scaleY:.08,duration:70,yoyo:true})})}
  stop(){this.tweens.killAll();this.idle=undefined}
  play(state:AnimState){
    if(!this.actor)return;this.stop();
    if(state==='idle'){this.resetActor();this.startIdle();return}
    if(state==='correct'){
      this.resetActor();this.drawMouth('smile');
      this.tweens.add({targets:this.actor,y:238,scaleX:1.04,scaleY:1.04,duration:220,ease:'Back.Out',onComplete:()=>this.tweens.add({targets:this.actor,y:292,angle:0,scaleX:.95,scaleY:.95,duration:240,ease:'Bounce.Out'})});
      this.burst(210,110,[0x3de6a7,0xffd94d,0x58b6ff],18);return;
    }
    if(state==='wrong_start'){this.resetActor();this.drawMouth('shock');this.tweens.add({targets:this.head,scaleX:1.08,scaleY:1.08,y:-100,duration:180,ease:'Back.Out'});this.pie.setVisible(true).setPosition(-120,190);this.tweens.add({targets:this.pie,x:72,duration:250,ease:'Quad.Out'});return}
    if(state==='pie_hit'){
      this.pie.setVisible(true);this.pie.setPosition(95,190);this.tweens.add({targets:this.pie,x:205,duration:120,ease:'Expo.In'});
      this.tweens.add({targets:this.actor,x:238,angle:12,scaleX:.94,scaleY:1.02,duration:150,yoyo:true,ease:'Quad.Out'});this.cameras.main.shake(170,.012);return;
    }
    if(state==='cream_splash'){this.pie.setVisible(false);this.cream.setAlpha(1).setScale(.25);this.tweens.add({targets:this.cream,scale:1,duration:180,ease:'Back.Out'});this.burst(210,190,[0xffffff,0xfff7d7,0xdcefff],26);this.tweens.add({targets:this.actor,angle:{from:-7,to:7},duration:75,yoyo:true,repeat:3});return}
    if(state==='reaction'){this.pie.setVisible(false);this.cream.setAlpha(1).setScale(1);this.drawMouth('shock');this.tweens.add({targets:this.actor,y:300,angle:{from:-2,to:2},duration:650,yoyo:true,repeat:-1,ease:'Sine.InOut'});this.drip()}
  }
  resetActor(){this.actor.setPosition(210,292).setScale(.95).setAngle(0);this.head.setPosition(0,-92).setScale(1);this.eyes.setScale(1);this.pie.setVisible(false);this.cream.setAlpha(0);this.drawMouth('idle')}
  burst(x:number,y:number,colors:number[],count:number){for(let i=0;i<count;i++){const p=this.add.circle(x,y,Phaser.Math.Between(5,12),Phaser.Utils.Array.GetRandom(colors)).setDepth(20);const a=Phaser.Math.FloatBetween(-Math.PI,Math.PI),d=Phaser.Math.Between(70,155);this.tweens.add({targets:p,x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,scale:0,alpha:0,angle:Phaser.Math.Between(-180,180),duration:Phaser.Math.Between(420,720),ease:'Quad.Out',onComplete:()=>p.destroy()})}}
  drip(){const d=this.add.circle(214,232,9,0xffffff).setDepth(22);this.tweens.add({targets:d,y:325,scaleY:1.8,alpha:0,duration:800,ease:'Quad.In',onComplete:()=>d.destroy()})}
}

export function CharacterStage({state}:{state:AnimState}){
 const host=useRef<HTMLDivElement>(null),scene=useRef<QuizCharacterScene|null>(null);
 useEffect(()=>{if(!host.current)return;const s=new QuizCharacterScene();scene.current=s;const game=new Phaser.Game({type:Phaser.AUTO,parent:host.current,width:420,height:340,transparent:true,antialias:true,scene:s,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH}});return()=>{game.destroy(true);scene.current=null}},[]);
 useEffect(()=>{scene.current?.play(state)},[state]);
 return <div className="phaser-stage" ref={host} aria-label={`حالة الشخصية: ${state}`}/>;
}
