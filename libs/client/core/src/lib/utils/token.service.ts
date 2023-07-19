import { inject, Injectable, Provider, signal, WritableSignal } from '@angular/core';

@Injectable()
export class TokenService {

  private readonly accessToken : WritableSignal<string> = signal('');

  setAccessToken(token: string) {
    this.accessToken.set(token);
  }

  getAccessToken() {
    return this.accessToken();
  }
}

export const injectToken = () => inject(TokenService);
export const provideToken = (): Provider => TokenService;
