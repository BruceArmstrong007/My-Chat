import { Login } from "../components/login";

describe('LoginPage', () => {

  const login = new Login();

  beforeEach(() => login.visitPage());

  it('should display title and h1', () => {
    login.title();
  });



  it('should login',()=>{
    login.loginForm();
  });
});
