import { TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe(DashboardComponent.name, () => {

  beforeEach(() => {
    TestBed.overrideComponent(DashboardComponent, {
      add: { 
        imports: [],
        providers: []
      }
    }) 
  })

  it('renders', () => {
     cy.mount(DashboardComponent,);
  })

})
