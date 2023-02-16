import { TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';

describe(RegisterComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(RegisterComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(RegisterComponent,);
  })

})
