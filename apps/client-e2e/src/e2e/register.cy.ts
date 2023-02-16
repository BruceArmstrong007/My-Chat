import { Register } from "../components/register";

describe('RegisterPage', () => {

  const register = new Register();

  beforeEach(() => register.visitPage());

  it('should display title and h1', () => {
    register.checkTitle();
  });


  it('should register',()=>{
    register.registerForm();
  });
});
