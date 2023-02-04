import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map, Observable,throwError,of, catchError } from 'rxjs';
import { TokenService } from '../utils/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequestHandlerService } from '../utils/request-handler.service';
import { AuthService } from '../service/auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    private readonly snackBar = inject(MatSnackBar);
    private readonly requestHandler = inject(RequestHandlerService);
    private readonly tokenService = inject(TokenService);
    private readonly authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token =  this.tokenService.getAccessToken();

    const clonedReq =token ? request.clone({ headers: request.headers.set('Authorization', token) }) : request.clone();

    return next.handle(clonedReq).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // Success Prompts
          if(event.body?.message){
            const {message,options} = this.requestHandler.responseHandler( event?.body?.message, event?.body?.success);
            this.snackBar.open(message,'Close',options);
          }
        }
        return event;
      }),
      catchError(({error}: HttpErrorResponse) => {
        if((error.message == 'Session expired.') && error.success === false){
          this.authService.logout();
        }
        const {message,options} = this.requestHandler.responseHandler( error.message, error.success);
        this.snackBar.open(message,'Close',options);
        return of(new HttpResponse({}));
      })
    );

  }
}
