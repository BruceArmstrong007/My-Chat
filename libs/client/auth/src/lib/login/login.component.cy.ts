import { TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';

describe(LoginComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(LoginComponent, {
      add: {
        imports: [],
        providers: []
      }
    })
  })

  it('renders', () => {
     cy.mount(LoginComponent,);
  })

})
