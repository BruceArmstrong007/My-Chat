export class FriendList{
    page = "/user/friend-list";

    title(){
      cy.title().should('eq', "Friend List");
    }

    visitPage(){
      cy.visit(this.page)
    }
}
