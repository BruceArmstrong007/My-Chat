import {  ToggleService } from '@client/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './../footer/footer.component';
import { HeaderComponent } from './../header/header.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'my-chat-app-layout',
  standalone: true,
  imports: [NgClass, HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  toggle = inject(ToggleService);

}
