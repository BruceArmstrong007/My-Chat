import { titleTag } from "../support/app.po";

export class Chats{

  page = "/user/friend-list";
  title = "Chats";


  visitPage(){
    cy.visit(this.page)
  }

  checkTitle(){
    titleTag().and('eq', this.title);
  }


}
