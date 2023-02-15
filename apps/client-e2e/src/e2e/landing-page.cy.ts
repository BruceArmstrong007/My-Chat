
describe('LandingPage', () => {
  beforeEach(() => cy.visit('/'));

  it('should display', () => {
    cy.titleH1('My Chat','My Chat');
  });

});
