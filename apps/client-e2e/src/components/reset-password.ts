export class ResetPassword{

  page = "/user/reset-password";
  title = "Reset Password";
  h1 = "Reset Password";
  resetPasswordAPI = "http://localhost:3333/api/user/resetPassword";

  checkTitle(){
    cy.titleH1(this.title,this.h1);
  }

  visitPage(){
    cy.visit(this.page)
  }

  interceptAPI(){
    cy.intercept("POST", this.resetPasswordAPI).as("resetPassword");
  }

  waitForAPI(){
    cy.wait("@resetPassword");
  }

  resetPasswordForm(){
    cy.fixture("reset-password").then((data:any)=>{
      cy.resetPassword(data?.password,data?.confirmPassword);
    });
  }

}
