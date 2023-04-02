import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordComponent } from './reset-password.component';
import { AuthService, CONFIG_DI_TOKEN, RequestHandlerService, TokenService, UserService } from '@client/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let username : any,password : any,confirmPassword : any, id : any;
  const snackBarMock = {
    open : jest.fn()
  }
  const mockRouter = {
    navigateByUrl: jest.fn()
  };
  const authServiceMock = {
    $user: of({ id: 1, username: 'testuser' })
  }
  const userServiceMock = {
    resetPassword: jest.fn().mockReturnValue(of({
      message : 'Temp',
      success : true
    }))
  }
  const requestHandlerMock = {
    responseHandler : jest.fn().mockReturnValue({
      message : 'Temp',
      options : { dummy: 'data'}
    })
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ResetPasswordComponent,
        HttpClientModule,
        BrowserAnimationsModule
      ],
      providers: [
        {provide : CONFIG_DI_TOKEN, useValue : {}},
        {provide : TokenService, useValue : {}},
        {provide: MatSnackBar, useValue : snackBarMock},
        {provide : AuthService, useValue : authServiceMock},
        {provide : UserService, useValue : userServiceMock},
        {provide : RequestHandlerService, useValue : requestHandlerMock},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.debugElement.componentInstance;

    id = component.resetForm.controls['id'];
    username = component.resetForm.controls['username'];
    password = component.resetForm.controls['password'];
    confirmPassword = component.resetForm.controls['confirmPassword']

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should return form controls', () => {
    expect(component.f).toBeDefined();
  });

  it('should initialize the username, password and confirmPassword fields to empty strings', () => {
    id.setValue('');
    username.setValue('');
    password.setValue('');
    confirmPassword.setValue('');
    expect(id.errors?.required).toBeTruthy();
    expect(username.errors?.required).toBeTruthy();
    expect(password.errors?.required).toBeTruthy();
    expect(confirmPassword.errors?.required).toBeTruthy();
  });

  it(`should validate
      id is required`, () => {
    id.setValue('asdas');
    expect(id.errors?.required).toBeFalsy();
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

  it('should update resetForm with user data', () => {

    // Act
    component.ngOnInit();

    // Assert
    expect(component.resetForm.value).toEqual({ id: 1, username: 'testuser', password: '', confirmPassword: '' });
  });

  it('Should reset password on valid response', () => {
    // Arrange
    const formValue = { id: '1', username: 'testuser', password: 'ahsdkasdhakjs', confirmPassword: 'ahsdkasdhakjs' };
    const resetResponse = { message : 'Temp', success : true };
    const responseHandler = {
      message : 'Temp',
      options : { dummy: 'data'}
    };
    jest.spyOn(mockRouter,'navigateByUrl');
    jest.spyOn(userServiceMock, 'resetPassword').mockReturnValue(of(resetResponse));

    // Act
    component.resetForm.setValue(formValue);
    component.send();

    // Assert;
    expect(component.resetForm.valid).toBeTruthy();
    expect(userServiceMock.resetPassword).toHaveBeenCalledWith(formValue);
    expect(requestHandlerMock.responseHandler).toHaveBeenCalledWith(resetResponse.message,resetResponse.success);
    expect(snackBarMock.open).toHaveBeenCalledWith(responseHandler.message,'Close',responseHandler.options);
    // expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/');

  });

  it('Should not reset password on invalid response', () => {
    // Arrange
    const formValue = { id: '', username: '', password: 'testpassword', confirmPassword: 'testpassword' };
    const errorMessage = { error: 'Error Response' };
    jest.spyOn(userServiceMock, 'resetPassword').mockReturnValue(throwError(errorMessage));

    // Act
    component.resetForm.setValue(formValue);
    component.send();

    // Assert
    expect(component.resetForm.valid).toBeFalsy();
  });


  it('should unsubscribe from observables on destroy', () => {
    jest.spyOn(component.destroy$, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.destroy$.unsubscribe).toHaveBeenCalled();
  });

});
