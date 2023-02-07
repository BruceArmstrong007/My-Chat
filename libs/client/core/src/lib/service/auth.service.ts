import { IS_LOGGED_STORAGE_KEY } from '../config/auth.config';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@prisma/client';
import { BehaviorSubject, iif, map, of, switchMap, tap, filter } from 'rxjs';
import { injectToken } from '../core.di';
import { HttpService } from '../utils/http.service';

type UserData = Omit<User, 'password' | 'refreshToken'>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser$ = new BehaviorSubject<null | UserData>(null);
  private readonly router = inject(Router);
  private readonly token = injectToken();
  private readonly http = inject(HttpService);
  $user = this.currentUser$.asObservable();

  currentUser(){
    return  this.currentUser$.getValue();
  }

  friends(){
    return this.currentUser$.pipe(
    map((user:any)=> user?.contact.filter((contact:any) => contact?.status === "friend")),
    )
  }

  authenticateUser(user: UserData) {
    this.currentUser$.next(user);
    localStorage.setItem(IS_LOGGED_STORAGE_KEY, JSON.stringify(true));
  }

  isUserLoggedIn() {
    return JSON.parse(localStorage.getItem(IS_LOGGED_STORAGE_KEY) ?? 'false');
  }


  isAuth() {
    return this.currentUser$.pipe(map(user => !!user));
  }

  logout() {
    this.http.get('/auth/logout').subscribe((res:any)=>{
      this.router.navigateByUrl('/');
      this.currentUser$.next(null);
      this.defaultState();
    });
  }

  login(user: Pick<User, 'username' | 'password'>) {
    return this.http.post('/auth/login',user).pipe(
      tap((response:any) => {
        this.token.setAccessToken(response?.data?.token);
      }),
      switchMap(response => iif(() => !!response?.data?.token, this.getUser(true), of(response))),
    );
  }

  register(user: any){
    return this.http.post('/auth/register',user);
  }

  getUser(login: boolean = false){
    return this.http.get('/user').pipe(
      map((user:any) => {
        this.authenticateUser(user?.data);
        if(login) this.router.navigateByUrl("/user")
      })
    )
  }

  getAccess() {
    return  this.http.get('/auth/accessToken').pipe(
      tap((response:any) => {
        this.token.setAccessToken(response?.data?.token);
      }),
      switchMap((response:any) => iif(() => !!response?.data.token, this.getUser(), of(response))),
    );
  }

  defaultState() {
    this.router.navigateByUrl('/');
    this.currentUser$.next(null);
    localStorage.clear();
  }


}
