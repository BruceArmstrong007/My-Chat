import { Login } from "../components/login";
import { ToolBar } from "../components/tool-bar";

describe('Logout', () => {

  const login = new Login();
  const toolBar = new ToolBar();


  beforeEach(()=>{
    login.interceptAPI();
    login.visitPage();
    login.loginForm();
  })

  it('should display title and h1', () => {
    login.waitForAPI();
    toolBar.clickProfileMenu();
    toolBar.clickLogout();
  });


});
