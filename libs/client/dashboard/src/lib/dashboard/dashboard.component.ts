import { Subject, distinctUntilChanged, map } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject, DestroyRef } from '@angular/core';
import { AuthService, ShareService } from '@client/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { CallModalComponent, TransferComponent } from '@client/shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'my-chat-app-dashboard',
  standalone: true,
  imports: [RouterOutlet,MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class  DashboardComponent {
  shareService = inject(ShareService);
  authService = inject(AuthService);
  destroyRef = inject(DestroyRef);
  currentUser : any;
  dialog : MatDialog = inject(MatDialog);
  ngOnInit(){
    this.authService.$user.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user:any)=>{
      if(user?.id){
      this.currentUser = user;
      this.shareService.connectWs(user?.id,user?.contact);
      }
    });

    this.shareService.callState$.pipe(distinctUntilChanged(),takeUntilDestroyed(this.destroyRef),map((res:any)=>{

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
        this.openDialog(CallModalComponent);
      }
      this.shareService.peerData$.next(res);
    });


    this.shareService.transferState$.pipe(distinctUntilChanged(),takeUntilDestroyed(this.destroyRef),map((res:any)=>{
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

      // status : request, missed , rejected, cancelled, accepted, received
      if(!res){
        return;
      }
      if(res?.message === 'missed' || res?.message === 'rejected' || res?.message === 'cancelled' || res?.message === 'received'){
        this.closeDialog(res);
      }
      if(res?.message === 'request'){
        this.openDialog(TransferComponent);
      }
      this.shareService.transferData$.next(res);
    });

  }

  openDialog(component:any): void {
    this.dialog.open(component, {
      enterAnimationDuration: '250ms',
      exitAnimationDuration: '250ms',
      disableClose: true
    });
  }

  closeDialog(data : any = null): void{
    this.dialog.closeAll();
    if(data?.isCaller){
      this.shareService.destroyPeer();
    }
  }

}
