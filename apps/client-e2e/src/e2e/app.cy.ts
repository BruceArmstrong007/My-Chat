import { h1 } from '../support/app.po';

describe('MyChat', () => {
  beforeEach(() => cy.visit('/'));

  it('should display', () => {
    cy.title().should('eq','My Chat');
    h1().contains('My Chat');
  });

});
