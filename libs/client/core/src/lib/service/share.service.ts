import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import io, { Socket } from 'socket.io-client';
import { inject, Injectable } from '@angular/core';
import { injectConfig } from '../core.di';
import { UserService } from './user.service';
import Peer from 'peerjs';
@Injectable({
  providedIn: 'root',
})
export class ShareService {
  private readonly authService = inject(AuthService);
  private readonly notifications$ = new Subject();
  private readonly userService = inject(UserService);
  peerData$ : any = new BehaviorSubject(undefined);
  localStream$: BehaviorSubject<any>= new BehaviorSubject(null);
  remoteStream$ : BehaviorSubject<any>= new BehaviorSubject(null);
  readonly callState$ : any = new BehaviorSubject(undefined);
  private readonly url = injectConfig();
  private socket : Socket = this.userService.socket;
  peer: Peer = new Peer();
  navigator : any = navigator;
  getUserMedia : any;
  readonly notify$ : Observable<any> = this.notifications$.asObservable();



  connectWs(id : number,contact : any[]){
    this.socket.emit('user',{roomID:id.toString()});

    this.socket.on("notification",(message:any)=>{
      this.notifications$.next(message);
    })

    this.socket.on("call",(data:any)=>{

      if(this.authService.generateRoomID(this.userService.chatMessages$.value[0]?.from,this.userService.chatMessages$.value[0]?.to) === data?.roomID){
        this.userService.chatMessages$.next([...this.userService.chatMessages$.value,data]);
      }
      const value =  this.callState$.value;
      if(value && data && value?.roomID !== data?.roomID && value?.message === 'accepted'){
        return;
      }
      this.callState$.next(data);
    });

    this.socket.on("error", (error:any) => {
        console.log(error);
    });

    this.getUserMedia = ( this.navigator.getUserMedia || this.navigator.webkitGetUserMedia || this.navigator.mozGetUserMedia || this.navigator.msGetUserMedia );

    this.peer.on('call',(call) =>{
      this.getUserMedia({video: true, audio: true}, (stream:MediaStream) => {
        call.answer(stream); // Answer the call with an A/V stream.
        this.localStream$.next(stream);
        call.on('stream', (remoteStream:MediaStream) => {
          // Show stream in some video/canvas element.
        this.remoteStream$.next(remoteStream)
        });
      }, (err : any)=> {
        console.log('Failed to get local stream' ,err);
      });
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

  call(data:any, option: string){
    this.socket.emit(option,data);
    this.callState$.next(data);
      if(this.authService.generateRoomID(this.userService.chatMessages$.value[0]?.from,this.userService.chatMessages$.value[0]?.to) === data?.roomID){
      this.userService.chatMessages$.next([...this.userService.chatMessages$.value,data]);
    }
  }


  connectPeer(peerID : any){
    this.getUserMedia({video: true, audio: true}, (stream:MediaStream) =>{
      const call = this.peer.call(peerID, stream);
      this.localStream$.next(stream);
      call.on('stream', (remoteStream: MediaStream) =>{
        // Show stream in some video/canvas element.
        this.remoteStream$.next(remoteStream)
      });
    }, (err: any) => {
      console.log('Failed to get local stream' ,err);
    });
  }

  destroyPeer(){
    this.remoteStream$?.value?.getTracks().forEach((track:any) => {
      track.stop();
    });
    this.localStream$?.value?.getTracks().forEach((track:any) => {
        track.stop();
    });
  }

}

