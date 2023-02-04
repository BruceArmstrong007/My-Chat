import { UserService, AuthService } from '@client/core';
import { Location } from '@angular/common';
import {  Observable, Subject, takeUntil } from 'rxjs';
import { ChatComponent } from '@client/shared';
import { ListComponent } from '@client/shared';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'my-chat-app-my-chat',
  standalone: true,
  imports: [CommonModule, ListComponent, ChatComponent],
  templateUrl: './my-chat.component.html',
  styleUrls: ['./my-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyChatComponent {
  sendMessage$: any = new Subject();
  cardClick$: any = new Subject();
  contactUser:any;
  messageList$: any = new Subject();
  private readonly destroy$ = new Subject<void>();
  readonly userService = inject(UserService);
  readonly authService = inject(AuthService);
  private readonly location = inject(Location);
  friendList$!:Observable<any[]>;


ngAfterViewInit(){
  this.contactUser = this.location.getState();
  if(this.contactUser?.id){
    this.startChat(this.contactUser);
  }else{
    this.contactUser = undefined;
  }
  

  this.friendList$ = this.authService.friends();
  this.cardClick$
    .subscribe(this.startChat.bind(this));

  this.sendMessage$
  .subscribe((event:any) => {
    const user_id = this.authService.currentUser()?.id;
    const contact_id = this.contactUser?.id;
    const id = this.userService.generateRoomID(user_id,contact_id);
    const data = {
      ...event,
      id,
      from : user_id,
      to : contact_id
    };

    this.userService.chat(data);
  });
  }

  startChat(contactUser:any)  {
    const user_id = this.authService.currentUser()?.id;
    if(this.contactUser)
      this.userService.disconnectWs(this.userService.generateRoomID(user_id,this.contactUser?.id))
    this.contactUser = contactUser;
    this.userService.emptyChat();
    const contact_id = this.contactUser?.id;
    // generate room id to create room
    this.userService.getChats({user_id,contact_id});
    this.userService.connectWs(this.userService.generateRoomID(user_id,contact_id));
  }



  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }

}
