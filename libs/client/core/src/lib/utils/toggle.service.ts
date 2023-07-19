import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  public darkmode : WritableSignal<boolean> = signal(false);

  constructor() {
    this.darkmode.set(this.getMode());
    this.setCache(this.darkmode());

  }

    toggle(){
      this.darkmode.update((darkMode : boolean)=> !darkMode);
      this.setCache(this.darkmode());
    }

    getMode(){
      const mode = localStorage.getItem('mode');
      return mode ? JSON.parse(mode) : false;
    }

    setCache(darkmode : boolean){
      localStorage.setItem('mode',JSON.stringify(darkmode));
    }
}
