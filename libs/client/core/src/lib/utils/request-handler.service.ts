import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RequestHandlerService {
  options :any = {
    duration: 2000,
    verticalPosition: 'bottom',
    horizontalPosition : 'right',
    panelClass: []
 };

responseStatus : any = {
  SUCCESS : "notification-success",
  ERROR : "notification-error",
}




responseHandler(message : string, success : boolean){
  return {message : this.titleCase(message) , options : {...this.options,panelClass:[success ? this.responseStatus?.SUCCESS : this.responseStatus?.ERROR]}};
 }

titleCase(str:string) {
  return str?.toLowerCase()?.replace(/\b\w/g, (s:string) => s.toUpperCase());
}

}
