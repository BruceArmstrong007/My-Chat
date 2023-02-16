export class Login{
  page = "/login";
  title = "Login";
  h1 = "Login";
  loginAPI = "http://localhost:3333/api/auth/login";

  checkTitle(){
    cy.titleH1(this.title,this.h1);
  }

  visitPage(){
    cy.visit(this.page)
  }


  interceptAPI(){
    cy.intercept('POST', this.loginAPI).as('login');
  }


  waitForAPI(){
    cy.wait("@login");
  }


  loginForm(){
    cy.fixture("login").then((data:any)=>{
      cy.login(data?.username,data?.password);
    });
  }

}
