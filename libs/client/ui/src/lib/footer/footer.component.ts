import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  selector: 'my-chat-app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {}
