import { TestBed } from '@angular/core/testing';
import { TransferComponent } from './transfer.component';

describe(TransferComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(TransferComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(TransferComponent,);
  })

})
