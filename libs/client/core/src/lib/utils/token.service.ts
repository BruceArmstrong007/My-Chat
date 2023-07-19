import { inject, Injectable, Provider, signal, WritableSignal } from '@angular/core';

@Injectable()
export class TokenService {

  private readonly accessToken : WritableSignal<string | null> = signal(null);

  setAccessToken(token: string) {
    this.accessToken.set(token);
  }

  getAccessToken() {
    return this.accessToken() ? this.accessToken() : '';
  }
}

export const injectToken = () => inject(TokenService);
export const provideToken = (): Provider => TokenService;
