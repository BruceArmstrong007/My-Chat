import { LandingPage } from "../components/landing-page";
import { Login } from "../components/login";
import { ToolBar } from "../components/tool-bar";

describe('Login', () => {

  const login = new Login();
  const landingPage = new LandingPage();
  const toolBar = new ToolBar();

  beforeEach(() => {
    landingPage.visitPage();
    toolBar.clickLogin();
  });

  it('should display title and h1', () => {
    login.checkTitle();
  });



  it('should login',()=>{
    login.loginForm();
  });
});
