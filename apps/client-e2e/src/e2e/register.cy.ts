
describe('RegisterPage', () => {
  beforeEach(() => cy.visit('/register'));

  it('should display', () => {
    cy.titleH1('Register','Register');
  });


  it('should login',()=>{
    const username = Math.random().toString(36).substring(2, 10);
    const password = Math.random().toString(36).substring(2, 10);
    cy.register(username,password,password);
  });
});
