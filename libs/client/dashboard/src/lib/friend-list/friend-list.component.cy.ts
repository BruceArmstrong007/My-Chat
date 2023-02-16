import { TestBed } from '@angular/core/testing';
import { FriendListComponent } from './friend-list.component';

describe(FriendListComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(FriendListComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(FriendListComponent,);
  })

})
