import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  public darkmode = false;
  
  constructor() {
    this.darkmode = this.getMode();
    console.log(this.darkmode);
    
  }

    toggle(){
      this.darkmode = !this.darkmode;
    }

    getMode(){
      const mode = localStorage.getItem('mode');
      return mode ? JSON.parse(mode) : false;
    }

    setMode(darkmode : boolean){
      localStorage.setItem('mode',JSON.stringify(darkmode));
    }
}
