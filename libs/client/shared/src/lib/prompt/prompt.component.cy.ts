import { TestBed } from '@angular/core/testing';
import { PromptComponent } from './prompt.component';

describe(PromptComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(PromptComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(PromptComponent,);
  })

})
