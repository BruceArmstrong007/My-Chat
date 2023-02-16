import { TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe(CardComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(CardComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(CardComponent, {
           componentProperties: {
               section:  '',
          }
       });
  })

})
