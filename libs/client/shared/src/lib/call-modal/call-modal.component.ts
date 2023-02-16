import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { AuthService, ShareService } from '@client/core';
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
  private readonly shareService = inject(ShareService);
  private readonly authService = inject(AuthService);
  data$ : BehaviorSubject<any> = this.shareService?.peerData$;
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
        console.log(this.dataValue?.from,this.dataValue?.to);

    this.roomID = this.authService.generateRoomID(this.dataValue?.from,this.dataValue?.to);

    this.shareService.localStream$.pipe(filter((res:any) => !!res),takeUntil(this.destroy$))
    .subscribe((stream:MediaStream) => {
      if(!stream) return;
      this.localAudioTrack = stream.getAudioTracks()[0]; //.find((track:MediaStreamTrack) => track.kind == 'audio')
      this.localVideoTrack = stream.getVideoTracks()[0]; //.find((track:MediaStreamTrack) => track.kind == 'video')
      if(this.localVideo)
        this.localVideo.nativeElement.srcObject = stream;
    });
    this.shareService.remoteStream$.pipe(filter((res:any) => !!res),takeUntil(this.destroy$))
    .subscribe(stream => {
      if(!stream) return;
      this.remoteVideo.nativeElement.srcObject = stream
    });
  }

  toggleAudio(){
    this.enableAudio = !this.enableAudio;
    if(this.localAudioTrack)
     this.localAudioTrack.enabled = this.enableAudio;
  }

  toggleVideo(){
    this.enableVideo = !this.enableVideo;
    if(this.localVideoTrack)
      this.localVideoTrack.enabled = this.enableVideo;
  }

  accept(){
    this.shareService.call({
      roomID :  this.roomID,
      from : this.dataValue?.from,
      to : this.dataValue?.to,
      peerID : this.dataValue?.peerID,
      message : "accepted",
      type: "call",
      created_at : new Date()
    },"videoCall");
    this.shareService.connectPeer(this.dataValue?.peerID)
  }

  reject(){
    let message = 'rejected';
    if(this.dataValue?.message === 'calling'){
      if(this.dataValue.isCaller) message = 'cancelled';
    }else{
      message = 'received';
    }
    this.shareService.call({
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
    this.shareService.destroyPeer();
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event:any) {
  this.shareService.call({
    roomID :  this.roomID,
    from : this.dataValue?.from,
    to : this.dataValue?.to,
    peerID : this.dataValue?.peerID,
    message : 'missed',
    type: "call",
    created_at : new Date()
    },"videoCall");
}

}
