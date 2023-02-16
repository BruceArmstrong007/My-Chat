import { titleTag } from "../support/app.po";

export class Chats{

  page = "/user/my-chats";
  title = "Chats";


  visitPage(){
    cy.visit(this.page)
  }

  checkTitle(){
    titleTag().should('eq', this.title);
  }


}
