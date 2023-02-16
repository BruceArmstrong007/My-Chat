import { LandingPage } from "../components/landing-page";
import { Register } from "../components/register";
import { ToolBar } from "../components/tool-bar";

describe('RegisterPage', () => {

  const register = new Register();
  const toolBar = new ToolBar();
  const landingPage = new LandingPage();

  beforeEach(() => {
    landingPage.visitPage();
    toolBar.clickRegister()
  });

  it('should display title and h1', () => {
    register.checkTitle();
  });


  it('should register',()=>{
    register.registerForm();
  });
});
