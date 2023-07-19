import { CardComponent } from './../card/card.component';
import { Observable, Subject,filter} from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ViewEncapsulation, ChangeDetectionStrategy, Component, inject, ViewChild, EventEmitter, Output, Input, HostListener} from '@angular/core';
import { ToggleService } from '@client/core';
import {MatMenu, MatMenuModule} from '@angular/material/menu';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { NgFor, NgIf, DatePipe, AsyncPipe } from '@angular/common';
@Component({
  selector: 'my-chat-app-chat',
  standalone: true,
  imports: [NgFor,NgIf,DatePipe,AsyncPipe,MatFormFieldModule,MatInputModule,MatIconModule,FormsModule,MatMenuModule,MatButtonModule,CardComponent,PickerModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
encapsulation: ViewEncapsulation.None
})
export class ChatComponent {
  messageText = 'Enter something to say..';
  @Input() currentUser : any;
  @Input() contactUser : any;
  @ViewChild('file') fileTag : any;
  _messageList !: Observable<any[]>;
  @Input() set messageList(value:any){
      this._messageList = value;
      this._messageList.subscribe((res:any)=>{
        setTimeout(()=>{this.scrollToBottom()},1);
      })
  }
  message = '';
  toggle : any = inject(ToggleService);
  @Output() sendMessage : any = new EventEmitter();
  @Output() videoCall : any = new EventEmitter();
  @Output() transferFile : any = new EventEmitter();
  @ViewChild('scrollMe') private scrollMe: any;
  disableScrollDown = false
  @ViewChild('menu') pickerMenu!: MatMenu;
  send(){
    if(!this.message) return;
      this.sendMessage.emit({message : this.message, type : "chat"});
      this.message = '';
  }

  handleEmoji(event : any){
    this.message += event?.emoji?.native;
  }

  callUser(){
    this.videoCall.emit();
  }


  ngAfterViewInit() {
    // Inject our custom logic of menu close
    (this.pickerMenu as any).closed = this.configureMenuClose(this.pickerMenu.close);
  }

  private configureMenuClose(old: MatMenu['close']): MatMenu['close'] {
    const upd = new EventEmitter();
    this.feed(upd.pipe(
      filter((event:any) => {
        if (event === 'click') {
          // Ignore clicks inside the menu
          return false;
        }
        return true;
      }),
    ), old);
    return upd;
  }

  feed<T>(from: Observable<T>, to: Subject<T>): any {
    return from.subscribe(
      (data:any) => to.next(data),
      (err:any) => to.error(err),
      () => to.complete(),
    );
  }

   onScroll() {
    const element = this.scrollMe.nativeElement
    const atBottom = element.scrollHeight - element.scrollTop === element.clientHeight
    if (this.disableScrollDown && atBottom) {
        this.disableScrollDown = false
    } else {
        this.disableScrollDown = true
    }
}


 scrollToBottom(): void {
    this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
}

@HostListener('keypress', ['$event'])
keyEvent(event: KeyboardEvent) {
    if (event.keyCode === 13) {
       if(this.message) this.send();
    }
}



files(data:any){
  const file = data?.files[0] ? data?.files[0] : null;
  this.transferFile.emit(file);
  this.fileTag.nativeElement.value = "";
}


}

