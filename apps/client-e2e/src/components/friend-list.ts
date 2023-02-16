import { titleTag } from "../support/app.po";

export class FriendList{
    page = "/user/friend-list";
    title = "Friend List";

    checkTitle(){
      titleTag().should('eq', this.title);
    }

    visitPage(){
      cy.visit(this.page)
    }
}
