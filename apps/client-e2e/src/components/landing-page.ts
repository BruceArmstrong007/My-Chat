export class LandingPage{
  page = '/';
  title = "My Chat";
  h1 = "My Chat";

  checkTitle(){
    cy.titleH1(this.title,this.h1);
  }

  visitPage(){
    cy.visit(this.page);
  }
}
