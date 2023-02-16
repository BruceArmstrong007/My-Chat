import { TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';

describe(LandingPageComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(LandingPageComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(LandingPageComponent,);
  })

})
