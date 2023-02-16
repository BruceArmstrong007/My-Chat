import { TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';

describe(ListComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(ListComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(ListComponent, {
           componentProperties: {
               searchText:  "Enter your friend's name.",
               section:  '',
               list:  '',
          }
       });
  })

})
