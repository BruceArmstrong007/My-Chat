import { Register } from "../components/register";

describe('RegisterPage', () => {

  const register = new Register();

  beforeEach(() => register.visitPage());

  it('should display title and h1', () => {
    register.title();
  });


  it('should register',()=>{
    register.register();
  });
});
