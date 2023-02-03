import { inject, Injectable } from '@angular/core';
import { Contacts, User } from '@prisma/client';
import { map, switchMap, iif, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { injectConfig } from '../core.di';
import { HttpService } from '../utils/http.service';
import io, { Socket } from 'socket.io-client';



@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly authService = inject(AuthService);
  private readonly chatMessage$ = new Subject();
  private readonly http = inject(HttpService);
  private readonly url = injectConfig();

  readonly chat$ = this.chatMessage$.asObservable();
  socket !: Socket;


  findUser(data:Pick<User, 'username'>) {
    return this.http.post('/user/find',data).pipe(map((res:any)=>res?.data));
  }

  requestUser(data:Pick<Contacts, 'user_id' | 'contact_id'>) {
    return this.http.post('/contact/request',data).pipe(
      switchMap((response:any) => iif(() => response.success === true, this.authService.getUser().pipe(map((res:any)=> (response))), (response))),
    )
  }

  acceptUser(data:Pick<Contacts, 'user_id' | 'contact_id'>){
    return this.http.post('/contact/accept',data).pipe(
      switchMap((response:any) => iif(() => response.success === true, this.authService.getUser().pipe(map((res:any)=> (response))), (response))),
    )
  }

  unfriendUser(data:Pick<Contacts, 'user_id' | 'contact_id'>){
    return this.http.post('/contact/unfriend',data).pipe(
      switchMap((response:any) => iif(() => response.success === true, this.authService.getUser().pipe(map((res:any)=> (response))), (response))),
    )
  }

  updateProfile(data:any){
    return this.http.post('/user/update',data).pipe(
      switchMap((response:any) => iif(() => response.success === true, this.authService.getUser().pipe(map((res:any)=> (response))), (response))),
    )
  }

  resetPassword(data:any){
    return this.http.post('/user/resetPassword',data).pipe(
      switchMap((response:any) => iif(() => response.success === true, this.authService.getUser().pipe(map((res:any)=> (response))), (response))),
    )
  }

  connectWs(id : any){
        this.socket = io(this.url.WS_URL,{
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          autoConnect: true,
          withCredentials: true
        });
        this.socket.emit('join',{id});
        this.socket.on("broadcast",(message:any)=>{
          this.chatMessage$.next(message);
        })
        this.socket.on("error", (error:any) => {
            console.log(error);
        });
    
  }

  chat(data:any){
    this.socket.emit("message",data);
  }

  getChats(data:any){
    return this.http.post('/message',data).pipe(map((res:any)=> res?.data?.messages));
  }


  generateRoomID(id1:any,id2:any){
    let id = '';
    if(id1 > id2){
      id = id2.toString()+'-'+id1.toString();
    }else{
      id = id1.toString()+'-'+id2.toString();
    }
    return id;
  }
}
