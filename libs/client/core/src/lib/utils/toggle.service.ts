import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  public darkmode = false;

    toggle(){
      this.darkmode = !this.darkmode;
    }

}
