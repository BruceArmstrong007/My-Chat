import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { AuthService, CONFIG_DI_TOKEN, TokenService } from '@client/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let username : any,password : any,confirmPassword : any;

  const mockRouter = {
    navigateByUrl: jest.fn()
  };

   const authServiceMock = {
    register: jest.fn().mockReturnValue(of({ success : true, message : 'User registered successfully.'})) // create a spy on the login method and return a mock value
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, HttpClientModule, BrowserAnimationsModule],
      providers: [
        {provide : TokenService, useValue : {}},
        {provide : CONFIG_DI_TOKEN, useValue : {}},
        {provide : AuthService, useValue: authServiceMock},
        {provide : Router, useValue: mockRouter}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.debugElement.componentInstance;

    username = component.registerForm.controls['username'];
    password = component.registerForm.controls['password'];
    confirmPassword = component.registerForm.controls['confirmPassword']

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return form controls', () => {
    expect(component.f).toBeDefined();
  });

  it('should initialize the username, password and confirmPassword fields to empty strings', () => {
    username.setValue('');
    password.setValue('');
    confirmPassword.setValue('');
    expect(username.errors?.required).toBeTruthy();
    expect(password.errors?.required).toBeTruthy();
    expect(confirmPassword.errors?.required).toBeTruthy();
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

  it(`should validate
    required error - falsy
    minlength error - falsy
    maxlength error - falsy
    missmatch error - falsy
    when user enters password and confirmPassword within 8 to 32 characters`, () => {
    confirmPassword.setValue('qwhd823khajwhdn');
    password.setValue('qwhd823khajwhdn');
    expect(confirmPassword.errors?.mismatch).toBeFalsy();
    expect(confirmPassword.errors?.required).toBeFalsy();
    expect(confirmPassword.errors?.minlength).toBeFalsy();
    expect(confirmPassword.errors?.maxlength).toBeFalsy();
  });

  it(`should validate
  required error - falsy
  minlength error - falsy
  maxlength error - falsy
  missmatch error - falsy
  when user enters password and confirmPassword within 8 to 32 characters`, () => {
  password.setValue('qwhd82dhajwhdn');
  confirmPassword.setValue('qsss23khajwhdn');
  expect(confirmPassword.errors?.mismatch).toBeTruthy();
  expect(confirmPassword.errors?.required).toBeFalsy();
  expect(confirmPassword.errors?.minlength).toBeFalsy();
  expect(confirmPassword.errors?.maxlength).toBeFalsy();
});

  it(`should validate
    maxlength error to be true
    when user enters confirmPassword exceeds 32 characters`, () => {
    confirmPassword.setValue('qwhd823khajwhdnaslkdnkasdnkasndnasdn');
    expect(confirmPassword.errors?.maxlength).toBeTruthy();
  });

  it(`should validate
    minlength error to be true
    when user enters confirmPassword is less than 8 characters`, () => {
    confirmPassword.setValue('qwd');
    expect(confirmPassword.errors?.minlength).toBeTruthy();
  });

  it('Should register on valid response', () => {
    // Arrange
    const formValue = { username: 'testuser', password: 'ahsdkasdhakjs', confirmPassword: 'ahsdkasdhakjs' };

    jest.spyOn(mockRouter,'navigateByUrl');
    jest.spyOn(authServiceMock, 'register');

    // Act
    component.registerForm.setValue(formValue);
    component.send();

    // Assert;
    expect(component.registerForm.value).toBeTruthy();
    expect(authServiceMock.register).toHaveBeenCalledWith(formValue);
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
  });

  it('Should not register on invalid response', () => {
    // Arrange
    const formValue = { username: '', password: 'testpassword', confirmPassword: 'testpassword' };

    jest.spyOn(mockRouter,'navigateByUrl');
    jest.spyOn(authServiceMock, 'register');

    // Act
    component.registerForm.setValue(formValue);
    component.send();

    // Assert
    expect(component.registerForm.valid).toBeFalsy();
    expect(authServiceMock.register).not.toHaveBeenCalledWith(formValue);
  });


  it('should unsubscribe from observables on destroy', () => {
    jest.spyOn(component.destroy$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.destroy$.unsubscribe).toHaveBeenCalled();
  });

});
