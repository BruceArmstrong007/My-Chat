import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject, takeUntil,} from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { ListComponent, PromptComponent } from '@client/shared';
import { ChangeDetectionStrategy, Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromptHandlerService, AuthService, UserService, RequestHandlerService } from '@client/core';

@Component({
  selector: 'my-chat-app-friend-list',
  standalone: true,
  imports: [CommonModule,ListComponent,MatDialogModule],
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
  private readonly requestHandler = inject(RequestHandlerService);
  private readonly destroy$ = new Subject<void>();
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly changeDetection = inject(ChangeDetectorRef);
  private readonly snackBar = inject(MatSnackBar);
  private readonly prompt = inject(PromptHandlerService);
  private readonly router = inject(Router);



ngAfterViewInit(){
    this.authService.$user.pipe(takeUntil(this.destroy$)).subscribe(((user:any)=>{
      this.sentList$.next(this.contactFilter(user?.contact,'sent'));
      this.friendList$.next(this.contactFilter(user?.contact,'friend'));
      this.receivedList$.next(this.contactFilter(user?.contact,'received'));
    }));


    this.acceptRequest$.subscribe((event:any)=>{
      this.prompt.openDialog(PromptComponent,{title : 'Confirmation',description:'Do you want to accept friend request ?'}).subscribe((result:any)=>{
        const contact_id = this.authService.currentUser()?.id;
        if(result && contact_id){
         this.userService.acceptUser({contact_id : event.id,user_id : contact_id})
         .pipe(takeUntil(this.destroy$))
         .subscribe((data:any) => {
        return;
        });
        }
      });

    });

    this.chatFriend$.subscribe((event:any)=>{
      const contact : object = {...event}
      this.router.navigateByUrl('/user', { state : contact });

    });

    this.cancelRequest$.subscribe((eventData:any)=>{
      const event = eventData?.event;
      this.prompt.openDialog(PromptComponent,{title : 'Confirmation',description:'Do you want to '+event.mode+'?'}).subscribe((result:any)=>{
        const contact_id = this.authService.currentUser()?.id;
        if(result && contact_id){
         this.userService.unfriendUser({contact_id : event.id,user_id : contact_id})
         .pipe(takeUntil(this.destroy$))
         .subscribe((data:any) => {
          return;
        });
        }
      });
    });

  }


  contactFilter(contact:any,key : string){
    contact = contact.filter((contact:any)=>contact.status === key);
    if(contact.length > 0)
      return contact;
    return [];
  }

  ngOnDestroy(){

    this.chatFriend$.unsubscribe();
    this.cancelRequest$.unsubscribe();
    this.acceptRequest$.unsubscribe();
    this.friendList$.unsubscribe();
    this.sentList$.unsubscribe();
    this.receivedList$.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
