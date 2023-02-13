import { IS_LOGGED_STORAGE_KEY } from '../config/auth.config';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@prisma/client';
import { BehaviorSubject, iif, map, of, switchMap, tap } from 'rxjs';
import { injectToken } from '../core.di';
import { HttpService } from '../utils/http.service';
import { injectConfig } from '../core.di';
import io from 'socket.io-client';

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
  readonly contactLinks$ : BehaviorSubject<any> = new BehaviorSubject([]);

  private readonly url = injectConfig();


  socket = io(this.url.WS_URL,{
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: true,
    withCredentials: true
  });


  currentUser(){
    return  this.currentUser$.getValue();
  }

  friends(){
    return this.currentUser$.pipe(
    map((user:any)=> user?.contact.filter((contact:any) => contact?.status === "friend"))
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
        const crntUser = user?.data;
        this.linkContact(crntUser?.id,crntUser?.contact,'connectFriend');
        this.authenticateUser(crntUser);
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


  linkContact(id: number,contact:any[] = [],option: string){
    let contactIDs:any[] = [];
    const contacts : any[] = this.contactLinks$.value;

      contact.forEach((user:any)=>{
        const length = contacts.some(contact => contact?.id === user?.id);

        if(!length){
          contactIDs = [...contactIDs,{id: user?.id,roomID :this.generateRoomID(id,user?.id)}];
        }
      });
    this.socket.emit(option,{contactIDs});
    if(option === 'connectFriend') this.contactLinks$.next([...contacts,contactIDs]);
    else this.contactLinks$.next([]);
  }


  generateRoomID(id1:any,id2:any){
    let id = '';
    if(id1 > id2){
      id = id2.toString()+'-'+id1.toString();
    }else{
      id = id1.toString()+'-'+id2.toString();
    }
    return id;
  }
}
