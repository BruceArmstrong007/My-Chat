import { titleTag } from "../support/app.po";

export class FindFriends{

  page = "/user/find-friend";
  title = "Find Friends";

  checkTitle(){
    titleTag().and('eq', this.title);
  }

  visitPage(){
    cy.visit(this.page)
  }

}
