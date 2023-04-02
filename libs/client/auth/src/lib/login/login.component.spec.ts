import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService, CONFIG_DI_TOKEN, TokenService } from '@client/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let username: any, password: any;

  const authServiceMock = {
    login: jest.fn().mockReturnValue(of({ data: { id: 123 } })) // create a spy on the login method and return a mock value
  };

  const mockRouter = {
    navigateByUrl: jest.fn()
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        HttpClientModule,
        BrowserAnimationsModule
      ],
       providers: [
        {provide : TokenService, useValue : {}},
        {provide : HttpClient, useValue : {}},
        {provide : CONFIG_DI_TOKEN, useValue : {}},
        {provide : AuthService, useValue: authServiceMock},
        {provide : Router, useValue: mockRouter}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.debugElement.componentInstance;

    username = component.loginForm.controls['username'];
    password = component.loginForm.controls['password'];

    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return form controls', () => {
    expect(component.f).toBeDefined();
  });

  it('should initialize the username and password fields to empty strings', () => {
    username.setValue('');
    password.setValue('');
    expect(username.errors?.required).toBeTruthy();
    expect(password.errors?.required).toBeTruthy();
  });

  it(`should validate
    required error - falsy
    minlength error - falsy
    maxlength error - falsy
    when user enters username within 8 to 15 characters`, () => {
    username.setValue('TestUser');
    expect(username.errors?.required).toBeFalsy();
    expect(username.errors?.minlength).toBeFalsy();
    expect(username.errors?.maxlength).toBeFalsy();
  });

  it(`should validate
    maxlength error to be true
    when user entered username exceeds 32 character length 32`,()=>{
    username.setValue('hefueeifoewkhwefjhuwehfiwefhuwefiuwefhwehfiwhef');
    expect(username.errors?.maxlength).toBeTruthy();
  });

  it(`should validate
    minlength error to be true
    when user entered username is less than 8 characters`,()=>{
    username.setValue('asd');
    expect(username.errors?.minlength).toBeTruthy();
  });

  it(`should validate
    required error - falsy
    minlength error - falsy
    maxlength error - falsy
    when user enters password within 8 to 32 characters`, () => {
    password.setValue('qwhd823khajwhdn');
    expect(password.errors?.required).toBeFalsy();
    expect(password.errors?.minlength).toBeFalsy();
    expect(password.errors?.maxlength).toBeFalsy();
  });

  it(`should validate
    maxlength error to be true
    when user enters password exceeds 32 characters`, () => {
    password.setValue('qwhd823khajwhdnaslkdnkasdnkasndnasdn');
    expect(password.errors?.maxlength).toBeTruthy();
  });


  it(`should validate
    minlength error to be true
    when user enters password is less than 8 characters`, () => {
    password.setValue('qwdn');
    expect(password.errors?.minlength).toBeTruthy();
  });


  it('Should not call login if form fields are invalid', () => {
    // Arrange
    const formValue = { username: '', password: '' };

    // Act
    component.loginForm.setValue(formValue);
    component.send();

    // Assert
    expect(component.loginForm.valid).toBeFalsy();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  })


  it('Should login on valid response', () => {
    // Arrange
    const formValue = { username: 'testuser', password: 'testpassword' };
    const loginResponse = { data: { id: 1 } };
    jest.spyOn(mockRouter,'navigateByUrl');
    jest.spyOn(authServiceMock, 'login').mockReturnValue(of(loginResponse));

    // Act
    component.loginForm.setValue(formValue);
    component.send();

    // Assert
    expect(component.loginForm.valid).toBeTruthy();
    expect(authServiceMock.login).toHaveBeenCalledWith(formValue);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/user');
  });

  it('Should not login on valid response',() => {
      // Arrange
      const formValue = { username: 'testuser', password: 'testpassword' };
      const errorMessage = { error : 'Error Response' };
      jest.spyOn(mockRouter,'navigateByUrl');
      jest.spyOn(authServiceMock, 'login').mockReturnValue(throwError(errorMessage));

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {return;});

      // Act
      component.loginForm.setValue(formValue);
      component.send();

      // Assert
    expect(component.loginForm.valid).toBeTruthy();
      expect(consoleSpy).toHaveBeenCalledWith(errorMessage);
  })


  it('should unsubscribe from observables on destroy', () => {
    jest.spyOn(component.destroy$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.destroy$.unsubscribe).toHaveBeenCalled();
  });

});
