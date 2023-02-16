import { TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';

describe(ProfileComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(ProfileComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(ProfileComponent,);
  })

})
