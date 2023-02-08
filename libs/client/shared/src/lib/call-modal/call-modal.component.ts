import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { NotificationService } from '@client/core';
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
  notificationService = inject(NotificationService);
  data$ : BehaviorSubject<any> = this.notificationService?.peerData$;
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  get dataValue(){
    return this.data$.value;
  }

  ngOnInit(){
    this.notificationService.localStream$.pipe(filter((res:any) => !!res),takeUntil(this.destroy$))
    .subscribe(stream => this.localVideo.nativeElement.srcObject = stream);
    this.notificationService.remoteStream$.pipe(filter((res:any) => !!res),takeUntil(this.destroy$))
    .subscribe(stream => this.remoteVideo.nativeElement.srcObject = stream);
  }

  accept(){
    this.notificationService.call({
      from : this.dataValue?.from,
      to : this.dataValue?.to,
      peerID : this.dataValue?.peerID,
      status : "accepted"
    },"callResponse");
    this.notificationService.connectPeer(this.dataValue?.peerID)
  }

  reject(){
    let status = 'rejected';
    if(this.dataValue?.status === 'calling'){
      if(this.dataValue.isCaller) status = 'cancelled';
    }else{
      status = 'received';
    }
    this.notificationService.call({
    from : this.dataValue?.from,
    to : this.dataValue?.to,
    peerID : this.dataValue?.peerID,
    status : status
  },"callResponse");
   this.notificationService.destroyPeer();
  }



  ngOnDestroy(){

    this.notificationService.destroyPeer();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
