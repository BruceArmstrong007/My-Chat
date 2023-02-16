import { TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';

describe(ResetPasswordComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(ResetPasswordComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(ResetPasswordComponent,);
  })

})
