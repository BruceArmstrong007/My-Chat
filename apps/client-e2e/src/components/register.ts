export class Register{

  page = "/register";


  visitPage(){
    cy.visit(this.page)
  }

  title(){
    cy.titleH1('Register','Register');
  }

  register(){
    const username = Math.random().toString(36).substring(2, 10);
    const password = Math.random().toString(36).substring(2, 10);
    cy.register(username,password,password);
  }

  interceptAPI(){
    cy.intercept('POST', 'http://localhost:3333/api/auth/register').as('register');
  }


  waitForAPI(){
    cy.wait("@register");
  }

}
