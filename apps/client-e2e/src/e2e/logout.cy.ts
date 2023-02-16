import { LandingPage } from "../components/landing-page";
import { Login } from "../components/login";
import { ToolBar } from "../components/tool-bar";

describe('Logout', () => {

  const login = new Login();
  const toolBar = new ToolBar();
  const landingPage = new LandingPage();

  beforeEach(()=>{
    landingPage.visitPage();
    login.interceptAPI();
    toolBar.clickLogin();
    login.loginForm();
    login.waitForAPI();
  })

  it('should Logout', () => {
    toolBar.clickProfileMenu();
    toolBar.clickLogout();
  });


});
