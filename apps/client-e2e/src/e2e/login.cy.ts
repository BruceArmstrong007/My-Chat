
describe('LoginPage', () => {
  beforeEach(() => cy.visit('/login'));

  it('should display', () => {
    cy.titleH1('Login','Login');
  });


  it('should login',()=>{
    cy.fixture("login").then((data:any)=>{
    cy.login(data?.username,data?.password);
    });
  });
});
