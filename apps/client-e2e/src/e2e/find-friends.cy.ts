import { FindFriends } from "../components/find-friends";
import { LandingPage } from "../components/landing-page";
import { Login } from "../components/login";
import { ToolBar } from "../components/tool-bar";

describe('FindFriendPage', () => {

  const login = new Login();
  const findFriends = new FindFriends();
  const landingPage = new LandingPage();
  const toolBar = new ToolBar();

  beforeEach(()=>{
    landingPage.visitPage();
    login.interceptAPI();
    toolBar.clickLogin();
    login.loginForm();
    login.waitForAPI();
    toolBar.clickFindFriend();
  })

  it('should display title and h1', () => {
    findFriends.checkTitle();
  });


  it('should display title and h1', () => {
    findFriends.checkTitle();
  });


});
