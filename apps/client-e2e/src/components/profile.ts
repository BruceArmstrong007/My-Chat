import { getTag } from "../support/app.po";

export class Profile{

  page = "/user/profile";
  profileAPI = "http://localhost:3333/api/user/update";
  title = "Edit Profile";
  h1 = "Edit Profile";
  resetPassword = "resetPassword";

  visitPage(){
    cy.visit(this.page)
  }


  interceptAPI(){
    cy.intercept("POST", this.profileAPI).as("profile");
  }

  checkTitle(){
    cy.titleH1(this.title,this.h1);
  }

  waitForAPI(){
    cy.wait("@profile");
  }


  profileForm(){
    cy.fixture("edit-profile").then((data:any)=>{
      cy.editProfile(data?.username,data?.image);
    });
  }

  clickResetPassword(){
    getTag('#' + this.resetPassword).click();
  }

}
