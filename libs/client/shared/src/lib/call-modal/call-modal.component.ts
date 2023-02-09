import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { AuthService, NotificationService } from '@client/core';
import { BehaviorSubject, filter, takeUntil, Subject } from 'rxjs';

@Component({
  selector: 'my-chat-call-modal',
  standalone: true,
  imports: [CommonModule,MatIconModule,MatButtonModule,MatCardModule],
  templateUrl: './call-modal.component.html',
  styleUrls: ['./call-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallModalComponent {
  private readonly destroy$ : any = new Subject();
  private readonly notificationService = inject(NotificationService);
  private readonly authService = inject(AuthService);
  data$ : BehaviorSubject<any> = this.notificationService?.peerData$;
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  roomID !:string;
  enableAudio = true;
  enableVideo = true;
  localAudioTrack !: MediaStreamTrack;
  localVideoTrack !: MediaStreamTrack;
  get dataValue(){
    return this.data$.value;
  }

  ngOnInit(){
    this.roomID = this.authService.generateRoomID(this.dataValue?.from,this.dataValue?.to);

    this.notificationService.localStream$.pipe(filter((res:any) => !!res),takeUntil(this.destroy$))
    .subscribe((stream:MediaStream) => {
      if(!stream) return;
      this.localAudioTrack = stream.getAudioTracks()[0]; //.find((track:MediaStreamTrack) => track.kind == 'audio')
      this.localVideoTrack = stream.getVideoTracks()[0]; //.find((track:MediaStreamTrack) => track.kind == 'video')

      this.localVideo.nativeElement.srcObject = stream;
    });
    this.notificationService.remoteStream$.pipe(filter((res:any) => !!res),takeUntil(this.destroy$))
    .subscribe(stream => {
      if(!stream) return;
      this.remoteVideo.nativeElement.srcObject = stream
    });
  }

  toggleAudio(){
    this.enableAudio = !this.enableAudio;
    console.log(this.localAudioTrack?.enabled);
    this.localAudioTrack.enabled = this.enableAudio;
  }

  toggleVideo(){
    this.enableVideo = !this.enableVideo;
    console.log(this.localVideoTrack?.enabled);
    this.localVideoTrack.enabled = this.enableVideo;
  }

  accept(){
    this.notificationService.call({
      roomID :  this.roomID,
      from : this.dataValue?.from,
      to : this.dataValue?.to,
      peerID : this.dataValue?.peerID,
      message : "accepted",
      type: "call",
      created_at : new Date()
    },"videoCall");
    this.notificationService.connectPeer(this.dataValue?.peerID)
  }

  reject(){
    let message = 'rejected';
    if(this.dataValue?.message === 'calling'){
      if(this.dataValue.isCaller) message = 'cancelled';
    }else{
      message = 'received';
    }
    this.notificationService.call({
    roomID :  this.roomID,
    from : this.dataValue?.from,
    to : this.dataValue?.to,
    peerID : this.dataValue?.peerID,
    message : message,
    type: "call",
    created_at : new Date()
    },"videoCall");
  }



  ngOnDestroy(){
    this.notificationService.destroyPeer();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
