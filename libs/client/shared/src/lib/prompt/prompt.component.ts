import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Component,Inject } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'my-chat-app-prompt',
  standalone: true,
  imports: [NgStyle,MatDialogModule,MatButtonModule,MatIconModule],
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
})
export class PromptComponent {

  constructor(public dialogRef: MatDialogRef<PromptComponent>,@Inject(MAT_DIALOG_DATA) public data:any) { }

}
