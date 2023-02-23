import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CONFIG_DI_TOKEN, HttpService, TokenService, injectConfig } from '@client/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent,MatSnackBarModule,HttpClientModule],
      providers:[MatSnackBar,{ provide: CONFIG_DI_TOKEN, useValue: injectConfig },TokenService,HttpClient,HttpService]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
