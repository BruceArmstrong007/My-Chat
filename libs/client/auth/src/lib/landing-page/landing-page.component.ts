import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'my-chat-app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPageComponent {
}
