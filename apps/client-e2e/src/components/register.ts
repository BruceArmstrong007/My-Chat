export class Register{

  page = "/register";
  title = "Register";
  h1 = "Register";
  registerAPI = "http://localhost:3333/api/auth/register";

  visitPage(){
    cy.visit(this.page)
  }

  checkTitle(){
    cy.titleH1(this.title,this.h1);
  }

  registerForm(){
    const username = Math.random().toString(36).substring(2, 10);
    const password = Math.random().toString(36).substring(2, 10);
    cy.register(username,password,password);
  }

  interceptAPI(){
    cy.intercept('POST', this.registerAPI).as('register');
  }


  waitForAPI(){
    cy.wait("@register");
  }

}
