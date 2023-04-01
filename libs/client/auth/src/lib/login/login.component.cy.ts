import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService, CONFIG_DI_TOKEN, RequestHandlerService, TokenService, injectConfig } from '@client/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpService } from '@client/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

describe(LoginComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(LoginComponent, {
      add: {
        imports: [MatSnackBarModule,HttpClientModule,CommonModule,MatFormFieldModule,MatInputModule,MatIconModule,ReactiveFormsModule,FormsModule,MatButtonModule,   ],
        providers: [MatSnackBar,FormBuilder,RequestHandlerService,Router,AuthService, TokenService, HttpClient,
          { provide: CONFIG_DI_TOKEN, useValue: injectConfig },HttpService
        ],
      }
    })
  })

  // it('renders', () => {
  //    cy.mount(LoginComponent);
  // });

  it('types', () => {
    cy.mount(LoginComponent);
    cy.get('#username').type('bruce123');
    cy.get('#password').type('12345678');
    cy.get('#submit').click();
 });

})
