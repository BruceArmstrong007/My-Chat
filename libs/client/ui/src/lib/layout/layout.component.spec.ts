import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutComponent } from './layout.component';
import { AuthService, CONFIG_DI_TOKEN, TokenService } from '@client/core';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  const authServiceMock = {
    isUserLoggedIn : jest.fn(),
    $user: of({ id: 1, username: 'testuser' })
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LayoutComponent,
        HttpClientModule,
      ],
      providers: [
        {provide : TokenService, useValue : {}},
        {provide : CONFIG_DI_TOKEN, useValue : {}},
        {provide : AuthService, useValue : authServiceMock},
        {provide : ActivatedRoute, useValue : {}},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
