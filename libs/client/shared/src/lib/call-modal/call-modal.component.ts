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
  get dataValue(){
    return this.data$.value;
  }

  ngOnInit(){
    this.roomID = this.authService.generateRoomID(this.dataValue?.from,this.dataValue?.to);

    this.notificationService.localStream$.pipe(filter((res:any) => !!res),takeUntil(this.destroy$))
    .subscribe(stream => this.localVideo.nativeElement.srcObject = stream);
    this.notificationService.remoteStream$.pipe(filter((res:any) => !!res),takeUntil(this.destroy$))
    .subscribe(stream => this.remoteVideo.nativeElement.srcObject = stream);
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
    },"callResponse");
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
    },"callResponse");
  }



  ngOnDestroy(){
    this.notificationService.destroyPeer();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
