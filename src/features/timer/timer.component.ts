import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'foc-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit {

  screens = {
    typeChooser: "typeChooser",
    timeSetter: "timeSetter",
    timeRunner: "timeRunner",
    timeUp: "timeUp"
  }

  timerTypes = {
    up: "up",
    down: "down"
  }

  timeSetterInitVal = {
    min: '01',
    sec: '00',
    tot: 60
  }

  minSetableTime = 5;

  timeSetterOrgVal: object;
  timeSetterCurrVal: object;
  selectedTimerType: string;
  
  elapsedTimeProportion = 0;

  selectedScreen: string;
  timerId;

  soundChooseinView = true;
  sounds = [
    {
      name: "None"
    },
    {
      name: "Sound 1",
      path: "./assets/Alarm1.wav"
    },
    {
      name: "Sound 2",
      path: "./assets/Alarm2.wav"
    },
    {
      name: "Sound 3",
      path: "./assets/Alarm3.wav"
    }
  ]

  selectedSound = 0;

  constructor() {

    this.selectedScreen = this.screens.typeChooser;
    this.timeSetterOrgVal = JSON.parse(JSON.stringify(this.timeSetterInitVal));
    
   }

  ngOnInit() { }

  showScreen(e){

    console.log("e: ", e);
    this.selectedScreen = e.screen;

    switch(e.screen){
        case this.screens.typeChooser:
            this.timeSetterOrgVal = JSON.parse(JSON.stringify(this.timeSetterInitVal));
        break;

        case this.screens.timeSetter:
            this.selectedTimerType = e.timerType;
        break;

        default:
        break;
    }
    
  }

  updateOrgTime(e){
    
    let time = JSON.parse(JSON.stringify(this.timeSetterOrgVal));
    
    time = {
      min: parseInt(time['min']),
      sec: parseInt(time['sec'])
    }

    if(e.action == 'inc'){
      time[e.type] += 1;
    }else if(e.action == 'dec'){
      time[e.type] -= 1;
    }

    let min = time['min'];
    let sec = time['sec'];

    if(e.type == 'sec' ){
      
      if(min==0 && sec < this.minSetableTime){
        sec = this.minSetableTime;
      }else if(sec < 0){
          sec = 0;
      }
      
    }else if(e.type == 'min' ){
      
      if(min < 0){
        min = 0;
      }
      
      if(min == 0 && sec < this.minSetableTime){
        sec = this.minSetableTime;
      }
    }

    this.timeSetterOrgVal = {
      min: this.formatTime(min),
      sec: this.formatTime(sec),
      tot: ((min*60)+sec)
    }
    
  }

  formatTime(n){
    return n > 9 ? "" + n: "0" + n;
  }

  startTimer(){
    /*this.showScreen({screen: this.screens.timeRunner});*/
    if(this.selectedTimerType == this.timerTypes.up){
      this.timeSetterCurrVal = {
        min: '00',
        sec: '00',
        tot: 0
      };
      this.showScreen({screen: this.screens.timeRunner});
      this.operateUpTimer();
    }else{
      this.timeSetterCurrVal = JSON.parse(JSON.stringify(this.timeSetterOrgVal));
      this.showScreen({screen: this.screens.timeRunner});
      this.operateDownTimer();
    }

  }

  operateDownTimer(){
    
    this.timerId = setInterval(()=>{
      
      let min = parseInt(this.timeSetterCurrVal['min']);
      let sec = parseInt(this.timeSetterCurrVal['sec']);

      if(min == 0 && sec == 0){
        this.stopTimer();
      }else{
        if(sec == 0){
          min -= 1;
          sec = 59;
        }else{
          sec -= 1;
        }
      }

      this.timeSetterCurrVal = {
        min: this.formatTime(min),
        sec: this.formatTime(sec),
        tot: ((min*60)+sec)
      }

      this.elapsedTimeProportion = (this.timeSetterOrgVal['tot'] - this.timeSetterCurrVal['tot'])/ (this.timeSetterOrgVal['tot']);

    }, 1000)
  }

  operateUpTimer(){

    let totMin = parseInt(this.timeSetterOrgVal['min']);
    let totSec = parseInt(this.timeSetterOrgVal['sec']);

    this.timerId = setInterval(()=>{
      
      let min = parseInt(this.timeSetterCurrVal['min']);
      let sec = parseInt(this.timeSetterCurrVal['sec']);

      if(min == totMin && sec == totSec){
        this.stopTimer();
      }else{
        if(sec == 59){
          min += 1;
          sec = 0;
        }else{
          sec += 1;
        }
      }

      this.timeSetterCurrVal = {
        min: this.formatTime(min),
        sec: this.formatTime(sec),
        tot: ((min*60)+sec)
      }

      this.elapsedTimeProportion = this.timeSetterCurrVal['tot'] / this.timeSetterOrgVal['tot'];

    }, 1000)
  }

  stopTimer(hardStop?){
    clearInterval(this.timerId);
    this.showScreen({screen: this.screens.timeUp});
    if(!hardStop){
      this.playAudio();
    }
  }

  pauseTimer(){
    clearInterval(this.timerId);
  }

  playAudio(){
    if(this.selectedSound){
      let audio = new Audio();
      audio.src = this.sounds[this.selectedSound]['path'];
      audio.load();
      audio.play();
    }
  }

  onSoundChange(e){
    this.selectedSound = e.target.value;
  }

  toggleSoundChooser(){
    this.soundChooseinView = !this.soundChooseinView;
  }

}
