import { LandingPage } from "../components/landing-page";
import { Login } from "../components/login";
import { Profile } from "../components/profile";
import { ResetPassword } from "../components/reset-password";
import { ToolBar } from "../components/tool-bar";

describe('ResetPassword', () => {

  const login = new Login();
  const toolBar = new ToolBar();
  const profile = new Profile();
  const landingPage = new LandingPage();
  const resetPassword = new ResetPassword();


  beforeEach(()=>{
    login.interceptAPI();
    landingPage.visitPage();
    toolBar.clickLogin();
    login.loginForm();
    login.waitForAPI();
    toolBar.clickProfileMenu();
    toolBar.clickEditProfile();
    profile.clickResetPassword();
  })

  it('should able to reset password', () => {
    resetPassword.interceptAPI();
    resetPassword.resetPasswordForm();
    resetPassword.waitForAPI();
  });


});
