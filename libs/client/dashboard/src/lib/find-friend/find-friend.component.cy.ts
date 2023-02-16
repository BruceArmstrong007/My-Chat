import { TestBed } from '@angular/core/testing';
import { FindFriendComponent } from './find-friend.component';

describe(FindFriendComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(FindFriendComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(FindFriendComponent,);
  })

})
