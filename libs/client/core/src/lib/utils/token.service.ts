import { inject, Injectable, Provider } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TokenService {

  private accessToken$ : BehaviorSubject<any> = new BehaviorSubject(null);

  setAccessToken(token: string) {
    this.accessToken$.next(token);
  }

  getAccessToken() {
    return this.accessToken$.value ? this.accessToken$.value : '';
  }
}

export const injectToken = () => inject(TokenService);
export const provideToken = (): Provider => TokenService;
