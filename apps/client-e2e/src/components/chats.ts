export class Chats{

  page = "/user/friend-list";


  visitPage(){
    cy.visit(this.page)
  }

  title(){
    cy.title().should('eq', "Chats");
  }


}
