import { TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';

describe(ChatComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(ChatComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(ChatComponent, {
           componentProperties: {
               messageList:  '',
          }
       });
  })

})
