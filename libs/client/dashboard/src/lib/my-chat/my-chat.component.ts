import { UserService, AuthService, ShareService } from '@client/core';
import { Location } from '@angular/common';
import { ChatComponent } from '@client/shared';
import { ListComponent } from '@client/shared';
import { ChangeDetectionStrategy, Component, inject, DestroyRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'my-chat-app-my-chat',
  standalone: true,
  imports: [ListComponent, ChatComponent],
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
  private readonly destroy$ : any = new Subject<void>();
  readonly userService = inject(UserService);
  readonly shareService = inject(ShareService);
  readonly authService = inject(AuthService);
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);
  friendList$!:Observable<any[]>;


ngAfterViewInit(){
  this.messageList$ = this.userService.chatMessages$;
  this.contactUser = this.location.getState();
  if(this.contactUser?.id){
    this.startChat(this.contactUser);
  }else{
    this.contactUser = undefined;
  }


  this.friendList$ = this.authService.friends().pipe(takeUntilDestroyed(this.destroy$));
  this.cardClick$.pipe(takeUntilDestroyed(this.destroy$))
    .subscribe(this.startChat.bind(this));

  this.sendMessage$.pipe(takeUntilDestroyed(this.destroy$))
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

  this.videoCall$.pipe(takeUntilDestroyed(this.destroy$)).subscribe(()=>{
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

  this.fileTransfer$.pipe(takeUntilDestroyed(this.destroy$)).subscribe((file:File)=>{

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

  this.destroyRef.onDestroy(() => {
    this.contactUser = undefined;
    this.destroy$.unsubscribe();
  })
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




}
