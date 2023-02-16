import { LandingPage } from "../components/landing-page";
import { Login } from "../components/login";
import { Profile } from "../components/profile";
import { ToolBar } from "../components/tool-bar";

describe('EditProfile', () => {

  const login = new Login();
  const toolBar = new ToolBar();
  const profile = new Profile();
  const landingPage = new LandingPage();


  beforeEach(()=>{
    landingPage.visitPage();
    login.interceptAPI();
    toolBar.clickLogin();
    login.loginForm();
    login.waitForAPI();
    toolBar.clickProfileMenu();
    toolBar.clickEditProfile();
  })

  it('should able to edit profile', () => {
    profile.interceptAPI();
    profile.profileForm();
    profile.waitForAPI();
  });


});
