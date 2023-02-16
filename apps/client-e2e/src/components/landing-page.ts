export class LandingPage{
  page = '/';

  title(){
    cy.titleH1('My Chat','My Chat');
  }

  visitPage(){
    cy.visit(this.page)
  }
}
