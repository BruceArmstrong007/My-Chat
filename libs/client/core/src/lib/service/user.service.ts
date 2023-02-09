import { inject, Injectable } from '@angular/core';
import { Contacts, User } from '@prisma/client';
import { map, switchMap, iif, BehaviorSubject, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpService } from '../utils/http.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly authService = inject(AuthService);
  readonly chatMessages$ : any = new BehaviorSubject([]);
  private readonly http = inject(HttpService);

  socket = this.authService?.socket;

   emptyChat(){
    this.chatMessages$.next([]);
  }



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

  connectWs({roomID} : any){
        this.socket.on(roomID,(message:any)=>{
          this.chatMessages$.next([...this.chatMessages$.value,message]);
        })
        this.socket.on("error", (error:any) => {
            console.log(error);
        });
  }

  disconnectWs(){
    this.socket.disconnect();
  }

  chat(data:any){
    this.socket.emit("message",data);
    this.chatMessages$.next([...this.chatMessages$.value,{...data, created_at : new Date()}])
  }

  getChats(data:any){
   this.http.post('/message',data).pipe(tap((res:any)=> this.chatMessages$.next(res?.data?.messages))).subscribe((res:any)=>{return;});
  }





}
