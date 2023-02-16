import { TestBed } from '@angular/core/testing';
import { MyChatComponent } from './my-chat.component';

describe(MyChatComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(MyChatComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(MyChatComponent,);
  })

})
