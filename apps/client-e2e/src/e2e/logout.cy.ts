import { Login } from "../components/login";
import { ToolBar } from "../components/tool-bar";

describe('Logout', () => {

  const login = new Login();
  const toolBar = new ToolBar();


  beforeEach(()=>{
    login.interceptAPI();
    login.visitPage();
    login.loginForm();
    login.waitForAPI();
  })

  it('should Logout', () => {
    toolBar.clickProfileMenu();
    toolBar.clickLogout();
  });


});
