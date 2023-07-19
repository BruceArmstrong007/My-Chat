import { Router } from '@angular/router';
import { BehaviorSubject, Subject} from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { ListComponent, PromptComponent } from '@client/shared';
import { ChangeDetectionStrategy, Component, inject, DestroyRef } from '@angular/core';
import { PromptHandlerService, AuthService, UserService } from '@client/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'my-chat-app-friend-list',
  standalone: true,
  imports: [ListComponent,MatDialogModule],
  templateUrl: './friend-list.component.html',
  providers:[PromptHandlerService],
  styleUrls: ['./friend-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FriendListComponent {

  chatFriend$ = new Subject();
  cancelRequest$ = new Subject();
  acceptRequest$ = new Subject();

  friendList$: any = new BehaviorSubject([]);
  sentList$: any = new BehaviorSubject([]);
  receivedList$: any = new BehaviorSubject([]);
  private readonly destroy$ : any = new Subject();
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly prompt = inject(PromptHandlerService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);



ngAfterViewInit(){
    this.authService.$user.pipe(takeUntilDestroyed(this.destroy$)).subscribe(((user:any)=>{
      this.sentList$.next(this.contactFilter(user?.contact,'sent'));
      this.friendList$.next(this.contactFilter(user?.contact,'friend'));
      this.receivedList$.next(this.contactFilter(user?.contact,'received'));
    }));

    this.acceptRequest$.pipe(takeUntilDestroyed(this.destroy$)).subscribe((event:any)=>{
      this.prompt.openDialog(PromptComponent,{title : 'Confirmation',description:'Do you want to accept friend request ?'}).subscribe((result:any)=>{
        const contact_id = this.authService.currentUser()?.id;
        if(result && contact_id){
         this.userService.acceptUser({contact_id : event.id,user_id : contact_id})
         .pipe(takeUntilDestroyed(this.destroy$))
         .subscribe(() => {return});
        }
      });

    });

    this.chatFriend$.pipe(takeUntilDestroyed(this.destroy$)).subscribe((event:any)=>{
      const contact : object = {...event}
      this.router.navigateByUrl('/user', { state : contact });

    });

    this.cancelRequest$.pipe(takeUntilDestroyed(this.destroy$)).subscribe((eventData:any)=>{
      const event = eventData?.event;
      this.prompt.openDialog(PromptComponent,{title : 'Confirmation',description:'Do you want to '+event.mode+'?'}).subscribe((result:any)=>{
        const contact_id = this.authService.currentUser()?.id;
        if(result && contact_id){
         this.userService.unfriendUser({contact_id : event.id,user_id : contact_id})
         .pipe(takeUntilDestroyed(this.destroy$))
         .subscribe(() => {return});
        }
      });
    });

    this.destroyRef.onDestroy(()=> this.destroy$.unsubscribe());
  }


  contactFilter(contact:any,key : string){
    contact = contact.filter((contact:any)=>contact.status === key);
    if(contact.length > 0)
      return contact;
    return [];
  }

}
