import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import io, { Socket } from 'socket.io-client';
import { inject, Injectable } from '@angular/core';
import { injectConfig } from '../core.di';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly authService = inject(AuthService);
  private readonly notifications$ = new Subject();
  private readonly url = injectConfig();
  private socket : Socket = inject(UserService).socket;

  readonly notify$ = this.notifications$.asObservable();


  connectWs(id : any){
    this.socket.emit('user',{id:id.toString()});
    this.socket.on("notification",(message:any)=>{
      this.notifications$.next(message);
    })
    this.socket.on("error", (error:any) => {
        console.log(error);
    });

}

  notification(data : any){
    switch(data?.type){
      case 'notification':
        this.authService.getUser().subscribe((res:any)=> {return;});
        break;
      default:
        break;
    }
  }

}

