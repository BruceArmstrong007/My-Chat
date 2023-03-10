import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService, PromptHandlerService, UserService, RequestHandlerService } from '@client/core';
import { Subject, distinctUntilChanged, takeUntil,  map, BehaviorSubject } from 'rxjs';
import { ListComponent, PromptComponent } from '@client/shared';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'my-chat-app-find-friend',
  standalone: true,
  imports: [CommonModule,ListComponent,MatDialogModule],
  providers:[PromptHandlerService],
  templateUrl: './find-friend.component.html',
  styleUrls: ['./find-friend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FindFriendComponent {
  findList$ : any = new BehaviorSubject([]);
  addRequest$ : any = new Subject();
  findFriend$ : any = new Subject();
  cancelRequest$ : any = new Subject();
  private readonly requestHandler = inject(RequestHandlerService);
  private readonly destroy$ = new Subject<void>();
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly prompt = inject(PromptHandlerService);


  ngAfterViewInit(){
    this.addRequest$.subscribe((event:any)=>{
      this.prompt.openDialog(PromptComponent,{title : 'Confirmation',description:'Do you want send request ?'}).subscribe((result:any)=>{
        const contact_id = this.authService.currentUser()?.id;
        if(!result || !contact_id){
          return;
        }
         this.userService.requestUser({contact_id : event.id,user_id : contact_id})
         .pipe(takeUntil(this.destroy$))
         .subscribe((data:any) => {
            this.findList$.next(this.findList$.value.map((user:any)=>{
              if(user.id === event.id){
                return {
                  ...user,
                  requested : true
                }
              }
              return user;
            }))
          });
      });

    });


    this.cancelRequest$.subscribe((event:any)=>{
      this.prompt.openDialog(PromptComponent,{title : 'Confirmation',description:'Do you want to cancel request ?'}).subscribe((result:any)=>{
        const contact_id = this.authService.currentUser()?.id;
        if(!result || !contact_id){
          return;
        }
         this.userService.unfriendUser({contact_id : event.id,user_id : contact_id}).pipe(takeUntil(this.destroy$))
         .subscribe((data:any) => {
            const {message,options} = this.requestHandler.responseHandler(data?.message,data?.success);
            this.snackBar.open(message,'Close',options);

            this.findList$.next(this.findList$.value.map((user:any)=>{
              if(user.id === event.id){
                return {
                  ...user,
                  requested : false
                }
              }
              return user;
            }));
          });
      });

    });

    this.findFriend$.pipe(distinctUntilChanged()).subscribe((event:any)=>{
      if(!event){
        this.findList$.next([]);
        return;
      }
      this.userService.findUser({username : event}).pipe(takeUntil(this.destroy$),

      map((userList:any)=> {
        const currentUser : any = this.authService.currentUser();

        // remove current user
        userList = userList.filter((user:any)=> user.id !== currentUser?.id);

        //
        userList = userList.map((user:any)=>{
          if(currentUser.contact.find((elt : any)=> elt.id === user.id)){
            return {
              ...user,
              requested : true
            }
          }
          return user;
        });
        return userList;
      }))
      .subscribe({
        next: (data:any) => {
            this.findList$.next(data);
        },
        error: (err:any) => {
          console.log(err);
        },
      });
    });
  }

  ngOnDestroy(){
    this.findList$.unsubscribe();
    this.addRequest$.unsubscribe();
    this.findFriend$.unsubscribe();
    this.cancelRequest$.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}




