import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {

  transform(size: any): any {
    const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
    let i=0;
    while(size>900){size/=1024;i++;}
    return (Math.round(size*100)/100)+' '+fSExt[i];
  }

}
