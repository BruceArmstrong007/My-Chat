export class FindFriends{

  page = "/user/find-friend";

  title(){
    cy.title().should('eq', "Find Friends");
  }

  visitPage(){
    cy.visit(this.page)
  }

}
