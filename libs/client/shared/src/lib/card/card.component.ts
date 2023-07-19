import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectionStrategy, Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DatePipe, NgClass, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'my-chat-app-card',
  standalone: true,
  imports: [NgIf,NgStyle,NgClass,DatePipe,MatIconModule,MatButtonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() card: any;
  @Input() section!:string;
  @Output() cardClick : any = new EventEmitter();
  @Output() chatFriend : any = new EventEmitter();
  @Output() cancelRequest : any = new EventEmitter();
  @Output() unfriend : any = new EventEmitter();
  @Output() acceptRequest : any = new EventEmitter();
  @Output() addFriend : any = new EventEmitter();



}
