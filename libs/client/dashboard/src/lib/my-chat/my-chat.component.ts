import { UserService, AuthService, ShareService } from '@client/core';
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
  videoCall$: any = new Subject();
  cardClick$: any = new Subject();
  fileTransfer$ : any = new Subject();
  contactUser:any;
  messageList$: any = new Subject();
  private readonly destroy$ = new Subject<void>();
  readonly userService = inject(UserService);
  readonly shareService = inject(ShareService);
  readonly authService = inject(AuthService);
  private readonly location = inject(Location);
  friendList$!:Observable<any[]>;


ngAfterViewInit(){
  this.messageList$ = this.userService.chatMessages$;
  this.contactUser = this.location.getState();
  if(this.contactUser?.id){
    this.startChat(this.contactUser);
  }else{
    this.contactUser = undefined;
  }


  this.friendList$ = this.authService.friends().pipe(takeUntil(this.destroy$));
  this.cardClick$.pipe(takeUntil(this.destroy$))
    .subscribe(this.startChat.bind(this));

  this.sendMessage$.pipe(takeUntil(this.destroy$))
  .subscribe((event:any) => {
    const user_id = this.authService.currentUser()?.id;
    const contact_id = this.contactUser?.id;
    const id = this.authService.generateRoomID(user_id,contact_id);
    const data = {
      ...event,
      roomID : id,
      from : user_id,
      to : contact_id,
    };
    this.userService.chat(data);
  });

  this.videoCall$.pipe(takeUntil(this.destroy$)).subscribe(()=>{
    const user_id = this.authService.currentUser()?.id;
    const contact_id = this.contactUser?.id;
    const id = this.authService.generateRoomID(user_id,contact_id);
    const data = {
      roomID : id,
      from : user_id,
      to : contact_id,
      peerID : this.shareService.peer?.id,
      message : "calling",
      type : "call",
      created_at : new Date()
    };
    this.shareService.call(data,"videoCall");
  });

  this.fileTransfer$.pipe(takeUntil(this.destroy$)).subscribe((file:File)=>{

    const user_id = this.authService.currentUser()?.id;
    const contact_id = this.contactUser?.id;
    const id = this.authService.generateRoomID(user_id,contact_id);
    const data = {
      roomID : id,
      from : user_id,
      to : contact_id,
      contactPeerID : null,
      message : "request",
      type : "transfer",
      created_at : new Date(),
      file : file,
      extra : JSON.stringify({name : file.name, size : file.size, mime : file.type, type : file.name.split(".").pop()})
    };
    this.shareService.transfer(data,'transfer');
  });

  }

  startChat(contactUser:any)  {
    const user_id = this.authService.currentUser()?.id;
    // if(this.contactUser)
    //   this.userService.disconnectWs()
    this.contactUser = contactUser;
    this.userService.emptyChat();
    const contact_id = this.contactUser?.id;
    // generate room id to create room
    this.userService.getChats({user_id,contact_id});
    this.userService.connectWs({roomID:this.authService.generateRoomID(user_id,contact_id)});
  }



  ngOnDestroy(){
    this.contactUser = undefined;
    this.messageList$.next([])
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}
