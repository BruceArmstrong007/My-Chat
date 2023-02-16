import { FriendList } from "../components/friend-list";
import { LandingPage } from "../components/landing-page";
import { Login } from "../components/login";
import { ToolBar } from "../components/tool-bar";

describe('FriendListPage', () => {

  const login = new Login();
  const toolBar = new ToolBar();
  const friendList = new FriendList();
  const landingPage = new LandingPage();


  beforeEach(()=>{
    landingPage.visitPage();
    login.interceptAPI();
    toolBar.clickLogin();
    login.loginForm();
    login.waitForAPI();
    toolBar.clickFriendList();
  })

  it('should display title and h1', () => {
    friendList.checkTitle();
  });


});
