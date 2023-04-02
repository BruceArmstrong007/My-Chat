import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService, CONFIG_DI_TOKEN, TokenService } from '@client/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const authServiceMock = {
    isUserLoggedIn : jest.fn(),
    $user: of({ id: 1, username: 'testuser' })
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        HttpClientModule,
      ],
      providers: [
        {provide : TokenService, useValue : {}},
        {provide : CONFIG_DI_TOKEN, useValue : {}},
        {provide : AuthService, useValue : authServiceMock},
        {provide : ActivatedRoute, useValue : {}},
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
