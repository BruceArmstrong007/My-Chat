
describe('FindFriendPage', () => {

  beforeEach(()=>{
    cy.visit('/login')
    cy.fixture("login").then((data:any)=>{
      cy.intercept('POST', 'http://localhost:3333/api/auth/login').as('login');
      cy.login(data?.username,data?.password);
    });
  })

  it('should display', () => {
    cy.wait("@login");
    cy.visit('/user/find-friend');
    cy.title().should('eq', "Find Friends");
  });


});
