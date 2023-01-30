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




SuccessResponseHandler(message : string, success : boolean){
  return {message : this.titleCase(message) , options : {...this.options,panelClass:[success ? this.responseStatus['notification-success'] : this.responseStatus['notification-error']]}};
 }

titleCase(str:string) {
  return str.toLowerCase().replace(/\b\w/g, (s:string) => s.toUpperCase());
}

}
