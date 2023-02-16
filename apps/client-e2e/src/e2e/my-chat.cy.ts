import { Chats } from "../components/chats";
import { LandingPage } from "../components/landing-page";
import { Login } from "../components/login";
import { ToolBar } from "../components/tool-bar";

describe('ChatsPage', () => {

  const login = new Login();
  const toolBar = new ToolBar();
  const landingPage = new LandingPage();
  const chats = new Chats();

  beforeEach(()=>{
    landingPage.visitPage();
    login.interceptAPI();
    toolBar.clickLogin();
    login.loginForm();
    login.waitForAPI();
    chats.visitPage();
  })

  it('should display title and h1', () => {
    chats.checkTitle();
  });


});
