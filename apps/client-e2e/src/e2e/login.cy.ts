import { h1 } from "../support/app.po";

describe('login', () => {
  beforeEach(() => cy.visit('/login'));

  it('should display', () => {
    cy.title().should('eq','Login');
    h1().contains('Login');

  });


  it('should login',()=>{
    cy.login("bruce123","12345678");
  });
});
