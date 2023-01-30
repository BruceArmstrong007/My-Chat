import { inject, Injectable } from '@angular/core';
import { Contacts, User } from '@prisma/client';
import { map, switchMap, iif, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { injectConfig } from '../core.di';
import { HttpService } from '../utils/http.service';
import { io } from "socket.io-client";


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly authService = inject(AuthService);
  private readonly chatMessage$ = new Subject();
  private readonly http = inject(HttpService);
  private readonly url = injectConfig();

  readonly chat$ = this.chatMessage$.asObservable();
  EVENTS = {
    connection: "connection",
    CLIENT: {
      CREATE_ROOM: "CREATE_ROOM",
      SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
      NOTIFICATION: "NOTIFICATION"
    },
  };

  socket = io(this.url.API_URL,{
    withCredentials: true,
  });



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

      this.socket.emit(this.EVENTS.CLIENT.CREATE_ROOM,{roomName:id});
      this.socket.on(
        this.EVENTS.CLIENT.SEND_ROOM_MESSAGE,(message)=>{
          this.chatMessage$.next(message);
      });
    
  }

  chat(data:any){
    return this.http.post(this.url.API_URL,data)
  }

  getChats(data:any){
    return this.http.post('/message',data).pipe(map((res:object)=> data?.messages));
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
