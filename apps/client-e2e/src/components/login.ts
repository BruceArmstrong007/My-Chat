export class Login{
  page = "/login";

  title(){
    cy.titleH1('Login','Login');
  }

  visitPage(){
    cy.visit(this.page)
  }


  interceptAPI(){
    cy.intercept('POST', 'http://localhost:3333/api/auth/login').as('login');
  }


  waitForAPI(){
    cy.wait("@login");
  }


  login(){
    cy.fixture("login").then((data:any)=>{
      cy.login(data?.username,data?.password);
    });
  }

}
