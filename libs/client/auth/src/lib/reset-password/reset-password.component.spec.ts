import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { AuthService, CONFIG_DI_TOKEN, TokenService } from '@client/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  const snackBarMock = {
    open : jest.fn()
  }
  const authServiceMock = {
    $user: of({
      id : 'asd',
      username : 'Jekasd'
    })
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent,
        HttpClientModule,
        BrowserAnimationsModule],
      providers: [
        {provide: MatSnackBar, useValue : snackBarMock},
        {provide : AuthService, useValue: authServiceMock},
        {provide : CONFIG_DI_TOKEN, useValue : {}},
        {provide : HttpClient, useValue : {}},
        {provide : TokenService, useValue : {}},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
