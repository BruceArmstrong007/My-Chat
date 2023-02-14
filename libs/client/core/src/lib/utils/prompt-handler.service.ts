import { inject, Injectable } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
@Injectable({
  providedIn: 'root',
})
export class PromptHandlerService {
  dialog = inject(MatDialog);

  openDialog(component: any, data:any){
    const dialogRef = this.dialog.open(component, {
      width: '500px',
      data:data,
    });
    return dialogRef.afterClosed();
  }
}
