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
export class NotificationService {
  private readonly authService = inject(AuthService);
  private readonly notifications$ = new Subject();
  peerData$ : any= new BehaviorSubject(undefined);
  localStream$: BehaviorSubject<any>= new BehaviorSubject(null);
  remoteStream$ : BehaviorSubject<any>= new BehaviorSubject(null);
  readonly callState$ : any = new BehaviorSubject(undefined);
  private readonly url = injectConfig();
  private socket : Socket = inject(UserService).socket;
  peer: Peer = new Peer();
  navigator : any = navigator;
  getUserMedia : any;

  readonly notify$ : Observable<any> = this.notifications$.asObservable();



  connectWs(id : any){
    this.socket.emit('user',{id:id.toString()});
    this.socket.on("notification",(message:any)=>{
      this.notifications$.next(message);
    })

    this.socket.on("call",(data:any)=>{
      const value =  this.callState$.value;
      if(value?.status == 'accepted' && data?.status === "calling"){
        return;
      }
      this.callState$.next(data);
    });

    this.socket.on("error", (error:any) => {
        console.log(error);
    });
    this.getUserMedia = ( this.navigator.getUserMedia || this.navigator.webkitGetUserMedia || this.navigator.mozGetUserMedia || this.navigator.msGetUserMedia );
    this.peer.on('call',(call) =>{
      this.getUserMedia({video: true, audio: false}, (stream:MediaStream) => {
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
  }


  connectPeer(peerID : any){
    this.getUserMedia({video: true, audio: false}, (stream:MediaStream) =>{
      console.log(stream);
      const call = this.peer.call(peerID, stream);
      console.log(call);
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

  this.remoteStream$?.value.getTracks().forEach((track:any) => {
    track.stop();
  });
  this.localStream$?.value.getTracks().forEach((track:any) => {
      track.stop();
  });
  }

}

