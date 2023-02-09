import { takeUntil, Subject, distinctUntilChanged, map } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, NotificationService } from '@client/core';
import {MatDialog, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { CallModalComponent } from '@client/shared';

@Component({
  selector: 'my-chat-app-dashboard',
  standalone: true,
  imports: [CommonModule,RouterOutlet,MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class  DashboardComponent {
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  currentUser : any;
  private readonly destroy$ : any = new Subject();
  dialog : MatDialog = inject(MatDialog);
  ngOnInit(){
    this.authService.$user.pipe(takeUntil(this.destroy$)).subscribe((user:any)=>{
      if(user?.id){
      this.currentUser = user;
      this.notificationService.connectWs(user?.id,user?.contact);
      }
    });

    this.notificationService.callState$.pipe(distinctUntilChanged(),takeUntil(this.destroy$),map((res:any)=>{

      let contactID!:number, isCaller = false;
      if(this.currentUser?.id == res?.from){
        contactID = parseInt(res?.to);
        isCaller = true;
      }
      if(this.currentUser?.id == res?.to){
        contactID = parseInt(res?.from);
      }
      const contactUser = this.currentUser.contact.find((contact:any) => contact?.id === contactID);
      return {...res, currentUser : this.currentUser,contactUser : contactUser, isCaller};
    })).subscribe((res:any)=>{
      // status : calling, missed , rejected, cancelled, accepted, received
      if(!res){
        return;
      }
      if(res?.message === 'missed' || res?.message === 'rejected' || res?.message === 'cancelled' || res?.message === 'received'){
        this.closeDialog(res);
      }
      if(res?.message === 'calling'){
        this.openDialog();
      }
      this.notificationService.peerData$.next(res);
    });
  }

  openDialog(): void {
    this.dialog.open(CallModalComponent, {
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '250ms',
      disableClose: true
    });
  }

  closeDialog(data : any = null): void{
    this.dialog.closeAll();
    if(data?.isCaller){
      this.notificationService.destroyPeer();
    }
  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
