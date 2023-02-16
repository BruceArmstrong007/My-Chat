import { TestBed } from '@angular/core/testing';
import { CallModalComponent } from './call-modal.component';

describe(CallModalComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(CallModalComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(CallModalComponent,);
  })

})
