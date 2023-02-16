import { Login } from "../components/login";

describe('Login', () => {

  const login = new Login();

  beforeEach(() => login.visitPage());

  it('should display title and h1', () => {
    login.checkTitle();
  });



  it('should login',()=>{
    login.loginForm();
  });
});
